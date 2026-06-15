import { useMemo, useState } from 'react';
import { ContactanosView } from '../features/contact/components/ContactanosView';
import { CinesView } from '../features/cinemas/components/CinesView';
import { BookingStepper } from '../features/booking/components/BookingStepper';
import { DulceriaView } from '../features/dulceria/components/DulceriaView';
import { EstrenosView } from '../features/movies/components/EstrenosView';
import { MovieDetailView } from '../features/movies/components/MovieDetailView';
import { HeroBanner } from '../shared/components/HeroBanner';
import { MovieCard } from '../shared/components/MovieCard';
import { Navbar } from '../shared/components/Navbar';
import { AccessibilityPanel } from '../shared/components/AccessibilityPanel';
import { AccessibilityStatus } from '../shared/components/AccessibilityStatus';
import { useAutoFocus } from '../shared/hooks/useAutoFocus';
import { MOVIES_DATA } from '../data/movies';
import { type ViewRoute } from '../shared/types/navigation';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewRoute>('inicio');
  const [selectedMovieId, setSelectedMovieId] = useState<number>(1);
  const homeHeadingRef = useAutoFocus<HTMLHeadingElement>(currentView);

  const selectedMovie = useMemo(
    () => MOVIES_DATA.find((movie) => movie.id === selectedMovieId) ?? MOVIES_DATA[0],
    [selectedMovieId],
  );

  const currentViewAnnouncement = useMemo(() => {
    switch (currentView) {
      case 'inicio':
        return 'Vista de inicio. Sección de películas destacadas.';
      case 'estrenos':
        return 'Vista de estrenos. Primero cartelera actual y luego próximos estrenos.';
      case 'dulceria':
        return 'Vista de dulceria. Revisa snacks, canchita, combos y bebidas.';
      case 'cines':
        return 'Vista de cines. Lista de sedes disponibles.';
      case 'contactanos':
        return 'Vista contáctanos. Formulario de consultas e incidencias.';
      case 'detalle':
        return `Vista de detalle de la película ${selectedMovie.title}.`;
      case 'booking':
        return `Vista de compra para ${selectedMovie.title}. Selecciona primero una fecha y luego un horario.`;
      default:
        return 'Vista actualizada.';
    }
  }, [currentView, selectedMovie.title]);

  const handleNavigation = (route: ViewRoute, movieId?: number) => {
    if (movieId) {
      setSelectedMovieId(movieId);
    }
    setCurrentView(route);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-red-700 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Saltar al contenido principal
      </a>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {currentViewAnnouncement}
      </div>

      <Navbar onNavigate={(route) => handleNavigation(route)} currentView={currentView} />
      <AccessibilityPanel />
      

      {currentView === 'inicio' && (
        <>
          <HeroBanner />
          <main id="main-content" className="max-w-6xl mx-auto px-6 py-12" aria-labelledby="home-movies-heading">
            <h1 ref={homeHeadingRef} tabIndex={-1} className="sr-only">
              Inicio de Cinerama
            </h1>
            <h2
              id="home-movies-heading"
              tabIndex={0}
              className="text-2xl md:text-3xl font-black tracking-wide mb-10 uppercase border-l-4 border-red-600 pl-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
            >
              Películas
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10">
              {MOVIES_DATA.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onNavigate={handleNavigation} />
              ))}
            </div>
          </main>
        </>
      )}

      {currentView === 'estrenos' && <EstrenosView onNavigate={handleNavigation} />}

      {currentView === 'dulceria' && <DulceriaView onNavigate={handleNavigation} />}
      
      {currentView === 'contactanos' && <ContactanosView onNavigate={(route) => handleNavigation(route)} />}
      
      {currentView === 'cines' && <CinesView onNavigate={handleNavigation} />}

      {currentView === 'detalle' && (
        <MovieDetailView movieId={selectedMovieId} onNavigate={handleNavigation} />
      )}

      {currentView === 'booking' && (
        <BookingStepper movieId={selectedMovieId} onNavigate={handleNavigation} />
      )}
      <AccessibilityStatus />

      <footer className="w-full bg-zinc-950 py-10 text-center border-t border-zinc-900 mt-10">
        <p className="text-zinc-600 text-xs tracking-widest uppercase font-bold">
          &copy; {new Date().getFullYear()} Cinerama Prototipo - Hombre-Máquina.
        </p>
      </footer>
    </div>
  );
}
