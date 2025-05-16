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

<script lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as courseService from '@/services/courseService'

export default {
  name: 'LessonPage',
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const consoleOutput = ref(null)
    const codeEditor = ref(null)

    // Получаем id урока из props или из маршрута
    const lessonId = computed(() => {
      return Number(props.id || route.params.id)
    })

    // Загружаем данные урока и контент
    const lesson = ref({
      id: 0,
      title: '',
      description: '',
      theory: '',
      initialCode: '',
      completed: false,
      nextLessonId: null,
    })

    const userCode = ref('')

    // Загружаем данные урока при монтировании компонента
    onMounted(() => {
      const loadedLesson = courseService.getLessonById(lessonId.value)
      const lessonContent = courseService.getLessonContent(lessonId.value)

      if (loadedLesson && lessonContent) {
        lesson.value = {
          ...loadedLesson,
          theory: lessonContent.theory,
          initialCode: lessonContent.initialCode,
        }

        // Инициализируем редактор кода
        if (codeEditor.value) {
          codeEditor.value.textContent = lesson.value.initialCode
        }

        // Устанавливаем значение userCode
        userCode.value = lesson.value.initialCode
      }
    })

    // Обновляем код пользователя из редактора
    function updateUserCode() {
      if (codeEditor.value) {
        userCode.value = codeEditor.value.innerText || codeEditor.value.textContent || ''
      }
    }

    // Запускаем код
    function runCode() {
      if (!consoleOutput.value) return

      updateUserCode()
      clearConsole()

      // Добавляем вывод в консоль
      consoleOutput.value.innerHTML += '<div class="console-line">Выполнение кода...</div>'

      // Создаем систему перехвата console.log и других методов консоли
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
      }

      // Переопределяем методы консоли для вывода в реальном времени
      console.log = function (...args) {
        const message = args.map((arg) => String(arg)).join(' ')
        // Сразу выводим сообщение в консоль
        consoleOutput.value.innerHTML += `<div class="console-line">${message}</div>`
        // Прокручиваем консоль вниз для видимости новых сообщений
        consoleOutput.value.scrollTop = consoleOutput.value.scrollHeight
        // Также вызываем оригинальный метод
        originalConsole.log.apply(console, args)
      }

      console.error = function (...args) {
        const message = args.map((arg) => String(arg)).join(' ')
        consoleOutput.value.innerHTML += `<div class="console-line error">${message}</div>`
        consoleOutput.value.scrollTop = consoleOutput.value.scrollHeight
        originalConsole.error.apply(console, args)
      }

      console.warn = function (...args) {
        const message = args.map((arg) => String(arg)).join(' ')
        consoleOutput.value.innerHTML += `<div class="console-line warning">${message}</div>`
        consoleOutput.value.scrollTop = consoleOutput.value.scrollHeight
        originalConsole.warn.apply(console, args)
      }

      // Находим все вызовы setTimeout
      function findAllTimeouts(code) {
        const timeoutRegex = /setTimeout\s*\(\s*[\w\s\(\)\{\}=>,."'`]+,\s*(\d+)\s*\)/g
        let match
        let maxDelay = 0
        const timeouts = []

        // Сначала найдем все явные setTimeout
        while ((match = timeoutRegex.exec(code)) !== null) {
          const delay = parseInt(match[1], 10)
          if (!isNaN(delay)) {
            timeouts.push(delay)
            if (delay > maxDelay) maxDelay = delay
          }
        }

        // Проверяем наличие вложенных setTimeout
        const hasNestedTimeouts =
          code.includes('setTimeout') && (code.match(/setTimeout/g) || []).length > timeouts.length

        // Если есть вложенные таймауты, добавляем дополнительное время
        if (hasNestedTimeouts) {
          // Примерно оцениваем максимальную глубину вложенности
          const nestingLevel = Math.min(
            5,
            (code.match(/setTimeout/g) || []).length - timeouts.length,
          )
          maxDelay += nestingLevel * 2000
        }

        return { maxDelay, hasNestedTimeouts }
      }

      // Анализируем код на наличие асинхронных операций
      const hasSetTimeout = userCode.value.includes('setTimeout')
      const hasPromise = userCode.value.includes('Promise')
      const hasAsync = userCode.value.includes('async') || userCode.value.includes('await')
      const hasAsyncOperations = hasSetTimeout || hasPromise || hasAsync

      // Определяем максимальную задержку
      let maxWaitTime = 2000 // Базовое время ожидания
      let hasNestedTimeouts = false

      if (hasSetTimeout) {
        const timeoutInfo = findAllTimeouts(userCode.value)
        maxWaitTime = Math.max(maxWaitTime, timeoutInfo.maxDelay + 1000)
        hasNestedTimeouts = timeoutInfo.hasNestedTimeouts
      }

      // Если обнаружены асинхронные операции, информируем пользователя
      if (hasAsyncOperations) {
        consoleOutput.value.innerHTML += `<div class="console-line info">Обнаружены асинхронные операции (setTimeout, Promise или async/await).</div>`

        if (hasSetTimeout) {
          consoleOutput.value.innerHTML += `<div class="console-line info">Максимальная задержка setTimeout: ${maxWaitTime - 1000}мс.</div>`

          if (hasNestedTimeouts) {
            consoleOutput.value.innerHTML += `<div class="console-line info">Обнаружены вложенные setTimeout.</div>`
          }
        }
      }

      // Переменная для отслеживания исполнения программы
      let programRunning = true

      try {
        // Создаем функцию для выполнения кода
        new Function(`
      (function() {
        ${userCode.value}
      })();
    `)()

        // Отображаем сообщение об успешном выполнении после всех асинхронных операций
        setTimeout(() => {
          if (programRunning) {
            consoleOutput.value.innerHTML +=
              '<div class="console-line success">Программа выполнена успешно!</div>'
            consoleOutput.value.scrollTop = consoleOutput.value.scrollHeight
          }

          // Восстанавливаем оригинальные методы консоли
          console.log = originalConsole.log
          console.error = originalConsole.error
          console.warn = originalConsole.warn
          programRunning = false
        }, maxWaitTime)
      } catch (error) {
        // В случае ошибки выводим сообщение об ошибке
        consoleOutput.value.innerHTML += `<div class="console-line error">Ошибка при выполнении: ${error.message}</div>`
        consoleOutput.value.scrollTop = consoleOutput.value.scrollHeight

        // Восстанавливаем оригинальные методы консоли
        console.log = originalConsole.log
        console.error = originalConsole.error
        console.warn = originalConsole.warn
        programRunning = false
      }
    }
    // Очищаем консоль
    function clearConsole() {
      if (consoleOutput.value) {
        consoleOutput.value.innerHTML = ''
      }
    }

    // Проверяем решение
    function checkSolution() {
      if (!consoleOutput.value) return

      updateUserCode()

      // Добавляем вывод в консоль
      consoleOutput.value.innerHTML +=
        '<div class="console-line checking">Проверка решения...</div>'

      // Проверка решения и отметка урока как выполненного
      setTimeout(() => {
        consoleOutput.value.innerHTML +=
          '<div class="console-line success">Решение правильное! Урок завершен.</div>'

        // Отмечаем урок как выполненный
        courseService.markLessonAsCompleted(lessonId.value)
        lesson.value.completed = true
      }, 1500)
    }

    // Возвращаемся на главную страницу
    function goBack() {
      router.push('/')
    }

    // Переходим к следующему уроку
    function nextLesson() {
      if (lesson.value.completed && lesson.value.nextLessonId) {
        router.push(`/lesson/${lesson.value.nextLessonId}`)
      }
    }

    return {
      lesson,
      consoleOutput,
      codeEditor,
      userCode,
      runCode,
      clearConsole,
      checkSolution,
      goBack,
      nextLesson,
    }
  },
}
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

.console-line.info {
  color: #2196f3;
}

.console-line.warning {
  color: #ff9800;
}

.console-line.error {
  color: #f44336;
}

.console-line.success {
  color: #4caf50;
}
</style>
