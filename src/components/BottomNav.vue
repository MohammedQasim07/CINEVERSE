<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';

const route = useRoute();

const isActive = (path) => {
  return route.path === path;
};

// التمرير للأعلى عند الضغط على "بحث" (لأنه في الصفحة الرئيسية)
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="fixed bottom-0 left-0 w-full bg-[#141414]/60 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] flex justify-around items-center h-16 z-50 md:hidden pb-safe">
    
    <router-link to="/" class="flex flex-col items-center gap-1 p-2 w-16 transition-colors" :class="isActive('/') ? 'text-red-600' : 'text-gray-400 hover:text-white'">
      <Icon icon="ph:house-fill" class="w-6 h-6" />
      <span class="text-[10px] font-medium">Home</span>
    </router-link>

    <!-- زر البحث يقوم بالتركيز أو الصعود للأعلى -->
    <div @click="scrollToTop" class="flex flex-col items-center gap-1 p-2 w-16 text-gray-400 hover:text-white cursor-pointer transition-colors active:scale-95">
      <Icon icon="ph:magnifying-glass-bold" class="w-6 h-6" />
      <span class="text-[10px] font-medium">Search</span>
    </div>

    <router-link to="/favorites" class="flex flex-col items-center gap-1 p-2 w-16 transition-colors" :class="isActive('/favorites') ? 'text-red-600' : 'text-gray-400 hover:text-white'">
       <Icon icon="ph:heart-fill" class="w-6 h-6" />
      <span class="text-[10px] font-medium">My List</span>
    </router-link>

  </div>
</template>

<style scoped>
/* دعم Safe Area لهواتف آيفون الحديثة */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
