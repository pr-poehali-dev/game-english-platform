import Icon from '@/components/ui/icon';

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const weekActivity = [45, 0, 78, 92, 60, 120, 35];
const maxActivity = Math.max(...weekActivity);

const recentGames = [
  { game: 'Переводчик-Молния', result: 'Победа', xp: 200, accuracy: 94, time: '2 ч. назад', icon: '⚡' },
  { game: 'Битва слов', result: 'Поражение', xp: 50, accuracy: 71, time: '5 ч. назад', icon: '⚔️' },
  { game: 'Охота на слова', result: 'Победа', xp: 150, accuracy: 88, time: '8 ч. назад', icon: '🔍' },
  { game: 'Переводчик-Молния', result: 'Победа', xp: 200, accuracy: 97, time: 'Вчера', icon: '⚡' },
  { game: 'Грамматический Boss', result: 'Поражение', xp: 75, accuracy: 62, time: 'Вчера', icon: '🐉' },
];

const skillStats = [
  { skill: 'Словарный запас', level: 72, color: 'cyan' },
  { skill: 'Грамматика', level: 58, color: 'purple' },
  { skill: 'Аудирование', level: 45, color: 'green' },
  { skill: 'Чтение', level: 83, color: 'yellow' },
  { skill: 'Произношение', level: 31, color: 'pink' },
];

export default function StatsPage() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-orbitron text-3xl font-black text-white mb-2">
            МОЯ <span className="neon-text-green">СТАТИСТИКА</span>
          </h1>
          <p className="text-gray-500 font-ibm">Анализ прогресса и игровых показателей</p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Всего XP', value: '42,100', icon: 'Zap', color: 'cyan', sub: '+1,240 за неделю' },
            { label: 'Игр сыграно', value: '95', icon: 'Gamepad2', color: 'purple', sub: '51 победа' },
            { label: 'Слов изучено', value: '234', icon: 'BookOpen', color: 'green', sub: 'из 500 цели' },
            { label: 'Дней стрик', value: '7', icon: 'Flame', color: 'orange', sub: 'Лучший: 14 дней' },
          ].map((stat, i) => (
            <div key={i} className="game-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center border ${
                stat.color === 'cyan' ? 'border-neon-cyan/30 bg-neon-cyan/10' :
                stat.color === 'purple' ? 'border-neon-purple/30 bg-neon-purple/10' :
                stat.color === 'green' ? 'border-neon-green/30 bg-neon-green/10' :
                'border-orange-400/30 bg-orange-400/10'
              }`}>
                <Icon name={stat.icon} size={18} fallback="Circle" className={
                  stat.color === 'cyan' ? 'text-neon-cyan' :
                  stat.color === 'purple' ? 'text-neon-purple' :
                  stat.color === 'green' ? 'text-neon-green' : 'text-orange-400'
                } />
              </div>
              <div className={`font-orbitron text-2xl font-black mb-1 ${
                stat.color === 'cyan' ? 'neon-text-cyan' :
                stat.color === 'purple' ? 'neon-text-purple' :
                stat.color === 'green' ? 'neon-text-green' : 'text-orange-400'
              }`}>{stat.value}</div>
              <div className="text-white text-xs font-ibm font-medium mb-0.5">{stat.label}</div>
              <div className="text-gray-600 text-xs font-ibm">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly activity */}
          <div className="game-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-orbitron text-sm font-bold text-white">Активность</div>
                <div className="text-gray-600 text-xs font-ibm mt-0.5">Эта неделя (в минутах)</div>
              </div>
              <span className="neon-text-cyan font-orbitron text-xs font-bold">430 мин</span>
            </div>

            <div className="flex items-end gap-2 h-24">
              {weekDays.map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-sm relative" style={{ height: '80px' }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-sm transition-all duration-700"
                      style={{
                        height: `${weekActivity[i] > 0 ? Math.max(4, (weekActivity[i] / maxActivity) * 80) : 2}px`,
                        background: weekActivity[i] > 0
                          ? 'linear-gradient(180deg, #00f5ff, rgba(0,245,255,0.3))'
                          : 'rgba(255,255,255,0.05)',
                        boxShadow: weekActivity[i] > 0 ? '0 0 8px rgba(0,245,255,0.4)' : 'none',
                      }}
                    />
                  </div>
                  <div className="text-gray-600 text-xs font-ibm">{day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills radar */}
          <div className="game-card rounded-2xl p-5">
            <div className="font-orbitron text-sm font-bold text-white mb-5">Навыки</div>
            <div className="space-y-3">
              {skillStats.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-ibm text-gray-400">{s.skill}</span>
                    <span className={`font-orbitron font-bold ${
                      s.color === 'cyan' ? 'neon-text-cyan' :
                      s.color === 'purple' ? 'neon-text-purple' :
                      s.color === 'green' ? 'neon-text-green' :
                      s.color === 'yellow' ? 'text-yellow-400' : 'text-neon-pink'
                    }`}>{s.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${s.level}%`,
                        background: s.color === 'cyan' ? 'linear-gradient(90deg, #00f5ff, rgba(0,245,255,0.5))' :
                          s.color === 'purple' ? 'linear-gradient(90deg, #bf00ff, rgba(191,0,255,0.5))' :
                          s.color === 'green' ? 'linear-gradient(90deg, #39ff14, rgba(57,255,20,0.5))' :
                          s.color === 'yellow' ? 'linear-gradient(90deg, #fbbf24, rgba(251,191,36,0.5))' :
                          'linear-gradient(90deg, #ff0080, rgba(255,0,128,0.5))',
                        boxShadow: s.color === 'cyan' ? '0 0 8px rgba(0,245,255,0.4)' :
                          s.color === 'purple' ? '0 0 8px rgba(191,0,255,0.4)' :
                          s.color === 'green' ? '0 0 8px rgba(57,255,20,0.4)' :
                          s.color === 'yellow' ? '0 0 8px rgba(251,191,36,0.4)' :
                          '0 0 8px rgba(255,0,128,0.4)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Win rate */}
        <div className="game-card rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="font-orbitron text-sm font-bold text-white">Игровая статистика</div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { label: 'Победы', value: 51, color: 'neon-text-green' },
              { label: 'Поражения', value: 44, color: 'text-red-400' },
              { label: 'Точность', value: '78%', color: 'neon-text-cyan' },
              { label: 'Win Rate', value: '54%', color: 'neon-text-purple' },
            ].map((s, i) => (
              <div key={i}>
                <div className={`font-orbitron text-xl font-black mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-gray-500 text-xs font-ibm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent games */}
        <div className="game-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-game-border">
            <div className="font-orbitron text-sm font-bold text-white">Последние игры</div>
          </div>
          <div>
            {recentGames.map((g, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3.5 border-b border-game-border/50 hover:bg-white/[0.02] transition-all animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="text-2xl">{g.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-orbitron text-xs font-bold text-white">{g.game}</div>
                  <div className="text-gray-600 text-xs font-ibm">{g.time}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-orbitron font-bold ${g.result === 'Победа' ? 'neon-text-green' : 'text-red-400'}`}>
                    {g.result}
                  </div>
                  <div className="text-gray-600 text-xs font-ibm">{g.accuracy}% точность</div>
                </div>
                <div className="text-right w-16">
                  <div className="neon-text-cyan font-orbitron text-xs font-bold">+{g.xp}</div>
                  <div className="text-gray-700 text-xs font-ibm">XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
