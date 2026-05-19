import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Word {
  en: string;
  ru: string;
  example: string;
}

interface LessonData {
  id: number;
  title: string;
  icon: string;
  xp: number;
  words: Word[];
}

interface LessonModalProps {
  lesson: LessonData;
  onClose: () => void;
  onComplete: (lessonId: number, xp: number) => void;
}

type Phase = 'intro' | 'learn' | 'quiz' | 'result';

export default function LessonModal({ lesson, onClose, onComplete }: LessonModalProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [shake, setShake] = useState(false);

  const words = lesson.words;
  const currentWord = words[cardIndex];
  const quizWord = words[quizIndex];

  // Generate options for quiz
  const getOptions = (correctWord: Word) => {
    const others = words.filter(w => w.en !== correctWord.en);
    const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    const all = [...shuffled, correctWord].sort(() => Math.random() - 0.5);
    return all.map(w => w.ru);
  };

  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (phase === 'quiz') {
      setOptions(getOptions(words[quizIndex]));
    }
  }, [quizIndex, phase]);

  const handleAnswer = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    if (answer === quizWord.ru) {
      setCorrect(c => c + 1);
    } else {
      setWrong(w => w + 1);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setTimeout(() => {
      setSelected(null);
      if (quizIndex + 1 >= words.length) {
        setPhase('result');
      } else {
        setQuizIndex(i => i + 1);
      }
    }, 900);
  };

  const score = Math.round((correct / words.length) * 100);
  const earnedXp = Math.round(lesson.xp * (score / 100));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-scale-in">

        {/* INTRO */}
        {phase === 'intro' && (
          <div className="game-card rounded-3xl p-8 text-center border-neon-cyan/20">
            <div className="text-6xl mb-4">{lesson.icon}</div>
            <h2 className="font-orbitron text-2xl font-black text-white mb-2">{lesson.title}</h2>
            <p className="text-gray-400 font-ibm mb-2 text-sm">
              {words.length} слов · Изучи карточки, затем пройди тест
            </p>
            <div className="flex items-center justify-center gap-2 text-yellow-400 text-sm font-ibm mb-8">
              <Icon name="Zap" size={14} fallback="Circle" />
              До +{lesson.xp} XP за урок
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-500 font-orbitron text-sm hover:border-gray-500 transition-all">
                Назад
              </button>
              <button
                onClick={() => setPhase('learn')}
                className="flex-2 flex-grow btn-solid-cyan py-3 rounded-xl font-orbitron font-bold text-sm"
              >
                Начать урок
              </button>
            </div>
          </div>
        )}

        {/* LEARN — Flashcards */}
        {phase === 'learn' && (
          <div className="game-card rounded-3xl p-6 border-neon-cyan/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm font-orbitron text-gray-500">
                {cardIndex + 1} / {words.length}
              </div>
              <div className="flex-1 mx-4">
                <div className="progress-neon h-2">
                  <div className="progress-neon-fill transition-all duration-500" style={{ width: `${((cardIndex + 1) / words.length) * 100}%` }} />
                </div>
              </div>
              <button onClick={onClose} className="text-gray-600 hover:text-gray-400 transition-colors">
                <Icon name="X" size={18} fallback="X" />
              </button>
            </div>

            {/* Card */}
            <div
              onClick={() => setFlipped(f => !f)}
              className={`cursor-pointer rounded-2xl border p-8 text-center mb-6 transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center ${
                flipped
                  ? 'border-neon-purple/40 bg-neon-purple/5'
                  : 'border-neon-cyan/30 bg-neon-cyan/5'
              }`}
            >
              {!flipped ? (
                <>
                  <div className="font-orbitron text-4xl font-black text-white mb-3">{currentWord.en}</div>
                  <div className="text-gray-500 text-sm font-ibm">Нажми, чтобы увидеть перевод</div>
                </>
              ) : (
                <>
                  <div className="neon-text-purple font-orbitron text-3xl font-black mb-3">{currentWord.ru}</div>
                  <div className="text-gray-400 text-sm font-ibm italic">"{currentWord.example}"</div>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setFlipped(false); setCardIndex(i => Math.max(0, i - 1)); }}
                disabled={cardIndex === 0}
                className="py-3 px-5 rounded-xl border border-gray-700 text-gray-500 font-orbitron text-sm disabled:opacity-30 hover:border-gray-500 transition-all"
              >
                <Icon name="ChevronLeft" size={16} fallback="Circle" />
              </button>
              {cardIndex + 1 < words.length ? (
                <button
                  onClick={() => { setFlipped(false); setCardIndex(i => i + 1); }}
                  className="flex-1 btn-solid-cyan py-3 rounded-xl font-orbitron font-bold text-sm"
                >
                  Следующее слово
                </button>
              ) : (
                <button
                  onClick={() => { setPhase('quiz'); setQuizIndex(0); setCorrect(0); setWrong(0); }}
                  className="flex-1 py-3 rounded-xl font-orbitron font-bold text-sm bg-neon-purple/20 border border-neon-purple/50 text-neon-purple hover:bg-neon-purple/30 transition-all"
                >
                  Пройти тест →
                </button>
              )}
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase === 'quiz' && (
          <div className={`game-card rounded-3xl p-6 border-neon-cyan/20 ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-3 text-sm font-ibm">
                <span className="text-neon-green">✓ {correct}</span>
                <span className="text-red-400">✗ {wrong}</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="progress-neon h-2">
                  <div className="progress-neon-fill transition-all duration-500" style={{ width: `${(quizIndex / words.length) * 100}%` }} />
                </div>
              </div>
              <div className="text-sm font-orbitron text-gray-500">{quizIndex + 1}/{words.length}</div>
            </div>

            <div className="text-center mb-8">
              <div className="text-gray-500 text-sm font-ibm mb-3">Переведи слово</div>
              <div className="font-orbitron text-4xl font-black text-white">{quizWord.en}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {options.map((opt, i) => {
                let cls = 'border border-gray-700 text-gray-300 hover:border-neon-cyan/50 hover:text-white';
                if (selected) {
                  if (opt === quizWord.ru) cls = 'border-neon-green/60 bg-neon-green/10 text-neon-green';
                  else if (opt === selected) cls = 'border-red-500/60 bg-red-500/10 text-red-400';
                  else cls = 'border-gray-800 text-gray-600 opacity-50';
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selected}
                    className={`py-4 px-3 rounded-xl text-sm font-ibm font-medium transition-all ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase === 'result' && (
          <div className="game-card rounded-3xl p-8 text-center border-neon-cyan/20">
            <div className="text-5xl mb-4">{score >= 80 ? '🏆' : score >= 50 ? '⭐' : '💪'}</div>
            <h2 className="font-orbitron text-2xl font-black text-white mb-1">
              {score >= 80 ? 'Отличный результат!' : score >= 50 ? 'Неплохо!' : 'Попробуй ещё раз'}
            </h2>
            <div className="font-orbitron text-5xl font-black neon-text-cyan my-4">{score}%</div>
            <div className="flex justify-center gap-6 mb-6 text-sm font-ibm">
              <span className="text-neon-green">✓ {correct} правильно</span>
              <span className="text-red-400">✗ {wrong} ошибок</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-yellow-400 font-orbitron text-lg font-bold mb-8">
              <Icon name="Zap" size={18} fallback="Circle" />
              +{earnedXp} XP получено!
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setPhase('learn'); setCardIndex(0); setFlipped(false); setQuizIndex(0); setCorrect(0); setWrong(0); }}
                className="flex-1 py-3 rounded-xl border border-neon-purple/40 text-neon-purple font-orbitron text-sm hover:bg-neon-purple/10 transition-all"
              >
                Повторить
              </button>
              <button
                onClick={() => { onComplete(lesson.id, earnedXp); onClose(); }}
                className="flex-1 btn-solid-cyan py-3 rounded-xl font-orbitron font-bold text-sm"
              >
                Завершить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
