import { useState, type FC } from 'react';
import { SNACKS_DATA, type SnackCategory } from '../../../data/snacks';
import { useAutoFocus } from '../../../shared/hooks/useAutoFocus';
import { useSpeakOnHover } from '../../../shared/hooks/useSpeakOnHover';

interface StepDulceriaProps {
  onNext: (summary: {
    items: { id: string; name: string; qty: number; price: number }[];
    totalItems: number;
    totalPrice: number;
  }) => void;
  onBack: () => void;
  initialQuantities?: Record<string, number>;
}

const categoryLabels: Record<SnackCategory, string> = {
  snacks: 'Snacks',
  canchita: 'Canchita',
  combos: 'Combos',
  bebidas: 'Bebidas',
};

export const StepDulceria: FC<StepDulceriaProps> = ({ onNext, onBack, initialQuantities }) => {
  const headingRef = useAutoFocus<HTMLHeadingElement>();
  const [activeTab, setActiveTab] = useState<SnackCategory>('snacks');
  const [quantities, setQuantities] = useState<Record<string, number>>(initialQuantities ?? {});
  const { speak, stop } = useSpeakOnHover();

  const handleIncrement = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrement = (id: string) => {
    if ((quantities[id] || 0) > 0) {
      setQuantities((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    }
  };

  const itemsFiltrados = SNACKS_DATA.filter((item) => item.categoria === activeTab);
  const selectedItems = SNACKS_DATA.filter((item) => quantities[item.id] > 0).map((item) => ({
    id: item.id,
    name: item.name,
    qty: quantities[item.id] ?? 0,
    price: item.price,
  }));

  const totalItems = selectedItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 animate-in fade-in duration-500 space-y-8" aria-labelledby="dulceria-heading">
      <section >
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 md:p-8">
            <p className="text-xl font-black uppercase tracking-[0.35em] text-red-500">Dulceria Cinerama</p>
     
           
          </div>
                 </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
        <section className="space-y-6" aria-label="Productos de dulceria">
          <div role="tablist" aria-label="Categorias de dulceria" className="flex flex-wrap gap-3 border-b border-zinc-900 pb-4">
            {(['snacks', 'canchita', 'combos', 'bebidas'] as SnackCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                onMouseEnter={() => speak(categoryLabels[cat])}
                onFocus={() => speak(categoryLabels[cat])}
                onMouseLeave={stop}
                onBlur={stop}
                role="tab"
                aria-selected={activeTab === cat}
                aria-controls="snack-items-panel"
                className={`text-xs md:text-sm font-black tracking-widest uppercase px-6 py-3 rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                  activeTab === cat ? 'bg-red-700 text-white shadow-md' : 'text-zinc-300 bg-zinc-950 hover:text-white'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          <div id="snack-items-panel" role="tabpanel" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {itemsFiltrados.map((item) => {
              const qty = quantities[item.id] || 0;
              return (
                <article
                  key={item.id}
                  aria-labelledby={`snack-title-${item.id}`}
                  className="bg-white text-black rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl border border-zinc-100 transition-transform hover:-translate-y-0.5"
                >
                  <div className="h-36 overflow-hidden rounded-lg bg-zinc-100 flex items-center justify-center">
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
                    <h2 id={`snack-title-${item.id}`} tabIndex={0} className="font-extrabold text-sm tracking-tight uppercase leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
                      {item.name}
                    </h2>
                    <p className="text-xs leading-5 text-zinc-600">{item.description}</p>
                    <p className="font-black text-lg text-zinc-900">S/{item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-zinc-100 p-2">
                    <button
                      type="button"
                      onClick={() => handleDecrement(item.id)}
                      onMouseEnter={() => speak(`Quitar uno de ${item.name}`)}
                      onFocus={() => speak(`Quitar uno de ${item.name}`)}
                      onMouseLeave={stop}
                      onBlur={stop}
                      aria-label={`Quitar uno de ${item.name}`}
                      className="w-9 h-9 rounded bg-zinc-900 hover:bg-zinc-700 text-white font-black text-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    >
                      -
                    </button>
                    <span className="font-black text-lg min-w-8 text-center" aria-live="polite">{qty}</span>
                    <button
                      type="button"
                      onClick={() => handleIncrement(item.id)}
                      onMouseEnter={() => speak(`Agregar uno de ${item.name}`)}
                      onFocus={() => speak(`Agregar uno de ${item.name}`)}
                      onMouseLeave={stop}
                      onBlur={stop}
                      aria-label={`Agregar uno de ${item.name}`}
                      className="w-9 h-9 rounded bg-red-700 hover:bg-red-600 text-white font-black text-lg flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
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
          <h2 className="text-lg font-black uppercase tracking-widest text-white">Tu dulceria</h2>
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
            <p className="text-sm">Total dulceria: <span className="font-semibold text-white">S/{totalPrice.toFixed(2)}</span></p>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 border border-zinc-800 bg-transparent text-white font-bold text-xs tracking-widest uppercase py-3.5 rounded transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
            >
              Atras
            </button>
            <button
              type="button"
              onClick={() => onNext({ items: selectedItems, totalItems, totalPrice })}
              className="flex-1 bg-red-700 hover:bg-red-600 text-white font-bold text-xs tracking-widest uppercase px-6 py-3.5 rounded transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
            >
              Siguiente
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};
