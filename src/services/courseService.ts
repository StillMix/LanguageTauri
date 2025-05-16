import { ref, reactive } from 'vue'

// Типы данных
export interface Lesson {
  id: number
  title: string
  description: string
  theory?: string
  initialCode?: string
  completed: boolean
  nextLessonId?: number
}

export interface Section {
  id: number
  title: string
  description: string
  lessons: Lesson[]
}

export interface UserProgress {
  completedLessons: number[]
  lastVisitedLesson: number | null
}

// Временная база данных разделов и уроков
const sectionsData: Section[] = [
  {
    id: 1,
    title: 'Основы программирования',
    description: 'Изучите основные понятия программирования и алгоритмического мышления.',
    lessons: [
      {
        id: 1,
        title: 'Что такое программирование?',
        description: 'Вводный урок о программировании и его роли в современном мире.',
        completed: false,
        nextLessonId: 2,
      },
      {
        id: 2,
        title: 'Переменные и типы данных',
        description: 'Изучите основные типы данных и работу с переменными.',
        completed: false,
        nextLessonId: 3,
      },
      {
        id: 3,
        title: 'Условные операторы',
        description: 'Изучите условные операторы и логику принятия решений в программировании.',
        completed: false,
      },
    ],
  },
  {
    id: 2,
    title: 'Основы HTML и CSS',
    description: 'Научитесь создавать простые веб-страницы с помощью HTML и CSS.',
    lessons: [
      {
        id: 4,
        title: 'Введение в HTML',
        description: 'Изучите основы HTML для создания структуры веб-страниц.',
        completed: false,
        nextLessonId: 5,
      },
      {
        id: 5,
        title: 'Стилизация с CSS',
        description: 'Научитесь оформлять веб-страницы с помощью CSS.',
        completed: false,
      },
    ],
  },
  {
    id: 3,
    title: 'JavaScript для начинающих',
    description: 'Изучите основы JavaScript для создания интерактивных веб-страниц.',
    lessons: [
      {
        id: 6,
        title: 'Введение в JavaScript',
        description: 'Познакомьтесь с основами JavaScript и его ролью в веб-разработке.',
        completed: false,
        nextLessonId: 7,
      },
      {
        id: 7,
        title: 'Переменные и операторы в JavaScript',
        description: 'Изучите переменные, типы данных и основные операторы в JavaScript.',
        completed: false,
      },
    ],
  },
]

// База данных содержимого уроков
const lessonsContentData: Record<number, { theory: string; initialCode: string }> = {
  1: {
    theory: `
      <h2>Что такое программирование?</h2>
      <p>Программирование — это процесс создания компьютерных программ с помощью языков программирования.</p>
      <p>Компьютеры не понимают человеческий язык напрямую. Они выполняют инструкции, которые написаны на специальных языках программирования.</p>
      <h3>Языки программирования</h3>
      <p>Языки программирования позволяют людям писать понятные для них инструкции, которые затем преобразуются в команды, понятные компьютеру.</p>
      <p>Существует множество языков программирования, например:</p>
      <ul>
        <li>Python — простой и популярный язык, отлично подходит для начинающих</li>
        <li>JavaScript — язык для создания интерактивных веб-страниц</li>
        <li>Java — используется для мобильных приложений и крупных систем</li>
        <li>C++ — мощный язык для создания системных программ и игр</li>
      </ul>
      <h3>Как работает программа</h3>
      <p>Программа — это последовательность инструкций для компьютера. Инструкции выполняются одна за другой, сверху вниз.</p>
      <p>Например, вот простая программа на JavaScript:</p>
      <pre><code>console.log("Привет, мир!");</code></pre>
      <p>Эта программа выводит текст "Привет, мир!" на экран.</p>
      <h3>Практическое задание</h3>
      <p>Попробуйте изменить текст в программе и запустите её, чтобы увидеть результат.</p>
    `,
    initialCode: 'console.log("Привет, мир!");',
  },
  2: {
    theory: `
      <h2>Переменные и типы данных</h2>
      <p>Переменные — это контейнеры для хранения данных в программе.</p>
      <p>С помощью переменных мы можем сохранять информацию и использовать её позже в программе.</p>
      <h3>Объявление переменных</h3>
      <p>В JavaScript переменные объявляются с помощью ключевых слов <code>let</code>, <code>const</code> или <code>var</code>:</p>
      <pre><code>let имя = "Анна";
const возраст = 15;
var школа = "Школа №42";</code></pre>
      <h3>Основные типы данных</h3>
      <ul>
        <li><strong>Строки (String)</strong> — текстовые данные, заключённые в кавычки: <code>"Привет"</code>, <code>'Мир'</code></li>
        <li><strong>Числа (Number)</strong> — целые числа или числа с плавающей точкой: <code>42</code>, <code>3.14</code></li>
        <li><strong>Логические значения (Boolean)</strong> — <code>true</code> (истина) или <code>false</code> (ложь)</li>
        <li><strong>Массивы (Array)</strong> — упорядоченные наборы данных: <code>[1, 2, 3]</code>, <code>["яблоко", "банан"]</code></li>
        <li><strong>Объекты (Object)</strong> — наборы пар "ключ-значение": <code>{имя: "Анна", возраст: 15}</code></li>
      </ul>
      <h3>Практическое задание</h3>
      <p>Создайте переменные для хранения информации о себе (имя, возраст, хобби) и выведите их в консоль.</p>
    `,
    initialCode: `// Создайте переменные и выведите их значения
const имя = "";
const возраст = 0;
const хобби = "";

// Выведите информацию в консоль
`,
  },
  3: {
    theory: `
      <h2>Условные операторы</h2>
      <p>Условные операторы позволяют выполнять разные части кода в зависимости от условий.</p>
      <p>Основной условный оператор — это <code>if</code> (если).</p>
      <h3>Оператор if</h3>
      <pre><code>if (условие) {
  // Код, который выполнится, если условие истинно
}</code></pre>
      <h3>Оператор if-else</h3>
      <pre><code>if (условие) {
  // Выполнится, если условие истинно
} else {
  // Выполнится, если условие ложно
}</code></pre>
      <h3>Оператор if-else if-else</h3>
      <pre><code>if (условие1) {
  // Выполнится, если условие1 истинно
} else if (условие2) {
  // Выполнится, если условие1 ложно, а условие2 истинно
} else {
  // Выполнится, если все условия ложны
}</code></pre>
      <h3>Операторы сравнения</h3>
      <ul>
        <li><code>==</code> — равно (с приведением типов)</li>
        <li><code>===</code> — строго равно (без приведения типов)</li>
        <li><code>!=</code> — не равно (с приведением типов)</li>
        <li><code>!==</code> — строго не равно (без приведения типов)</li>
        <li><code>></code> — больше</li>
        <li><code><</code> — меньше</li>
        <li><code>>=</code> — больше или равно</li>
        <li><code><=</code> — меньше или равно</li>
      </ul>
      <h3>Практическое задание</h3>
      <p>Напишите программу, которая проверяет, является ли возраст человека подходящим для получения водительских прав (18 лет и старше).</p>
    `,
    initialCode: `// Укажите возраст
const возраст = 16;

// Напишите условие, которое проверит, достаточно ли человеку лет
// для получения водительских прав, и выведет соответствующее сообщение

`,
  },
  4: {
    theory: `
      <h2>Введение в HTML</h2>
      <p>HTML (HyperText Markup Language) — это язык разметки, используемый для создания и структурирования содержимого веб-страниц.</p>
      <h3>Основные понятия</h3>
      <p>HTML использует <strong>теги</strong> для обозначения различных элементов страницы. Теги заключаются в угловые скобки:</p>
      <pre><code>&lt;тег&gt;Содержимое&lt;/тег&gt;</code></pre>
      <p>Большинство тегов имеют открывающую и закрывающую часть, но некоторые (например, &lt;img&gt;) являются самозакрывающимися.</p>
      <h3>Структура HTML-документа</h3>
      <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Заголовок страницы&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Привет, мир!&lt;/h1&gt;
    &lt;p&gt;Это абзац текста.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
      <h3>Основные теги HTML</h3>
      <ul>
        <li><code>&lt;h1&gt; - &lt;h6&gt;</code> — заголовки разных уровней</li>
        <li><code>&lt;p&gt;</code> — абзац текста</li>
        <li><code>&lt;a&gt;</code> — ссылка</li>
        <li><code>&lt;img&gt;</code> — изображение</li>
        <li><code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, <code>&lt;li&gt;</code> — списки</li>
        <li><code>&lt;div&gt;</code> — блочный контейнер</li>
        <li><code>&lt;span&gt;</code> — строчный контейнер</li>
      </ul>
      <h3>Практическое задание</h3>
      <p>Создайте простую HTML-страницу с заголовком, абзацем текста и списком.</p>
    `,
    initialCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Моя первая страница</title>
  </head>
  <body>
    <!-- Добавьте сюда свой код -->
    
  </body>
</html>`,
  },
}

// Состояние пользователя
const userProgress = reactive<UserProgress>({
  completedLessons: [],
  lastVisitedLesson: null,
})

// Реактивные переменные для хранения данных
const sections = ref<Section[]>(sectionsData)

// Методы для работы с данными
export function getAllSections(): Section[] {
  return sections.value
}

export function getSection(sectionId: number): Section | undefined {
  return sections.value.find((section) => section.id === sectionId)
}

export function getLessonById(lessonId: number): Lesson | null {
  for (const section of sections.value) {
    const lesson = section.lessons.find((l) => l.id === lessonId)
    if (lesson) {
      return lesson
    }
  }
  return null
}

export function getLessonContent(lessonId: number): { theory: string; initialCode: string } | null {
  return lessonsContentData[lessonId] || null
}

export function markLessonAsCompleted(lessonId: number): void {
  // Находим урок и отмечаем его как завершенный
  const lesson = getLessonById(lessonId)
  if (lesson) {
    lesson.completed = true

    // Добавляем в прогресс пользователя, если его там еще нет
    if (!userProgress.completedLessons.includes(lessonId)) {
      userProgress.completedLessons.push(lessonId)
    }

    // Сохраняем в локальное хранилище (в будущем будет подключаться к Rust бэкенду)
    saveUserProgress()
  }
}

export function getNextLesson(currentLessonId: number): Lesson | null {
  const currentLesson = getLessonById(currentLessonId)
  if (currentLesson && currentLesson.nextLessonId) {
    return getLessonById(currentLesson.nextLessonId)
  }
  return null
}

// Функции для работы с прогрессом пользователя
export function isLessonCompleted(lessonId: number): boolean {
  return userProgress.completedLessons.includes(lessonId)
}

export function getCompletedLessonsCount(): number {
  return userProgress.completedLessons.length
}

export function getTotalLessonsCount(): number {
  return sections.value.reduce((total, section) => total + section.lessons.length, 0)
}

export function getUserProgress(): UserProgress {
  return userProgress
}

// Сохранение и загрузка данных пользователя (в локальное хранилище)
function saveUserProgress(): void {
  localStorage.setItem('userProgress', JSON.stringify(userProgress))
}

export function loadUserProgress(): void {
  const savedProgress = localStorage.getItem('userProgress')
  if (savedProgress) {
    const parsed = JSON.parse(savedProgress)
    userProgress.completedLessons = parsed.completedLessons || []
    userProgress.lastVisitedLesson = parsed.lastVisitedLesson || null

    // Обновляем статус завершения для уроков
    userProgress.completedLessons.forEach((lessonId) => {
      const lesson = getLessonById(lessonId)
      if (lesson) {
        lesson.completed = true
      }
    })
  }
}

// Инициализация - загружаем сохраненный прогресс, если он есть
loadUserProgress()
