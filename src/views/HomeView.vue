<script setup>
import { onMounted, computed, ref, onUnmounted } from 'vue';
import { useMovieStore } from '../stores/movieStore';
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
        <div class="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent opacity-80"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative container mx-auto px-6 h-full flex flex-col justify-end pb-20 md:justify-center md:pb-0 z-10">
        
        <!-- Mobile Layout: Poster + Info Side-by-Side -->
        <div class="flex flex-col md:block">
          <div class="flex flex-row md:flex-col items-end md:items-start gap-4 mb-4 md:mb-0">
            <!-- Poster (Mobile Only) -->
            <div class="w-1/3 md:hidden rounded-lg overflow-hidden shadow-2xl border border-white/10 shrink-0">
               <img :src="posterUrl" class="w-full h-auto object-cover" alt="Poster">
            </div>

            <div class="flex-1">
               <span class="inline-block w-fit bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded mb-2 uppercase tracking-wider backdrop-blur-md">
                Trending {{ movieStore.contentType === 'movie' ? 'Movies' : 'TV Series' }}
              </span>
              
              <h1 class="text-2xl md:text-7xl font-black text-white max-w-2xl leading-tight drop-shadow-2xl text-left">
                {{ heroTitle }}
              </h1>
              
              <!-- Simple Rating/Date Line for Mobile -->
              <div class="flex items-center gap-2 text-xs text-gray-300 mt-2 md:hidden">
                 <span class="text-yellow-400 font-bold">★ {{ featuredMovie.vote_average?.toFixed(1) }}</span>
                 <span>•</span>
                 <span>{{ featuredMovie.release_date?.split('-')[0] || featuredMovie.first_air_date?.split('-')[0] }}</span>
              </div>
            </div>
          </div>

          <!-- Description (Full on Mobile) -->
          <p class="text-gray-300 text-xs md:text-lg mt-2 md:mt-3 max-w-xl md:line-clamp-3 drop-shadow-md text-left leading-relaxed">
            {{ featuredMovie.overview }}
          </p>
          
          <div class="flex gap-4 mt-6 justify-start">
            <router-link :to="`/movie/${featuredMovie.id}`" class="w-fit justify-center bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-full font-bold transition flex items-center gap-2 shadow-lg shadow-red-900/40 active:scale-95 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
              </svg>
              See Details
            </router-link>
          </div>
        </div>

      </div>
    </div>
    
    <div v-else class="h-24"></div>

    <div class="container mx-auto px-4 mb-6 flex justify-center">
      <div class="bg-gray-900 p-1 rounded-full flex border border-gray-700 shadow-xl">
        <button 
          @click="switchType('movie')"
          :class="movieStore.contentType === 'movie' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'"
          class="px-6 py-2 rounded-full font-bold text-sm transition-all duration-300"
        >
          Movies
        </button>
        <button 
          @click="switchType('tv')"
          :class="movieStore.contentType === 'tv' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'"
          class="px-6 py-2 rounded-full font-bold text-sm transition-all duration-300"
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
          :class="movieStore.selectedGenre === genre.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/50 border-red-600' : 'bg-[#1f1f1f]/60 text-gray-400 border-white/5 hover:bg-[#2a2a2a] hover:text-white hover:border-white/20'"
          class="whitespace-nowrap px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-300 backdrop-blur-sm shadow-sm active:scale-95"
        >
          {{ genre.name }}
        </button>
      </div>
    </div>

    <div class="container mx-auto px-4">
      <h2 class="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-red-600 pl-4 flex items-center">
        {{ movieStore.selectedGenre ? 'Filtered Results' : (movieStore.contentType === 'movie' ? 'Popular Movies' : 'Top TV Series') }}
      </h2>
      
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