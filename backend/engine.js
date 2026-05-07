function normalizeString(str) {
  if (!str) return "";
  // Trimming, lowercasing, and normalizing whitespace
  return str.toString().trim().toLowerCase().replace(/\s+/g, " ");
}

function processAnswers(answers) {
  return answers
    .map((ans) => {
      const options = {};
      ["a", "b", "c", "d", "e", "f", "g", "h"].forEach((letter) => {
        const key = `answer_${letter}`;
        if (ans[key]) {
          options[normalizeString(ans[key])] = letter.toUpperCase();
        }
      });

      return {
        qIndex: parseInt(ans.question_number),
        text: ans.question_text,
        correct: (ans.correct || "").trim().toUpperCase(),
        options,
      };
    })
    .sort((a, b) => a.qIndex - b.qIndex);
}

/**
 * Bridges the new DB format to the structure the existing engine logic expects.
 */
function transformData(sessions, answersDb, answersText) {
  const optionIdToText = {};
  const questionIdToQIndex = {};
  const qKeys = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"];

  // 1. Map IDs to human-readable text from answers.csv
  const processedAnswers = answersText.map((ansText, idx) => {
    const qNum = idx + 1;
    const dbRow = answersDb.find((d) => parseInt(d.question_number) === qNum);
    const options = {};

    if (dbRow) {
      questionIdToQIndex[dbRow.question_ID] = qNum;
      ["a", "b", "c", "d", "e", "f", "g", "h"].forEach((l) => {
        const id = dbRow[`answer_${l}`];
        const text = ansText[`answer_${l}`];
        if (id && text) {
          optionIdToText[id] = text;
          options[normalizeString(text)] = l.toUpperCase();
        }
      });
    }

    return {
      qIndex: qNum,
      text: ansText.question_text,
      correct: (ansText.correct || "").trim().toUpperCase(),
      options,
    };
  });

  // 2. Pivot "long" sessions into "wide" participant objects
  const participantMap = {};
  sessions.forEach((row) => {
    const sId = row.phpsession;
    if (!sId) return;

    if (!participantMap[sId]) {
      participantMap[sId] = {
        SessionID: sId,
        "Prime UserID": row.user_id || "Unknown",
        Team: (row.team_name || "Phoenix").trim(),
        Discipline: "N/A", // Not present in DB files
      };
      // Pre-fill answers with fallback
      qKeys.forEach((k) => (participantMap[sId][k] = "No Response"));
    }

    const qIdx = questionIdToQIndex[row.question_id];
    if (qIdx) {
      const text = optionIdToText[row.question_option_id];
      participantMap[sId][`Q${qIdx}`] = text || "No Response";
    }
  });

  return {
    outcomes: Object.values(participantMap),
    processedAnswers,
    qKeys,
  };
}

function calculateResults(
  outcomes,
  processedAnswers,
  qKeys,
  upToQuestionIndex,
) {
  const teams = {};
  outcomes.forEach((row) => {
    let teamName = (row.Team || "").trim();
    if (!teamName || teamName.toLowerCase() === "noteamwalkin")
      teamName = "Phoenix";
    if (!teams[teamName]) {
      teams[teamName] = {
        name: teamName,
        members: [],
        N: 0,
        scores: [],
        correctPercentages: [],
      };
    }
    teams[teamName].members.push(row);
    teams[teamName].N += 1;
  });

  for (let q = 0; q < upToQuestionIndex; q++) {
    const qKey = qKeys[q];
    const questionInfo = processedAnswers[q];
    Object.values(teams).forEach((team) => {
      let correctCount = 0;
      team.members.forEach((member) => {
        const norm = normalizeString(member[qKey]);
        if (questionInfo.options[norm] === questionInfo.correct)
          correctCount += 1;
      });
      team.scores.push(team.N > 0 ? 10 * (correctCount / team.N) : 0);
      team.correctPercentages.push(
        team.N > 0 ? (correctCount / team.N) * 100 : 0,
      );
    });
  }

  const currentQKey = qKeys[upToQuestionIndex - 1];
  const currentQInfo = processedAnswers[upToQuestionIndex - 1];

  const rankedTeams = Object.values(teams).map((team) => {
    const qScore = team.scores[upToQuestionIndex - 1] || 0;
    const qConsensus = team.correctPercentages[upToQuestionIndex - 1] || 0;
    return {
      name: team.name,
      score: Math.round(team.scores.reduce((a, b) => a + b, 0) * 100) / 100,
      consensus:
        Math.round(
          (team.correctPercentages.reduce((a, b) => a + b, 0) /
            team.correctPercentages.length) *
            100,
        ) / 100,
      currentQuestionScore: Math.round(qScore * 100) / 100,
      currentQuestionConsensus: Math.round(qConsensus * 100) / 100,
      N: team.N,
      members: team.members.map((m) => ({
        sessionID: m.SessionID,
        id: m["Prime UserID"],
        rawAnswer: m[currentQKey],
        isCorrect:
          normalizeString(m[currentQKey]) in currentQInfo.options &&
          currentQInfo.options[normalizeString(m[currentQKey])] ===
            currentQInfo.correct,
      })),
    };
  });

  return rankedTeams
    .sort((a, b) => b.score - a.score || b.consensus - a.consensus)
    .map((t, i) => ({ ...t, rank: i + 1 }));
}

function generateAllSnapshots(sessions, answersDb, answersText) {
  const { outcomes, processedAnswers, qKeys } = transformData(
    sessions,
    answersDb,
    answersText,
  );
  const snapshots = [];

  for (let i = 1; i <= 8; i++) {
    const qInfo = processedAnswers[i - 1];
    const qKey = qKeys[i - 1];
    const correctCount = outcomes.filter(
      (m) => qInfo.options[normalizeString(m[qKey])] === qInfo.correct,
    ).length;
    const correctText = Object.keys(qInfo.options).find(
      (k) => qInfo.options[k] === qInfo.correct,
    );

    snapshots.push({
      questionIndex: i,
      questionInfo: {
        text: qInfo.text,
        correctAnswer: correctText || qInfo.correct,
        classCorrectPercentage:
          outcomes.length > 0
            ? Math.round((correctCount / outcomes.length) * 100)
            : 0,
      },
      leaderboard: calculateResults(outcomes, processedAnswers, qKeys, i),
    });
  }
  return snapshots;
}

module.exports = { generateAllSnapshots };
