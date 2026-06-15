import { useState, type FC } from "react";
import { SHOWTIME_DAYS, SHOWTIMES_DATA } from "../../../data/showtimes";
import { useAutoFocus } from "../../../shared/hooks/useAutoFocus";
import { useSpeakOnHover } from "../../../shared/hooks/useSpeakOnHover";
import { type Movie } from "../../../shared/types/movie";

interface StepHorariosProps {
  movie: Movie;
  onNext: () => void;
  setSelectedHorario: (horario: string) => void;
}

export const StepHorarios: FC<StepHorariosProps> = ({
  movie,
  onNext,
  setSelectedHorario,
}) => {
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const firstDateButtonRef = useAutoFocus<HTMLButtonElement>();
  const { speak, stop } = useSpeakOnHover();

  const selectedDay = SHOWTIME_DAYS[selectedDate];
  const selectedDateText = `${selectedDay.label} ${selectedDay.num} de ${selectedDay.mes}`;
  const showtimeBlock = SHOWTIMES_DATA.find(
    (showtime) => showtime.movieId === movie.id,
  );
  const horasDisponibles =
    showtimeBlock?.horasPorDia[selectedDate] ?? showtimeBlock?.horas ?? [];
  const formatLabel = showtimeBlock?.tipo ?? movie.format ?? "DOB";
  const roomNames = ["Sala 01", "Sala 02", "Sala 03", "Sala XD"];
  const availabilityLabels = [
    "Alta demanda",
    "Disponible",
    "Ultimos asientos",
    "Funcion accesible",
  ];

  const handleTimeClick = (time: string) => {
    setSelectedHorario(`${selectedDateText} - ${time}`);
    onNext();
  };

  return (
    <main
      className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500"
      aria-labelledby="horarios-heading"
    >
      <h1 id="horarios-heading" className="sr-only">
        Selecciona la fecha y horario para {movie.title}
      </h1>
      <p className="sr-only" id="booking-step-description">
        Selecciona primero una fecha disponible. Despues escoge el horario para
        la pelicula seleccionada.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] mb-10">
        <article className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 shadow-xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="w-full sm:w-40 aspect-[2/3] overflow-hidden rounded-3xl border border-zinc-800 shadow-xl">
              <img
                src={movie.imageUrl}
                alt={`Poster de ${movie.title}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                  {movie.title}
                </h2>
                <span className="rounded-full bg-red-700 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                  {formatLabel}
                </span>
              </div>
              <p className="text-zinc-400 text-sm">
                Duracion {movie.duration ?? "2h 10m"} | Clasificacion{" "}
                {movie.rating ?? "+14"}
              </p>
              <p className="text-zinc-300 text-sm">
                Elige la fecha y el horario. Todas las peliculas tienen
                funciones durante la semana.
              </p>
            </div>
          </div>
        </article>

        <aside
          role="region"
          aria-labelledby="selected-date-label"
          className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 shadow-xl"
        >
          <p
            id="selected-date-label"
            className="text-sm uppercase tracking-[0.3em] text-zinc-500"
          >
            Fecha seleccionada
          </p>
          <p className="mt-3 text-xl font-black text-white">
            {selectedDateText}
          </p>
          <p className="mt-4 text-sm text-zinc-400">
            Funciones disponibles: {horasDisponibles.length}
          </p>
        </aside>
      </div>

      <div
        aria-describedby="booking-step-description"
        className="overflow-x-auto pb-4 scrollbar-none"
      >
        <div className="flex gap-3">
          {SHOWTIME_DAYS.map((dia, idx) => (
            <button
              key={`${dia.label}-${dia.num}`}
              ref={idx === 0 ? firstDateButtonRef : undefined}
              type="button"
              onClick={() => setSelectedDate(idx)}
              onMouseEnter={() =>
                speak(`Seleccionar fecha ${dia.label} ${dia.num} de ${dia.mes}`)
              }
              onFocus={() =>
                speak(`Seleccionar fecha ${dia.label} ${dia.num} de ${dia.mes}`)
              }
              onMouseLeave={stop}
              onBlur={stop}
              aria-pressed={selectedDate === idx}
              aria-label={`Seleccionar fecha ${dia.label} ${dia.num} de ${dia.mes}`}
              className={`flex flex-col items-center justify-center min-w-[100px] h-24 rounded-xl border font-bold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 ${
                selectedDate === idx
                  ? "bg-red-800 border-red-700 text-white shadow-lg"
                  : "bg-white border-zinc-200 text-black hover:bg-zinc-100"
              }`}
            >
              <span className="text-xs font-medium leading-none">
                {dia.label}
              </span>
              <span className="text-2xl font-black my-1">{dia.num}</span>
              <span className="text-xs font-medium leading-none">
                {dia.mes}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {horasDisponibles.map((hora, index) => (
            <button
              key={hora}
              type="button"
              onClick={() => handleTimeClick(hora)}
              onMouseEnter={() =>
                speak(`Seleccionar horario ${hora} para ${movie.title}`)
              }
              onFocus={() =>
                speak(`Seleccionar horario ${hora} para ${movie.title}`)
              }
              onMouseLeave={stop}
              onBlur={stop}
              aria-label={`Comprar ${movie.title} el ${selectedDateText} a las ${hora}`}
              className="group rounded-3xl border border-zinc-800 bg-zinc-950 p-5 text-left transition-all hover:-translate-y-1 hover:border-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                  Horario
                </span>
                <span className="rounded-full bg-red-900/60 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-200">
                  {
                    roomNames[
                      (movie.id + selectedDate + index) % roomNames.length
                    ]
                  }
                </span>
              </div>
              <p className="mt-3 text-3xl font-black text-white">{hora}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-zinc-800 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                  {formatLabel}
                </span>
                <span className="rounded-full border border-zinc-800 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                  {
                    availabilityLabels[
                      (movie.id + selectedDate + index) %
                        availabilityLabels.length
                    ]
                  }
                </span>
              </div>
              <p className="mt-4 text-sm text-zinc-400">
                Espacios accesibles, asistencia en sala y seleccion de asientos.
              </p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};
