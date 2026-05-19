import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';

const TARGET_WORDS = ['CAT', 'DOG', 'SUN', 'CAR', 'BIG', 'MAP', 'RUN', 'FLY', 'SKY', 'ART'];
const GRID_SIZE = 8;

type Cell = { letter: string; found: boolean; selected: boolean };

function buildGrid(words: string[]): Cell[][] {
  const grid: string[][] = Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill('').map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
  );

  const placed: string[] = [];
  for (const word of words) {
    const dirs = [[0,1],[1,0],[1,1]];
    let tries = 0;
    while (tries < 50) {
      tries++;
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
      const maxR = GRID_SIZE - (dr === 0 ? 0 : word.length - 1);
      const maxC = GRID_SIZE - (dc === 0 ? 0 : word.length - 1);
      if (maxR <= 0 || maxC <= 0) continue;
      const r = Math.floor(Math.random() * maxR);
      const c = Math.floor(Math.random() * maxC);
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const nr = r + i * dr, nc = c + i * dc;
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) { ok = false; break; }
      }
      if (ok) {
        for (let i = 0; i < word.length; i++) grid[r + i*dr][c + i*dc] = word[i];
        placed.push(word);
        break;
      }
    }
  }

  return grid.map(row => row.map(letter => ({ letter, found: false, selected: false })));
}

interface Props { onClose: () => void; }

type GameState = 'waiting' | 'playing' | 'finished';

export default function WordSearch({ onClose }: Props) {
  const [state, setState] = useState<GameState>('waiting');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selecting, setSelecting] = useState(false);
  const [selStart, setSelStart] = useState<[number,number] | null>(null);
  const [selCells, setSelCells] = useState<[number,number][]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [score, setScore] = useState(0);
  const [targets] = useState(() => TARGET_WORDS.sort(() => Math.random() - 0.5).slice(0, 6));

  const startGame = useCallback(() => {
    setGrid(buildGrid(targets));
    setFoundWords([]);
    setSelStart(null);
    setSelCells([]);
    setSelecting(false);
    setScore(0);
    setTimeLeft(120);
    setState('playing');
  }, [targets]);

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

  useEffect(() => {
    if (foundWords.length >= targets.length && state === 'playing') {
      setState('finished');
    }
  }, [foundWords, targets, state]);

  const getCellsBetween = (r1: number, c1: number, r2: number, c2: number): [number,number][] => {
    const cells: [number,number][] = [];
    const dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1);
    if (dr === 0 && dc === 0) return [[r1,c1]];
    const steps = Math.max(Math.abs(r2-r1), Math.abs(c2-c1));
    if (dr !== 0 && dc !== 0 && Math.abs(r2-r1) !== Math.abs(c2-c1)) return [];
    for (let i = 0; i <= steps; i++) cells.push([r1 + i*dr, c1 + i*dc]);
    return cells;
  };

  const handleMouseDown = (r: number, c: number) => {
    if (state !== 'playing') return;
    setSelecting(true);
    setSelStart([r, c]);
    setSelCells([[r, c]]);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (!selecting || !selStart) return;
    const cells = getCellsBetween(selStart[0], selStart[1], r, c);
    setSelCells(cells);
  };

  const handleMouseUp = () => {
    if (!selecting || selCells.length === 0) return;
    setSelecting(false);
    const word = selCells.map(([r,c]) => grid[r][c].letter).join('');
    const wordRev = word.split('').reverse().join('');

    const matched = targets.find(t => (t === word || t === wordRev) && !foundWords.includes(t));
    if (matched) {
      setFoundWords(fw => [...fw, matched]);
      setScore(s => s + matched.length * 15);
      setGrid(prev => prev.map((row, ri) =>
        row.map((cell, ci) =>
          selCells.some(([sr,sc]) => sr===ri && sc===ci) ? {...cell, found: true, selected: false} : cell
        )
      ));
    }
    setSelCells([]);
    setSelStart(null);
  };

  const isCellSelected = (r: number, c: number) => selCells.some(([sr,sc]) => sr===r && sc===c);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-md animate-scale-in">

        {state === 'waiting' && (
          <div className="game-card rounded-3xl p-8 text-center border-neon-green/20">
            <div className="text-5xl mb-4 animate-float">🔍</div>
            <h2 className="font-orbitron text-2xl font-black text-white mb-2">Охота на слова</h2>
            <p className="text-gray-400 font-ibm text-sm mb-6">
              Найди {targets.length} английских слов в сетке букв.<br/>
              120 секунд · Выделяй мышкой или пальцем
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-500 font-orbitron text-sm hover:border-gray-500 transition-all">Назад</button>
              <button onClick={startGame} className="flex-1 py-3 rounded-xl font-orbitron font-bold text-sm border border-neon-green/50 bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-all">Играть!</button>
            </div>
          </div>
        )}

        {state === 'playing' && (
          <div className="game-card rounded-3xl p-5 border-neon-green/20">
            <div className="flex items-center justify-between mb-4">
              <div className="neon-text-green font-orbitron font-bold text-sm">{score} pts</div>
              <div className="flex items-center gap-1 font-orbitron text-sm">
                <Icon name="Clock" size={13} fallback="Circle" className={timeLeft <= 20 ? 'text-red-400' : 'text-neon-cyan'} />
                <span className={timeLeft <= 20 ? 'text-red-400' : 'neon-text-cyan'}>{timeLeft}с</span>
              </div>
              <div className="text-gray-500 text-xs font-ibm">{foundWords.length}/{targets.length} слов</div>
            </div>

            {/* Words to find */}
            <div className="flex flex-wrap gap-2 mb-4">
              {targets.map(w => (
                <span key={w} className={`text-xs font-orbitron font-bold px-2 py-1 rounded border transition-all ${
                  foundWords.includes(w)
                    ? 'border-neon-green/50 bg-neon-green/10 text-neon-green line-through opacity-60'
                    : 'border-gray-700 text-gray-400'
                }`}>{w}</span>
              ))}
            </div>

            {/* Grid */}
            <div
              className="select-none touch-none"
              onMouseLeave={() => { if (selecting) handleMouseUp(); }}
            >
              {grid.map((row, ri) => (
                <div key={ri} className="flex gap-1 mb-1">
                  {row.map((cell, ci) => (
                    <div
                      key={ci}
                      onMouseDown={() => handleMouseDown(ri, ci)}
                      onMouseEnter={() => handleMouseEnter(ri, ci)}
                      onMouseUp={handleMouseUp}
                      onTouchStart={(e) => { e.preventDefault(); handleMouseDown(ri, ci); }}
                      onTouchMove={(e) => {
                        e.preventDefault();
                        const t = e.touches[0];
                        const el = document.elementFromPoint(t.clientX, t.clientY);
                        if (el) {
                          const r = parseInt(el.getAttribute('data-r') || '-1');
                          const c = parseInt(el.getAttribute('data-c') || '-1');
                          if (r >= 0 && c >= 0) handleMouseEnter(r, c);
                        }
                      }}
                      onTouchEnd={(e) => { e.preventDefault(); handleMouseUp(); }}
                      data-r={ri}
                      data-c={ci}
                      className={`flex-1 aspect-square flex items-center justify-center rounded text-xs font-orbitron font-bold cursor-pointer transition-all select-none ${
                        cell.found
                          ? 'bg-neon-green/20 border border-neon-green/50 text-neon-green'
                          : isCellSelected(ri, ci)
                          ? 'bg-neon-cyan/30 border border-neon-cyan/60 text-white scale-110'
                          : 'border border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                      }`}
                      style={{ userSelect: 'none' }}
                    >
                      {cell.letter}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {state === 'finished' && (
          <div className="game-card rounded-3xl p-8 text-center border-neon-green/20">
            <div className="text-5xl mb-3">{foundWords.length >= targets.length ? '🎉' : '🔍'}</div>
            <h2 className="font-orbitron text-xl font-black text-white mb-1">
              {foundWords.length >= targets.length ? 'Все слова найдены!' : 'Время вышло!'}
            </h2>
            <div className="font-orbitron text-5xl font-black neon-text-green my-4">{score}</div>
            <div className="text-gray-400 font-ibm text-sm mb-2">найдено {foundWords.length} из {targets.length} слов</div>
            <div className="flex justify-center gap-2 flex-wrap mb-6">
              {foundWords.map(w => <span key={w} className="text-xs font-orbitron text-neon-green border border-neon-green/30 px-2 py-0.5 rounded">{w}</span>)}
            </div>
            <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-3 mb-8">
              <div className="text-yellow-400 font-orbitron font-bold text-lg">+{Math.round(score / 5)} XP</div>
              <div className="text-gray-600 text-xs font-ibm">получено</div>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-500 font-orbitron text-sm">Выйти</button>
              <button onClick={startGame} className="flex-1 py-3 rounded-xl font-orbitron font-bold text-sm border border-neon-green/50 bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-all">Ещё раз</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
