import { useEffect, useState, type FC } from 'react';
import { BANNERS_DATA } from '../../data/movies';
import { useAccessibility } from '../context/AccessibilityContext';
import { useSpeakOnHover } from '../hooks/useSpeakOnHover';

export const HeroBanner: FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { speak, stop } = useSpeakOnHover();
  const { reduceMotion } = useAccessibility();
  const currentBanner = BANNERS_DATA[currentIndex];
  const bannerHeadingId = `hero-banner-title-${currentBanner.id}`;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? BANNERS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === BANNERS_DATA.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (reduceMotion) return undefined;
    const sliderTimer = window.setInterval(handleNext, 5500);
    return () => window.clearInterval(sliderTimer);
  }, [reduceMotion]);

  return (
    <section
      aria-labelledby={bannerHeadingId}
      className="relative w-full h-[50vh] md:h-[65vh] bg-cover bg-center flex items-center transition-all duration-500"
      style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4)), url('${currentBanner.imageUrl}')` }}
    >
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
        <h1 id={bannerHeadingId} className="text-red-600 text-5xl md:text-7xl font-black tracking-widest uppercase italic drop-shadow-2xl">
          {currentBanner.title}
        </h1>
        <p className="text-zinc-300 text-xs md:text-sm font-semibold tracking-widest mt-2 uppercase">
          {currentBanner.subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={handlePrev}
        onMouseEnter={() => speak('Anterior')}
        onFocus={() => speak('Anterior')}
        onMouseLeave={stop}
        onBlur={stop}
        aria-label="Anterior"
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-500 bg-black/40 text-xl text-zinc-400 transition-all hover:border-white hover:text-white md:left-8 md:h-12 md:w-12 focus-visible:bg-red-600/20"
      >
        &larr;
      </button>

      <button
        type="button"
        onClick={handleNext}
        onMouseEnter={() => speak('Siguiente')}
        onFocus={() => speak('Siguiente')}
        onMouseLeave={stop}
        onBlur={stop}
        aria-label="Siguiente"
        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-500 bg-black/40 text-xl text-zinc-400 transition-all hover:border-white hover:text-white md:right-8 md:h-12 md:w-12 focus-visible:bg-red-600/20"
      >
        &rarr;
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2" aria-label="Indicadores del slider">
        {BANNERS_DATA.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Mostrar banner ${banner.title}`}
            aria-pressed={currentIndex === index}
            className={`h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
              currentIndex === index ? 'w-8 bg-red-600' : 'w-2.5 bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
