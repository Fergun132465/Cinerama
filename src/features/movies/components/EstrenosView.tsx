import type { FC } from "react";
import { MOVIES_DATA, UPCOMING_MOVIES_DATA } from "../../../data/movies";
import { MovieCard } from "../../../shared/components/MovieCard";
import { useAutoFocus } from "../../../shared/hooks/useAutoFocus";
import { useSpeakOnHover } from "../../../shared/hooks/useSpeakOnHover";
import { type ViewRoute } from "../../../shared/types/navigation";

interface EstrenosViewProps {
  onNavigate: (route: ViewRoute, movieId?: number) => void;
}

export const EstrenosView: FC<EstrenosViewProps> = ({ onNavigate }) => {
  const headingRef = useAutoFocus<HTMLHeadingElement>();
  const { speak, stop } = useSpeakOnHover();

  return (
    <div
      id="main-content"
      className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-500 space-y-16"
    >
      <section aria-labelledby="title-cartelera">
        <h1
          id="title-cartelera"
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-black tracking-tight text-white uppercase mb-10 focus:outline-none"
        >
          CARTELERA
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10">
          {MOVIES_DATA.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      <section aria-labelledby="title-proximos" className="pt-4">
        <h2
          id="title-proximos"
          tabIndex={0}
          className="text-3xl font-black tracking-tight text-white uppercase mb-10 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
        >
          PRÓXIMOS ESTRENOS
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10 mb-10">
          {UPCOMING_MOVIES_DATA.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onNavigate={onNavigate} isUpcoming />
          ))}
        </div>

        <div className="flex justify-start">
          <div
            className="group relative cursor-default"
            onMouseEnter={() => speak("Próximamente")}
            onMouseLeave={stop}
          >
           
            <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-black text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap z-10">
              Próximamente en cines
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
