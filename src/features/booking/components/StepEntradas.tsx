import { useState, type FC } from 'react';
import { useAutoFocus } from '../../../shared/hooks/useAutoFocus';
import { useSpeakOnHover } from '../../../shared/hooks/useSpeakOnHover';
import { type Movie } from '../../../shared/types/movie';

interface StepEntradasProps {
  movie: Movie;
  horario: string;
  onNext: (summary: {
    totalEntradas: number;
    totalPrice: number;
    breakdown: { adulto: number; infantil: number; mayor: number };
  }) => void;
}

export const StepEntradas: FC<StepEntradasProps> = ({ movie, horario, onNext }) => {
  const headingRef = useAutoFocus<HTMLHeadingElement>();

  // Estados independientes para cada tipo de entrada
  const [adulto, setAdulto] = useState<number>(0);
  const [infantil, setInfantil] = useState<number>(0);
  const [adultoMayor, setAdultoMayor] = useState<number>(0);

  const totalEntradas = adulto + infantil + adultoMayor;
  const totalPrice = adulto * 10 + infantil * 8.5 + adultoMayor * 8.5;
  const { speak, stop } = useSpeakOnHover();

  const handleIncrement = (type: 'adulto' | 'infantil' | 'mayor') => {
    if (type === 'adulto') setAdulto(p => p + 1);
    if (type === 'infantil') setInfantil(p => p + 1);
    if (type === 'mayor') setAdultoMayor(p => p + 1);
  };

  const handleDecrement = (type: 'adulto' | 'infantil' | 'mayor') => {
    if (type === 'adulto' && adulto > 0) setAdulto(p => p - 1);
    if (type === 'infantil' && infantil > 0) setInfantil(p => p - 1);
    if (type === 'mayor' && adultoMayor > 0) setAdultoMayor(p => p - 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 animate-in fade-in duration-500 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-6 border-r border-zinc-900 pr-0 lg:pr-6">
        <div className="w-full aspect-[2/3] rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
          <img src={movie.imageUrl} alt={`Póster de ${movie.title}`} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase">{movie.title}</h2>
          <p className="text-zinc-400 text-sm font-semibold">2 hrs 7 min | +14</p>
          <p className="text-zinc-300 text-sm font-medium pt-2">Hoy mar. 19 may, 2026</p>
          <p className="text-red-500 font-bold text-lg">{horario}</p>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">SALA: 03</p>
        </div>
      </div>

      <div className="lg:col-span-3 flex flex-col justify-between max-w-2xl w-full mx-auto lg:mx-0 pt-4">
        <div className="space-y-8">
          <div role="status" aria-live="polite" className="rounded-3xl border border-zinc-800 bg-zinc-950/95 p-5 text-zinc-300">
            <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-black text-white uppercase tracking-wide focus:outline-none">
              ENTRADAS
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Selecciona las entradas que necesites y revisa el total antes de continuar.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-200">
              <span className="font-semibold">Total: {totalEntradas} entrada{totalEntradas === 1 ? '' : 's'}</span>
              <span className="font-semibold">Precio aproximado: S/{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-8">
            <div role="group" aria-labelledby="adulto-label" className="flex justify-between items-center bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60">
              <span id="adulto-label" tabIndex={0} className="text-xl font-bold text-white uppercase tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600">ADULTO S/10.00</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleDecrement('adulto')}
                  onMouseEnter={() => speak('Disminuir una entrada de adulto')}
                  onFocus={() => speak('Disminuir una entrada de adulto')}
                  onMouseLeave={stop}
                  onBlur={stop}
                  aria-label="Disminuir una entrada de adulto"
                  className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-black text-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  -
                </button>
                <span className="text-white font-bold text-lg w-4 text-center" aria-live="polite">{adulto}</span>
                <button
                  type="button"
                  onClick={() => handleIncrement('adulto')}
                  onMouseEnter={() => speak('Aumentar una entrada de adulto')}
                  onFocus={() => speak('Aumentar una entrada de adulto')}
                  onMouseLeave={stop}
                  onBlur={stop}
                  aria-label="Aumentar una entrada de adulto"
                  className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-black text-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  +
                </button>
              </div>
            </div>

            <div role="group" aria-labelledby="infantil-label" className="flex justify-between items-center bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60">
              <span id="infantil-label" tabIndex={0} className="text-xl font-bold text-white uppercase tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600">INFANTIL DE 2-8 S/8.50</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleDecrement('infantil')}
                  onMouseEnter={() => speak('Disminuir una entrada infantil')}
                  onFocus={() => speak('Disminuir una entrada infantil')}
                  onMouseLeave={stop}
                  onBlur={stop}
                  aria-label="Disminuir una entrada infantil"
                  className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-black text-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  -
                </button>
                <span className="text-white font-bold text-lg w-4 text-center" aria-live="polite">{infantil}</span>
                <button
                  type="button"
                  onClick={() => handleIncrement('infantil')}
                  onMouseEnter={() => speak('Aumentar una entrada infantil')}
                  onFocus={() => speak('Aumentar una entrada infantil')}
                  onMouseLeave={stop}
                  onBlur={stop}
                  aria-label="Aumentar una entrada infantil"
                  className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-black text-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  +
                </button>
              </div>
            </div>

            <div role="group" aria-labelledby="mayor-label" className="flex justify-between items-center bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60">
              <span id="mayor-label" tabIndex={0} className="text-xl font-bold text-white uppercase tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600">AD.MAYOR+60 S/8.50</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleDecrement('mayor')}
                  onMouseEnter={() => speak('Disminuir una entrada de adulto mayor')}
                  onFocus={() => speak('Disminuir una entrada de adulto mayor')}
                  onMouseLeave={stop}
                  onBlur={stop}
                  aria-label="Disminuir una entrada de adulto mayor"
                  className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-black text-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  -
                </button>
                <span className="text-white font-bold text-lg w-4 text-center" aria-live="polite">{adultoMayor}</span>
                <button
                  type="button"
                  onClick={() => handleIncrement('mayor')}
                  onMouseEnter={() => speak('Aumentar una entrada de adulto mayor')}
                  onFocus={() => speak('Aumentar una entrada de adulto mayor')}
                  onMouseLeave={stop}
                  onBlur={stop}
                  aria-label="Aumentar una entrada de adulto mayor"
                  className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-black text-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end pt-12">
          <button
            type="button"
            onClick={() => onNext({
              totalEntradas,
              totalPrice,
              breakdown: { adulto, infantil, mayor: adultoMayor },
            })}
            onMouseEnter={() => speak('Continuar a selección de asientos')}
            onFocus={() => speak('Continuar a selección de asientos')}
            onMouseLeave={stop}
            onBlur={stop}
            disabled={totalEntradas === 0}
            aria-label="Continuar a selección de asientos"
            className={`font-bold text-xs tracking-widest uppercase px-8 py-3 rounded-md transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 ${
              totalEntradas > 0 
                ? 'bg-red-700 hover:bg-red-600 text-white cursor-pointer' 
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>

    </div>
  );
};
