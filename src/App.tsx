import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Icon from '@/components/ui/icon';
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import GamesPage from './pages/GamesPage';
import RatingPage from './pages/RatingPage';
import AchievementsPage from './pages/AchievementsPage';
import StatsPage from './pages/StatsPage';

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
  const [activePage, setActivePage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <TooltipProvider>
      <Toaster />
      <div className="min-h-screen bg-game-dark grid-bg relative">
        {/* Scanlines overlay */}
        <div className="fixed inset-0 scanlines pointer-events-none z-0" />

        {/* Ambient glow effects */}
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
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neon-purple/30 bg-neon-purple/5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                    <span className="text-xs font-bold text-game-dark">А</span>
                  </div>
                  <span className="text-sm font-ibm text-gray-300">Алекс</span>
                  <span className="text-xs neon-text-green font-orbitron">LVL 12</span>
                </div>
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

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-neon-cyan/10 bg-game-dark/95 backdrop-blur-xl">
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

        {/* Page content */}
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
