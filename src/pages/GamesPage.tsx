import { useState } from 'react';
import Icon from '@/components/ui/icon';
import FlashTranslator from '@/components/games/FlashTranslator';
import WordBattle from '@/components/games/WordBattle';
import WordSearch from '@/components/games/WordSearch';

type GameId = 1 | 2 | 4 | null;

const games = [
  {
    id: 1,
    title: 'Переводчик-Молния',
    desc: 'Переводи слова быстрее противника. 60 секунд на раунд!',
    icon: '⚡',
    players: '2.4k онлайн',
    xp: 200,
    difficulty: 'Лёгкая',
    diffColor: 'green',
    tag: 'HOT',
    playable: true,
  },
  {
    id: 2,
    title: 'Битва слов',
    desc: 'Составляй предложения из перемешанных слов',
    icon: '⚔️',
    players: '1.8k онлайн',
    xp: 350,
    difficulty: 'Средняя',
    diffColor: 'yellow',
    tag: 'NEW',
    playable: true,
  },
  {
    id: 3,
    title: 'Грамматический Boss',
    desc: 'Победи языкового босса, отвечая на грамматические вопросы',
    icon: '🐉',
    players: '950 онлайн',
    xp: 500,
    difficulty: 'Сложная',
    diffColor: 'purple',
    tag: '',
    playable: false,
  },
  {
    id: 4,
    title: 'Охота на слова',
    desc: 'Найди все скрытые слова в сетке букв',
    icon: '🔍',
    players: '3.1k онлайн',
    xp: 150,
    difficulty: 'Лёгкая',
    diffColor: 'green',
    tag: 'POPULAR',
    playable: true,
  },
  {
    id: 5,
    title: 'Диктант Дуэль',
    desc: 'Пиши слова на слух быстрее чем соперник',
    icon: '🎧',
    players: '620 онлайн',
    xp: 280,
    difficulty: 'Средняя',
    diffColor: 'yellow',
    tag: '',
    playable: false,
  },
  {
    id: 6,
    title: 'Криптоглиф',
    desc: 'Расшифруй зашифрованные английские слова',
    icon: '🔐',
    players: '410 онлайн',
    xp: 420,
    difficulty: 'Сложная',
    diffColor: 'cyan',
    tag: 'NEW',
    playable: false,
  },
];

const tagColors: Record<string, string> = {
  HOT: 'bg-neon-pink/20 border-neon-pink/40 text-neon-pink',
  NEW: 'bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan',
  POPULAR: 'bg-yellow-400/20 border-yellow-400/40 text-yellow-400',
};

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameId>(null);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-orbitron text-3xl font-black text-white mb-2">
            ИГРОВОЙ <span className="neon-text-purple">АРСЕНАЛ</span>
          </h1>
          <p className="text-gray-500 font-ibm">Выбери режим и сразись с другими игроками</p>
        </div>

        {/* Active tournament banner */}
        <div className="game-card rounded-2xl p-5 mb-8 border-neon-cyan/30 bg-gradient-to-r from-neon-cyan/5 to-transparent relative overflow-hidden">
          <div className="absolute right-4 top-4 text-5xl opacity-20 select-none">⚡</div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-neon-green text-xs font-orbitron">АКТИВНО СЕЙЧАС</span>
          </div>
          <div className="font-orbitron text-lg font-bold text-white mb-1">Турнир выходного дня</div>
          <div className="text-gray-400 text-sm font-ibm mb-3">Переводчик-Молния · 847 участников · Заканчивается через 8ч 23м</div>
          <button
            onClick={() => setActiveGame(1)}
            className="btn-solid-cyan px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider"
          >
            Присоединиться
          </button>
        </div>

        {/* Games grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game, i) => (
            <div
              key={game.id}
              className={`game-card rounded-2xl p-5 flex flex-col animate-fade-in ${!game.playable ? 'opacity-60' : ''}`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{game.icon}</div>
                <div className="flex items-center gap-2">
                  {!game.playable && (
                    <span className="text-xs font-orbitron border border-gray-700 text-gray-600 px-2 py-0.5 rounded">
                      Скоро
                    </span>
                  )}
                  {game.tag && (
                    <span className={`text-xs font-orbitron font-bold px-2 py-0.5 rounded border ${tagColors[game.tag] || ''}`}>
                      {game.tag}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-orbitron text-sm font-bold text-white mb-2">{game.title}</h3>
              <p className="text-gray-500 text-sm font-ibm leading-relaxed mb-4 flex-1">{game.desc}</p>

              <div className="flex items-center gap-3 mb-4 text-xs font-ibm">
                <span className="flex items-center gap-1 text-gray-500">
                  <Icon name="Users" size={11} fallback="Circle" />
                  {game.players}
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <Icon name="Zap" size={11} fallback="Circle" />
                  +{game.xp} XP
                </span>
                <span className={`font-medium ${
                  game.diffColor === 'green' ? 'text-neon-green' :
                  game.diffColor === 'yellow' ? 'text-yellow-400' :
                  game.diffColor === 'purple' ? 'text-neon-purple' : 'text-neon-cyan'
                }`}>{game.difficulty}</span>
              </div>

              <button
                disabled={!game.playable}
                onClick={() => game.playable && setActiveGame(game.id as GameId)}
                className={`w-full py-2.5 rounded-xl text-sm font-orbitron font-bold tracking-wide transition-all ${
                  game.playable
                    ? 'btn-neon-cyan cursor-pointer'
                    : 'border border-gray-700 text-gray-600 cursor-not-allowed'
                }`}
              >
                {game.playable ? 'Играть' : 'Скоро'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Game modals */}
      {activeGame === 1 && <FlashTranslator onClose={() => setActiveGame(null)} />}
      {activeGame === 2 && <WordBattle onClose={() => setActiveGame(null)} />}
      {activeGame === 4 && <WordSearch onClose={() => setActiveGame(null)} />}
    </div>
  );
}
