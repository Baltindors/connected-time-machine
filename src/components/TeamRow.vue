<template>
  <div 
    class="relative group flex items-center p-4 rounded-xl border transition-all duration-300 transform-gpu"
    :class="[
      isHovered ? 'shadow-lg scale-[1.01] z-10' : 'shadow bg-slate-800/80 border-slate-700/50',
      rank === 1 && !isHovered ? 'bg-slate-800 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : ''
    ]"
    :style="rowStyle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Rank Badge -->
    <div class="w-12 flex-shrink-0 flex justify-center">
      <div 
        class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
        :class="[
          rank === 1 ? 'bg-amber-500 text-amber-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
          rank === 2 ? 'bg-slate-300 text-slate-800' : 
          rank === 3 ? 'bg-amber-700 text-amber-100' : 
          'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
        ]"
      >
        {{ rank }}
      </div>
    </div>
    
    <!-- Team Info -->
    <div class="flex-grow ml-4 flex items-center gap-3">
      <div class="text-2xl filter drop-shadow-md bg-white/10 w-10 h-10 rounded-lg flex items-center justify-center border border-white/5">
        {{ branding.icon }}
      </div>
      <div>
        <h3 class="font-bold text-lg leading-tight transition-colors" :style="{ color: branding.color }">
          {{ team.name }}
        </h3>
        <p class="text-xs text-slate-400 mt-0.5 font-medium">
          {{ team.N }} Participants
        </p>
      </div>
    </div>
    
    <!-- Stats -->
    <div class="flex items-center gap-8 text-right pr-2">
      <!-- Consensus -->
      <div class="flex flex-col">
        <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Consensus</span>
        <span class="text-lg font-semibold tabular-nums" :class="consensusColor">
          {{ team.consensus.toFixed(1) }}%
        </span>
      </div>
      
      <!-- Score -->
      <div class="flex flex-col items-end min-w-[80px]">
        <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Score</span>
        <span class="text-2xl font-bold tabular-nums text-white drop-shadow-sm">
          {{ team.score.toFixed(0) }}
        </span>
      </div>
    </div>
    
    <!-- Progress Bar (Background) -->
    <div class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { getTeamBranding, getPastelBackground } from '../assets/team-config';

const props = defineProps({
  team: {
    type: Object,
    required: true
  },
  rank: {
    type: Number,
    required: true
  }
});

const isHovered = ref(false);

const branding = computed(() => getTeamBranding(props.team.name));

const rowStyle = computed(() => {
  if (isHovered.value) {
    return {
      backgroundColor: getPastelBackground(branding.value.color),
      borderColor: `${branding.value.color}40`, // 25% opacity
    };
  }
  return {};
});

const consensusColor = computed(() => {
  if (props.team.consensus >= 80) return 'text-emerald-400';
  if (props.team.consensus >= 50) return 'text-amber-400';
  return 'text-rose-400';
});
</script>
