import { ref, computed } from 'vue';

export function useResults() {
  const allSnapshots = ref([]);
  const currentQuestionIndex = ref(1);
  const isLoading = ref(true);
  const error = ref(null);

  const fetchResults = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch('/api/results');
      const data = await response.json();
      if (data.success) {
        allSnapshots.value = data.snapshots;
      } else {
        error.value = data.error || 'Failed to fetch results';
      }
    } catch (err) {
      error.value = 'Failed to connect to backend';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const currentSnapshot = computed(() => {
    if (!allSnapshots.value.length) return null;
    return allSnapshots.value.find(s => s.questionIndex === currentQuestionIndex.value);
  });

const rankedTeams = computed(() => {
    return currentSnapshot.value?.leaderboard || [];
  });

  const questionInfo = computed(() => {
    return currentSnapshot.value?.questionInfo || null;
  });

const selectedTeamName = ref(null);

const selectedTeamDetails = computed(() => {
  if (!selectedTeamName.value || !rankedTeams.value) return null;
  return rankedTeams.value.find(t => t.name === selectedTeamName.value);
});

return {
  allSnapshots,
  currentQuestionIndex,
  currentSnapshot,
    rankedTeams,
    questionInfo,
    selectedTeamName, // Added
    selectedTeamDetails, // Added
    isLoading,
    error,
    fetchResults
  };
}
