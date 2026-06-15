import type { FC } from "react";
import { useSpeakOnHover } from "../hooks/useSpeakOnHover";
import { type Movie } from "../types/movie";
import { type ViewRoute } from "../types/navigation";

interface MovieCardProps {
  movie: Movie;
  onNavigate: (route: ViewRoute, movieId?: number) => void;
  isUpcoming?: boolean;
}

export const MovieCard: FC<MovieCardProps> = ({
  movie,
  onNavigate,
  isUpcoming,
}) => {
  const titleId = `movie-card-title-${movie.id}`;
  const { speak, stop } = useSpeakOnHover();

  return (
    <article aria-labelledby={titleId} className="flex flex-col items-center">
      <h3
        id={titleId}
        tabIndex={0}
        onMouseEnter={() => speak(movie.title)}
        onFocus={() => speak(movie.title)}
        onMouseLeave={stop}
        onBlur={stop}
        className="order-2 text-zinc-300 font-bold text-sm tracking-wide mt-3 text-center uppercase truncate w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
      >
        {movie.title}
      </h3>
      {movie.releaseDate && (
        <p className="order-3 mt-1 w-full text-center text-[11px] font-semibold uppercase tracking-wide text-red-400">
          {movie.releaseDate}
        </p>
      )}

      <div className="order-1 group relative w-full aspect-[2/3] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 transition-transform duration-300 hover:-translate-y-1">
        <img
          src={movie.imageUrl}
          alt={`Póster de ${movie.title}`}
          className="w-full h-full object-cover transition-all duration-300 group-hover:blur-md group-hover:scale-105 group-focus-within:blur-md group-focus-within:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          {" "}
          {isUpcoming ? (
            <div className="text-center">
              {" "}
              <p
                onMouseEnter={() => speak("Próximamente")}
                onMouseLeave={stop}
                className="text-white font-black text-lg uppercase"
              >
                {" "}
                Próximamente{" "}
              </p>{" "}
              {movie.releaseDate && (
                <p className="mt-2 text-red-400 text-sm font-semibold">
                  {" "}
                  Disponible el {movie.releaseDate}{" "}
                </p>
              )}{" "}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate("detalle", movie.id)}
              onMouseEnter={() => speak("Ver detalles")}
              onFocus={() => speak("Ver detalles")}
              onMouseLeave={stop}
              onBlur={stop}
              aria-label="Ver detalles"
              className="bg-red-800 hover:bg-red-700 text-white font-bold text-xs md:text-sm tracking-wide px-4 py-2.5 rounded flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
            >
              {" "}
              <span>+</span> Ver detalles{" "}
            </button>
          )}{" "}
        </div>

        {movie.format && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase select-none tracking-wider">
            {" "}
            {movie.format}{" "}
          </span>
        )}
      </div>
    </article>
  );
};
