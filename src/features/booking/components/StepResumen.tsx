import { type FC } from 'react';
import { useAutoFocus } from '../../../shared/hooks/useAutoFocus';
import { useSpeakOnHover } from '../../../shared/hooks/useSpeakOnHover';
import { type Movie } from '../../../shared/types/movie';

interface StepResumenProps {
  movie: Movie;
  horario: string;
  totalTickets: number;
  selectedSeats: string[];
  selectedCinema?: { name: string } | null;
  entradasSummary: {
    totalEntradas: number;
    totalPrice: number;
    breakdown: { adulto: number; infantil: number; mayor: number };
  };
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
  };
  onBack: () => void;
  onEditEntradas: () => void;
  onEditDulceria: () => void;
  onNext: () => void;
}

export const StepResumen: FC<StepResumenProps> = ({
  movie,
  horario,
  totalTickets,
  selectedSeats,
  selectedCinema,
  entradasSummary,
  snacksSummary,
  paymentSummary,
  onBack,
  onEditEntradas,
  onEditDulceria,
  onNext,
}) => {
  const headingRef = useAutoFocus<HTMLHeadingElement>();
  const { speak, stop } = useSpeakOnHover();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 animate-in fade-in duration-500">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-black text-white uppercase tracking-wide focus:outline-none">
            Revisa tu compra
          </h1>
          <p className="text-zinc-400 leading-7">
            Confirma todos los datos antes de generar tu boleto digital. Si necesitas cambiar algo, puedes regresar al paso anterior.
          </p>

          <section
            className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 space-y-4"
            onMouseEnter={() => speak(`Resumen de funciones. Película ${movie.title}. Horario ${horario}. Sala 03. Boletos ${totalTickets}. Asientos ${selectedSeats.join(', ') || 'ninguno'}`)}
            onFocus={() => speak(`Resumen de funciones. Película ${movie.title}. Horario ${horario}. Sala 03. Boletos ${totalTickets}. Asientos ${selectedSeats.join(', ') || 'ninguno'}`)}
            onMouseLeave={stop}
          >
            <h2 className="text-lg font-black text-white uppercase tracking-[0.2em]">Resumen de funciones</h2>
            <p className="text-zinc-300">Película: <span className="font-semibold text-white">{movie.title}</span></p>
            <p className="text-zinc-300">Horario: <span className="font-semibold text-white">{horario}</span></p>
            <p className="text-zinc-300">Sala: <span className="font-semibold text-white">03</span></p>
            <p className="text-zinc-300">Boletos: <span className="font-semibold text-white">{totalTickets}</span></p>
            <p className="text-zinc-300">Asientos: <span className="font-semibold text-white">{selectedSeats.join(', ') || 'Ninguno'}</span></p>
            {selectedCinema && (
              <p className="text-zinc-300">Cine: <span className="font-semibold text-white">{selectedCinema.name}</span></p>
            )}
          </section>

          <section
            className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 space-y-4"
            onMouseEnter={() => speak(`Detalle de entradas. Adulto ${entradasSummary.breakdown.adulto}, Infantil ${entradasSummary.breakdown.infantil}, Adulto mayor ${entradasSummary.breakdown.mayor}, Total S/${entradasSummary.totalPrice.toFixed(2)}`)}
            onFocus={() => speak(`Detalle de entradas. Adulto ${entradasSummary.breakdown.adulto}, Infantil ${entradasSummary.breakdown.infantil}, Adulto mayor ${entradasSummary.breakdown.mayor}, Total S/${entradasSummary.totalPrice.toFixed(2)}`)}
            onMouseLeave={stop}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-black text-white uppercase tracking-[0.2em]">Detalle de entradas</h2>
              <button
                type="button"
                onClick={onEditEntradas}
                onFocus={() => speak('Editar entradas')}
                onMouseEnter={() => speak('Editar entradas')}
                onMouseLeave={stop}
                className="text-xs font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Editar
              </button>
            </div>
            <div className="grid gap-2 text-zinc-300 text-sm">
              <div className="flex justify-between"><span>Adulto</span><span>{entradasSummary.breakdown.adulto}</span></div>
              <div className="flex justify-between"><span>Infantil</span><span>{entradasSummary.breakdown.infantil}</span></div>
              <div className="flex justify-between"><span>Adulto mayor</span><span>{entradasSummary.breakdown.mayor}</span></div>
              <div className="border-t border-zinc-800 pt-3 flex justify-between text-white font-black text-sm"><span>Total</span><span>S/{entradasSummary.totalPrice.toFixed(2)}</span></div>
            </div>
          </section>

          <section
            className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 space-y-4"
            onMouseEnter={() => speak(snacksSummary.items.length > 0 ? `Dulcería: ${snacksSummary.items.map((item) => `${item.qty} de ${item.name}`).join(', ')}. Total S/${snacksSummary.totalPrice.toFixed(2)}` : 'No hay snacks seleccionados.')}
            onFocus={() => speak(snacksSummary.items.length > 0 ? `Dulcería: ${snacksSummary.items.map((item) => `${item.qty} de ${item.name}`).join(', ')}. Total S/${snacksSummary.totalPrice.toFixed(2)}` : 'No hay snacks seleccionados.')}
            onMouseLeave={stop}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-black text-white uppercase tracking-[0.2em]">Dulcería</h2>
              <button
                type="button"
                onClick={onEditDulceria}
                onFocus={() => speak('Editar dulcería')}
                onMouseEnter={() => speak('Editar dulcería')}
                onMouseLeave={stop}
                className="text-xs font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Editar
              </button>
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-[0.2em]">Dulcería</h2>
            {snacksSummary.items.length > 0 ? (
              <div className="grid gap-2 text-zinc-300 text-sm">
                {snacksSummary.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.qty}</span>
                    <span>S/{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-zinc-800 pt-3 flex justify-between text-white font-black text-sm">
                  <span>Total snacks</span>
                  <span>S/{snacksSummary.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-400">No hay snacks seleccionados.</p>
            )}
          </section>

          <section
            className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 space-y-4"
            onMouseEnter={() => speak(`Método de pago. ${paymentSummary.method}. Tarjeta terminada en ${paymentSummary.last4}. Titular ${paymentSummary.name}. Correo ${paymentSummary.email}`)}
            onFocus={() => speak(`Método de pago. ${paymentSummary.method}. Tarjeta terminada en ${paymentSummary.last4}. Titular ${paymentSummary.name}. Correo ${paymentSummary.email}`)}
            onMouseLeave={stop}
          >
            <h2 className="text-lg font-black text-white uppercase tracking-[0.2em]">Método de pago</h2>
            <p className="text-zinc-300">Forma: <span className="font-semibold text-white">{paymentSummary.method}</span></p>
            <p className="text-zinc-300">Tarjeta: <span className="font-semibold text-white">**** {paymentSummary.last4}</span></p>
            <p className="text-zinc-300">Titular: <span className="font-semibold text-white">{paymentSummary.name}</span></p>
            <p className="text-zinc-300">Correo: <span className="font-semibold text-white">{paymentSummary.email}</span></p>
          </section>
        </div>

        <aside className="space-y-6">
          <div
            className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-300"
            onMouseEnter={() => speak(`Resumen de pago. Entradas S/${entradasSummary.totalPrice.toFixed(2)}. Dulcería S/${snacksSummary.totalPrice.toFixed(2)}. Total S/${(entradasSummary.totalPrice + snacksSummary.totalPrice).toFixed(2)}`)}
            onFocus={() => speak(`Resumen de pago. Entradas S/${entradasSummary.totalPrice.toFixed(2)}. Dulcería S/${snacksSummary.totalPrice.toFixed(2)}. Total S/${(entradasSummary.totalPrice + snacksSummary.totalPrice).toFixed(2)}`)}
            onMouseLeave={stop}
          >
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">Resumen de pago</h3>
            <div className="grid gap-3 text-sm text-zinc-300">
              <div className="flex justify-between"><span>Entradas</span><span>S/{entradasSummary.totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Dulcería</span><span>S/{snacksSummary.totalPrice.toFixed(2)}</span></div>
            </div>
            <p className="mt-4 text-4xl font-black text-white">S/{(entradasSummary.totalPrice + snacksSummary.totalPrice).toFixed(2)}</p>
            <p className="mt-2 text-sm text-zinc-400">Total combinado antes de confirmar.</p>
          </div>

          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 space-y-4">
            <p className="text-zinc-400 text-sm">Al confirmar tu compra recibirás tu boleto digital inmediatamente y un correo con los detalles.</p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={onBack}
                onFocus={() => speak('Volver')}
                onMouseEnter={() => speak('Volver')}
                onMouseLeave={stop}
                aria-label="Volver"
                className="w-full border border-zinc-800 bg-transparent text-white font-black text-xs tracking-[0.2em] uppercase py-3 rounded-lg hover:border-white transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={onNext}
                onFocus={() => speak('Confirmar compra')}
                onMouseEnter={() => speak('Confirmar compra')}
                onMouseLeave={stop}
                aria-label="Confirmar compra"
                className="w-full bg-red-700 hover:bg-red-600 text-white font-black text-xs tracking-[0.2em] uppercase py-3 rounded-lg transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
              >
                Confirmar compra
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
