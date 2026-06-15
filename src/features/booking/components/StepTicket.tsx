import { type FC } from 'react';
import { useAutoFocus } from '../../../shared/hooks/useAutoFocus';
import { useSpeakOnHover } from '../../../shared/hooks/useSpeakOnHover';
import { type Movie } from '../../../shared/types/movie';

interface StepTicketProps {
  movie: Movie;
  horario: string;
  selectedSeats: string[];
  totalPrice: number;
  snacksSummary: {
    items: { id: string; name: string; qty: number; price: number }[];
    totalItems: number;
    totalPrice: number;
  };
  paymentSummary: {
    method: string;
    last4: string;
    name: string;
    email: string;
  } | null;
  selectedCinema?: { name: string } | null;
  onFinish: () => void;
}

export const StepTicket: FC<StepTicketProps> = ({ movie, horario, selectedSeats, totalPrice, snacksSummary, paymentSummary, selectedCinema = null, onFinish }) => {
  const headingRef = useAutoFocus<HTMLHeadingElement>();
  const { speak, stop } = useSpeakOnHover();
  const ticketTotal = totalPrice;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 animate-in zoom-in duration-700" role="main" aria-labelledby="ticket-heading">

      <h1 id="ticket-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-black text-white text-center uppercase tracking-[0.2em] mb-12 focus:outline-none">
        BOLETO DIGITAL
      </h1>

      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row">

        <div className="w-full md:w-1/3 relative">
          <img 
            src={movie.imageUrl} 
            alt={`Póster de ${movie.title}`} 
            className="w-full h-full object-cover"
          />
          {movie.format && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter -rotate-12 shadow-lg">
              {movie.format}
            </span>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent md:hidden" />
        </div>

        <div
          className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-between items-center text-center"
          onMouseEnter={() => speak(`Boleto digital para ${movie.title}. Horario ${horario}. Sala 03. ${selectedSeats.length} boleto${selectedSeats.length === 1 ? '' : 's'}. Asientos ${selectedSeats.join(', ') || 'N/A'}. Total S/${ticketTotal.toFixed(2)}.`)}
          onFocus={() => speak(`Boleto digital para ${movie.title}. Horario ${horario}. Sala 03. ${selectedSeats.length} boleto${selectedSeats.length === 1 ? '' : 's'}. Asientos ${selectedSeats.join(', ') || 'N/A'}. Total S/${ticketTotal.toFixed(2)}.`)}
          onMouseLeave={stop}
        >
          <div className="space-y-6">
            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Datos</h2>
            <div className="space-y-2">
              <p className="text-white text-xl font-bold">Hoy mar. 19 may, 2026 - {horario}</p>
              <p className="text-zinc-300 text-lg font-medium">SALA: 03</p>
              <p className="text-zinc-300 text-lg font-medium">{selectedCinema?.name || 'N/A'}</p>
              <p className="text-zinc-300 text-lg font-medium">{selectedSeats.length} BOLETO{selectedSeats.length === 1 ? '' : 'S'}</p>
              <p className="text-red-500 text-xl font-black tracking-widest">ASIENTOS: {selectedSeats.join(', ') || 'N/A'}</p>
            </div>
            <div className="pt-4">
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{movie.title}</h3>
               <p className="text-zinc-500 text-sm font-bold uppercase mt-1">2 hrs 7 min | +14</p>
               <p className="text-zinc-400 text-sm mt-1">Precio total: S/{ticketTotal.toFixed(2)}</p>
               {snacksSummary.items.length > 0 && (
                 <p className="text-zinc-400 text-sm mt-1">Snacks: {snacksSummary.items.map((item) => `${item.qty}× ${item.name}`).join(', ')}</p>
               )}
               {paymentSummary && (
                 <p className="text-zinc-400 text-sm mt-1">Tarjeta terminada en **** {paymentSummary.last4}</p>
               )}
            </div>
          </div>

          <div className="w-full pt-10 flex flex-col sm:flex-row items-center justify-center gap-8">

            <div className="bg-white p-2 rounded-lg shadow-xl">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CINERAMA-RESERVA-12345" 
                alt="Código QR de reserva" 
                className="w-24 h-24"
              />
            </div>

            <div className="bg-white px-4 py-2 rounded-lg shadow-xl flex flex-col items-center">
              <div className="h-16 w-48 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px)]" />
              <span className="text-[10px] font-mono text-black mt-1 font-bold">001234567890</span>
            </div>
          </div>

          <div className="pt-10">
            <button
              type="button"
              onClick={onFinish}
              onMouseEnter={() => speak('Finalizar')}
              onFocus={() => speak('Finalizar')}
              onMouseLeave={stop}
              onBlur={stop}
              aria-label="Finalizar"
              className="bg-red-800 hover:bg-red-700 text-white font-black text-xs tracking-[0.2em] uppercase px-12 py-3.5 rounded transition-all transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
