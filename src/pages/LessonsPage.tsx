import Icon from '@/components/ui/icon';

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const lessons = [
  { id: 1, title: 'Приветствия и знакомство', level: 'A1', xp: 150, time: '15 мин', progress: 100, icon: '👋', locked: false },
  { id: 2, title: 'Числа и счёт', level: 'A1', xp: 200, time: '20 мин', progress: 100, icon: '🔢', locked: false },
  { id: 3, title: 'Цвета и формы', level: 'A1', xp: 180, time: '18 мин', progress: 75, icon: '🎨', locked: false },
  { id: 4, title: 'Еда и напитки', level: 'A1', xp: 220, time: '22 мин', progress: 30, icon: '🍕', locked: false },
  { id: 5, title: 'Семья и отношения', level: 'A2', xp: 280, time: '25 мин', progress: 0, icon: '👨‍👩‍👧', locked: false },
  { id: 6, title: 'Работа и профессии', level: 'A2', xp: 300, time: '30 мин', progress: 0, icon: '💼', locked: false },
  { id: 7, title: 'Путешествия', level: 'B1', xp: 400, time: '35 мин', progress: 0, icon: '✈️', locked: true },
  { id: 8, title: 'Бизнес английский', level: 'B1', xp: 450, time: '40 мин', progress: 0, icon: '📊', locked: true },
];

export default function LessonsPage() {
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
          <button className="btn-solid-cyan px-4 py-2 rounded-lg text-sm font-bold">Все уровни</button>
          {levels.map((lvl) => (
            <button key={lvl} className="btn-neon-cyan px-4 py-2 rounded-lg text-sm">
              {lvl}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="game-card rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-orbitron text-sm text-white font-bold">Прогресс курса</span>
              <span className="text-gray-500 text-xs font-ibm ml-3">3 из 8 уроков завершены</span>
            </div>
            <span className="neon-text-cyan font-orbitron font-bold text-sm">37%</span>
          </div>
          <div className="progress-neon h-3">
            <div className="progress-neon-fill" style={{ width: '37%' }} />
          </div>
        </div>

        {/* Lessons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {lessons.map((lesson, i) => (
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
              {lesson.progress > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-ibm">Прогресс</span>
                    <span className="neon-text-cyan font-orbitron">{lesson.progress}%</span>
                  </div>
                  <div className="progress-neon h-2">
                    <div className="progress-neon-fill" style={{ width: `${lesson.progress}%` }} />
                  </div>
                </div>
              )}

              <button className={`w-full py-2.5 rounded-xl text-sm font-orbitron font-bold tracking-wide transition-all ${
                lesson.locked
                  ? 'border border-gray-700 text-gray-600 cursor-not-allowed'
                  : lesson.progress === 100
                  ? 'border border-neon-green/40 text-neon-green bg-neon-green/10 hover:bg-neon-green/20'
                  : lesson.progress > 0
                  ? 'btn-solid-cyan'
                  : 'btn-neon-cyan'
              }`}>
                {lesson.locked ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="Lock" size={13} fallback="Circle" /> Заблокировано
                  </span>
                ) : lesson.progress === 100 ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="CheckCircle" size={13} fallback="Circle" /> Пройдено
                  </span>
                ) : lesson.progress > 0 ? 'Продолжить' : 'Начать урок'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
