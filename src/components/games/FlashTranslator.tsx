import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';

const wordPairs = [
  { en: 'apple', ru: 'яблоко' }, { en: 'house', ru: 'дом' }, { en: 'water', ru: 'вода' },
  { en: 'sun', ru: 'солнце' }, { en: 'book', ru: 'книга' }, { en: 'cat', ru: 'кошка' },
  { en: 'dog', ru: 'собака' }, { en: 'car', ru: 'машина' }, { en: 'tree', ru: 'дерево' },
  { en: 'phone', ru: 'телефон' }, { en: 'bread', ru: 'хлеб' }, { en: 'city', ru: 'город' },
  { en: 'night', ru: 'ночь' }, { en: 'sky', ru: 'небо' }, { en: 'wind', ru: 'ветер' },
  { en: 'fire', ru: 'огонь' }, { en: 'river', ru: 'река' }, { en: 'door', ru: 'дверь' },
  { en: 'heart', ru: 'сердце' }, { en: 'dream', ru: 'мечта' },
];

interface Props {
  onClose: () => void;
}

type GameState = 'waiting' | 'playing' | 'finished';

export default function FlashTranslator({ onClose }: Props) {
  const [state, setState] = useState<GameState>('waiting');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [shuffled, setShuffled] = useState<typeof wordPairs>([]);

  const genOptions = useCallback((idx: number, words: typeof wordPairs) => {
    const correct = words[idx];
    const others = words.filter((_, i) => i !== idx).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...others.map(w => w.ru), correct.ru].sort(() => Math.random() - 0.5);
  }, []);

  const startGame = () => {
    const sh = [...wordPairs].sort(() => Math.random() - 0.5);
    setShuffled(sh);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(60);
    setOptions(genOptions(0, sh));
    setState('playing');
  };

  useEffect(() => {
    if (state !== 'playing') return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); setState('finished'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [state]);

  const handleAnswer = (answer: string) => {
    if (selected || state !== 'playing') return;
    setSelected(answer);
    const isCorrect = answer === shuffled[currentIndex].ru;

    if (isCorrect) {
      const newCombo = combo + 1;
      const bonus = newCombo >= 3 ? 2 : 1;
      setScore(s => s + 10 * bonus);
      setCombo(newCombo);
      setMaxCombo(m => Math.max(m, newCombo));
      setFlash('correct');
    } else {
      setCombo(0);
      setFlash('wrong');
    }

    setTimeout(() => {
      setSelected(null);
      setFlash(null);
      const nextIdx = currentIndex + 1;
      if (nextIdx >= shuffled.length) {
        setState('finished');
      } else {
        setCurrentIndex(nextIdx);
        setOptions(genOptions(nextIdx, shuffled));
      }
    }, 400);
  };

  const timerPct = (timeLeft / 60) * 100;
  const timerColor = timeLeft > 20 ? '#00f5ff' : timeLeft > 10 ? '#fbbf24' : '#ef4444';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-md animate-scale-in">

        {/* WAITING */}
        {state === 'waiting' && (
          <div className="game-card rounded-3xl p-8 text-center border-neon-cyan/20">
            <div className="text-5xl mb-4 animate-float">⚡</div>
            <h2 className="font-orbitron text-2xl font-black text-white mb-2">Переводчик-Молния</h2>
            <p className="text-gray-400 font-ibm text-sm mb-6">
              60 секунд — переводи как можно больше слов.<br/>
              Комбо x3 удваивает очки!
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8 text-center">
              {[['60 сек', 'Время'], ['x2 Комбо', 'с 3 подряд'], ['10 pts', 'за слово']].map(([val, lbl]) => (
                <div key={lbl} className="rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 p-3">
                  <div className="neon-text-cyan font-orbitron font-bold text-sm">{val}</div>
                  <div className="text-gray-600 text-xs font-ibm mt-0.5">{lbl}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-500 font-orbitron text-sm hover:border-gray-500 transition-all">Назад</button>
              <button onClick={startGame} className="flex-1 btn-solid-cyan py-3 rounded-xl font-orbitron font-bold text-sm">Играть!</button>
            </div>
          </div>
        )}

        {/* PLAYING */}
        {state === 'playing' && shuffled.length > 0 && (
          <div className={`game-card rounded-3xl p-6 border-2 transition-colors duration-200 ${
            flash === 'correct' ? 'border-neon-green/60' : flash === 'wrong' ? 'border-red-500/60' : 'border-neon-cyan/20'
          }`}>
            {/* Timer + Score */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke={timerColor} strokeWidth="3"
                      strokeDasharray={`${timerPct * 0.942} 94.2`}
                      style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-orbitron font-bold text-white">{timeLeft}</span>
                </div>
              </div>

              <div className="text-center">
                {combo >= 3 && (
                  <div className="text-neon-pink font-orbitron text-xs font-bold animate-glow-pulse">🔥 КОМБО x{combo}</div>
                )}
              </div>

              <div className="text-right">
                <div className="neon-text-cyan font-orbitron text-xl font-black">{score}</div>
                <div className="text-gray-600 text-xs font-ibm">очков</div>
              </div>
            </div>

            {/* Word */}
            <div className={`rounded-2xl border p-8 text-center mb-5 transition-all ${
              flash === 'correct' ? 'border-neon-green/40 bg-neon-green/5' :
              flash === 'wrong' ? 'border-red-500/40 bg-red-500/5' :
              'border-neon-cyan/20 bg-neon-cyan/5'
            }`}>
              <div className="font-orbitron text-4xl font-black text-white">{shuffled[currentIndex].en}</div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {options.map((opt, i) => {
                let cls = 'border-gray-700 text-gray-300 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 hover:text-white';
                if (selected) {
                  if (opt === shuffled[currentIndex].ru) cls = 'border-neon-green/60 bg-neon-green/10 text-neon-green';
                  else if (opt === selected) cls = 'border-red-500/60 bg-red-500/10 text-red-400';
                  else cls = 'border-gray-800 text-gray-700 opacity-40';
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selected}
                    className={`py-4 rounded-xl text-sm font-ibm font-medium border transition-all ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* FINISHED */}
        {state === 'finished' && (
          <div className="game-card rounded-3xl p-8 text-center border-neon-cyan/20">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="font-orbitron text-xl font-black text-white mb-1">Время вышло!</h2>
            <div className="font-orbitron text-5xl font-black neon-text-cyan my-4">{score}</div>
            <div className="text-gray-400 font-ibm text-sm mb-6">очков набрано</div>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="rounded-xl border border-neon-purple/20 bg-neon-purple/5 p-3">
                <div className="neon-text-purple font-orbitron font-bold text-lg">{maxCombo}</div>
                <div className="text-gray-600 text-xs font-ibm">макс. комбо</div>
              </div>
              <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-3">
                <div className="text-yellow-400 font-orbitron font-bold text-lg">+{Math.round(score / 5)} XP</div>
                <div className="text-gray-600 text-xs font-ibm">получено</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-500 font-orbitron text-sm hover:border-gray-500 transition-all">Выйти</button>
              <button onClick={startGame} className="flex-1 btn-solid-cyan py-3 rounded-xl font-orbitron font-bold text-sm">Ещё раз</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
