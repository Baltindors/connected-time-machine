const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

function loadData() {
  const outcomesPath = path.join(__dirname, 'data', 'outcomes.csv');
  const answersPath = path.join(__dirname, 'data', 'answers.csv');

  const outcomesRaw = fs.readFileSync(outcomesPath, 'utf8');
  const answersRaw = fs.readFileSync(answersPath, 'utf8');

  const outcomes = Papa.parse(outcomesRaw, {
    header: true,
    skipEmptyLines: true
  }).data;

  const answers = Papa.parse(answersRaw, {
    header: true,
    skipEmptyLines: true
  }).data;

  return { outcomes, answers };
}

module.exports = { loadData };
