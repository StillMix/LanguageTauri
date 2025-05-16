<template>
  <div class="progress-container">
    <div class="progress-header">
      <h2 class="progress-title">Ваш прогресс</h2>
      <div class="progress-stats">
        <span class="stats-completed">{{ completedCount }}</span> из
        <span class="stats-total">{{ totalCount }}</span> уроков завершено
      </div>
    </div>

    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: progressPercentage + '%' }"
        :class="{ completed: progressPercentage === 100 }"
      ></div>
    </div>

    <div v-if="lastLesson" class="last-lesson">
      <div class="last-lesson-header">Продолжить обучение</div>
      <div class="last-lesson-card" @click="openLesson(lastLesson.id)">
        <div class="lesson-info">
          <div class="lesson-title">{{ lastLesson.title }}</div>
          <div class="lesson-section">{{ getSectionByLessonId(lastLesson.id)?.title }}</div>
        </div>
        <div class="lesson-continue-btn">Продолжить →</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import * as courseService from '@/services/courseService'
import type { Section } from '@/services/courseService'

const props = defineProps<{
  completedCount: number
  totalCount: number
}>()

const router = useRouter()

// Вычисляем процент прогресса
const progressPercentage = computed(() => {
  if (props.totalCount === 0) return 0
  return Math.min(Math.round((props.completedCount / props.totalCount) * 100), 100)
})

// Находим последний посещенный урок
const lastLesson = computed(() => {
  const userProgress = courseService.getUserProgress()
  if (userProgress.lastVisitedLesson) {
    return courseService.getLessonById(userProgress.lastVisitedLesson)
  }

  // Если нет последнего урока, предлагаем первый незавершенный
  const allSections = courseService.getAllSections()
  for (const section of allSections) {
    for (const lesson of section.lessons) {
      if (!lesson.completed) {
        return lesson
      }
    }
  }

  // Если все уроки завершены, возвращаем null
  return null
})

// Функция для определения раздела урока
function getSectionByLessonId(lessonId: number): Section | undefined {
  const allSections = courseService.getAllSections()
  return allSections.find((section) => section.lessons.some((lesson) => lesson.id === lessonId))
}

// Функция для перехода к уроку
function openLesson(lessonId: number) {
  router.push(`/lesson/${lessonId}`)
}
</script>

<style scoped>
.progress-container {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-title {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.progress-stats {
  font-size: 0.9rem;
  color: #666;
}

.stats-completed {
  font-weight: bold;
  color: #4caf50;
}

.stats-total {
  font-weight: bold;
}

.progress-bar {
  height: 12px;
  background-color: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.progress-fill.completed {
  background-color: #4a55a2;
}

.last-lesson {
  margin-top: 1rem;
}

.last-lesson-header {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.last-lesson-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.last-lesson-card:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.lesson-info {
  flex: 1;
}

.lesson-title {
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.lesson-section {
  font-size: 0.8rem;
  color: #666;
}

.lesson-continue-btn {
  background-color: #4a55a2;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: background-color 0.2s;
}

.last-lesson-card:hover .lesson-continue-btn {
  background-color: #3c4585;
}
</style>
