import { useCallback, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const supportsSpeech =
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  'SpeechSynthesisUtterance' in window;

export function useSpeakOnHover() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { voiceAssist } = useAccessibility();

  const speak = useCallback(
    (text: string) => {
      if (!voiceAssist || !supportsSpeech) return;

      const cleanText = text.trim();

      if (!cleanText) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);

      utterance.lang = 'es-PE';
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      utteranceRef.current = utterance;

      window.speechSynthesis.speak(utterance);
    },
    [voiceAssist],
  );

  const speakElement = useCallback(
    (element: HTMLElement) => {
      if (!voiceAssist || !supportsSpeech) return;

      const ariaLabel = element.getAttribute('aria-label');
      const title = element.getAttribute('title');
      const text = element.innerText;
      const fallback = element.textContent;

      const content =
        ariaLabel ||
        title ||
        text ||
        fallback ||
        '';

      speak(content);
    },
    [voiceAssist, speak],
  );

  const stop = useCallback(() => {
    if (!supportsSpeech) return;

    window.speechSynthesis.cancel();
    utteranceRef.current = null;
  }, []);

   return {
    speak,
    speakElement,
    stop, };
}
