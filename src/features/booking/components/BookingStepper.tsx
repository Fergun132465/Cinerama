import { useMemo, useState, type FC } from 'react';
import { StepHorarios } from './StepHorarios';
import { StepEntradas } from './StepEntradas';
import { StepAsientos } from './StepAsientos';
import { StepDulceria } from './StepDulceria';
import { StepDatos } from './StepDatos';
import { StepResumen } from './StepResumen';
import { StepTicket } from './StepTicket';
import { MOVIES_DATA } from '../../../data/movies';
import { CINEMAS_DATA } from '../../../data/cinemas';
import { type ViewRoute } from '../../../shared/types/navigation';

interface BookingStepperProps {
  movieId: number;
  onNavigate: (route: ViewRoute) => void;
}

export const BookingStepper: FC<BookingStepperProps> = ({ movieId, onNavigate }) => {
  const [step, setStep] = useState<number>(1);

  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [selectedHorario, setSelectedHorario] = useState<string>('');

  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const [entradasSummary, setEntradasSummary] = useState({
    totalEntradas: 0,
    totalPrice: 0,
    breakdown: { adulto: 0, infantil: 0, mayor: 0 },
  });

  const [paymentSummary, setPaymentSummary] = useState<{
    method: string;
    last4: string;
    name: string;
    email: string;
  } | null>(null);

  const [snacksSummary, setSnacksSummary] = useState<{
    items: { id: string; name: string; qty: number; price: number }[];
    totalItems: number;
    totalPrice: number;
  }>({ items: [], totalItems: 0, totalPrice: 0 });

  // 🎬 Movie seleccionada
  const selectedMovie = useMemo(
    () => MOVIES_DATA.find((movie) => movie.id === movieId) ?? MOVIES_DATA[0],
    [movieId],
  );

  // 🏢 Cinema seleccionado
  const selectedCinema = useMemo(() => {
    return CINEMAS_DATA.find((c) => c.id === selectedCinemaId) ?? null;
  }, [selectedCinemaId]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleEntradasComplete = (summary: {
    totalEntradas: number;
    totalPrice: number;
    breakdown: { adulto: number; infantil: number; mayor: number };
  }) => {
    setTotalTickets(summary.totalEntradas);
    setEntradasSummary(summary);
    handleNext();
  };

  const handleAsientosComplete = (seats: string[]) => {
    setSelectedSeats(seats);
    handleNext();
  };

  const handleDatosComplete = (summary: {
    method: string;
    last4: string;
    name: string;
    email: string;
  }) => {
    setPaymentSummary(summary);
    handleNext();
  };

  const handleDulceriaComplete = (summary: {
    items: { id: string; name: string; qty: number; price: number }[];
    totalItems: number;
    totalPrice: number;
  }) => {
    setSnacksSummary(summary);
    handleNext();
  };

  const stepTitles = [
    'Cine',
    'Horario',
    'Entradas',
    'Asientos',
    'Dulcería',
    'Datos',
    'Resumen',
    'Ticket',
  ];

  const stepAnnouncement = useMemo(() => {
    switch (step) {
      case 1:
        return 'Paso 1 de 8. Selección de cine.';
      case 2:
        return `Paso 2 de 8. Selección de horario en ${selectedCinema?.name ?? ''}.`;
      case 3:
        return `Paso 3 de 8. Entradas para ${selectedMovie.title}.`;
      case 4:
        return `Paso 4 de 8. Asientos (${totalTickets}).`;
      case 5:
        return 'Paso 5 de 8. Dulcería.';
      case 6:
        return 'Paso 6 de 8. Datos y pago.';
      case 7:
        return 'Paso 7 de 8. Resumen.';
      case 8:
        return 'Paso 8 de 8. Ticket generado.';
      default:
        return '';
    }
  }, [step, selectedCinema, selectedMovie.title, totalTickets]);

  return (
    <main className="min-h-[60vh] bg-black" aria-labelledby="booking-page-title">

      {/* HEADER */}
      <nav className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-4 flex justify-between">
          <div>
            <p className="text-xs text-zinc-500">
              Paso {step} de {stepTitles.length}
            </p>
            <h2 className="text-white font-bold">
              {stepTitles[step - 1]}
            </h2>
          </div>
          <p className="text-zinc-400 text-sm">{selectedMovie.title}</p>
        </div>

        <div className="h-2 bg-zinc-900 rounded">
          <div
            className="h-full bg-red-600"
            style={{ width: `${(step / stepTitles.length) * 100}%` }}
          />
        </div>
      </nav>

      {/* LIVE ANNOUNCEMENT */}
      <div className="sr-only" aria-live="polite">
        {stepAnnouncement}
      </div>

      {/* BACK BUTTON */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <button
          onClick={() => (step === 1 ? onNavigate('inicio') : handleBack())}
          className="text-zinc-400 text-xs uppercase"
        >
          ← Volver
        </button>
      </div>

       {step === 1 && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-white text-xl mb-4">Selecciona un cine</h2>

          <div className="grid gap-3">
            {CINEMAS_DATA.map((cinema) => (
              <button
                key={cinema.id}
                onClick={() => {
                  setSelectedCinemaId(cinema.id);
                  handleNext();
                }}
                className="p-4 border border-zinc-800 rounded text-left hover:border-red-600"
              >
                <p className="text-white font-bold">{cinema.name}</p>
                <p className="text-zinc-400 text-sm">{cinema.address}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedCinema && (
        <StepHorarios
          movie={selectedMovie}
          cinema={selectedCinema}
          onNext={handleNext}
          setSelectedHorario={setSelectedHorario}
        />
      )}


      {step === 3 && (
        <StepEntradas
          movie={selectedMovie}
          cinema={selectedCinema}
          horario={selectedHorario}
          onNext={handleEntradasComplete}
        />
      )}


      {step === 4 && (
        <StepAsientos
          movie={selectedMovie}
          cinema={selectedCinema}
          horario={selectedHorario}
          totalTickets={totalTickets}
          onNext={handleAsientosComplete}
        />
      )}


      {step === 5 && (
        <StepDulceria
          onNext={handleDulceriaComplete}
          onBack={handleBack}
          initialQuantities={Object.fromEntries(
            snacksSummary.items.map((i) => [i.id, i.qty])
          )}
        />
      )}


      {step === 6 && (
        <StepDatos
          movie={selectedMovie}
          horario={selectedHorario}
          cinema={selectedCinema}
          totalPrice={entradasSummary.totalPrice + snacksSummary.totalPrice}
          ticketSubtotal={entradasSummary.totalPrice}
          snacksSubtotal={snacksSummary.totalPrice}
          onNext={handleDatosComplete}
        />
      )}


      {step === 7 && paymentSummary && (
        <StepResumen
          movie={selectedMovie}
          horario={selectedHorario}
          cinema={selectedCinema}
          totalTickets={totalTickets}
          selectedSeats={selectedSeats}
          entradasSummary={entradasSummary}
          snacksSummary={snacksSummary}
          paymentSummary={paymentSummary}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}


      {step === 8 && (
        <StepTicket
          movie={selectedMovie}
          cinema={selectedCinema}
          horario={selectedHorario}
          selectedSeats={selectedSeats}
          totalPrice={entradasSummary.totalPrice + snacksSummary.totalPrice}
          snacksSummary={snacksSummary}
          paymentSummary={paymentSummary}
          onFinish={() => onNavigate('inicio')}
        />
      )}

    </main>
  );
};