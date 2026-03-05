<script setup>
import { ref } from 'vue';
import { useMovieStore } from '../stores/movieStore';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const store = useMovieStore();
const router = useRouter();
const searchQuery = ref('');

const handleSearch = async () => {
  // التعديل هنا:
  // إذا كتب المستخدم شيئاً -> ابحث عنه
  if (searchQuery.value.trim()) {
    await store.searchMovies(searchQuery.value);
  } 
  // إذا كان الحقل فارغاً وضغط بحث -> أعد تحميل الأفلام الشائعة
  else {
    await store.fetchPopularMovies();
  }
  
  // في كلتا الحالتين، اذهب للصفحة الرئيسية
  router.push('/');
};
</script>

<template>
  <div class="relative flex w-full bg-gray-800/50 rounded-full border border-gray-600 focus-within:border-red-600 focus-within:bg-black/80 transition-all duration-300 backdrop-blur-sm">
    
    <input 
      v-model="searchQuery"
      @keyup.enter="handleSearch"
      type="text" 
      placeholder="Search titles..." 
      class="w-full bg-transparent text-white px-5 py-2 rounded-full outline-none placeholder-gray-400 text-sm font-['Outfit']"
    />

    <button 
      @click="handleSearch"
      class="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition duration-300 cursor-pointer flex justify-center items-center"
    >
      <Icon icon="ph:magnifying-glass-bold" class="w-4 h-4 text-white" />
    </button>
  </div>
</template>