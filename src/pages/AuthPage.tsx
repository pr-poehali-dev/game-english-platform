import { useState } from 'react';
import Icon from '@/components/ui/icon';

const AUTH_URL = 'https://functions.poehali.dev/703300cb-b771-4ebc-b319-69ff6b3c5430';

export interface User {
  id: number;
  username: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
}

interface AuthPageProps {
  onAuth: (user: User, token: string) => void;
}

type Mode = 'login' | 'register';

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
    setUsername('');
    setEmail('');
    setLogin('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await fetch(`${AUTH_URL}?action=register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'register', username, email, password }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Ошибка регистрации'); return; }
        localStorage.setItem('ge_token', data.token);
        onAuth(data.user, data.token);
      } else {
        const res = await fetch(`${AUTH_URL}?action=login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', login, password }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Ошибка входа'); return; }
        localStorage.setItem('ge_token', data.token);
        onAuth(data.user, data.token);
      }
    } catch {
      setError('Нет соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-game-dark grid-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed inset-0 scanlines pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl border border-neon-cyan/50 flex items-center justify-center bg-neon-cyan/10">
              <span className="text-neon-cyan font-orbitron font-black text-lg">G</span>
            </div>
            <span className="font-orbitron font-black text-2xl text-white">
              GAME<span className="neon-text-cyan">ENGLISH</span>
            </span>
          </div>
          <p className="text-gray-500 font-ibm text-sm">Учи английский как в игре</p>
        </div>

        {/* Card */}
        <div className="game-card rounded-3xl p-8 border-neon-cyan/15 animate-scale-in">
          {/* Tab switcher */}
          <div className="flex rounded-xl border border-gray-800 p-1 mb-7 bg-black/20">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-orbitron font-bold transition-all ${
                mode === 'login'
                  ? 'bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan'
                  : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 py-2 rounded-lg text-sm font-orbitron font-bold transition-all ${
                mode === 'register'
                  ? 'bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan'
                  : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-orbitron text-gray-500 mb-1.5 uppercase tracking-wider">Имя игрока</label>
                <div className="relative">
                  <Icon name="User" size={15} fallback="Circle" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="DragonSlayer"
                    required
                    className="w-full bg-black/30 border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-white font-ibm text-sm placeholder-gray-700 focus:outline-none focus:border-neon-cyan/50 focus:bg-neon-cyan/5 transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-orbitron text-gray-500 mb-1.5 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Icon name="Mail" size={15} fallback="Circle" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="player@example.com"
                    required
                    className="w-full bg-black/30 border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-white font-ibm text-sm placeholder-gray-700 focus:outline-none focus:border-neon-cyan/50 focus:bg-neon-cyan/5 transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div>
                <label className="block text-xs font-orbitron text-gray-500 mb-1.5 uppercase tracking-wider">Логин или Email</label>
                <div className="relative">
                  <Icon name="User" size={15} fallback="Circle" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                    placeholder="DragonSlayer или email"
                    required
                    className="w-full bg-black/30 border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-white font-ibm text-sm placeholder-gray-700 focus:outline-none focus:border-neon-cyan/50 focus:bg-neon-cyan/5 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-orbitron text-gray-500 mb-1.5 uppercase tracking-wider">Пароль</label>
              <div className="relative">
                <Icon name="Lock" size={15} fallback="Circle" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Минимум 6 символов' : '••••••••'}
                  required
                  className="w-full bg-black/30 border border-gray-700 rounded-xl pl-9 pr-10 py-3 text-white font-ibm text-sm placeholder-gray-700 focus:outline-none focus:border-neon-cyan/50 focus:bg-neon-cyan/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  <Icon name={showPass ? 'EyeOff' : 'Eye'} size={15} fallback="Circle" />
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm font-ibm flex items-center gap-2">
                <Icon name="AlertCircle" size={15} fallback="Circle" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-solid-cyan py-3.5 rounded-xl font-orbitron font-bold text-sm tracking-wider disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-game-dark/30 border-t-game-dark rounded-full animate-spin" />
                  {mode === 'register' ? 'Создаём аккаунт...' : 'Входим...'}
                </span>
              ) : (
                mode === 'register' ? 'Создать аккаунт' : 'Войти в игру'
              )}
            </button>
          </form>

          <p className="text-center text-gray-700 text-xs font-ibm mt-5">
            {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-neon-cyan hover:text-white transition-colors"
            >
              {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
