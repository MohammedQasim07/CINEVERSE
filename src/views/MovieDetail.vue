<script setup>
import { onMounted, computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router'; 
import { useMovieStore } from '../stores/movieStore';
import { Icon } from '@iconify/vue';

const route = useRoute();
const store = useMovieStore();
const showTrailer = ref(false);

const fetchData = () => {
  store.fetchMovieById(route.params.id);
  window.scrollTo(0, 0);
  showTrailer.value = false;
};

onMounted(fetchData);
watch(() => route.params.id, fetchData);

const backdropUrl = computed(() => store.singleMovie?.backdrop_path ? `https://image.tmdb.org/t/p/original${store.singleMovie.backdrop_path}` : '');
const posterUrl = computed(() => store.singleMovie?.poster_path ? `https://image.tmdb.org/t/p/w500${store.singleMovie.poster_path}` : '');
const profileBaseUrl = 'https://image.tmdb.org/t/p/w185';

const displayTitle = computed(() => store.singleMovie?.title || store.singleMovie?.name || '');
const displayDate = computed(() => {
  const date = store.singleMovie?.release_date || store.singleMovie?.first_air_date;
  return date ? date.split('-')[0] : '';
});

const formattedRuntime = computed(() => {
  let m = store.singleMovie?.runtime;
  if (!m && store.singleMovie?.episode_run_time?.length > 0) m = store.singleMovie.episode_run_time[0];
  if(!m) return '';
  return `${Math.floor(m / 60)}h ${m % 60}m`;
});

const trailerKey = computed(() => {
  if (!store.singleMovie?.videos?.results) return null;
  const trailer = store.singleMovie.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  return trailer ? trailer.key : null;
});

const isFavorite = computed(() => store.singleMovie ? store.isMovieFavorite(store.singleMovie.id) : false);
const handleFavorite = () => store.toggleFavorite(store.singleMovie);
</script>

<template>
  <div v-if="store.loading" class="min-h-screen flex items-center justify-center bg-[#141414]">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
  </div>

  <div v-else-if="store.singleMovie" class="relative min-h-screen bg-[#141414] text-white font-['Outfit'] pb-10">
    
    <div class="absolute top-0 left-0 w-full h-[55vh] md:h-[85vh] overflow-hidden z-0">
      <div class="w-full h-full bg-cover bg-top" :style="backdropUrl ? `background-image: url('${backdropUrl}');` : 'background-color: #1f1f1f;'"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>
    </div>

    <div class="relative z-10 container mx-auto px-5 pt-[30vh] md:pt-[40vh]">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        
        <div class="hidden md:block flex-shrink-0 -mt-20">
          <img v-if="posterUrl" :src="posterUrl" class="w-72 rounded-xl shadow-2xl border-4 border-[#141414]" />
        </div>

        <div class="flex-1 w-full space-y-5">
          
          <div class="text-center md:text-left">
            <h1 class="text-4xl md:text-6xl font-black leading-tight drop-shadow-2xl mb-2">{{ displayTitle }}</h1>
            
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-medium text-gray-300">
               <div class="flex items-center gap-1 text-yellow-400 bg-gray-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span>★</span> <span>{{ store.singleMovie.vote_average?.toFixed(1) }}</span>
               </div>
               <span class="bg-gray-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">{{ displayDate }}</span>
               <span v-if="formattedRuntime" class="bg-gray-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">{{ formattedRuntime }}</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 py-2 w-full">
            
            <button 
              v-if="trailerKey"
              @click="showTrailer = true"
              class="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3.5 px-8 rounded-xl font-bold transition shadow-lg shadow-red-900/40 active:scale-95 cursor-pointer"
            >
               <Icon icon="ph:play-circle-fill" class="w-6 h-6 flex-shrink-0" />
               <span>Watch Trailer</span>
            </button>
            
            <button 
              @click="handleFavorite"
              :class="isFavorite ? 'bg-green-600 border-green-500 text-white' : 'bg-gray-800 border-gray-600 text-gray-200'"
              class="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-bold transition border active:scale-95 cursor-pointer hover:bg-opacity-80"
            >
               <Icon v-if="!isFavorite" icon="ph:plus-bold" class="w-5 h-5 flex-shrink-0" />
               <Icon v-else icon="ph:check-bold" class="w-5 h-5 flex-shrink-0" />
               <span>{{ isFavorite ? 'Added' : 'My List' }}</span>
            </button>
          </div>

          <div class="bg-gray-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
            <h3 class="text-lg font-bold text-white mb-2">Storyline</h3>
            <p class="text-gray-300 text-base leading-relaxed">{{ store.singleMovie.overview || 'No overview available.' }}</p>
          </div>
          
          <div v-if="store.singleMovie.credits?.cast?.length" class="pt-2">
            <h3 class="text-lg font-bold text-white mb-3">Top Cast</h3>
            <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              <div v-for="actor in store.singleMovie.credits.cast.slice(0, 10)" :key="actor.id" class="flex-shrink-0 w-20 text-center group">
                <div class="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-800 group-hover:border-red-500 transition">
                  <img v-if="actor.profile_path" :src="profileBaseUrl + actor.profile_path" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-gray-500">No Img</div>
                </div>
                <p class="text-xs font-bold text-white truncate">{{ actor.name }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div v-if="showTrailer" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-0 md:p-10 animate-fade-in">
      <div class="relative w-full md:max-w-5xl aspect-video bg-black md:rounded-xl overflow-hidden shadow-2xl border-none md:border border-gray-800 flex flex-col justify-center">
        
        <button 
          @click="showTrailer = false" 
          class="absolute top-4 right-4 text-white/90 hover:text-red-500 z-20 p-2 bg-black/60 rounded-full cursor-pointer backdrop-blur-md transition hover:scale-110"
        >
          <Icon icon="ph:x-bold" class="w-6 h-6" />
        </button>

        <iframe v-if="trailerKey" :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`" class="w-full h-full" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        <div v-else class="text-gray-500 text-center">No Trailer Found</div>
      </div>
    </div>

  </div>
</template>