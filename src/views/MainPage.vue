<template>
  <div class="main-container">
    <header class="header">
      <h1 class="logo">КодУчебник</h1>
      <div class="user-profile">
        <span class="user-name">Ученик</span>
      </div>
    </header>

    <div class="content">
      <aside class="sidebar">
        <nav class="nav-menu">
          <h2 class="menu-title">Разделы</h2>
          <ul class="menu-list">
            <li
              class="menu-item"
              v-for="section in sections"
              :key="section.id"
              @click="selectSection(section)"
              :class="{ active: selectedSection && selectedSection.id === section.id }"
            >
              {{ section.title }}
            </li>
          </ul>
        </nav>
      </aside>

      <main class="lesson-area">
        <ProgressDashboard
          v-if="!selectedSection"
          :completedCount="completedLessonsCount"
          :totalCount="totalLessonsCount"
        />

        <div v-if="selectedSection" class="section-content">
          <h2 class="section-title">{{ selectedSection.title }}</h2>
          <p class="section-description">{{ selectedSection.description }}</p>

          <div class="lessons-list">
            <h3 class="lessons-title">Уроки</h3>
            <div
              class="lesson-card"
              v-for="lesson in selectedSection.lessons"
              :key="lesson.id"
              @click="openLesson(lesson)"
              :class="{ 'completed-lesson': lesson.completed }"
            >
              <div class="lesson-info">
                <h4 class="lesson-title">{{ lesson.title }}</h4>
                <p class="lesson-description">{{ lesson.description }}</p>
              </div>
              <div class="lesson-status" :class="{ completed: lesson.completed }">
                {{ lesson.completed ? 'Выполнено' : 'Не выполнено' }}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="!selectedSection" class="welcome-screen">
          <h2>Добро пожаловать в КодУчебник!</h2>
          <p>Выберите раздел, чтобы начать обучение программированию.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as courseService from '@/services/courseService'
import type { Section, Lesson } from '@/services/courseService'
import ProgressDashboard from '@/components/ProgressDashboard.vue'

const router = useRouter()

// Получаем разделы из сервиса
const sections = ref<Section[]>([])
const selectedSection = ref<Section | null>(null)

// Вычисляем прогресс
const completedLessonsCount = computed(() => courseService.getCompletedLessonsCount())
const totalLessonsCount = computed(() => courseService.getTotalLessonsCount())

onMounted(() => {
  // Загружаем все разделы при монтировании компонента
  sections.value = courseService.getAllSections()
})

function selectSection(section: Section) {
  selectedSection.value = section
}

function openLesson(lesson: Lesson) {
  router.push(`/lesson/${lesson.id}`)
}
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Roboto', Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #4a55a2;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-name {
  margin-left: 0.5rem;
}

.content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.nav-menu {
  padding: 1rem;
}

.menu-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  padding: 0.8rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #e0e0e0;
}

.menu-item.active {
  background-color: #4a55a2;
  color: white;
}

.lesson-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.section-title {
  margin-top: 0;
  color: #4a55a2;
}

.section-description {
  color: #555;
  margin-bottom: 2rem;
}

.lessons-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lesson-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.lesson-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.lesson-card.completed-lesson {
  border-left: 4px solid #4caf50;
}

.lesson-info {
  flex: 1;
}

.lesson-title {
  margin: 0 0 0.5rem;
  color: #333;
}

.lesson-description {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.lesson-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: #f1f1f1;
  color: #666;
  font-size: 0.8rem;
}

.lesson-status.completed {
  background-color: #4caf50;
  color: white;
}

.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  color: #555;
}

.welcome-screen h2 {
  color: #4a55a2;
  margin-bottom: 1rem;
}
</style>
<template>
  <div class="main-container">
    <header class="header">
      <h1 class="logo">КодУчебник</h1>
      <div class="user-profile">
        <span class="user-name">Ученик</span>
      </div>
    </header>

    <div class="content">
      <aside class="sidebar">
        <nav class="nav-menu">
          <h2 class="menu-title">Разделы</h2>
          <ul class="menu-list">
            <li
              class="menu-item"
              v-for="(section, index) in sections"
              :key="index"
              @click="selectSection(section)"
            >
              {{ section.title }}
            </li>
          </ul>
        </nav>
      </aside>

      <main class="lesson-area">
        <div v-if="selectedSection" class="section-content">
          <h2 class="section-title">{{ selectedSection.title }}</h2>
          <p class="section-description">{{ selectedSection.description }}</p>

          <div class="lessons-list">
            <h3 class="lessons-title">Уроки</h3>
            <div
              class="lesson-card"
              v-for="(lesson, index) in selectedSection.lessons"
              :key="index"
              @click="openLesson(lesson)"
            >
              <div class="lesson-info">
                <h4 class="lesson-title">{{ lesson.title }}</h4>
                <p class="lesson-description">{{ lesson.description }}</p>
              </div>
              <div class="lesson-status" :class="{ completed: lesson.completed }">
                {{ lesson.completed ? 'Выполнено' : 'Не выполнено' }}
              </div>
            </div>
          </div>
        </div>

        <div v-else class="welcome-screen">
          <h2>Добро пожаловать в КодУчебник!</h2>
          <p>Выберите раздел, чтобы начать обучение программированию.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as courseService from '@/services/courseService'
import type { Section, Lesson } from '@/services/courseService'

const router = useRouter()

// Получаем разделы из сервиса
const sections = ref<Section[]>([])
const selectedSection = ref<Section | null>(null)

onMounted(() => {
  // Загружаем все разделы при монтировании компонента
  sections.value = courseService.getAllSections()


})


const selectedSection = ref<Section | null>(null)
const selectedLesson = ref<Lesson | null>(null)

function selectSection(section: Section) {
  selectedSection.value = section
  selectedLesson.value = null
}

function openLesson(lesson: Lesson) {
  router.push(`/lesson/${lesson.id}`)
}
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Roboto', Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #4a55a2;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-name {
  margin-left: 0.5rem;
}

.content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.nav-menu {
  padding: 1rem;
}

.menu-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  padding: 0.8rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #e0e0e0;
}

.lesson-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.section-title {
  margin-top: 0;
  color: #4a55a2;
}

.section-description {
  color: #555;
  margin-bottom: 2rem;
}

.lessons-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lesson-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.lesson-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.lesson-info {
  flex: 1;
}

.lesson-title {
  margin: 0 0 0.5rem;
  color: #333;
}

.lesson-description {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.lesson-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: #f1f1f1;
  color: #666;
  font-size: 0.8rem;
}

.lesson-status.completed {
  background-color: #4caf50;
  color: white;
}

.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  color: #555;
}

.welcome-screen h2 {
  color: #4a55a2;
  margin-bottom: 1rem;
}
</style>
