const express = require("express");
const cors = require("cors");
const { loadData } = require("./dataLoader");
const { generateAllSnapshots } = require("./engine");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/results", (req, res) => {
  try {
    const { sessions, answersDb, answersText } = loadData();
    const snapshots = generateAllSnapshots(sessions, answersDb, answersText);
    res.json({ success: true, snapshots });
  } catch (error) {
    console.error("Error processing results:", error);
    res.status(500).json({ success: false, error: "Failed to process data" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
