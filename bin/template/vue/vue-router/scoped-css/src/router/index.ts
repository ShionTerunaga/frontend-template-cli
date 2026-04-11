import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import HarryPotterView from '../views/harry-potter-character/harry-potter-characters.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/harry-potter',
      name: 'harry-potter',
      component: HarryPotterView,
    },
  ],
})

export default router
