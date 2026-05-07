const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

function loadData() {
  const sessionsPath = path.join(
    __dirname,
    "data",
    "13LV258_livepolling_sessions_db.csv",
  );
  const answersDbPath = path.join(__dirname, "data", "answers_db.csv");
  const answersTextPath = path.join(__dirname, "data", "answers.csv");

  const sessionsRaw = fs.readFileSync(sessionsPath, "utf8");
  const answersDbRaw = fs.readFileSync(answersDbPath, "utf8");
  const answersTextRaw = fs.readFileSync(answersTextPath, "utf8");

  const sessions = Papa.parse(sessionsRaw, {
    header: true,
    skipEmptyLines: true,
  }).data;
  const answersDb = Papa.parse(answersDbRaw, {
    header: true,
    skipEmptyLines: true,
  }).data;
  const answersText = Papa.parse(answersTextRaw, {
    header: true,
    skipEmptyLines: true,
  }).data;

  return { sessions, answersDb, answersText };
}

module.exports = { loadData };
