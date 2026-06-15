import type { FC } from 'react';
import { MOVIES_DATA } from '../../../data/movies';
import { useAccessibility } from '../../../shared/context/AccessibilityContext';
import { useAutoFocus } from '../../../shared/hooks/useAutoFocus';
import { type ViewRoute } from '../../../shared/types/navigation';

interface MovieDetailViewProps {
  movieId: number;
  onNavigate: (route: ViewRoute) => void;
}

export const MovieDetailView: FC<MovieDetailViewProps> = ({ movieId, onNavigate }) => {
  const headingRef = useAutoFocus<HTMLHeadingElement>();
  const { cognitiveMode } = useAccessibility();
  const selectedMovie = MOVIES_DATA.find((movie) => movie.id === movieId) ?? MOVIES_DATA[0];
  const movieTitle = selectedMovie.format ? `${selectedMovie.title} (${selectedMovie.format})` : selectedMovie.title;
  
  return (
    <div id="main-content" className="w-full bg-black min-h-screen text-white animate-in fade-in duration-500">
      <section className="w-full bg-black">
  <div className="max-w-6xl mx-auto px-6 pt-8">
<div className="mt-8 flex flex-col md:flex-row justify-between gap-6">
      <div>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-4xl md:text-5xl font-black uppercase"
        >
          {movieTitle}
        </h1>

        <p className="text-zinc-400 mt-3">
          {selectedMovie.duration ?? '2 hrs 7 min'} •
          {' '}{selectedMovie.rating ?? 'APT'} •
          {' '}{selectedMovie.genre ?? 'Cine'}
        </p>
      </div>

      
    </div>

    <div className="overflow-hidden rounded-2xl border border-zinc-800 shadow-[0_0_40px_rgba(220,38,38,0.25)]">
      <div className="aspect-video">
        {selectedMovie.trailerId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${selectedMovie.trailerId}?cc_load_policy=1&cc_lang_pref=es&rel=0`}
            title={`Trailer de ${selectedMovie.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            src={selectedMovie.imageUrl}
            alt={selectedMovie.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
    </div>

    
  </div>
  
</section>


      <main className="max-w-5xl mx-auto px-6 py-12">
      


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="w-full aspect-[2/3] rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
            <img src={selectedMovie.imageUrl} alt={movieTitle} className="w-full h-full object-cover" />
          </div>

          <div className="md:col-span-2 bg-zinc-950 text-white p-8 md:p-12 rounded-2xl shadow-2xl border border-zinc-800">
            <h2 tabIndex={0} className="text-3xl font-black text-red-500 tracking-tight mb-6 uppercase">
              SINOPSIS
            </h2>
            <p className="text-zinc-300 text-lg leading-8">
              {selectedMovie.synopsis}
            </p>
            {cognitiveMode && (
              <ul className="mt-6 grid gap-3 text-sm font-semibold text-zinc-900" aria-label="Resumen simple de la pelicula">
                <li>Genero: {selectedMovie.genre ?? 'Cine'}</li>
                <li>Duracion: {selectedMovie.duration ?? 'aproximada'}</li>
                <li>Formato: {selectedMovie.format ?? 'DOB'}</li>
              </ul>
            )}

            
          </div>
            <button
        type="button"
        onClick={() => onNavigate('booking')}
        className="bg-red-700 hover:bg-red-600 hover:scale-105 transition-all duration-300 text-white font-bold px-8 py-3 rounded-lg"
      >
        Comprar entradas
      </button>
        </div>

      </main>
    </div>
  );
};
