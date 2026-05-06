<template>
  <div class="w-full">
    <div class="flex items-center justify-between px-4 mb-4">
      <h2 class="text-lg font-bold text-slate-200">Team Rankings</h2>
      <div class="text-xs text-slate-500 font-medium">Sorted by Score, then Consensus</div>
    </div>
    
    <div class="relative bg-slate-900/40 rounded-2xl p-2 md:p-4 border border-slate-700/50">
      <TransitionGroup name="list" tag="div" class="flex flex-col gap-3 relative min-h-[400px]">
<TeamRow 
  v-for="team in teams" 
          :key="team.name"
          :team="team"
          :rank="team.rank"
          @click="$emit('select-team', team.name)"
          class="cursor-pointer active:scale-[0.98] transition-transform"
        />
      </TransitionGroup>
      
      <div v-if="teams.length === 0" class="absolute inset-0 flex items-center justify-center text-slate-500 italic">
        No teams available for this question.
      </div>
    </div>
  </div>
</template>

<script setup>
import TeamRow from './TeamRow.vue';

defineProps({
  teams: {
    type: Array,
    required: true
  }
});
</script>
