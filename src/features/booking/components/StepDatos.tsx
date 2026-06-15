import { useState, type FC, type FormEvent } from 'react';
import { useAutoFocus } from '../../../shared/hooks/useAutoFocus';
import { useSpeakOnHover } from '../../../shared/hooks/useSpeakOnHover';
import { type Movie } from '../../../shared/types/movie';

interface StepDatosProps {
  movie: Movie;
  horario: string;
  totalPrice: number;
  ticketSubtotal: number;
  snacksSubtotal: number;
  onNext: (summary: { method: string; last4: string; name: string; email: string }) => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidExpiration = (value: string) => {
  const normalized = value.replace(/\s/g, '');
  if (!/^\d{2}\/\d{2}$/.test(normalized)) return false;
  const [month, year] = normalized.split('/').map(Number);
  return month >= 1 && month <= 12 && year >= 24;
};

export const StepDatos: FC<StepDatosProps> = ({ movie, horario, totalPrice, ticketSubtotal, snacksSubtotal, onNext }) => {
  const dniInputRef = useAutoFocus<HTMLInputElement>();

  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [numTarjeta, setNumTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const { speak, stop } = useSpeakOnHover();

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const errors = {
    dni: dni.length === 8 ? '' : 'El DNI debe tener 8 dígitos.',
    nombre: nombre.trim() ? '' : 'Ingresa tu nombre.',
    apellidos: apellidos.trim() ? '' : 'Ingresa tus apellidos.',
    correo: correo.trim() && emailPattern.test(correo) ? '' : 'Ingresa un email válido.',
    numTarjeta: numTarjeta.length === 16 ? '' : 'El número de tarjeta debe tener 16 dígitos.',
    vencimiento: isValidExpiration(vencimiento) ? '' : 'Formato MM/AA inválido.',
    cvv: cvv.length === 3 ? '' : 'El CVV debe tener 3 dígitos.',
    nombreTarjeta: nombreTarjeta.trim() ? '' : 'Ingresa el nombre que aparece en la tarjeta.',
  };

  const isFormValid = Object.values(errors).every((error) => error === '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isFormValid) {
      setTouched({
        dni: true,
        nombre: true,
        apellidos: true,
        correo: true,
        numTarjeta: true,
        vencimiento: true,
        cvv: true,
        nombreTarjeta: true,
      });
      return;
    }

    onNext({
      method: 'Tarjeta',
      last4: numTarjeta.slice(-4),
      name: nombreTarjeta.trim(),
      email: correo.trim(),
    });
  };

  const showError = (field: keyof typeof errors) => touched[field] || submitted;

  const formattedVencimiento = vencimiento.replace(/[^0-9]/g, '').replace(/(\d{2})(\d{1,2})?/, (_, m1, m2) => (m2 ? `${m1}/${m2}` : m1));

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 animate-in fade-in duration-500 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-6 border-r border-zinc-900 pr-0 lg:pr-6">
        <div className="w-full aspect-[2/3] rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
          <img src={movie.imageUrl} alt={`Póster de la película ${movie.title}`} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase">{movie.title}</h2>
          <p className="text-zinc-400 text-sm font-semibold">2 hrs 7 min | +14</p>
          <p className="text-zinc-300 text-sm font-medium pt-2">Hoy mar. 19 may, 2026</p>
          <p className="text-red-500 font-bold text-lg">{horario}</p>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">SALA: 03</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8 max-w-2xl w-full mx-auto lg:mx-0" aria-describedby="datos-pago-resumen">
        <p id="datos-pago-resumen" className="sr-only">
          Completa primero el DNI, luego tus datos personales y finalmente los datos de pago.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="dni" className="text-xs font-black text-white uppercase tracking-wider">DNI</label>
            <input
              id="dni"
              ref={dniInputRef}
              type="text"
              maxLength={8}
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
              onBlur={() => handleBlur('dni')}
              onFocus={() => speak('DNI')}
              onMouseEnter={() => speak('DNI')}
              onMouseLeave={stop}
              aria-label="DNI"
              aria-invalid={showError('dni') && Boolean(errors.dni)}
              aria-describedby={showError('dni') && errors.dni ? 'dni-error' : undefined}
              placeholder="12345678"
              className={`w-full bg-white text-black font-medium px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                showError('dni') && errors.dni ? 'border-red-600' : 'border-zinc-300'
              }`}
            />
            {showError('dni') && errors.dni && (
              <p id="dni-error" className="text-xs text-red-400">{errors.dni}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="nombre" className="text-xs font-black text-white uppercase tracking-wider">Nombre</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => handleBlur('nombre')}
              onFocus={() => speak('Nombre')}
              onMouseEnter={() => speak('Nombre')}
              onMouseLeave={stop}
              aria-label="Nombre"
              aria-invalid={showError('nombre') && Boolean(errors.nombre)}
              aria-describedby={showError('nombre') && errors.nombre ? 'nombre-error' : undefined}
              placeholder="Juan"
              className={`w-full bg-white text-black font-medium px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                showError('nombre') && errors.nombre ? 'border-red-600' : 'border-zinc-300'
              }`}
            />
            {showError('nombre') && errors.nombre && (
              <p id="nombre-error" className="text-xs text-red-400">{errors.nombre}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="apellidos" className="text-xs font-black text-white uppercase tracking-wider">Apellidos</label>
            <input
              id="apellidos"
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              onBlur={() => handleBlur('apellidos')}
              onFocus={() => speak('Apellidos')}
              onMouseEnter={() => speak('Apellidos')}
              onMouseLeave={stop}
              aria-label="Apellidos"
              aria-invalid={showError('apellidos') && Boolean(errors.apellidos)}
              aria-describedby={showError('apellidos') && errors.apellidos ? 'apellidos-error' : undefined}
              placeholder="Pérez Gómez"
              className={`w-full bg-white text-black font-medium px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                showError('apellidos') && errors.apellidos ? 'border-red-600' : 'border-zinc-300'
              }`}
            />
            {showError('apellidos') && errors.apellidos && (
              <p id="apellidos-error" className="text-xs text-red-400">{errors.apellidos}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="correo" className="text-xs font-black text-white uppercase tracking-wider">Correo Electrónico</label>
            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              onBlur={() => handleBlur('correo')}
              onFocus={() => speak('Correo electrónico')}
              onMouseEnter={() => speak('Correo electrónico')}
              onMouseLeave={stop}
              aria-label="Correo electrónico"
              aria-invalid={showError('correo') && Boolean(errors.correo)}
              aria-describedby={showError('correo') && errors.correo ? 'correo-error' : undefined}
              placeholder="correo@ejemplo.com"
              className={`w-full bg-white text-black font-medium px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                showError('correo') && errors.correo ? 'border-red-600' : 'border-zinc-300'
              }`}
            />
            {showError('correo') && errors.correo && (
              <p id="correo-error" className="text-xs text-red-400">{errors.correo}</p>
            )}
          </div>
        </div>

        <div className="space-y-6 pt-4 border-t border-zinc-900">
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-5 text-zinc-300">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500 font-black">Total a pagar</p>
            <div className="mt-4 flex items-center justify-between gap-4 text-white">
              <div>
                <p className="text-sm text-zinc-400">Entradas</p>
                <p className="font-bold">S/{ticketSubtotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Dulcería</p>
                <p className="font-bold">S/{snacksSubtotal.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400">Total</p>
                <p className="text-2xl font-black text-white">S/{totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <h3 tabIndex={0} className="text-xl font-bold text-white tracking-tight focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600">¿Cómo desea realizar su pago?</h3>
          <div className="w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-300">
            <p className="text-zinc-400">Paga con tarjeta segura.</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">Datos de tarjeta</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="numTarjeta" className="text-xs font-black text-white uppercase tracking-wider">Número de tarjeta</label>
              <input
                id="numTarjeta"
                type="text"
                maxLength={16}
                value={numTarjeta}
                onChange={(e) => setNumTarjeta(e.target.value.replace(/\D/g, ''))}
                onBlur={() => handleBlur('numTarjeta')}
                onFocus={() => speak('Campo número de tarjeta')}
                onMouseEnter={() => speak('Campo número de tarjeta')}
                onMouseLeave={stop}
                aria-label="Número de tarjeta"
                aria-invalid={showError('numTarjeta') && Boolean(errors.numTarjeta)}
                aria-describedby={showError('numTarjeta') && errors.numTarjeta ? 'numTarjeta-error' : undefined}
                placeholder="1234123412341234"
                className={`w-full bg-white text-black font-medium px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                  showError('numTarjeta') && errors.numTarjeta ? 'border-red-600' : 'border-zinc-300'
                }`}
              />
              {showError('numTarjeta') && errors.numTarjeta && (
                <p id="numTarjeta-error" className="text-xs text-red-400">{errors.numTarjeta}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="vencimiento" className="text-xs font-black text-white uppercase tracking-wider">Vencimiento MM/AA</label>
                <input
                  id="vencimiento"
                  type="text"
                  maxLength={5}
                  value={formattedVencimiento}
                  onChange={(e) => setVencimiento(e.target.value)}
                  onBlur={() => handleBlur('vencimiento')}
                  onFocus={() => speak('Vencimiento MM/AA')}
                  onMouseEnter={() => speak('Vencimiento MM/AA')}
                  onMouseLeave={stop}
                  aria-label="Vencimiento MM/AA"
                  aria-invalid={showError('vencimiento') && Boolean(errors.vencimiento)}
                  aria-describedby={showError('vencimiento') && errors.vencimiento ? 'vencimiento-error' : undefined}
                  placeholder="MM/AA"
                  className={`w-full bg-white text-black font-medium px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    showError('vencimiento') && errors.vencimiento ? 'border-red-600' : 'border-zinc-300'
                  }`}
                />
                {showError('vencimiento') && errors.vencimiento && (
                  <p id="vencimiento-error" className="text-xs text-red-400">{errors.vencimiento}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="cvv" className="text-xs font-black text-white uppercase tracking-wider">CVV</label>
                <input
                  id="cvv"
                  type="password"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  onBlur={() => handleBlur('cvv')}
                  onFocus={() => speak('CVV')}
                  onMouseEnter={() => speak('CVV')}
                  onMouseLeave={stop}
                  aria-label="CVV"
                  aria-invalid={showError('cvv') && Boolean(errors.cvv)}
                  aria-describedby={showError('cvv') && errors.cvv ? 'cvv-error' : undefined}
                  placeholder="123"
                  className={`w-full bg-white text-black font-medium px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    showError('cvv') && errors.cvv ? 'border-red-600' : 'border-zinc-300'
                  }`}
                />
                {showError('cvv') && errors.cvv && (
                  <p id="cvv-error" className="text-xs text-red-400">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="nombreTarjeta" className="text-xs font-black text-white uppercase tracking-wider">Nombre completo</label>
              <input
                id="nombreTarjeta"
                type="text"
                value={nombreTarjeta}
                onChange={(e) => setNombreTarjeta(e.target.value)}
                onBlur={() => handleBlur('nombreTarjeta')}
                onFocus={() => speak('Nombre completo')}
                onMouseEnter={() => speak('Nombre completo')}
                onMouseLeave={stop}
                aria-label="Nombre completo"
                aria-invalid={showError('nombreTarjeta') && Boolean(errors.nombreTarjeta)}
                aria-describedby={showError('nombreTarjeta') && errors.nombreTarjeta ? 'nombreTarjeta-error' : undefined}
                placeholder="Juan Pérez Gómez"
                className={`w-full bg-white text-black font-medium px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                  showError('nombreTarjeta') && errors.nombreTarjeta ? 'border-red-600' : 'border-zinc-300'
                }`}
              />
              {showError('nombreTarjeta') && errors.nombreTarjeta && (
                <p id="nombreTarjeta-error" className="text-xs text-red-400">{errors.nombreTarjeta}</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end pt-4">
          <button
            type="submit"
            disabled={!isFormValid}
            onFocus={() => speak(`Pagar ${totalPrice.toFixed(2)}`)}
            onMouseEnter={() => speak(`Pagar ${totalPrice.toFixed(2)}`)}
            onMouseLeave={stop}
            aria-label={`Pagar ${totalPrice.toFixed(2)}`}
            className={`font-bold text-xs tracking-widest uppercase px-8 py-3 rounded transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 ${
              isFormValid
                ? 'bg-red-800 hover:bg-red-700 text-white'
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            Pagar 47.50
          </button>
        </div>
      </form>
    </div>
  );
};
