import { useState } from 'react';
import Icon from '@/components/ui/icon';

type Period = 'day' | 'week' | 'month' | 'all';
type Level = 'all' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

const allPlayers = [
  { rank: 1, name: 'DragonSlayer', country: '🇷🇺', level: 'B2', xp: 128400, streak: 45, games: 312, wins: 241 },
  { rank: 2, name: 'NightOwl_99', country: '🇰🇿', level: 'B2', xp: 115200, streak: 30, games: 289, wins: 198 },
  { rank: 3, name: 'WordMaster', country: '🇧🇾', level: 'B1', xp: 98700, streak: 22, games: 256, wins: 167 },
  { rank: 4, name: 'GrammarNinja', country: '🇺🇿', level: 'C1', xp: 91300, streak: 18, games: 234, wins: 145 },
  { rank: 5, name: 'LexiconKing', country: '🇷🇺', level: 'B2', xp: 87650, streak: 15, games: 198, wins: 134 },
  { rank: 6, name: 'VocabViking', country: '🇦🇲', level: 'B1', xp: 82100, streak: 12, games: 187, wins: 121 },
  { rank: 7, name: 'PhoneticPhantom', country: '🇰🇬', level: 'A2', xp: 74500, streak: 8, games: 163, wins: 98 },
  { rank: 8, name: 'TenseTemple', country: '🇷🇺', level: 'B1', xp: 69800, streak: 25, games: 155, wins: 89 },
  { rank: 9, name: 'AccentAce', country: '🇹🇯', level: 'A2', xp: 61200, streak: 5, games: 132, wins: 72 },
  { rank: 10, name: 'PronounPrince', country: '🇷🇺', level: 'C1', xp: 58900, streak: 11, games: 128, wins: 68 },
  { rank: 11, name: 'AlexEnglish', country: '🇷🇺', level: 'A2', xp: 42100, streak: 7, games: 95, wins: 51 },
  { rank: 12, name: 'SyntaxStar', country: '🇰🇿', level: 'B1', xp: 38400, streak: 3, games: 87, wins: 43 },
];

const periods: { id: Period; label: string }[] = [
  { id: 'day', label: 'Сегодня' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
  { id: 'all', label: 'Всё время' },
];

const levels: Level[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const currentUserRank = 11;

export default function RatingPage() {
  const [period, setPeriod] = useState<Period>('week');
  const [levelFilter, setLevelFilter] = useState<Level>('all');

  const filtered = levelFilter === 'all'
    ? allPlayers
    : allPlayers.filter(p => p.level === levelFilter);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-orbitron text-3xl font-black text-white mb-2">
            ТАБЛИЦА <span className="neon-text-yellow rank-gold">РЕЙТИНГА</span>
          </h1>
          <p className="text-gray-500 font-ibm">Соревнуйся с лучшими игроками платформы</p>
        </div>

        {/* Your position */}
        <div className="game-card rounded-2xl p-4 mb-6 border-neon-purple/30 bg-gradient-to-r from-neon-purple/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="text-xs font-orbitron text-neon-purple mb-1">ТВОЯ ПОЗИЦИЯ</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl border border-neon-purple/40 bg-neon-purple/10 flex items-center justify-center font-orbitron font-black text-neon-purple">
              {currentUserRank}
            </div>
            <div className="flex-1">
              <div className="font-orbitron text-sm font-bold text-white">AlexEnglish <span className="text-gray-600">— это ты</span></div>
              <div className="flex gap-3 text-xs font-ibm text-gray-500 mt-0.5">
                <span>🇷🇺</span>
                <span>Уровень A2</span>
                <span className="text-yellow-400">↑ +3 за неделю</span>
              </div>
            </div>
            <div className="text-right">
              <div className="neon-text-purple font-orbitron font-bold">42,100</div>
              <div className="text-gray-600 text-xs font-ibm">XP очков</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Period filter */}
          <div className="flex gap-1.5 flex-wrap">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-orbitron transition-all ${
                  period === p.id
                    ? 'bg-neon-cyan/15 border border-neon-cyan/40 text-neon-cyan'
                    : 'border border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Level filter */}
          <div className="flex gap-1.5 flex-wrap">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-orbitron transition-all ${
                  levelFilter === lvl
                    ? 'bg-neon-purple/15 border border-neon-purple/40 text-neon-purple'
                    : 'border border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                {lvl === 'all' ? 'Все уровни' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[filtered[1], filtered[0], filtered[2]].map((p, i) => {
            if (!p) return <div key={i} />;
            const pos = i === 0 ? 2 : i === 1 ? 1 : 3;
            const isFirst = pos === 1;
            return (
              <div
                key={p.rank}
                className={`game-card rounded-2xl p-4 text-center flex flex-col items-center ${
                  isFirst ? 'border-yellow-400/30 bg-yellow-400/5 mt-0' : 'mt-4'
                }`}
              >
                <div className={`text-2xl mb-1 ${isFirst ? 'animate-float' : ''}`}>
                  {pos === 1 ? '🥇' : pos === 2 ? '🥈' : '🥉'}
                </div>
                <div className="text-xl mb-1">{p.country}</div>
                <div className={`font-orbitron text-xs font-bold mb-1 ${
                  pos === 1 ? 'rank-gold' : pos === 2 ? 'rank-silver' : 'rank-bronze'
                }`}>{p.name}</div>
                <div className={`font-orbitron text-sm font-black ${
                  pos === 1 ? 'rank-gold' : pos === 2 ? 'rank-silver' : 'rank-bronze'
                }`}>{p.xp.toLocaleString()}</div>
                <div className="text-gray-600 text-xs font-ibm">XP</div>
              </div>
            );
          })}
        </div>

        {/* Full table */}
        <div className="game-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-game-border text-xs font-orbitron text-gray-600 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Игрок</div>
            <div className="col-span-2 text-right">Уровень</div>
            <div className="col-span-2 text-right">XP</div>
            <div className="col-span-2 text-right hidden sm:block">Стрик</div>
            <div className="col-span-1 text-right hidden sm:block">Win%</div>
          </div>

          {filtered.map((p, i) => {
            const isMe = p.name === 'AlexEnglish';
            const winRate = Math.round((p.wins / p.games) * 100);
            return (
              <div
                key={p.rank}
                className={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-game-border/50 items-center transition-all hover:bg-white/[0.02] animate-fade-in ${
                  isMe ? 'bg-neon-purple/5 border-l-2 border-l-neon-purple/50' : ''
                }`}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div className={`col-span-1 font-orbitron text-sm font-bold ${
                  p.rank === 1 ? 'rank-gold' : p.rank === 2 ? 'rank-silver' : p.rank === 3 ? 'rank-bronze' : 'text-gray-600'
                }`}>{p.rank}</div>

                <div className="col-span-4 flex items-center gap-2">
                  <span className="text-base">{p.country}</span>
                  <span className={`font-orbitron text-xs font-bold ${isMe ? 'neon-text-purple' : 'text-white'}`}>
                    {p.name}{isMe && <span className="text-gray-600 font-normal ml-1">(ты)</span>}
                  </span>
                </div>

                <div className="col-span-2 text-right">
                  <span className={`text-xs font-orbitron font-bold px-2 py-0.5 rounded border ${
                    p.level === 'A1' || p.level === 'A2' ? 'border-neon-green/40 text-neon-green' :
                    p.level === 'B1' || p.level === 'B2' ? 'border-neon-cyan/40 text-neon-cyan' :
                    'border-neon-purple/40 text-neon-purple'
                  }`}>{p.level}</span>
                </div>

                <div className="col-span-2 text-right font-orbitron text-sm font-bold neon-text-cyan">
                  {p.xp.toLocaleString()}
                </div>

                <div className="col-span-2 text-right hidden sm:flex items-center justify-end gap-1">
                  <Icon name="Flame" size={12} fallback="Circle" className="text-orange-400" />
                  <span className="text-orange-400 text-xs font-ibm">{p.streak} дн.</span>
                </div>

                <div className="col-span-1 text-right hidden sm:block text-xs font-ibm text-gray-400">
                  {winRate}%
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-4 text-gray-600 text-sm font-ibm">
          Показано {filtered.length} игроков из 12,847
        </div>
      </div>
    </div>
  );
}
