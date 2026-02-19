<script setup>
import { ref } from 'vue';
import { useMovieStore } from '../stores/movieStore';
import { useRouter } from 'vue-router';

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
      class="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition duration-300 cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
        <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>