import { useEffect, useRef, useState, type FC } from 'react';
import { useSpeakOnHover } from '../hooks/useSpeakOnHover';
import { type ViewRoute } from '../types/navigation';

interface NavbarProps {
  onNavigate: (route: ViewRoute) => void;
  currentView: ViewRoute;
}

const navItems: Array<{ route: ViewRoute; label: string }> = [
  { route: 'inicio', label: 'Inicio' },
  { route: 'estrenos', label: 'Estrenos' },
  { route: 'dulceria', label: 'Dulcería' },
  { route: 'cines', label: 'Cines' },
  { route: 'contactanos', label: 'Contáctanos' },
];

export const Navbar: FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { speak, stop } = useSpeakOnHover();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!menuOpen) return;
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleNavigate = (route: ViewRoute) => {
    setMenuOpen(false);
    onNavigate(route);
  };

  const menuToggleLabel = menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación';

  return (
    <header ref={headerRef} className="w-full bg-black py-5 px-6 md:px-12 border-b border-zinc-900 sticky top-0 z-50">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => handleNavigate('inicio')}
          onMouseEnter={() => speak('Ir al inicio de Cinerama')}
          onFocus={() => speak('Ir al inicio de Cinerama')}
          onMouseLeave={stop}
          onBlur={stop}
          aria-label="Ir al inicio de Cinerama"
          className="rounded px-1 text-2xl font-black tracking-wider text-red-600 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        >
          CINERAMA
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          onMouseEnter={() => speak(menuToggleLabel)}
          onFocus={() => speak(menuToggleLabel)}
          onMouseLeave={stop}
          onBlur={stop}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="md:hidden inline-flex items-center justify-center rounded border border-zinc-800 p-2 text-zinc-300 hover:border-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        >
          <span className="sr-only">{menuToggleLabel}</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav aria-label="Navegación principal" className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
          {navItems.map((item) => (
            <button
              key={item.route}
              type="button"
              onClick={() => handleNavigate(item.route)}
              onMouseEnter={() => speak(item.label)}
              onFocus={() => speak(item.label)}
              onMouseLeave={stop}
              onBlur={stop}
              aria-current={currentView === item.route ? 'page' : undefined}
              className={`focus:outline-none focus-visible:underline rounded transition-colors ${
                currentView === item.route ? 'text-red-600' : 'text-zinc-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <button
          type="button"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden focus:outline-none"
          tabIndex={-1}
        />
      )}

      <div
        id="mobile-menu"
        aria-label="Menú de navegación móvil"
        className={`relative mt-4 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-4 shadow-xl md:hidden transition-[max-height,opacity,transform] duration-200 ease-out ${
          menuOpen ? 'max-h-[28rem] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-[0.98]'
        }`}
        style={{ willChange: 'max-height, opacity, transform' }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Menú</p>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            onMouseEnter={() => speak('Cerrar menú de navegación')}
            onFocus={() => speak('Cerrar menú de navegación')}
            onMouseLeave={stop}
            onBlur={stop}
            aria-label="Cerrar menú de navegación"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:border-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className={`space-y-3 ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          {navItems.map((item) => (
            <button
              key={item.route}
              type="button"
              onClick={() => handleNavigate(item.route)}
              onMouseEnter={() => speak(item.label)}
              onFocus={() => speak(item.label)}
              onMouseLeave={stop}
              onBlur={stop}
              aria-current={currentView === item.route ? 'page' : undefined}
              className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-bold tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                currentView === item.route ? 'bg-red-700 text-white' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
