import { useMemo, useState, type FC, type FormEvent } from 'react';
import { CINEMAS_DATA } from '../../../data/cinemas';
import { SNACKS_DATA, type SnackCategory } from '../../../data/snacks';
import { useAutoFocus } from '../../../shared/hooks/useAutoFocus';
import { useSpeakOnHover } from '../../../shared/hooks/useSpeakOnHover';
import { type ViewRoute } from '../../../shared/types/navigation';

interface DulceriaViewProps {
  onNavigate: (route: ViewRoute) => void;
}

const categoryLabels: Record<SnackCategory, string> = {
  snacks: 'Snacks',
  canchita: 'Canchita',
  combos: 'Combos',
  bebidas: 'Bebidas',
};

const categoryOrder: SnackCategory[] = ['snacks', 'canchita', 'combos', 'bebidas'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass = 'w-full rounded border border-zinc-300 bg-white px-4 py-2.5 font-medium text-black focus:outline-none focus:ring-2 focus:ring-red-600';

const isValidExpiration = (value: string) => {
  const digits = value.replace(/\D/g, '');
  const normalized = digits.length === 4 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : value.replace(/\s/g, '');
  if (!/^\d{2}\/\d{2}$/.test(normalized)) return false;
  const [month, year] = normalized.split('/').map(Number);
  return month >= 1 && month <= 12 && year >= 24;
};

export const DulceriaView: FC<DulceriaViewProps> = ({ onNavigate }) => {
  const headingRef = useAutoFocus<HTMLHeadingElement>();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<SnackCategory>('snacks');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [numTarjeta, setNumTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { speak, stop } = useSpeakOnHover();

  const selectedCinema = CINEMAS_DATA.find((cinema) => cinema.id === selectedCinemaId) ?? null;
  const items = useMemo(() => SNACKS_DATA.filter((item) => item.categoria === activeCategory), [activeCategory]);
  const selectedItems = useMemo(
    () => SNACKS_DATA
      .filter((item) => (quantities[item.id] ?? 0) > 0)
      .map((item) => ({ ...item, qty: quantities[item.id] ?? 0 })),
    [quantities],
  );
  const totalItems = selectedItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  const orderCode = useMemo(() => `CINERAMA-DUL-${Date.now().toString().slice(-6)}`, [step]);
  const qrData = encodeURIComponent(`${orderCode}|${selectedCinema?.name ?? 'CINERAMA'}|S/${totalPrice.toFixed(2)}`);

  const errors = {
    dni: dni.length === 8 ? '' : 'El DNI debe tener 8 digitos.',
    nombre: nombre.trim() ? '' : 'Ingresa tu nombre.',
    apellidos: apellidos.trim() ? '' : 'Ingresa tus apellidos.',
    correo: correo.trim() && emailPattern.test(correo) ? '' : 'Ingresa un email valido.',
    numTarjeta: numTarjeta.length === 16 ? '' : 'La tarjeta debe tener 16 digitos.',
    vencimiento: isValidExpiration(vencimiento) ? '' : 'Usa el formato MM/AA.',
    cvv: cvv.length === 3 ? '' : 'El CVV debe tener 3 digitos.',
    nombreTarjeta: nombreTarjeta.trim() ? '' : 'Ingresa el nombre de la tarjeta.',
  };
  const isPaymentValid = Object.values(errors).every((error) => error === '');
  const formattedVencimiento = vencimiento
    .replace(/[^0-9]/g, '')
    .slice(0, 4)
    .replace(/(\d{2})(\d{1,2})?/, (_, m1, m2) => (m2 ? `${m1}/${m2}` : m1));

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const nextQty = Math.max((prev[id] ?? 0) + delta, 0);
      return { ...prev, [id]: nextQty };
    });
  };

  const handlePayment = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isPaymentValid || totalItems === 0 || !selectedCinema) return;
    setStep(4);
    window.scrollTo(0, 0);
  };

  return (
    <main id="main-content" className="max-w-6xl mx-auto px-6 py-10 space-y-8" aria-labelledby="dulceria-page-title">
      <header className="flex flex-col gap-4 border-b border-zinc-900 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-red-500">Dulceria Cinerama</p>
          <h1 ref={headingRef} id="dulceria-page-title" tabIndex={-1} className="mt-3 text-3xl font-black uppercase tracking-tight text-white focus:outline-none md:text-4xl">
            Compra dulceria
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Elige tu cine, arma tu pedido y recoge en caja con tu QR.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('booking')}
          onMouseEnter={() => speak('Comprar entradas')}
          onFocus={() => speak('Comprar entradas')}
          onMouseLeave={stop}
          onBlur={stop}
          
        >
        </button>
      </header>

      <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-black uppercase tracking-widest text-zinc-500">
        {['Cine', 'Productos', 'Pago', 'Ticket'].map((label, index) => (
          <div key={label} className={`rounded border px-2 py-3 ${step >= index + 1 ? 'border-red-700 bg-red-950/40 text-white' : 'border-zinc-900 bg-zinc-950'}`}>
            {label}
          </div>
        ))}
      </div>

      {step === 1 && (
        <section className="space-y-6" aria-label="Seleccion de cine">
          <div>
            <h2 className="text-2xl font-black uppercase text-white"> ¿En qué cine estás?</h2>
            <p className="mt-2 text-sm text-zinc-400">El pedido quedara listo para reclamarlo en la caja del cine seleccionado.</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950">
            {CINEMAS_DATA.map((cinema) => (
              <button
                key={cinema.id}
                type="button"
                onClick={() => setSelectedCinemaId(cinema.id)}
                onMouseEnter={() => speak(cinema.name)}
                onFocus={() => speak(cinema.name)}
                onMouseLeave={stop}
                onBlur={stop}
                className={`grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-zinc-900 px-4 py-4 text-left transition-colors last:border-b-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 md:grid-cols-[3rem_1fr_auto] md:px-6 ${
                  selectedCinemaId === cinema.id ? 'bg-red-950/50' : 'hover:bg-zinc-900/70'
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-black ${
                  selectedCinemaId === cinema.id ? 'border-red-600 bg-red-700 text-white' : 'border-zinc-800 text-zinc-400'
                }`}>
                  {cinema.id}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black uppercase text-white">{cinema.name}</span>
                  <span className="mt-1 block text-xs leading-5 text-zinc-400">{cinema.address}</span>
                </span>
                <span className={`hidden rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest sm:inline-flex ${
                  selectedCinemaId === cinema.id ? 'bg-red-700 text-white' : 'bg-black text-zinc-500'
                }`}>
                  {selectedCinemaId === cinema.id ? 'Seleccionado' : 'Elegir'}
                </span>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!selectedCinema}
              onClick={() => setStep(2)}
              className={`rounded px-8 py-3 text-xs font-black uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 ${
                selectedCinema ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-zinc-900 text-zinc-600'
              }`}
            >
              Continuar
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <section className="space-y-6" aria-label="Productos de dulceria">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <h2 className="text-2xl font-black uppercase text-white">Elige tus productos</h2>
                <p className="mt-2 text-sm text-zinc-400">Cine seleccionado: <span className="font-bold text-white">{selectedCinema?.name}</span></p>
              </div>
              <button type="button" onClick={() => setStep(1)} className="text-left text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-400 md:text-right">
                Cambiar cine
              </button>
            </div>
            <div role="tablist" aria-label="Categorias de dulceria" className="flex flex-wrap gap-3 border-b border-zinc-900 pb-4">
              {categoryOrder.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  role="tab"
                  aria-selected={activeCategory === category}
                  aria-controls="dulceria-items-panel"
                  className={`rounded px-6 py-3 text-xs font-black uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 md:text-sm ${
                    activeCategory === category ? 'bg-red-700 text-white shadow-md' : 'bg-zinc-950 text-zinc-300 hover:text-white'
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
            <div id="dulceria-items-panel" role="tabpanel" className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => {
                const qty = quantities[item.id] ?? 0;
                return (
                  <article key={item.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-zinc-100 bg-white p-5 text-black shadow-xl">
                    <div className="flex h-36 items-center justify-center overflow-hidden rounded-lg bg-zinc-100">
                      <img
                        src={item.imgUrl}
                        alt={item.name}
                        className="h-full w-full object-contain p-2"
                        onError={(event) => {
                          event.currentTarget.src = 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-widest text-red-700">{categoryLabels[item.categoria]}</p>
                      <h3 className="text-sm font-extrabold uppercase leading-tight tracking-tight">{item.name}</h3>
                      <p className="min-h-10 text-xs leading-5 text-zinc-600">{item.description}</p>
                      <p className="text-lg font-black text-zinc-900">S/{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-zinc-100 p-2">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        disabled={qty === 0}
                        aria-label={`Quitar uno de ${item.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded bg-zinc-900 text-lg font-black text-white disabled:bg-zinc-300"
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-lg font-black">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        aria-label={`Agregar uno de ${item.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded bg-red-700 text-lg font-black text-white hover:bg-red-600"
                      >
                        +
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-zinc-900 bg-zinc-950 p-5 text-zinc-300 lg:sticky lg:top-24">
            <h2 className="text-lg font-black uppercase tracking-widest text-white">Tu pedido</h2>
            <div className="mt-4 space-y-3">
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 border-b border-zinc-900 pb-2 text-sm">
                    <span>{item.qty} x {item.name}</span>
                    <span className="font-bold text-white">S/{(item.qty * item.price).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">Aun no agregaste productos.</p>
              )}
            </div>
            <div className="mt-5 rounded-2xl bg-black p-4">
              <p className="text-sm">Productos: <span className="font-semibold text-white">{totalItems}</span></p>
              <p className="text-sm">Total: <span className="font-semibold text-white">S/{totalPrice.toFixed(2)}</span></p>
            </div>
            <button
              type="button"
              disabled={totalItems === 0}
              onClick={() => setStep(3)}
              className={`mt-5 w-full rounded px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 ${
                totalItems > 0 ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-zinc-900 text-zinc-600'
              }`}
            >
              Comprar ahora
            </button>
          </aside>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handlePayment} className="grid gap-8 lg:grid-cols-[1fr_22rem]" aria-label="Datos y pago">
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-black uppercase text-white">Datos y pago</h2>
              <p className="mt-2 text-sm text-zinc-400">Completa tus datos para generar el QR de recojo.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="DNI" error={submitted ? errors.dni : ''}>
                <input value={dni} maxLength={8} onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))} placeholder="12345678" className={inputClass} />
              </Field>
              <Field label="Nombre" error={submitted ? errors.nombre : ''}>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Juan" className={inputClass} />
              </Field>
              <Field label="Apellidos" error={submitted ? errors.apellidos : ''}>
                <input value={apellidos} onChange={(e) => setApellidos(e.target.value)} placeholder="Perez Gomez" className={inputClass} />
              </Field>
              <Field label="Correo electronico" error={submitted ? errors.correo : ''}>
                <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="correo@ejemplo.com" className={inputClass} />
              </Field>
            </div>
            <div className="border-t border-zinc-900 pt-6">
              <h3 className="text-lg font-black uppercase tracking-widest text-white">Datos de tarjeta</h3>
              <div className="mt-5 grid gap-5">
                <Field label="Numero de tarjeta" error={submitted ? errors.numTarjeta : ''}>
                  <input value={numTarjeta} maxLength={16} onChange={(e) => setNumTarjeta(e.target.value.replace(/\D/g, ''))} placeholder="1234123412341234" className={inputClass} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Vencimiento MM/AA" error={submitted ? errors.vencimiento : ''}>
                    <input value={formattedVencimiento} maxLength={5} onChange={(e) => setVencimiento(e.target.value)} placeholder="MM/AA" className={inputClass} />
                  </Field>
                  <Field label="CVV" error={submitted ? errors.cvv : ''}>
                    <input type="password" value={cvv} maxLength={3} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} placeholder="123" className={inputClass} />
                  </Field>
                </div>
                <Field label="Nombre en la tarjeta" error={submitted ? errors.nombreTarjeta : ''}>
                  <input value={nombreTarjeta} onChange={(e) => setNombreTarjeta(e.target.value)} placeholder="Juan Perez Gomez" className={inputClass} />
                </Field>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-zinc-900 bg-zinc-950 p-5 text-zinc-300 lg:sticky lg:top-24">
            <h2 className="text-lg font-black uppercase tracking-widest text-white">Resumen</h2>
            <p className="mt-3 text-sm text-zinc-400">{selectedCinema?.name}</p>
            <div className="mt-4 space-y-3">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 border-b border-zinc-900 pb-2 text-sm">
                  <span>{item.qty} x {item.name}</span>
                  <span className="font-bold text-white">S/{(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-4xl font-black text-white">S/{totalPrice.toFixed(2)}</p>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 rounded border border-zinc-800 py-3 text-xs font-black uppercase tracking-widest text-white">Atras</button>
              <button type="submit" className="flex-1 rounded bg-red-700 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-red-600">Pagar</button>
            </div>
          </aside>
        </form>
      )}

      {step === 4 && (
        <section className="mx-auto max-w-4xl rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-center shadow-2xl md:p-10" aria-label="Compra exitosa">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-red-500">Compra exitosa</p>
          <h2 className="mt-3 text-3xl font-black uppercase text-white">Tu pedido esta listo para reclamar</h2>
          <p className="mt-3 text-sm text-zinc-400">Muestra este QR en caja de {selectedCinema?.name} para recoger tu dulceria.</p>
          <div className="mt-8 grid gap-8 md:grid-cols-[16rem_1fr] md:text-left">
            <div className="rounded-2xl bg-white p-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrData}`}
                alt="Codigo QR para reclamar el pedido en caja"
                className="mx-auto h-56 w-56"
              />
            </div>
            <div className="space-y-4 rounded-2xl bg-black p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Codigo</p>
                <p className="text-xl font-black text-white">{orderCode}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Cliente</p>
                <p className="text-white">{nombre} {apellidos}</p>
                <p className="text-sm text-zinc-400">{correo}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Detalle</p>
                <div className="mt-2 space-y-2 text-sm text-zinc-300">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4">
                      <span>{item.qty} x {item.name}</span>
                      <span>S/{(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-2xl font-black text-white">Total S/{totalPrice.toFixed(2)}</p>
                <p className="mt-1 text-sm text-zinc-400">Tarjeta terminada en **** {numTarjeta.slice(-4)}</p>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => onNavigate('inicio')} className="mt-8 rounded bg-red-700 px-8 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-red-600">
            Finalizar
          </button>
        </section>
      )}
    </main>
  );
};

const Field: FC<{ label: string; error: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-black uppercase tracking-wider text-white">{label}</span>
    {children}
    {error && <span className="text-xs text-red-400">{error}</span>}
  </label>
);
