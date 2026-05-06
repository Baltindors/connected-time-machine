<template>
  <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-slate-600/50">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xs font-bold uppercase tracking-widest text-slate-400">Current Event Phase</h2>
      <div class="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/20">
        Question {{ questionIndex }}
      </div>
    </div>
    
    <div v-if="questionInfo" class="space-y-6">
      <p class="text-xl md:text-2xl font-light text-slate-100 leading-relaxed">
        {{ questionInfo.text }}
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/30 flex flex-col justify-center">
          <span class="text-xs text-slate-500 mb-1">Correct Answer</span>
          <span class="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            {{ questionInfo.correctAnswer || 'N/A' }}
          </span>
        </div>
        
        <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/30 flex flex-col justify-center">
          <span class="text-xs text-slate-500 mb-1">Overall Class Accuracy</span>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold" :class="accuracyColor">
              {{ questionInfo.classCorrectPercentage }}%
            </span>
            <div class="w-full bg-slate-800 h-2 rounded-full mb-1 ml-2 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-1000 ease-out" 
                   :class="accuracyBgColor"
                   :style="{ width: `${questionInfo.classCorrectPercentage}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="py-8 text-center text-slate-500 animate-pulse">
      Loading phase data...
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  questionIndex: {
    type: Number,
    required: true
  },
  questionInfo: {
    type: Object,
    default: null
  }
});

const accuracyColor = computed(() => {
  const pct = props.questionInfo?.classCorrectPercentage || 0;
  if (pct >= 80) return 'text-emerald-400';
  if (pct >= 50) return 'text-amber-400';
  return 'text-rose-400';
});

const accuracyBgColor = computed(() => {
  const pct = props.questionInfo?.classCorrectPercentage || 0;
  if (pct >= 80) return 'bg-emerald-400';
  if (pct >= 50) return 'bg-amber-400';
  return 'bg-rose-400';
});
</script>
