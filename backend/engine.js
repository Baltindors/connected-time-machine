function normalizeString(str) {
  if (!str) return '';
  // Trimming, lowercasing, and normalizing whitespace
  return str.toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

function processAnswers(answers) {
  return answers.map(ans => {
    const options = {};
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(letter => {
      const key = `answer_${letter}`;
      if (ans[key]) {
        options[normalizeString(ans[key])] = letter.toUpperCase();
      }
    });

    return {
      qIndex: parseInt(ans.question_number),
      text: ans.question_text,
      correct: (ans.correct || '').trim().toUpperCase(),
      options
    };
  }).sort((a, b) => a.qIndex - b.qIndex);
}

function getQuestionKeys(outcomes) {
  // Extract the last 8 columns from the first row as the keys for questions 1-8
  if (outcomes.length === 0) return [];
  const keys = Object.keys(outcomes[0]);
  return keys.slice(-8); // We have 8 questions
}

function calculateResults(outcomes, processedAnswers, qKeys, upToQuestionIndex) {
  const teams = {};

  outcomes.forEach(row => {
    let teamName = (row.Team || row.team_name || '').trim();
    if (!teamName || teamName.toLowerCase() === 'noteamwalkin') {
      teamName = 'Phoenix';
    }

    if (!teams[teamName]) {
      teams[teamName] = {
        name: teamName,
        members: [],
        N: 0,
        scores: [],
        correctPercentages: []
      };
    }
    teams[teamName].members.push(row);
    teams[teamName].N += 1;
  });

  for (let q = 0; q < upToQuestionIndex; q++) {
    const qKey = qKeys[q];
    const questionInfo = processedAnswers[q];
    if (!questionInfo) continue;

    Object.values(teams).forEach(team => {
      let correctCount = 0;
      team.members.forEach(member => {
        const rawAnswer = member[qKey];
        const normalizedAnswer = normalizeString(rawAnswer);
        const mappedLetter = questionInfo.options[normalizedAnswer] || '';
        
        if (mappedLetter === questionInfo.correct) {
          correctCount += 1;
        } else if (mappedLetter === '' && questionInfo.correct) {
          // Fallback if clinical text is just 'true' or 'false'
          if (normalizedAnswer === 'true' && questionInfo.options['true'] === questionInfo.correct) {
            correctCount += 1;
          } else if (normalizedAnswer === 'false' && questionInfo.options['false'] === questionInfo.correct) {
            correctCount += 1;
          }
        }
      });

      const qScore = team.N > 0 ? 10 * (correctCount / team.N) : 0;
      team.scores.push(qScore);

      const correctPercentage = team.N > 0 ? (correctCount / team.N) * 100 : 0;
      team.correctPercentages.push(correctPercentage);
    });
  }

  const rankedTeams = Object.values(teams).map(team => {
    const cumulativeScore = team.scores.reduce((sum, score) => sum + score, 0);
    const avgConsensus = team.correctPercentages.length > 0 
      ? team.correctPercentages.reduce((sum, pct) => sum + pct, 0) / team.correctPercentages.length
      : 0;

return {
      name: team.name,
      score: Math.round(cumulativeScore * 100) / 100,
      consensus: Math.round(avgConsensus * 100) / 100,
      N: team.N,
      members: team.members.map(m => ({
        id: m['Prime UserID'] || 'Unknown',
        discipline: m['Discipline'] || 'N/A',
        // Use the current question key to get the specific answer for this phase
        rawAnswer: m[qKeys[upToQuestionIndex - 1]] || 'No Response'
      }))
    };
  });

  rankedTeams.sort((a, b) => {
    if (Math.abs(b.score - a.score) > 0.001) {
      return b.score - a.score;
    }
    return b.consensus - a.consensus;
  });

  rankedTeams.forEach((team, index) => {
    team.rank = index + 1;
  });

  return rankedTeams;
}

function generateAllSnapshots(outcomes, answers) {
  const processedAnswers = processAnswers(answers);
  const qKeys = getQuestionKeys(outcomes);
  const snapshots = [];

  for (let i = 1; i <= 8; i++) {
    const questionInfo = processedAnswers[i - 1];
    if (!questionInfo) continue;

    let totalCorrect = 0;
    let totalN = outcomes.length;
    const qKey = qKeys[i - 1];

    outcomes.forEach(member => {
      const normalizedAnswer = normalizeString(member[qKey]);
      const mappedLetter = questionInfo.options[normalizedAnswer] || '';
      if (mappedLetter === questionInfo.correct) {
        totalCorrect += 1;
      } else if (mappedLetter === '' && questionInfo.correct) {
        if (normalizedAnswer === 'true' && questionInfo.options['true'] === questionInfo.correct) {
          totalCorrect += 1;
        } else if (normalizedAnswer === 'false' && questionInfo.options['false'] === questionInfo.correct) {
          totalCorrect += 1;
        }
      }
    });

    const classCorrectPercentage = totalN > 0 ? Math.round((totalCorrect / totalN) * 100) : 0;

    snapshots.push({
      questionIndex: i,
      questionInfo: {
        text: questionInfo.text,
        correctAnswer: questionInfo.correct,
        classCorrectPercentage: classCorrectPercentage
      },
      leaderboard: calculateResults(outcomes, processedAnswers, qKeys, i)
    });
  }
  return snapshots;
}

module.exports = { generateAllSnapshots };
