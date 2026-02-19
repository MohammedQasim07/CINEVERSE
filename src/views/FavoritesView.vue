<script setup>
import { useMovieStore } from '../stores/movieStore';
import MovieCard from '../components/MovieCard.vue';

const store = useMovieStore();
</script>

<template>
  <div class="min-h-screen bg-[#141414] text-white font-['Outfit'] pt-24 px-4 container mx-auto">
    <h2 class="text-3xl font-bold mb-8 border-l-4 border-red-600 pl-4">My List</h2>

    <div v-if="store.favorites.length === 0" class="flex flex-col items-center justify-center py-20 opacity-50">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 mb-4 text-gray-600">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-xl">Your list is empty.</p>
      <p class="text-sm">Start adding movies to watch them later!</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
      <router-link 
        v-for="movie in store.favorites" 
        :key="movie.id" 
        :to="`/movie/${movie.id}`"
      >
        <MovieCard :movie="movie" />
      </router-link>
    </div>
  </div>
</template>