import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MovieDetail from '../views/MovieDetail.vue';
import FavoritesView from '../views/FavoritesView.vue'; // 1. Import

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/movie/:id', name: 'movie-detail', component: MovieDetail },
    { path: '/favorites', name: 'favorites', component: FavoritesView } // 2. Add Route
  ],
  // 3. Scroll to top on navigation (UX improvement)
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;