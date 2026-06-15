import { useEffect, useRef, useState, type FC, type FormEvent } from 'react';
import { useSpeakOnHover } from '../../../shared/hooks/useSpeakOnHover';
import { useAutoFocus } from '../../../shared/hooks/useAutoFocus';
import { type ViewRoute } from '../../../shared/types/navigation';

interface ContactanosViewProps {
  onNavigate: (route: ViewRoute) => void;
}

export const ContactanosView: FC<ContactanosViewProps> = ({ onNavigate }) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const headingRef = useAutoFocus<HTMLHeadingElement>();
  const successMessageRef = useRef<HTMLHeadingElement | null>(null);
  const { speak, stop } = useSpeakOnHover();

  useEffect(() => {
    if (isSubmitted) {
      successMessageRef.current?.focus();
    }
  }, [isSubmitted]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    window.scrollTo(0, 0); 
  };

  if (isSubmitted) {
      return (
        <div
          id="main-content"
          aria-live="assertive"
          aria-atomic="true"
          className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 transition-all"
      >
        <h2
          ref={successMessageRef}
          tabIndex={-1}
          className="text-3xl md:text-4xl font-bold tracking-normal text-white mb-6"
        >
          MENSAJE ENVIADO CON ÉXITO
        </h2>
        <p className="text-zinc-500 text-sm md:text-base mb-10 max-w-xl leading-relaxed">
          Gracias por comunicarte con nosotros. Nuestro equipo de Atención al Cliente revisará tu consulta.
        </p>
        <button
          onClick={() => onNavigate('inicio')}
          onMouseEnter={() => speak('Aceptar')}
          onFocus={() => speak('Aceptar')}
          onMouseLeave={stop}
          onBlur={stop}
          className="bg-red-800 hover:bg-red-700 text-white font-medium text-sm px-16 py-2.5 rounded-md transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
        >
          Aceptar
        </button>
      </div>
    );
  }

  return (
    <div id="main-content" className="max-w-5xl mx-auto px-6 py-12">
      <h1 ref={headingRef} tabIndex={-1} className="text-3xl md:text-4xl font-bold text-white uppercase mb-3 tracking-wide focus:outline-none">
        CONTÁCTANOS
      </h1>
      <p className="text-xl text-zinc-300 font-normal mb-4">
        Atención de consultas o incidencias
      </p>
      <p id="contactanos-descripcion" className="text-zinc-600 text-sm mb-12">
        Para asegurar la calidad y optimización de nuestro servicio, por favor llenar todos los campos que solicitamos.¡Gracias!
      </p>

      <form onSubmit={handleSubmit} className="space-y-10" aria-describedby="contactanos-descripcion">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
          
          <div className="flex flex-col gap-2">
            <label htmlFor="nombre" className="text-xs font-bold text-white uppercase tracking-wider">Nombre</label>
            <input
              type="text"
              id="nombre"
              required
              placeholder="Value"
              onMouseEnter={() => speak('Nombre')}
              onFocus={() => speak('Nombre')}
              onMouseLeave={stop}
              onBlur={stop}
              className="bg-white text-black p-3 rounded-md focus:outline-none text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="apellidos" className="text-xs font-bold text-white uppercase tracking-wider">Apellidos</label>
            <input
              type="text"
              id="apellidos"
              required
              placeholder="Value"
              onMouseEnter={() => speak('Apellidos')}
              onFocus={() => speak('Apellidos')}
              onMouseLeave={stop}
              onBlur={stop}
              className="bg-white text-black p-3 rounded-md focus:outline-none text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="dni" className="text-xs font-bold text-white uppercase tracking-wider">DNI</label>
            <input
              type="text"
              id="dni"
              required
              maxLength={8}
              placeholder="Value"
              onMouseEnter={() => speak('DNI')}
              onFocus={() => speak('DNI')}
              onMouseLeave={stop}
              onBlur={stop}
              className="bg-white text-black p-3 rounded-md focus:outline-none text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tel" className="text-xs font-bold text-white uppercase tracking-wider">Teléfono de contacto</label>
            <input
              type="tel"
              id="tel"
              placeholder="Value"
              onMouseEnter={() => speak('Teléfono de contacto')}
              onFocus={() => speak('Teléfono de contacto')}
              onMouseLeave={stop}
              onBlur={stop}
              className="bg-white text-black p-3 rounded-md focus:outline-none text-sm"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="email" className="text-xs font-bold text-white uppercase tracking-wider">Correo electrónico</label>
            <input
              type="email"
              id="email"
              required
              placeholder="Value"
              onMouseEnter={() => speak('Correo electrónico')}
              onFocus={() => speak('Correo electrónico')}
              onMouseLeave={stop}
              onBlur={stop}
              className="bg-white text-black p-3 rounded-md focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="desc" className="text-xs font-bold text-white uppercase tracking-wider">
            Descripción <span className="text-zinc-500 font-normal lowercase">— Por favor ingresa aquí todos los detalles de tu caso.</span>
          </label>
          <textarea
            id="desc"
            required
            rows={8}
            onMouseEnter={() => speak('Descripción')}
            onFocus={() => speak('Descripción')}
            onMouseLeave={stop}
            onBlur={stop}
            className="bg-white text-black p-4 rounded-md focus:outline-none resize-none text-sm"
          />
        </div>

        <button
          type="submit"
          onMouseEnter={() => speak('Enviar')}
          onFocus={() => speak('Enviar')}
          onMouseLeave={stop}
          onBlur={stop}
          className="bg-red-800 hover:bg-red-700 text-white font-medium text-sm px-10 py-2.5 rounded transition-colors focus:outline-none"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};
