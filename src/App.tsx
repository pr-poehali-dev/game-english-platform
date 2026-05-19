import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Icon from '@/components/ui/icon';
import AuthPage, { User } from './pages/AuthPage';
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import GamesPage from './pages/GamesPage';
import RatingPage from './pages/RatingPage';
import AchievementsPage from './pages/AchievementsPage';
import StatsPage from './pages/StatsPage';

const AUTH_URL = 'https://functions.poehali.dev/703300cb-b771-4ebc-b319-69ff6b3c5430';

type Page = 'home' | 'lessons' | 'games' | 'rating' | 'achievements' | 'stats';

const navItems = [
  { id: 'home' as Page, label: 'Главная', icon: 'Home' },
  { id: 'lessons' as Page, label: 'Уроки', icon: 'BookOpen' },
  { id: 'games' as Page, label: 'Игры', icon: 'Gamepad2' },
  { id: 'rating' as Page, label: 'Рейтинг', icon: 'Trophy' },
  { id: 'achievements' as Page, label: 'Достижения', icon: 'Award' },
  { id: 'stats' as Page, label: 'Статистика', icon: 'BarChart3' },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [authChecked, setAuthChecked] = useState(false);
  const [activePage, setActivePage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Проверяем сохранённый токен при загрузке
  useEffect(() => {
    const saved = localStorage.getItem('ge_token');
    if (!saved) { setAuthChecked(true); return; }
    fetch(`${AUTH_URL}?action=me`, {
      headers: { 'Authorization': `Bearer ${saved}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.user) { setUser(data.user); setToken(saved); }
        else { localStorage.removeItem('ge_token'); }
      })
      .catch(() => { localStorage.removeItem('ge_token'); })
      .finally(() => setAuthChecked(true));
  }, []);

  const handleAuth = (u: User, t: string) => {
    setUser(u);
    setToken(t);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${AUTH_URL}?action=logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch { /* ignore */ }
    localStorage.removeItem('ge_token');
    setUser(null);
    setToken('');
    setActivePage('home');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage onNavigate={setActivePage} />;
      case 'lessons': return <LessonsPage />;
      case 'games': return <GamesPage />;
      case 'rating': return <RatingPage />;
      case 'achievements': return <AchievementsPage />;
      case 'stats': return <StatsPage />;
    }
  };

  // Ещё проверяем токен
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-game-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
          <span className="text-gray-600 font-orbitron text-xs">ЗАГРУЗКА...</span>
        </div>
      </div>
    );
  }

  // Не авторизован — показываем экран входа
  if (!user) {
    return (
      <TooltipProvider>
        <Toaster />
        <AuthPage onAuth={handleAuth} />
      </TooltipProvider>
    );
  }

  // Авторизован — основное приложение
  return (
    <TooltipProvider>
      <Toaster />
      <div className="min-h-screen bg-game-dark grid-bg relative">
        <div className="fixed inset-0 scanlines pointer-events-none z-0" />
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed top-1/3 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 left-1/2 w-64 h-64 bg-neon-green/3 rounded-full blur-3xl pointer-events-none" />

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neon-cyan/10 bg-game-dark/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <button onClick={() => setActivePage('home')} className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded border border-neon-cyan/50 flex items-center justify-center bg-neon-cyan/10 group-hover:bg-neon-cyan/20 transition-all">
                  <span className="text-neon-cyan text-sm font-orbitron font-bold">G</span>
                </div>
                <span className="font-orbitron font-bold text-white text-lg hidden sm:block">
                  GAME<span className="neon-text-cyan">ENGLISH</span>
                </span>
              </button>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-ibm transition-all duration-200 ${
                      activePage === item.id
                        ? 'text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon name={item.icon} size={15} fallback="Circle" />
                    {item.label}
                  </button>
                ))}
              </div>

              {/* User badge */}
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neon-purple/30 bg-neon-purple/5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-game-dark">{user.username[0].toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-ibm text-gray-300 max-w-[100px] truncate">{user.username}</span>
                  <span className="text-xs neon-text-green font-orbitron shrink-0">LVL {user.level}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Выйти"
                  className="p-2 rounded-lg border border-gray-800 text-gray-600 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <Icon name="LogOut" size={15} fallback="Circle" />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={20} fallback="Menu" />
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-neon-cyan/10 bg-game-dark/95 backdrop-blur-xl">
              {/* User info */}
              <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                    <span className="text-xs font-bold text-game-dark">{user.username[0].toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-ibm text-white">{user.username}</span>
                  <span className="text-xs neon-text-green font-orbitron">LVL {user.level}</span>
                </div>
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-400 transition-colors text-xs font-ibm flex items-center gap-1">
                  <Icon name="LogOut" size={13} fallback="Circle" /> Выйти
                </button>
              </div>
              <div className="px-4 py-3 grid grid-cols-3 gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActivePage(item.id); setMobileMenuOpen(false); }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg text-xs font-ibm transition-all ${
                      activePage === item.id
                        ? 'text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon name={item.icon} size={18} fallback="Circle" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        <main className="pt-16 pb-16 md:pb-0 relative z-10">
          {renderPage()}
        </main>

        {/* Bottom mobile nav */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 border-t border-neon-cyan/10 bg-game-dark/95 backdrop-blur-xl">
          <div className="grid grid-cols-6 gap-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-all ${
                  activePage === item.id ? 'text-neon-cyan' : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                <Icon name={item.icon} size={18} fallback="Circle" />
                <span className="text-[9px] font-ibm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
