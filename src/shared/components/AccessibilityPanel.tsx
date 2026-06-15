import { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const accessibilityOptions = [
  {
    key: 'voiceAssist',
    label: 'Voz',
    description: 'Lee botones y controles al pasar o enfocar.',
  },
  {
    key: 'cognitiveMode',
    label: 'Cognitivo',
    description: 'Reduce distracciones y mejora la lectura.',
  },
  {
    key: 'visualAid',
    label: 'Visual',
    description: 'Aumenta contraste, subrayado y legibilidad.',
  },
  {
    key: 'hearingAid',
    label: 'Auditivo',
    description: 'Muestra transcripciones, subtitulos y avisos visuales.',
  },
  {
    key: 'motorAid',
    label: 'Motor',
    description: 'Agrandar areas de toque, foco y acciones rapidas.',
  },
  {
    key: 'reduceMotion',
    label: 'Sin movimiento',
    description: 'Disminuye animaciones y desplazamientos.',
  },
] as const;

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const accessibility = useAccessibility();

  return (
    <section className="fixed bottom-4 right-4 z-[70]" aria-label="Opciones de accesibilidad">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        className="min-h-12 rounded-full border border-white/20 bg-red-800 px-4 py-3 text-xs font-black uppercase tracking-widest text-white shadow-2xl transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
      >
        Accesibilidad
      </button>

      {isOpen && (
        <div
          id="accessibility-panel"
          className="mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-white/15 bg-zinc-950 p-4 text-white shadow-2xl"
        >
          <h2 className="text-sm font-black uppercase tracking-widest">Ayudas</h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">
            Activa solo lo que necesites para navegar Cinerama con mas comodidad.
          </p>
          <div className="mt-4 space-y-3">
            {accessibilityOptions.map((option) => {
              const enabled = accessibility[option.key];
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => accessibility.toggleSetting(option.key)}
                  aria-pressed={enabled}
                  className={`w-full rounded-md border px-3 py-3 text-left transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 ${
                    enabled
                      ? 'border-red-500 bg-red-950/70 text-white'
                      : 'border-white/10 bg-black text-zinc-300 hover:border-white/30'
                  }`}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="text-xs font-black uppercase tracking-widest">{option.label}</span>
                    <span className="text-[11px] font-bold uppercase text-zinc-400">{enabled ? 'Activo' : 'Off'}</span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-zinc-400">{option.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
