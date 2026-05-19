import { useState } from 'react';
import Icon from '@/components/ui/icon';
import LessonModal from '@/components/LessonModal';

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const lessonsData = [
  {
    id: 1, title: 'Приветствия и знакомство', level: 'A1', xp: 150, time: '15 мин', progress: 100, icon: '👋', locked: false,
    words: [
      { en: 'Hello', ru: 'Привет', example: 'Hello, how are you?' },
      { en: 'Name', ru: 'Имя', example: 'My name is Alex.' },
      { en: 'Nice', ru: 'Приятно', example: 'Nice to meet you!' },
      { en: 'Goodbye', ru: 'До свидания', example: 'Goodbye, see you later!' },
      { en: 'Please', ru: 'Пожалуйста', example: 'Please, help me.' },
    ]
  },
  {
    id: 2, title: 'Числа и счёт', level: 'A1', xp: 200, time: '20 мин', progress: 100, icon: '🔢', locked: false,
    words: [
      { en: 'One', ru: 'Один', example: 'One apple on the table.' },
      { en: 'Two', ru: 'Два', example: 'Two cats are sleeping.' },
      { en: 'Three', ru: 'Три', example: 'Three dogs in the park.' },
      { en: 'Ten', ru: 'Десять', example: 'I have ten fingers.' },
      { en: 'Hundred', ru: 'Сто', example: 'A hundred people came.' },
    ]
  },
  {
    id: 3, title: 'Цвета и формы', level: 'A1', xp: 180, time: '18 мин', progress: 75, icon: '🎨', locked: false,
    words: [
      { en: 'Red', ru: 'Красный', example: 'The apple is red.' },
      { en: 'Blue', ru: 'Синий', example: 'The sky is blue.' },
      { en: 'Green', ru: 'Зелёный', example: 'The grass is green.' },
      { en: 'Circle', ru: 'Круг', example: 'Draw a circle here.' },
      { en: 'Square', ru: 'Квадрат', example: 'The box is a square.' },
    ]
  },
  {
    id: 4, title: 'Еда и напитки', level: 'A1', xp: 220, time: '22 мин', progress: 30, icon: '🍕', locked: false,
    words: [
      { en: 'Water', ru: 'Вода', example: 'I drink water every day.' },
      { en: 'Bread', ru: 'Хлеб', example: 'She buys fresh bread.' },
      { en: 'Milk', ru: 'Молоко', example: 'He drinks milk in the morning.' },
      { en: 'Apple', ru: 'Яблоко', example: 'I eat an apple for breakfast.' },
      { en: 'Coffee', ru: 'Кофе', example: 'I love coffee with milk.' },
    ]
  },
  {
    id: 5, title: 'Семья и отношения', level: 'A2', xp: 280, time: '25 мин', progress: 0, icon: '👨‍👩‍👧', locked: false,
    words: [
      { en: 'Mother', ru: 'Мать', example: 'My mother is very kind.' },
      { en: 'Father', ru: 'Отец', example: 'My father works hard.' },
      { en: 'Brother', ru: 'Брат', example: 'I have one brother.' },
      { en: 'Sister', ru: 'Сестра', example: 'My sister likes music.' },
      { en: 'Family', ru: 'Семья', example: 'Family is everything.' },
    ]
  },
  {
    id: 6, title: 'Работа и профессии', level: 'A2', xp: 300, time: '30 мин', progress: 0, icon: '💼', locked: false,
    words: [
      { en: 'Doctor', ru: 'Врач', example: 'She is a great doctor.' },
      { en: 'Teacher', ru: 'Учитель', example: 'The teacher explains well.' },
      { en: 'Engineer', ru: 'Инженер', example: 'He works as an engineer.' },
      { en: 'Office', ru: 'Офис', example: 'I work in a big office.' },
      { en: 'Manager', ru: 'Менеджер', example: 'She is our new manager.' },
    ]
  },
  {
    id: 7, title: 'Путешествия', level: 'B1', xp: 400, time: '35 мин', progress: 0, icon: '✈️', locked: true,
    words: []
  },
  {
    id: 8, title: 'Бизнес английский', level: 'B1', xp: 450, time: '40 мин', progress: 0, icon: '📊', locked: true,
    words: []
  },
];

type LessonDataType = typeof lessonsData[0];

export default function LessonsPage() {
  const [activeLesson, setActiveLesson] = useState<LessonDataType | null>(null);
  const [progresses, setProgresses] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {};
    lessonsData.forEach(l => { init[l.id] = l.progress; });
    return init;
  });
  const [activeFilter, setActiveFilter] = useState<string>('Все уровни');

  const handleComplete = (lessonId: number, xp: number) => {
    setProgresses(p => ({ ...p, [lessonId]: 100 }));
  };

  const filtered = activeFilter === 'Все уровни'
    ? lessonsData
    : lessonsData.filter(l => l.level === activeFilter);

  const completed = Object.values(progresses).filter(p => p === 100).length;
  const totalProgress = Math.round((completed / lessonsData.length) * 100);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-orbitron text-3xl font-black text-white mb-2">
            УРОКИ <span className="neon-text-cyan">АНГЛИЙСКОГО</span>
          </h1>
          <p className="text-gray-500 font-ibm">Прокачай свой уровень через структурированные уроки</p>
        </div>

        {/* Level filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {['Все уровни', ...levels].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveFilter(lvl)}
              className={`px-4 py-2 rounded-lg text-sm font-orbitron transition-all ${
                activeFilter === lvl ? 'btn-solid-cyan' : 'btn-neon-cyan'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="game-card rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-orbitron text-sm text-white font-bold">Прогресс курса</span>
              <span className="text-gray-500 text-xs font-ibm ml-3">{completed} из {lessonsData.length} уроков завершены</span>
            </div>
            <span className="neon-text-cyan font-orbitron font-bold text-sm">{totalProgress}%</span>
          </div>
          <div className="progress-neon h-3">
            <div className="progress-neon-fill transition-all duration-700" style={{ width: `${totalProgress}%` }} />
          </div>
        </div>

        {/* Lessons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((lesson, i) => {
            const prog = progresses[lesson.id] ?? 0;
            return (
              <div
                key={lesson.id}
                className={`game-card rounded-2xl p-5 animate-fade-in relative overflow-hidden ${lesson.locked ? 'opacity-50' : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Level badge */}
                <div className="absolute top-4 right-4">
                  <span className={`text-xs font-orbitron font-bold px-2 py-0.5 rounded border ${
                    lesson.level === 'A1' || lesson.level === 'A2'
                      ? 'border-neon-green/40 text-neon-green bg-neon-green/10'
                      : lesson.level === 'B1' || lesson.level === 'B2'
                      ? 'border-neon-cyan/40 text-neon-cyan bg-neon-cyan/10'
                      : 'border-neon-purple/40 text-neon-purple bg-neon-purple/10'
                  }`}>{lesson.level}</span>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">{lesson.icon}</div>
                  <div className="flex-1 pr-8">
                    <h3 className="font-orbitron text-sm font-bold text-white mb-1">{lesson.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-ibm">
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={11} fallback="Circle" />
                        {lesson.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Zap" size={11} fallback="Circle" className="text-yellow-400" />
                        +{lesson.xp} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                {prog > 0 && prog < 100 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-ibm">Прогресс</span>
                      <span className="neon-text-cyan font-orbitron">{prog}%</span>
                    </div>
                    <div className="progress-neon h-2">
                      <div className="progress-neon-fill" style={{ width: `${prog}%` }} />
                    </div>
                  </div>
                )}

                <button
                  disabled={lesson.locked}
                  onClick={() => !lesson.locked && setActiveLesson(lesson)}
                  className={`w-full py-2.5 rounded-xl text-sm font-orbitron font-bold tracking-wide transition-all ${
                    lesson.locked
                      ? 'border border-gray-700 text-gray-600 cursor-not-allowed'
                      : prog === 100
                      ? 'border border-neon-green/40 text-neon-green bg-neon-green/10 hover:bg-neon-green/20 cursor-pointer'
                      : prog > 0
                      ? 'btn-solid-cyan cursor-pointer'
                      : 'btn-neon-cyan cursor-pointer'
                  }`}
                >
                  {lesson.locked ? (
                    <span className="flex items-center justify-center gap-2">
                      <Icon name="Lock" size={13} fallback="Circle" /> Заблокировано
                    </span>
                  ) : prog === 100 ? (
                    <span className="flex items-center justify-center gap-2">
                      <Icon name="CheckCircle" size={13} fallback="Circle" /> Пройти снова
                    </span>
                  ) : prog > 0 ? 'Продолжить' : 'Начать урок'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
