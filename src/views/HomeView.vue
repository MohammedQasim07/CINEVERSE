<script setup>
import { onMounted, computed, ref, onUnmounted } from 'vue';
import { useMovieStore } from '../stores/movieStore';
import { Icon } from '@iconify/vue';
import MovieCard from '../components/MovieCard.vue';
import MovieSkeleton from '../components/MovieSkeleton.vue';

const movieStore = useMovieStore();
const loadTrigger = ref(null);
let observer = null;

onMounted(async () => {
  // جلب التصنيفات
  await movieStore.fetchGenres();

  // جلب الأفلام إذا كانت القائمة فارغة
  if (movieStore.movies.length === 0) {
    movieStore.fetchPopularMovies();
  }

  // Infinite Scroll Observer
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      movieStore.fetchPopularMovies(true);
    }
  }, { rootMargin: '100px' });

  if (loadTrigger.value) observer.observe(loadTrigger.value);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

const featuredMovie = computed(() => movieStore.movies.length > 0 ? movieStore.movies[0] : null);
const backdropUrl = computed(() => featuredMovie.value ? `https://image.tmdb.org/t/p/original${featuredMovie.value.backdrop_path}` : '');
const posterUrl = computed(() => featuredMovie.value ? `https://image.tmdb.org/t/p/w500${featuredMovie.value.poster_path}` : ''); // إضافة رابط البوستر

// التعامل مع اختلاف الأسماء
const heroTitle = computed(() => featuredMovie.value?.title || featuredMovie.value?.name);

const handleGenreClick = (id) => movieStore.setSelectedGenre(id);

const switchType = (type) => {
  if (movieStore.contentType === type) return;
  movieStore.toggleContentType(type);
};
</script>

<template>
  <div class="pb-20 min-h-screen bg-[#141414]"> 
    
    <div v-if="featuredMovie && !movieStore.selectedGenre" class="relative min-h-[60vh] md:h-[80vh] w-full mb-8 animate-fade-in group">
      
      <div 
        class="absolute inset-0 bg-cover bg-[center_top] transition-all duration-1000"
        :style="`background-image: url('${backdropUrl}');`"
      >
        <div class="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/95 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/50 to-transparent opacity-90"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative container mx-auto px-6 h-full flex flex-col justify-end pb-12 pt-24 md:justify-center md:pb-0 z-10">
        
        <!-- Layout: Text centered on Mobile, left-aligned on Desktop -->
        <div class="flex flex-col items-center text-center md:items-start md:text-left">
          <div class="flex flex-col items-center md:items-start gap-2 mb-4 md:mb-0">
             <span class="inline-block w-fit bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded mb-2 uppercase tracking-wider backdrop-blur-md">
              Trending {{ movieStore.contentType === 'movie' ? 'Movies' : 'TV Series' }}
            </span>
            
            <h1 class="text-3xl md:text-7xl font-black text-white max-w-2xl leading-tight drop-shadow-2xl">
              {{ heroTitle }}
            </h1>
            
            <!-- Simple Rating/Date Line for Mobile -->
            <div class="flex items-center gap-2 text-xs text-gray-300 mt-2 md:hidden">
               <span class="text-yellow-400 font-bold">★ {{ featuredMovie.vote_average?.toFixed(1) }}</span>
               <span>•</span>
               <span>{{ featuredMovie.release_date?.split('-')[0] || featuredMovie.first_air_date?.split('-')[0] }}</span>
            </div>
          </div>

          <!-- Description (Full on Mobile) -->
          <p class="text-gray-300 text-sm md:text-lg mt-2 md:mt-3 max-w-xl md:line-clamp-3 drop-shadow-md leading-relaxed mx-auto md:mx-0">
            {{ featuredMovie.overview }}
          </p>
          
          <div class="flex gap-4 mt-6 w-full md:w-auto justify-center md:justify-start">
            <router-link :to="`/movie/${featuredMovie.id}`" class="w-full md:w-fit justify-center bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 shadow-xl shadow-red-900/50 hover:shadow-red-600/40 hover:-translate-y-0.5 border border-red-500/30 active:scale-95 text-base md:text-sm">
              <Icon icon="ph:info-bold" class="w-5 h-5 text-white" />
              See Details
            </router-link>
          </div>
        </div>

      </div>
    </div>
    
    <div v-else class="h-24"></div>

    <div class="container mx-auto px-4 mb-8 flex justify-center">
      <div class="relative bg-[#1c1c1e]/80 backdrop-blur-md p-1.5 rounded-full flex border border-white/5 shadow-2xl">
        <!-- Sliding Highlighter -->
        <div 
          class="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-red-600 to-rose-600 rounded-full transition-transform duration-300 ease-out shadow-lg shadow-red-900/40"
          :class="movieStore.contentType === 'movie' ? 'translate-x-0' : 'translate-x-full'"
        ></div>
        
        <button 
          @click="switchType('movie')"
          :class="movieStore.contentType === 'movie' ? 'text-white' : 'text-gray-400 hover:text-white'"
          class="relative z-10 px-8 py-2 rounded-full font-bold text-sm transition-colors duration-300 w-32"
        >
          Movies
        </button>
        <button 
          @click="switchType('tv')"
          :class="movieStore.contentType === 'tv' ? 'text-white' : 'text-gray-400 hover:text-white'"
          class="relative z-10 px-8 py-2 rounded-full font-bold text-sm transition-colors duration-300 w-32"
        >
          TV Series
        </button>
      </div>
    </div>

    <div class="relative container mx-auto px-4 mb-10 group">
      <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#141414] to-transparent z-10 pointer-events-none"></div>
      <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#141414] to-transparent z-10 pointer-events-none"></div>
      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-4 md:px-0">
        <button 
          v-for="genre in movieStore.genres" 
          :key="genre.id"
          @click="handleGenreClick(genre.id)"
          :class="movieStore.selectedGenre === genre.id ? 'bg-[#2a1315] text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'bg-[#1a1a1c] text-gray-400 border-white/5 hover:bg-[#242426] hover:text-gray-200'"
          class="whitespace-nowrap px-6 py-2 rounded-full border text-sm font-semibold transition-all duration-300 active:scale-95"
        >
          {{ genre.name }}
        </button>
      </div>
    </div>

    <div class="container mx-auto px-4">
      <div class="flex items-center gap-3 mb-6">
        <Icon v-if="!movieStore.selectedGenre" icon="ph:fire-fill" class="w-6 h-6 md:w-8 md:h-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        <Icon v-else icon="ph:funnel-fill" class="w-6 h-6 md:w-8 md:h-8 text-red-500" />
        <h2 class="text-xl md:text-3xl font-black text-white tracking-tight">
          {{ movieStore.selectedGenre ? 'Filtered Results' : (movieStore.contentType === 'movie' ? 'Popular Movies' : 'Top TV Series') }}
        </h2>
      </div>
      
      <div v-if="movieStore.loading && movieStore.movies.length === 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        <MovieSkeleton v-for="n in 10" :key="n" />
      </div>

      <TransitionGroup 
        name="list" 
        tag="div" 
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6"
        v-else
      >
        <router-link 
          v-for="movie in movieStore.movies" 
          :key="movie.id" 
          :to="`/movie/${movie.id}`"
          class="transition-all duration-300"
        >
          <MovieCard :movie="movie" />
        </router-link>
      </TransitionGroup>

      <div ref="loadTrigger" class="h-24 flex items-center justify-center mt-8">
        <div v-if="movieStore.loading" class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        <div v-else-if="!movieStore.hasMore" class="text-gray-600">End of results</div>
      </div>
    </div>

  </div>
</template>