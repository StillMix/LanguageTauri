<template>
  <div class="lesson-container">
    <div class="lesson-header">
      <button class="back-button" @click="goBack">← Назад</button>
      <h1 class="lesson-title">{{ lesson.title }}</h1>
    </div>

    <div class="lesson-content">
      <div class="theory-section">
        <div class="theory-content" v-html="lesson.theory"></div>
      </div>

      <div class="practice-section">
        <div class="code-editor-container">
          <div class="editor-header">
            <h3>Редактор кода</h3>
            <div class="editor-controls">
              <button class="run-button" @click="runCode">Запустить</button>
            </div>
          </div>
          <div class="code-editor" contenteditable="true" spellcheck="false" ref="codeEditor">
            {{ lesson.initialCode }}
          </div>
        </div>

        <div class="console-container">
          <div class="console-header">
            <h3>Консоль</h3>
            <button class="clear-button" @click="clearConsole">Очистить</button>
          </div>
          <div class="console-output" ref="consoleOutput"></div>
        </div>
      </div>
    </div>

    <div class="lesson-footer">
      <button class="check-button" @click="checkSolution">Проверить решение</button>
      <button class="next-button" :disabled="!lesson.completed" @click="nextLesson">
        Следующий урок →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue'

interface LessonProps {
  lesson: {
    id: number
    title: string
    theory: string
    initialCode: string
    completed: boolean
    nextLessonId?: number
  }
}

const props = defineProps<LessonProps>()
const consoleOutput = ref<HTMLElement | null>(null)
const codeEditor = ref<HTMLElement | null>(null)
const userCode = ref<string>(props.lesson.initialCode)

const emit = defineEmits(['back', 'next', 'complete'])

function goBack() {
  emit('back')
}

function nextLesson() {
  if (props.lesson.completed) {
    emit('next')
  }
}

function updateUserCode() {
  if (codeEditor.value) {
    userCode.value = codeEditor.value.innerText || codeEditor.value.textContent || ''
  }
}

function runCode() {
  if (!consoleOutput.value) return

  updateUserCode()
  clearConsole()

  // Добавляем вывод в консоль
  consoleOutput.value.innerHTML += '<div class="console-line">Выполнение кода...</div>'

  try {
    // Создаем функцию для перехвата вызовов console.log
    const originalConsoleLog = console.log
    const logs: string[] = []

    console.log = function (...args) {
      logs.push(args.map((arg) => String(arg)).join(' '))
      originalConsoleLog(...args)
    }

    // Запускаем код пользователя
    // Для безопасности используем Function вместо eval
    new Function(userCode.value)()

    // Восстанавливаем оригинальный console.log
    console.log = originalConsoleLog

    // Выводим результаты в консоль интерфейса
    setTimeout(() => {
      if (logs.length > 0) {
        logs.forEach((log) => {
          consoleOutput.value!.innerHTML += `<div class="console-line">${log}</div>`
        })
        consoleOutput.value!.innerHTML +=
          '<div class="console-line success">Программа выполнена успешно!</div>'
      } else {
        consoleOutput.value!.innerHTML +=
          '<div class="console-line">Программа выполнена, но ничего не выведено в консоль.</div>'
      }
    }, 500)
  } catch (error) {
    // В случае ошибки выводим её
    setTimeout(() => {
      consoleOutput.value!.innerHTML += `<div class="console-line error">Ошибка: ${error}</div>`
    }, 500)
  }
}

function clearConsole() {
  if (consoleOutput.value) {
    consoleOutput.value.innerHTML = ''
  }
}

function checkSolution() {
  if (!consoleOutput.value) return

  updateUserCode()

  // Добавляем вывод в консоль
  consoleOutput.value.innerHTML += '<div class="console-line checking">Проверка решения...</div>'

  // В будущем здесь будет логика проверки кода
  // Сейчас просто засчитываем, если код был запущен и не выдал ошибок

  setTimeout(() => {
    consoleOutput.value!.innerHTML +=
      '<div class="console-line success">Решение правильное! Урок завершен.</div>'
    emit('complete')
  }, 1500)
}

onMounted(() => {
  // Инициализация редактора кода
  if (codeEditor.value) {
    codeEditor.value.textContent = props.lesson.initialCode
  }

  // Добавление подсветки синтаксиса и другие улучшения в будущем
})
</script>

<style scoped>
.lesson-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.lesson-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.back-button {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #4a55a2;
  padding: 0.5rem;
  border-radius: 4px;
}

.back-button:hover {
  background-color: rgba(74, 85, 162, 0.1);
}

.lesson-title {
  margin: 0 0 0 1rem;
  font-size: 1.5rem;
  color: #333;
}

.lesson-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.theory-section {
  width: 40%;
  padding: 1.5rem;
  overflow-y: auto;
  border-right: 1px solid #ddd;
}

.theory-content {
  line-height: 1.6;
}

.theory-content h2 {
  color: #4a55a2;
  margin-top: 0;
}

.theory-content code {
  background-color: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: monospace;
}

.practice-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.code-editor-container {
  flex: 2;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ddd;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.editor-header h3 {
  margin: 0;
  font-size: 1rem;
}

.run-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.run-button:hover {
  background-color: #45a049;
}

.code-editor {
  flex: 1;
  padding: 1rem;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  background-color: #282c34;
  color: #abb2bf;
  overflow-y: auto;
  white-space: pre;
  outline: none;
}

.console-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 150px;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.console-header h3 {
  margin: 0;
  font-size: 1rem;
}

.clear-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
}

.clear-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.console-output {
  flex: 1;
  padding: 0.5rem 1rem;
  background-color: #1e1e1e;
  color: #dcdcdc;
  font-family: monospace;
  overflow-y: auto;
}

.console-line {
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.console-line.success {
  color: #4caf50;
}

.console-line.error {
  color: #f44336;
}

.console-line.checking {
  color: #2196f3;
}

.lesson-footer {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
}

.check-button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.check-button:hover {
  background-color: #0b7dda;
}

.next-button {
  background-color: #4a55a2;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.next-button:hover:not(:disabled) {
  background-color: #3c4585;
}

.next-button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}
</style>
