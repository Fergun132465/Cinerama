import { useState, type FC } from 'react';
import { useAutoFocus } from '../../../shared/hooks/useAutoFocus';
import { useSpeakOnHover } from '../../../shared/hooks/useSpeakOnHover';
import { type Movie } from '../../../shared/types/movie';

interface StepAsientosProps {
  movie: Movie;
  horario: string;
  totalTickets: number;
  onNext: (selectedSeats: string[]) => void;
}

export const StepAsientos: FC<StepAsientosProps> = ({ movie, horario, totalTickets, onNext }) => {
  const mainHeadingRef = useAutoFocus<HTMLHeadingElement>();
  const filas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const columnas = Array.from({ length: 18 }, (_, i) => String(18 - i).padStart(2, '0'));
  const asientosOcupados = new Set([
    'A-11', 'C-08', 'C-01', 'D-17', 'D-16', 'E-08',
    'F-05', 'H-08', 'I-08', 'I-04', 'J-08', 'J-07', 'J-06', 'J-05',
  ]);
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const { speak, stop } = useSpeakOnHover();

  const selectedSeats = Array.from(seleccionados).sort();
  const puedeContinuar = seleccionados.size === totalTickets;

  const handleSeatClick = (seatId: string) => {
    if (asientosOcupados.has(seatId)) return;

    setSeleccionados((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(seatId)) {
        nuevo.delete(seatId);
      } else {
        if (nuevo.size >= totalTickets) return prev;
        nuevo.add(seatId);
      }
      return nuevo;
    });
  };

  const handleSuggestedSeats = () => {
    for (const fila of filas) {
      const rowSeats = columnas.map((col) => `${fila}-${col}`).filter((seatId) => !asientosOcupados.has(seatId));
      for (let index = 0; index <= rowSeats.length - totalTickets; index += 1) {
        const group = rowSeats.slice(index, index + totalTickets);
        if (group.length === totalTickets) {
          setSeleccionados(new Set(group));
          return;
        }
      }
    }

    const availableSeats = filas.flatMap((fila) =>
      columnas.map((col) => `${fila}-${col}`).filter((seatId) => !asientosOcupados.has(seatId)),
    );
    setSeleccionados(new Set(availableSeats.slice(0, totalTickets)));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 animate-in fade-in duration-500 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <h2 id="seat-selection-heading" ref={mainHeadingRef} tabIndex={-1} className="sr-only focus:outline-none">
        Seleccion de asientos para {movie.title}. Debes seleccionar {totalTickets} asiento{totalTickets === 1 ? '' : 's'}.
      </h2>

      <div className="lg:col-span-1 space-y-6 border-r border-zinc-900 pr-0 lg:pr-6">
        <div className="w-full aspect-[2/3] rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
          <img src={movie.imageUrl} alt={`Poster de la pelicula ${movie.title}`} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-white uppercase">{movie.title}</h3>
          <p className="text-zinc-400 text-sm font-semibold">{movie.duration ?? '2 hrs 7 min'} | {movie.rating ?? '+14'}</p>
          <p className="text-red-500 font-bold text-lg">{horario}</p>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">SALA: 03</p>
          <div className="pt-4 border-t border-zinc-900/60 mt-4">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Progreso de seleccion:</p>
            <p className="text-sm font-black text-white mt-1">{seleccionados.size} de {totalTickets} asientos elegidos</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-zinc-700 text-zinc-900 font-black tracking-[0.5em] text-center py-2 text-2xl uppercase rounded-sm mb-6 shadow-inner select-none">
          PANTALLA
        </div>

        <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-4 mb-6 text-sm text-zinc-300">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3"><span className="inline-flex h-3.5 w-3.5 rounded-full bg-zinc-600 border border-zinc-700" />Disponible</div>
            <div className="flex items-center gap-3"><span className="inline-flex h-3.5 w-3.5 rounded-full bg-emerald-600 border border-emerald-500" />Seleccionado</div>
            <div className="flex items-center gap-3"><span className="inline-flex h-3.5 w-3.5 rounded-full bg-red-600 border border-red-700" />Ocupado</div>
          </div>
          <div className="mt-4 text-zinc-200">
            <p className="font-semibold">Asientos elegidos</p>
            <p>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Ninguno seleccionado aun'}</p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSuggestedSeats}
              className="rounded-md bg-red-700 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
            >
              Sugerir juntos
            </button>
            <button
              type="button"
              onClick={() => setSeleccionados(new Set())}
              className="rounded-md border border-zinc-700 px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-200 transition-colors hover:border-white focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
            >
              Limpiar
            </button>
          </div>
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Has seleccionado {seleccionados.size} de {totalTickets} asientos.
        </p>

        <div className="w-full overflow-x-auto pb-6 text-center select-none" aria-describedby="seat-selection-summary" role="region" aria-labelledby="seat-selection-heading">
          <div className="inline-block min-w-[640px] space-y-2">
            {filas.map((fila) => (
              <div key={fila} className="flex items-center justify-center gap-1.5">
                <span className="w-6 text-right text-zinc-400 font-black text-sm pl-2">{fila}</span>
                {columnas.map((col) => {
                  const seatId = `${fila}-${col}`;
                  const ocupado = asientosOcupados.has(seatId);
                  const elegido = seleccionados.has(seatId);
                  const esPasillo = (parseInt(col, 10) === 15 || parseInt(col, 10) === 14 || parseInt(col, 10) === 13) && fila !== 'J';

                  if (esPasillo) return <div key={seatId} className="w-6 h-6 md:w-7 md:h-7" />;

                  return (
                    <button
                      key={seatId}
                      type="button"
                      disabled={ocupado}
                      onClick={() => handleSeatClick(seatId)}
                      onMouseEnter={() => speak(`Asiento ${fila}${col}, ${ocupado ? 'Ocupado' : elegido ? 'Seleccionado' : 'Disponible'}`)}
                      onFocus={() => speak(`Asiento ${fila}${col}, ${ocupado ? 'Ocupado' : elegido ? 'Seleccionado' : 'Disponible'}`)}
                      onMouseLeave={stop}
                      onBlur={stop}
                      aria-pressed={elegido}
                      aria-label={`Asiento ${fila}${col}, ${ocupado ? 'Ocupado' : elegido ? 'Seleccionado' : 'Disponible'}`}
                      className={`w-6 h-6 md:w-7 md:h-7 rounded-md transition-all text-[9px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        ocupado
                          ? 'bg-red-600 text-white cursor-not-allowed'
                          : elegido
                            ? 'bg-emerald-600 text-white font-bold scale-105 shadow-md'
                            : 'bg-zinc-600 text-zinc-300 hover:bg-zinc-500'
                      }`}
                    >
                      {elegido ? col : ''}
                    </button>
                  );
                })}
              </div>
            ))}

            <div className="flex items-center justify-center gap-1.5 pt-4 pr-6">
              <span className="w-6 md:w-7" />
              {columnas.map((col) => (
                <span key={col} className="w-6 md:w-7 text-center text-[10px] text-zinc-500 font-bold">{col}</span>
              ))}
            </div>
          </div>
        </div>

        <div id="seat-selection-summary" className="w-full max-w-2xl rounded-3xl border border-zinc-900 bg-zinc-950 p-4 text-zinc-300 mb-6">
          <p className="text-sm">Selecciona exactamente {totalTickets} asiento{totalTickets === 1 ? '' : 's'} para continuar. Si compras mas de 2 entradas, puedes elegir mas de 2 asientos.</p>
          <p className="mt-2 text-sm text-zinc-400">Presiona sobre un asiento o usa "Sugerir juntos" para completar el grupo automaticamente.</p>
        </div>

        <div className="w-full flex justify-end max-w-2xl pt-6">
          <button
            type="button"
            onClick={() => onNext(selectedSeats)}
            disabled={!puedeContinuar}
            aria-label={puedeContinuar ? 'Continuar a dulceria' : `Debes seleccionar ${totalTickets - seleccionados.size} asiento${totalTickets - seleccionados.size === 1 ? '' : 's'} mas para continuar`}
            className={`font-bold text-xs tracking-widest uppercase px-8 py-3 rounded-md transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 ${
              puedeContinuar
                ? 'bg-red-700 hover:bg-red-600 text-white cursor-pointer shadow-lg'
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            {seleccionados.size < totalTickets ? `Faltan ${totalTickets - seleccionados.size} asientos` : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};
