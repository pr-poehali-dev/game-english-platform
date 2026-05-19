import Icon from '@/components/ui/icon';

const categories = ['Все', 'Игры', 'Обучение', 'Стрики', 'Социальные', 'Секретные'];

const achievements = [
  { icon: '🔥', title: 'Огненная серия', desc: '7 дней подряд', xp: 500, unlocked: true, rarity: 'Обычная', progress: null },
  { icon: '⚡', title: 'Молния', desc: 'Первая победа в Переводчик-Молния', xp: 200, unlocked: true, rarity: 'Обычная', progress: null },
  { icon: '🎯', title: 'Снайпер слов', desc: '100% точность в уроке', xp: 350, unlocked: true, rarity: 'Редкая', progress: null },
  { icon: '🏆', title: 'Чемпион', desc: 'Выиграй 50 игр подряд', xp: 1000, unlocked: false, rarity: 'Эпическая', progress: 32 },
  { icon: '📚', title: 'Книгочей', desc: 'Пройди 20 уроков', xp: 750, unlocked: false, rarity: 'Редкая', progress: 3 },
  { icon: '🌙', title: 'Ночная сова', desc: 'Занимайся после 23:00 (5 раз)', xp: 300, unlocked: true, rarity: 'Необычная', progress: null },
  { icon: '👑', title: 'Король', desc: 'Достигни топ-10 рейтинга', xp: 2000, unlocked: false, rarity: 'Легендарная', progress: 11 },
  { icon: '🎓', title: 'Академик', desc: 'Изучи 500 новых слов', xp: 800, unlocked: false, rarity: 'Редкая', progress: 234 },
  { icon: '💎', title: 'Бриллиант', desc: 'Набери 100,000 XP', xp: 5000, unlocked: false, rarity: 'Легендарная', progress: 42100 },
  { icon: '🤝', title: 'Командный игрок', desc: 'Сыграй 10 командных матчей', xp: 400, unlocked: false, rarity: 'Необычная', progress: 3 },
  { icon: '🌍', title: 'Полиглот', desc: '???', xp: 9999, unlocked: false, rarity: 'Секретная', progress: null, secret: true },
  { icon: '🚀', title: 'К звёздам', desc: '???', xp: 9999, unlocked: false, rarity: 'Секретная', progress: null, secret: true },
];

const rarityColors: Record<string, { border: string; text: string; bg: string }> = {
  'Обычная': { border: 'border-gray-500/40', text: 'text-gray-400', bg: 'bg-gray-500/10' },
  'Необычная': { border: 'border-neon-green/40', text: 'text-neon-green', bg: 'bg-neon-green/10' },
  'Редкая': { border: 'border-neon-cyan/40', text: 'text-neon-cyan', bg: 'bg-neon-cyan/10' },
  'Эпическая': { border: 'border-neon-purple/40', text: 'text-neon-purple', bg: 'bg-neon-purple/10' },
  'Легендарная': { border: 'border-yellow-400/40', text: 'rank-gold', bg: 'bg-yellow-400/10' },
  'Секретная': { border: 'border-gray-700/40', text: 'text-gray-700', bg: 'bg-gray-900/30' },
};

export default function AchievementsPage() {
  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-orbitron text-3xl font-black text-white mb-2">
            ЗАЛА <span className="neon-text-purple">ДОСТИЖЕНИЙ</span>
          </h1>
          <p className="text-gray-500 font-ibm">Коллекционируй награды за мастерство</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="game-card rounded-xl p-4 text-center">
            <div className="font-orbitron text-2xl font-black neon-text-cyan mb-1">{unlocked}</div>
            <div className="text-gray-500 text-xs font-ibm">Получено</div>
          </div>
          <div className="game-card rounded-xl p-4 text-center">
            <div className="font-orbitron text-2xl font-black text-white mb-1">{achievements.length}</div>
            <div className="text-gray-500 text-xs font-ibm">Всего</div>
          </div>
          <div className="game-card rounded-xl p-4 text-center">
            <div className="font-orbitron text-2xl font-black neon-text-purple mb-1">
              {Math.round((unlocked / achievements.length) * 100)}%
            </div>
            <div className="text-gray-500 text-xs font-ibm">Завершено</div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-ibm mb-2 text-gray-500">
            <span>Общий прогресс достижений</span>
            <span className="neon-text-cyan font-orbitron">{unlocked} / {achievements.length}</span>
          </div>
          <div className="progress-neon h-3">
            <div className="progress-neon-fill" style={{ width: `${(unlocked / achievements.length) * 100}%` }} />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-3 py-1.5 rounded-lg text-xs font-orbitron transition-all border ${
                i === 0
                  ? 'bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan'
                  : 'border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievements grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach, i) => {
            const colors = rarityColors[ach.rarity];
            return (
              <div
                key={i}
                className={`game-card rounded-2xl p-5 animate-fade-in relative overflow-hidden transition-all ${
                  !ach.unlocked && !ach.secret ? 'opacity-60' : ''
                } ${ach.unlocked ? `border ${colors.border}` : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {ach.unlocked && (
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center ${colors.bg} border ${colors.border}`}>
                      <Icon name="Check" size={10} fallback="Circle" className="text-neon-green" />
                    </div>
                  </div>
                )}

                <div className={`text-4xl mb-3 ${ach.secret && !ach.unlocked ? 'blur-sm' : ''}`}>{ach.icon}</div>

                <div className={`text-xs font-orbitron font-bold px-2 py-0.5 rounded border inline-block mb-2 ${colors.border} ${colors.text} ${colors.bg}`}>
                  {ach.rarity}
                </div>

                <h3 className={`font-orbitron text-sm font-bold mb-1 ${ach.secret && !ach.unlocked ? 'text-gray-700' : 'text-white'}`}>
                  {ach.secret && !ach.unlocked ? '???????????' : ach.title}
                </h3>
                <p className={`text-xs font-ibm mb-3 ${ach.secret && !ach.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                  {ach.desc}
                </p>

                {ach.progress !== null && !ach.unlocked && (
                  <div className="mb-3">
                    <div className="progress-neon h-1.5">
                      <div
                        className="progress-neon-fill"
                        style={{
                          width: `${Math.min(100, (ach.progress / (
                            ach.title === 'Чемпион' ? 50 :
                            ach.title === 'Книгочей' ? 20 :
                            ach.title === 'Академик' ? 500 :
                            ach.title === 'К звёздам' ? 10 :
                            ach.title === 'Командный игрок' ? 10 :
                            ach.title === 'Бриллиант' ? 100000 :
                            ach.title === 'Король' ? 10 : 1
                          )) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-yellow-400 text-xs font-ibm">
                    <Icon name="Zap" size={11} fallback="Circle" />
                    +{ach.xp === 9999 ? '???' : ach.xp} XP
                  </span>
                  {ach.unlocked && (
                    <span className="text-xs text-gray-600 font-ibm">Получено</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
