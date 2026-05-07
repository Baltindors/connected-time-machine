<template>
  <div class="h-screen overflow-hidden flex flex-col font-sans bg-slate-900 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
    <!-- Premium background elements -->
    <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px]"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 p-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 class="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 drop-shadow-sm">
            ConnectED Time-Machine
          </h1>
          <p class="text-slate-400 text-sm mt-1 font-medium tracking-wide">
            13LV258 Eosinophilic Esophagitis • Post-Event Analytics
          </p>
        </div>
        <div class="px-4 py-2 bg-slate-800/80 rounded-lg border border-slate-700 shadow-inner flex items-center gap-3">
          <span class="relative flex h-3 w-3">
            <span v-if="!isLoading && !error" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3" :class="error ? 'bg-rose-500' : (isLoading ? 'bg-amber-500' : 'bg-emerald-500')"></span>
          </span>
          <span class="text-xs font-bold text-slate-300 uppercase tracking-widest">
            {{ error ? 'Engine Error' : (isLoading ? 'Processing...' : 'Engine Online') }}
          </span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
<main class="flex-grow relative z-10 p-6 overflow-hidden flex flex-col min-h-0">
      <div class="max-w-7xl mx-auto w-full flex-grow flex flex-col min-h-0">
        
        <div v-if="isLoading" class="flex flex-col items-center justify-center h-64 gap-4">
          <div class="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p class="text-indigo-400 font-bold tracking-widest uppercase text-sm animate-pulse">Running Consensus Engine...</p>
        </div>

        <div v-else-if="error" class="bg-rose-950/50 border border-rose-800 p-6 rounded-xl text-center">
          <p class="text-rose-400 font-bold mb-2">Error Loading Data</p>
          <p class="text-rose-300/80 text-sm">{{ error }}</p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow min-h-0">
          
          <div class="lg:col-span-6 space-y-6 flex flex-col min-h-0 overflow-hidden">
            <QuestionCard 
              :questionIndex="currentQuestionIndex"
              :questionInfo="questionInfo"
              :selectedTeam="selectedTeamDetails"
            />
            
            <div v-if="selectedTeamDetails" class="bg-slate-800/40 border border-indigo-500/30 rounded-xl p-4 backdrop-blur-md flex-grow overflow-y-auto custom-scrollbar min-h-0">
              <div class="flex justify-between items-center mb-4 sticky top-0 bg-slate-800/80 backdrop-blur pb-2">
                <h3 class="text-indigo-400 font-bold uppercase text-xs tracking-widest">
                  Team Breakdown: {{ selectedTeamName }}
                </h3>
                <button @click="selectedTeamName = null" class="text-slate-500 hover:text-slate-300 text-xs underline">Close</button>
              </div>
              <div class="space-y-2">
                <div class="grid grid-cols-4 px-3 text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-widest">
                  <span>Session</span>
                  <span>User ID</span>
                  <span>Answer</span>
                  <span class="text-right">Result</span>
                </div>
                <div v-for="member in selectedTeamDetails.members" :key="member.sessionID + member.id" 
                    class="grid grid-cols-4 items-center bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 transition-colors hover:bg-slate-900/90">
                  <span class="text-slate-500 text-[10px] font-mono truncate pr-2">{{ member.sessionID }}</span>
                  <span class="text-slate-200 font-medium text-sm">{{ member.id }}</span>
                  <span class="text-slate-400 text-[11px] italic truncate pr-2">"{{ member.rawAnswer || 'No Resp' }}"</span>
                  <div class="text-right">
                    <span :class="member.isCorrect ? 'text-emerald-400' : 'text-rose-500'" class="text-[10px] font-black uppercase">
                      {{ member.isCorrect ? 'Correct' : 'Wrong' }}
                    </span>
                  </div>
                </div>
              </div>
            </div> 
          </div>

          <div class="lg:col-span-6 flex flex-col min-h-0">
            <Leaderboard 
              :teams="rankedTeams" 
              @select-team="name => selectedTeamName = name" 
              class="flex-grow min-h-0"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Fixed Footer with Slider -->
    <footer class="mt-auto relative z-20">
      <TimelineSlider 
        v-if="!isLoading && !error && allSnapshots.length > 0"
        v-model="currentQuestionIndex" 
        :min="1" 
        :max="allSnapshots.length"
      />
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useResults } from './composables/useResults';
import QuestionCard from './components/QuestionCard.vue';
import Leaderboard from './components/Leaderboard.vue';
import TimelineSlider from './components/TimelineSlider.vue';

const {
  allSnapshots,
  currentQuestionIndex,
  rankedTeams,
  questionInfo,
  selectedTeamName,    
  selectedTeamDetails,
  isLoading,
  error,
  fetchResults
} = useResults();

onMounted(() => {
  fetchResults();
});
</script>
