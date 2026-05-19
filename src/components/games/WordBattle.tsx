import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const sentences = [
  { words: ['I', 'love', 'English', 'very', 'much'], translation: 'Я очень люблю английский' },
  { words: ['She', 'reads', 'books', 'every', 'day'], translation: 'Она читает книги каждый день' },
  { words: ['We', 'play', 'games', 'at', 'school'], translation: 'Мы играем в игры в школе' },
  { words: ['He', 'speaks', 'English', 'well'], translation: 'Он хорошо говорит по-английски' },
  { words: ['They', 'eat', 'lunch', 'together'], translation: 'Они вместе обедают' },
  { words: ['The', 'cat', 'sits', 'on', 'the', 'mat'], translation: 'Кот сидит на коврике' },
  { words: ['I', 'wake', 'up', 'early', 'morning'], translation: 'Я просыпаюсь рано утром' },
  { words: ['She', 'likes', 'coffee', 'with', 'milk'], translation: 'Ей нравится кофе с молоком' },
];

interface Props {
  onClose: () => void;
}

type GameState = 'waiting' | 'playing' | 'finished';

export default function WordBattle({ onClose }: Props) {
  const [state, setState] = useState<GameState>('waiting');
  const [sentIdx, setSentIdx] = useState(0);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [round, setRound] = useState(0);
  const [totalSents] = useState(() => [...sentences].sort(() => Math.random() - 0.5).slice(0, 5));

  const current = totalSents[sentIdx];

  const startGame = () => {
    setSentIdx(0);
    setScore(0);
    setRound(0);
    setTimeLeft(90);
    setChosen([]);
    setShuffled([...totalSents[0].words].sort(() => Math.random() - 0.5));
    setState('playing');
  };

  useEffect(() => {
    if (state !== 'playing') return;
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(t); setState('finished'); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [state]);

  const pickWord = (word: string, fromIdx: number) => {
    if (result) return;
    const newChosen = [...chosen, word];
    const newShuffled = shuffled.filter((_, i) => i !== fromIdx);
    setChosen(newChosen);
    setShuffled(newShuffled);

    if (newShuffled.length === 0) {
      const correct = newChosen.join(' ') === current.words.join(' ');
      setResult(correct ? 'correct' : 'wrong');
      if (correct) setScore(s => s + 30);
      setTimeout(() => {
        setResult(null);
        setChosen([]);
        const next = sentIdx + 1;
        if (next >= totalSents.length) {
          setState('finished');
        } else {
          setSentIdx(next);
          setShuffled([...totalSents[next].words].sort(() => Math.random() - 0.5));
          setRound(next);
        }
      }, 800);
    }
  };

  const removeWord = (idx: number) => {
    if (result) return;
    const word = chosen[idx];
    setShuffled(s => [...s, word]);
    setChosen(c => c.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-scale-in">

        {state === 'waiting' && (
          <div className="game-card rounded-3xl p-8 text-center border-neon-purple/20">
            <div className="text-5xl mb-4 animate-float">⚔️</div>
            <h2 className="font-orbitron text-2xl font-black text-white mb-2">Битва слов</h2>
            <p className="text-gray-400 font-ibm text-sm mb-6">
              Составляй предложения из перемешанных слов.<br/>
              {totalSents.length} предложений · 90 секунд
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-500 font-orbitron text-sm hover:border-gray-500 transition-all">Назад</button>
              <button onClick={startGame} className="flex-1 py-3 rounded-xl font-orbitron font-bold text-sm bg-neon-purple/20 border border-neon-purple/50 text-neon-purple hover:bg-neon-purple/30 transition-all">Играть!</button>
            </div>
          </div>
        )}

        {state === 'playing' && current && (
          <div className={`game-card rounded-3xl p-6 border-2 transition-colors duration-200 ${
            result === 'correct' ? 'border-neon-green/60' : result === 'wrong' ? 'border-red-500/60' : 'border-neon-purple/20'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-orbitron text-gray-500">{round + 1} / {totalSents.length}</div>
              <div className="flex items-center gap-1 text-sm font-orbitron text-white">
                <Icon name="Clock" size={14} fallback="Circle" className={timeLeft <= 15 ? 'text-red-400' : 'text-neon-cyan'} />
                <span className={timeLeft <= 15 ? 'text-red-400' : 'neon-text-cyan'}>{timeLeft}с</span>
              </div>
              <div className="neon-text-purple font-orbitron font-bold text-sm">{score} pts</div>
            </div>

            {/* Translation hint */}
            <div className="rounded-xl border border-neon-purple/20 bg-neon-purple/5 p-3 text-center mb-4">
              <div className="text-gray-400 text-xs font-ibm mb-0.5">Переведи на английский:</div>
              <div className="text-white font-ibm font-medium">{current.translation}</div>
            </div>

            {/* Answer area */}
            <div className="min-h-[64px] rounded-xl border-2 border-dashed border-neon-purple/30 bg-neon-purple/5 p-3 flex flex-wrap gap-2 mb-4">
              {chosen.length === 0 && (
                <span className="text-gray-700 text-sm font-ibm m-auto">Нажимай на слова ниже...</span>
              )}
              {chosen.map((word, i) => (
                <button
                  key={i}
                  onClick={() => removeWord(i)}
                  className="px-3 py-1.5 rounded-lg bg-neon-purple/20 border border-neon-purple/50 text-neon-purple font-ibm text-sm hover:bg-neon-purple/30 transition-all"
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Word bank */}
            <div className="flex flex-wrap gap-2 min-h-[48px]">
              {shuffled.map((word, i) => (
                <button
                  key={i}
                  onClick={() => pickWord(word, i)}
                  className="px-3 py-2 rounded-lg bg-game-card border border-gray-700 text-gray-300 font-ibm text-sm hover:border-neon-cyan/40 hover:text-white hover:bg-neon-cyan/5 transition-all"
                >
                  {word}
                </button>
              ))}
            </div>

            {result && (
              <div className={`text-center mt-3 font-orbitron text-sm font-bold ${result === 'correct' ? 'text-neon-green' : 'text-red-400'}`}>
                {result === 'correct' ? '✓ Правильно! +30 очков' : `✗ Неверно: ${current.words.join(' ')}`}
              </div>
            )}
          </div>
        )}

        {state === 'finished' && (
          <div className="game-card rounded-3xl p-8 text-center border-neon-purple/20">
            <div className="text-5xl mb-3">⚔️</div>
            <h2 className="font-orbitron text-xl font-black text-white mb-1">Битва окончена!</h2>
            <div className="font-orbitron text-5xl font-black neon-text-purple my-4">{score}</div>
            <div className="text-gray-400 font-ibm text-sm mb-6">очков набрано</div>
            <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-3 mb-8">
              <div className="text-yellow-400 font-orbitron font-bold text-lg">+{Math.round(score / 4)} XP</div>
              <div className="text-gray-600 text-xs font-ibm">получено</div>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-500 font-orbitron text-sm">Выйти</button>
              <button onClick={startGame} className="flex-1 py-3 rounded-xl font-orbitron font-bold text-sm bg-neon-purple/20 border border-neon-purple/50 text-neon-purple hover:bg-neon-purple/30 transition-all">Ещё раз</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
