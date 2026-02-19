<script setup>
import SearchBar from './components/SearchBar.vue';
import BottomNav from './components/BottomNav.vue';
import OfflineIndicator from './components/OfflineIndicator.vue';
import InstallPrompt from './components/InstallPrompt.vue';
import { useMovieStore } from './stores/movieStore'; // 1. استيراد الستور
import { useRouter } from 'vue-router';

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
    
    <header class="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-gradient-to-b from-black/95 via-black/80 to-transparent pb-3 backdrop-blur-sm">
      <div class="container mx-auto px-4 py-2 flex flex-row justify-between items-center gap-4">
        
        <div @click="goHome" class="cursor-pointer text-xl md:text-3xl font-black text-red-600 tracking-tighter uppercase drop-shadow-md hover:scale-105 transition-transform flex items-center gap-1">
          Cine<span class="text-white">Verse</span>
        </div>

        <div class="flex items-center gap-2 flex-1 justify-end">
          <router-link to="/favorites" class="text-gray-300 hover:text-white font-bold text-sm hidden md:block">
            My List
          </router-link>
          
          <div class="w-full max-w-[200px] md:max-w-xs transition-all duration-300">
            <SearchBar />
          </div>
        </div>
        
      </div>
    </header>

    <main>
      <router-view></router-view>
    </main>
    
    <BottomNav />
    <InstallPrompt />
  </div>
</template>
