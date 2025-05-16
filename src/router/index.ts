import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import LessonPage from '../views/LessonPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage,
    },
    {
      path: '/lesson/:id',
      name: 'LessonPage',
      component: LessonPage,
      props: true,
    },
  ],
})

export default router
