<template>
  <div v-if="selectedTeam" class="team-details-container">
    <div class="team-details-header">
      <h3>Team: {{ selectedTeam.name }}</h3>
      <div class="team-stats">
        <span class="stat-item">
          <strong>Question Points:</strong> {{ selectedTeam.currentQuestionScore }}
        </span>
        <span class="stat-item">
          <strong>Question Consensus:</strong> {{ selectedTeam.currentQuestionConsensus }}%
        </span>
      </div>
    </div>

    <table class="breakdown-table">
      <thead>
        <tr>
          <th>Session ID</th>
          <th>Prime User ID</th>
          <th>Answer</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(member, idx) in selectedTeam.members" :key="idx">
          <td>{{ member.sessionID }}</td>
          <td>{{ member.id }}</td>
          <td>{{ member.rawAnswer }}</td>
          <td>
            <span :class="member.isCorrect ? 'correct-label' : 'wrong-label'">
              {{ member.isCorrect ? 'CORRECT' : 'WRONG' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  selectedTeam: {
    type: Object,
    default: null
  }
});
</script>

<style scoped>
.team-details-container {
  color: white;
  padding: 20px;
  background: #1a1f2e;
  border-radius: 8px;
}
.team-details-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}
.stat-item {
  margin-left: 20px;
}
.breakdown-table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}
.breakdown-table th {
  color: #aaa;
  font-size: 0.85rem;
  padding: 10px;
}
.breakdown-table td {
  padding: 10px;
  font-size: 0.9rem;
  border-bottom: 1px solid #2a2f3e;
}
.correct-label {
  color: #4caf50;
  font-weight: bold;
}
.wrong-label {
  color: #f44336;
  font-weight: bold;
}
</style>