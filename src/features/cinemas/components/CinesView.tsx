import type { FC } from 'react';
import { CINEMAS_DATA } from '../../../data/cinemas';
import { useAutoFocus } from '../../../shared/hooks/useAutoFocus';
import { useSpeakOnHover } from '../../../shared/hooks/useSpeakOnHover';
import { type ViewRoute } from '../../../shared/types/navigation';

interface CinesViewProps {
  onNavigate: (route: ViewRoute) => void;
}

export const CinesView: FC<CinesViewProps> = ({ onNavigate }) => {
  const headingRef = useAutoFocus<HTMLHeadingElement>();
  const { speak, stop } = useSpeakOnHover();

  return (
    <div id="main-content" className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col gap-3">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-red-500">Ubicaciones</p>
        <h1 ref={headingRef} tabIndex={-1} className="text-3xl md:text-4xl font-black tracking-wider text-white uppercase focus:outline-none">
          NUESTROS CINES
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-400">
          Encuentra tu sede, revisa la direccion y abre el mapa para llegar con mas facilidad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CINEMAS_DATA.map((cinema) => {
          const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(cinema.mapQuery)}&output=embed`;
          const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cinema.mapQuery)}`;

          return (
            <article
              key={cinema.id}
              aria-labelledby={`cinema-title-${cinema.id}`}
              className="bg-white text-black rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="min-h-64 overflow-hidden bg-zinc-200">
                <iframe
                  title={`Mapa de ${cinema.name}`}
                  src={mapUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-64 w-full border-0"
                />
              </div>

              <div className="p-5 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <span className="inline-flex bg-black text-white font-black tracking-tighter text-xs px-3 py-1 rounded-sm">
                    CINERAMA
                  </span>
                  <h2
                    id={`cinema-title-${cinema.id}`}
                    tabIndex={0}
                    className="font-extrabold text-lg tracking-tight leading-tight uppercase focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
                  >
                    {cinema.name}
                  </h2>
                  <p className="text-xs font-bold text-zinc-600 tracking-wide uppercase">
                    {cinema.address}
                  </p>
                  <p className="text-sm leading-6 text-zinc-700">
                    Sala con atencion en boleteria, acceso guiado y ubicacion visible en mapa.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => speak(`Abrir mapa de ${cinema.name}`)}
                    onFocus={() => speak(`Abrir mapa de ${cinema.name}`)}
                    onMouseLeave={stop}
                    onBlur={stop}
                    className="bg-zinc-900 hover:bg-black text-white text-[11px] font-bold tracking-tight uppercase px-4 py-2.5 rounded-md transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
                  >
                    Abrir mapa
                  </a>
                  <button
                    type="button"
                    onClick={() => onNavigate('booking')}
                    onMouseEnter={() => speak('Ver cartelera')}
                    onFocus={() => speak('Ver cartelera')}
                    onMouseLeave={stop}
                    onBlur={stop}
                    aria-label="Ver cartelera"
                    className="bg-red-800 hover:bg-red-700 text-white text-[11px] font-bold tracking-tight uppercase px-4 py-2.5 rounded-md transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
                  >
                    Ver cartelera
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
