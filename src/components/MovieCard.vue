<script setup>
import { computed, ref, onMounted } from 'vue';
import { inView, animate } from 'motion';

const props = defineProps({
  movie: Object
});

const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

// معالجة الصورة
const posterUrl = computed(() => props.movie.poster_path ? `${imageBaseUrl}${props.movie.poster_path}` : null);

// 1. الحل هنا: إذا لم تجد العنوان (للفيلم)، ابحث عن الاسم (للمسلسل)
const displayTitle = computed(() => {
  return props.movie.title || props.movie.name || 'Unknown Title';
});

// 2. معالجة التاريخ: الأفلام (release_date) والمسلسلات (first_air_date)
const displayDate = computed(() => {
  const date = props.movie.release_date || props.movie.first_air_date;
  return date ? date.split('-')[0] : 'N/A';
});

const cardRef = ref(null);

onMounted(() => {
  if (cardRef.value) {
    inView(cardRef.value, (info) => {
      animate(info.target, { opacity: [0, 1], y: [30, 0] }, { duration: 0.5, easing: 'ease-out' });
      return () => {
         // optional teardown if it leaves view, but typically we just animate in once.
      };
    }, { amount: 0.1 }); 
  }
});
</script>

<template>
  <div ref="cardRef" class="group relative cursor-pointer active:scale-95 transition-transform duration-200" style="opacity: 0;">
    <div class="relative overflow-hidden rounded-lg aspect-[2/3] transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-red-900/20 bg-gray-800">
      
      <img 
        v-if="posterUrl"
        :src="posterUrl" 
        :alt="displayTitle"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4 text-center">
        <span class="text-xs">No Image</span>
        <span class="font-bold text-sm mt-2 text-gray-400">{{ displayTitle }}</span>
      </div>

      <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        
        <h3 class="text-white font-bold text-lg leading-tight">{{ displayTitle }}</h3>
        
        <div class="flex items-center gap-2 mt-2 text-xs text-gray-300">
          <span class="text-yellow-400 font-bold">★ {{ movie.vote_average?.toFixed(1) }}</span>
          <span>•</span>
          <span>{{ displayDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>