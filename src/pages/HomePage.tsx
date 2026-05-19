import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

type Page = 'home' | 'lessons' | 'games' | 'rating' | 'achievements' | 'stats';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const stats = [
  { label: 'Игроков онлайн', value: '12,847', icon: 'Users', color: 'cyan' },
  { label: 'Уроков пройдено', value: '1.2M', icon: 'BookOpen', color: 'purple' },
  { label: 'Слов изучено', value: '45M+', icon: 'Brain', color: 'green' },
  { label: 'Стран участников', value: '87', icon: 'Globe', color: 'pink' },
];

const features = [
  { icon: 'Gamepad2', title: 'Игровые механики', desc: 'Очки, уровни, боссы — учёба превращается в приключение', color: 'cyan' },
  { icon: 'Trophy', title: 'Реальный рейтинг', desc: 'Соревнуйся с игроками по всему миру, фильтр по уровню', color: 'yellow' },
  { icon: 'Zap', title: 'Быстрый прогресс', desc: '15 минут в день — и уже через месяц ты на новом уровне', color: 'green' },
  { icon: 'Award', title: 'Достижения', desc: 'Более 200 уникальных наград за прогресс и мастерство', color: 'purple' },
];

const topPlayers = [
  { name: 'DragonSlayer', level: 48, xp: 128400, country: '🇷🇺' },
  { name: 'NightOwl_99', level: 45, xp: 115200, country: '🇰🇿' },
  { name: 'WordMaster', level: 43, xp: 98700, country: '🇧🇾' },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; duration: number }[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
    }));
    setParticles(p);
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 rounded-full bg-neon-cyan/40"
            style={{
              left: `${p.x}%`,
              bottom: 0,
              animation: `particle-float ${p.duration}s ${p.delay}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Big glow behind hero */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-neon-cyan/5 blur-[100px]" />
        </div>

        <div className={`text-center max-w-4xl mx-auto relative z-10 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/40 bg-neon-green/5 text-neon-green text-xs font-orbitron mb-8 animate-glow-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            ВЕРСИЯ 1.0 — БЕТА ДОСТУПНА
          </div>

          {/* Title */}
          <h1 className="font-orbitron text-5xl sm:text-7xl font-black mb-4 leading-none tracking-tight">
            <span className="text-white">УЧИ</span>{' '}
            <span className="neon-text-cyan animate-neon-flicker">ENGLISH</span>
            <br />
            <span className="text-white">КАК В </span>
            <span className="neon-text-purple">ИГРЕ</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl font-ibm font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Рейтинги, достижения, игровые механики — забудь про скучные учебники.
            <br />
            <span className="text-gray-300">Прогрессируй каждый день и становись топ-игроком.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate('games')}
              className="btn-solid-cyan px-8 py-4 rounded-xl text-base font-bold uppercase tracking-wider"
            >
              Начать играть
            </button>
            <button
              onClick={() => onNavigate('rating')}
              className="btn-neon-purple px-8 py-4 rounded-xl text-base uppercase tracking-wider"
            >
              Смотреть рейтинг
            </button>
          </div>

          {/* Mini stats row */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className="game-card rounded-xl p-4 text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Icon name={s.icon} size={20} fallback="Circle" className={`mx-auto mb-2 ${
                  s.color === 'cyan' ? 'text-neon-cyan' :
                  s.color === 'purple' ? 'text-neon-purple' :
                  s.color === 'green' ? 'text-neon-green' : 'text-neon-pink'
                }`} />
                <div className={`font-orbitron font-bold text-xl ${
                  s.color === 'cyan' ? 'neon-text-cyan' :
                  s.color === 'purple' ? 'neon-text-purple' :
                  s.color === 'green' ? 'neon-text-green' : 'text-neon-pink'
                }`}>{s.value}</div>
                <div className="text-gray-500 text-xs font-ibm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white mb-3">
              ЧТО ДЕЛАЕТ НАС <span className="neon-text-cyan">ОСОБЕННЫМИ</span>
            </h2>
            <p className="text-gray-500 font-ibm">Игровой подход к изучению языка</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="game-card rounded-2xl p-6 group">
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center border ${
                  f.color === 'cyan' ? 'border-neon-cyan/30 bg-neon-cyan/10' :
                  f.color === 'yellow' ? 'border-yellow-400/30 bg-yellow-400/10' :
                  f.color === 'green' ? 'border-neon-green/30 bg-neon-green/10' :
                  'border-neon-purple/30 bg-neon-purple/10'
                }`}>
                  <Icon name={f.icon} size={22} fallback="Star" className={
                    f.color === 'cyan' ? 'text-neon-cyan' :
                    f.color === 'yellow' ? 'text-yellow-400' :
                    f.color === 'green' ? 'text-neon-green' : 'text-neon-purple'
                  } />
                </div>
                <h3 className="font-orbitron text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm font-ibm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Players Preview */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-orbitron text-2xl font-bold text-white">ТОП ИГРОКОВ</h2>
              <p className="text-gray-500 text-sm font-ibm mt-1">Лучшие прямо сейчас</p>
            </div>
            <button
              onClick={() => onNavigate('rating')}
              className="btn-neon-cyan px-4 py-2 rounded-lg text-sm"
            >
              Весь рейтинг
            </button>
          </div>

          <div className="space-y-3">
            {topPlayers.map((p, i) => (
              <div key={i} className="game-card rounded-xl p-4 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-black text-sm ${
                  i === 0 ? 'bg-yellow-400/20 border border-yellow-400/50 rank-gold' :
                  i === 1 ? 'bg-gray-400/20 border border-gray-400/50 rank-silver' :
                  'bg-orange-400/20 border border-orange-400/50 rank-bronze'
                }`}>{i + 1}</div>

                <div className="text-2xl">{p.country}</div>

                <div className="flex-1">
                  <div className="font-orbitron text-sm font-bold text-white">{p.name}</div>
                  <div className="text-gray-500 text-xs font-ibm">Уровень {p.level}</div>
                </div>

                <div className="text-right">
                  <div className="neon-text-cyan font-orbitron text-sm font-bold">{p.xp.toLocaleString()}</div>
                  <div className="text-gray-600 text-xs font-ibm">очков</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="game-card rounded-3xl p-10 text-center border-neon-cyan/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-purple/5 pointer-events-none" />
            <h2 className="font-orbitron text-3xl font-black text-white mb-3 relative z-10">
              ГОТОВ СТАТЬ <span className="neon-text-cyan">ЛЕГЕНДОЙ?</span>
            </h2>
            <p className="text-gray-400 font-ibm mb-8 relative z-10">Присоединяйся к 12,000+ игрокам и начни свой путь к мастерству</p>
            <button
              onClick={() => onNavigate('lessons')}
              className="btn-solid-cyan px-10 py-4 rounded-xl text-base font-bold uppercase tracking-wider relative z-10"
            >
              Начать бесплатно
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
