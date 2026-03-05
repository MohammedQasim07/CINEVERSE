<script setup>
import SearchBar from './components/SearchBar.vue';
import BottomNav from './components/BottomNav.vue';
import OfflineIndicator from './components/OfflineIndicator.vue';
import InstallPrompt from './components/InstallPrompt.vue';
import { useMovieStore } from './stores/movieStore'; // 1. استيراد الستور
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const store = useMovieStore();
const router = useRouter();

// 2. دالة العودة للرئيسية وتصفير البحث
const goHome = () => {
  store.fetchPopularMovies(); // إعادة تحميل الأفلام الشائعة
  router.push('/'); // الذهاب للرابط الرئيسي
};
</script>

<template>
  <div class="min-h-screen bg-[#141414] text-white font-['Outfit']">
    <OfflineIndicator />
    
    <header class="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-gradient-to-b from-[#141414] via-[#141414]/90 to-transparent pb-6 pt-2 backdrop-blur-md border-b border-white/5">
      <div class="container mx-auto px-4 py-2 flex flex-row justify-between items-center gap-4">
        
        <div @click="goHome" class="cursor-pointer hover:scale-105 transition-transform flex items-center gap-1.5 active:scale-95 group">
          <div class="bg-gradient-to-br from-red-500 to-rose-600 p-1 rounded-lg shadow-lg shadow-red-600/30 group-hover:shadow-red-500/50 transition-all">
            <Icon icon="ph:play-fill" class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl md:text-2xl font-black tracking-tighter uppercase drop-shadow-md">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">Cine</span><span class="text-white">Verse</span>
          </span>
        </div>

        <div class="flex items-center gap-4 flex-1 justify-end">
           <router-link to="/favorites" class="text-gray-300 hover:text-red-500 transition-colors hidden md:flex items-center gap-1 active:scale-95" title="My List">
            <Icon icon="ph:bookmark-simple-bold" class="w-7 h-7" />
          </router-link>
          
          <div class="w-full max-w-[200px] md:max-w-xs transition-all duration-300">
            <SearchBar />
          </div>
        </div>
        
      </div>
    </header>

    <main class="min-h-screen">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <BottomNav />
    <InstallPrompt />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
