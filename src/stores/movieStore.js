import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = '188c9fc4d2befa1693f3cd6b69f00fad'; 

export const useMovieStore = defineStore('movieStore', {
  state: () => ({
    movies: [],
    genres: [],
    selectedGenre: null,
    singleMovie: null,
    favorites: JSON.parse(localStorage.getItem('cineverse_favorites')) || [],
    // متغير جديد: يحدد هل نحن في وضع الأفلام أم المسلسلات
    // نحفظه في الذاكرة لكي لا يعود للأفلام عند تحديث الصفحة
    contentType: localStorage.getItem('cineverse_content_type') || 'movie', 
    loading: false,
    error: null,
    currentPage: 1,
    hasMore: true,
  }),

  actions: {
    // دالة للتبديل بين الأفلام والمسلسلات
    toggleContentType(type) {
      this.contentType = type;
      localStorage.setItem('cineverse_content_type', type); // حفظ الاختيار
      this.selectedGenre = null; // تصفير التصنيف
      this.movies = []; // تفريغ القائمة القديمة
      this.currentPage = 1;
      // إعادة تحميل البيانات الجديدة
      this.fetchGenres();
      this.fetchPopularMovies();
    },

    async fetchGenres() {
      try {
        // لاحظ: نستخدم contentType هنا لجلب تصنيفات المسلسلات أو الأفلام
        const response = await axios.get(`${API_URL}/genre/${this.contentType}/list`, {
          params: { api_key: API_KEY }
        });
        this.genres = [{ id: null, name: 'All' }, ...response.data.genres];
      } catch (err) {
        console.error('Failed to load genres');
      }
    },

    async fetchPopularMovies(loadMore = false) {
      if (!loadMore) {
        this.currentPage = 1;
        this.movies = [];
        this.hasMore = true;
      }

      if (!this.hasMore || (loadMore && this.loading)) return;

      this.loading = true;
      this.error = null;

      try {
        // Endpoint ديناميكي
        const endpoint = this.selectedGenre 
          ? `${API_URL}/discover/${this.contentType}` 
          : `${API_URL}/${this.contentType}/popular`;
        
        const response = await axios.get(endpoint, {
          params: { 
            api_key: API_KEY, 
            page: this.currentPage,
            with_genres: this.selectedGenre,
            sort_by: 'popularity.desc'
          }
        });

        const newMovies = response.data.results;

        if (newMovies.length === 0) {
          this.hasMore = false;
        } else {
          if (loadMore) this.movies.push(...newMovies);
          else this.movies = newMovies;
          this.currentPage++;
        }

      } catch (err) {
        this.error = 'Failed to load content.';
      } finally {
        this.loading = false;
      }
    },

    async searchMovies(query) {
      if (!query) {
        this.selectedGenre = null;
        this.fetchPopularMovies();
        return;
      }
      this.loading = true;
      this.hasMore = false;
      try {
        // البحث أيضاً ديناميكي
        const response = await axios.get(`${API_URL}/search/${this.contentType}`, {
          params: { api_key: API_KEY, query: query }
        });
        this.movies = response.data.results;
      } catch (err) {
        this.error = 'Search failed.';
      } finally {
        this.loading = false;
      }
    },

    async fetchMovieById(id) {
      this.loading = true;
      this.singleMovie = null;
      try {
        // جلب التفاصيل ديناميكي
        const response = await axios.get(`${API_URL}/${this.contentType}/${id}`, {
          params: { api_key: API_KEY, append_to_response: 'credits,videos' }
        });
        this.singleMovie = response.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    // ... باقي الدوال (Favorites, SetGenre) كما هي تماماً ...
    setSelectedGenre(id) {
      this.selectedGenre = id;
      this.fetchPopularMovies(false);
    },
    toggleFavorite(movie) {
      const index = this.favorites.findIndex(m => Number(m.id) === Number(movie.id));
      if (index === -1) this.favorites.push({ ...movie, media_type: this.contentType }); // نحفظ النوع أيضاً
      else this.favorites.splice(index, 1);
      localStorage.setItem('cineverse_favorites', JSON.stringify(this.favorites));
    },
  },

  getters: {
    isMovieFavorite: (state) => (movieId) => {
      if (!movieId) return false;
      return state.favorites.some(m => Number(m.id) === Number(movieId));
    }
  }
});