<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

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
  <div class="fixed bottom-0 left-0 w-full bg-[#141414]/90 backdrop-blur-lg border-t border-white/10 flex justify-around items-center h-16 z-50 md:hidden pb-safe">
    
    <router-link to="/" class="flex flex-col items-center gap-1 p-2 w-16 transition-colors" :class="isActive('/') ? 'text-red-600' : 'text-gray-400 hover:text-white'">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
      </svg>
      <span class="text-[10px] font-medium">Home</span>
    </router-link>

    <!-- زر البحث يقوم بالتركيز أو الصعود للأعلى -->
    <div @click="scrollToTop" class="flex flex-col items-center gap-1 p-2 w-16 text-gray-400 hover:text-white cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
        <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd" />
      </svg>
      <span class="text-[10px] font-medium">Search</span>
    </div>

    <router-link to="/favorites" class="flex flex-col items-center gap-1 p-2 w-16 transition-colors" :class="isActive('/favorites') ? 'text-red-600' : 'text-gray-400 hover:text-white'">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
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
