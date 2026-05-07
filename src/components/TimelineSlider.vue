<template>
  <div class="bg-slate-800/80 backdrop-blur-md p-6 border-t border-slate-700/50 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
    <div class="max-w-4xl mx-auto flex flex-col gap-4">
      <div class="flex justify-between items-center text-sm font-bold text-slate-400">
        <span>Start</span>
        <span class="text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]">Time-Machine Controls</span>
        <span>End</span>
      </div>
      
      <div class="relative flex items-center py-4">
        <div class="absolute w-full h-2 bg-slate-700 rounded-lg z-0"></div>

        <div 
          class="absolute left-0 h-2 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-l-lg pointer-events-none z-10"
          :style="{ width: `${progressPercentage}%` }"
        ></div>

        <input 
          type="range" 
          :min="min" 
          :max="max" 
          :value="modelValue"
          @input="$emit('update:modelValue', parseInt($event.target.value))"
          class="w-full h-2 bg-transparent appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all slider-thumb relative z-20"
        />
        
        <div class="absolute top-full left-0 w-full flex justify-between px-1 pointer-events-none -mt-2">
          <span 
            v-for="tick in max"
            :key="tick"
            class="text-[10px] font-bold w-4 text-center transition-colors duration-300"
            :class="tick <= modelValue ? 'text-cyan-400' : 'text-slate-600'"
          >
            {{ tick }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 8
  }
});

defineEmits(['update:modelValue']);

const progressPercentage = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100;
});
</script>

<style scoped>
/* WebKit (Chrome, Safari, Edge) styling for thumb */
.slider-thumb::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid #6366f1; /* indigo-500 */
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.6);
  cursor: pointer;
  position: relative;
  z-index: 10;
  transition: transform 0.1s;
}

.slider-thumb::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.8);
}

.slider-thumb::-webkit-slider-thumb:active {
  transform: scale(0.95);
}

/* Firefox styling for thumb */
.slider-thumb::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid #6366f1;
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.6);
  cursor: pointer;
  position: relative;
  z-index: 10;
  transition: transform 0.1s;
}

.slider-thumb::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.8);
}
</style>
