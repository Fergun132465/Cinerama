import {
createContext,
useContext,
useEffect,
useMemo,
useState,
type ReactNode,
} from "react";

type AccessibilitySettings = {
voiceAssist: boolean;
cognitiveMode: boolean;
visualAid: boolean;
hearingAid: boolean;
motorAid: boolean;
reduceMotion: boolean;
};

type AccessibilityContextValue = AccessibilitySettings & {
toggleSetting: (setting: keyof AccessibilitySettings) => void;
message: string;
announce: (text: string, options?: { speak?: boolean }) => void;
speak: (text: string) => void;
};

const STORAGE_KEY = "cinerama-accessibility-settings";

const defaultSettings: AccessibilitySettings = {
voiceAssist: false,
cognitiveMode: false,
visualAid: false,
hearingAid: false,
motorAid: false,
reduceMotion: false,
};

const INITIAL_MESSAGE =
"Bienvenido a CINERAMA. Usa Tab para navegar y Enter para seleccionar.";

const AccessibilityContext = createContext<
AccessibilityContextValue | undefined

> (undefined);

function getInitialSettings(): AccessibilitySettings {
if (typeof window === "undefined") {
return defaultSettings;
}

try {
const savedSettings = window.localStorage.getItem(STORAGE_KEY);

return savedSettings
  ? { ...defaultSettings, ...JSON.parse(savedSettings) }
  : defaultSettings;


} catch {
return defaultSettings;
}
}

export function AccessibilityProvider({
children,
}: {
children: ReactNode;
}) {
const [settings, setSettings] =
useState<AccessibilitySettings>(getInitialSettings);

const [message, setMessage] = useState(INITIAL_MESSAGE);

const speak = (text: string) => {
if (typeof window === "undefined") return;

const cleanText = text.trim();

if (!cleanText) return;

setMessage(cleanText);

if (!("speechSynthesis" in window)) return;

window.speechSynthesis.cancel();

const utterance = new SpeechSynthesisUtterance(cleanText);

utterance.lang = "es-PE";
utterance.rate = 0.95;
utterance.pitch = 1;
utterance.volume = 1;

window.speechSynthesis.speak(utterance);


};

const announce = (
text: string,
options?: { speak?: boolean },
) => {
setMessage(text);


if (options?.speak || settings.voiceAssist) {
  speak(text);
}


};

useEffect(() => {
if (typeof window === "undefined") return;

const root = document.documentElement;

Object.entries(settings).forEach(([key, enabled]) => {
  const attributeName = `data-a11y-${key.replace(
    /[A-Z]/g,
    (letter) => `-${letter.toLowerCase()}`,
  )}`;

  root.toggleAttribute(attributeName, enabled);
});

window.localStorage.setItem(
  STORAGE_KEY,
  JSON.stringify(settings),
);

}, [settings]);

useEffect(() => {
if (!settings.voiceAssist) return;


const getElementDescription = (
  element: HTMLElement,
): string => {
  if (
    element.closest(
      '[data-a11y-ignore="true"]',
    )
  ) {
    return "";
  }

  return (
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    element.innerText ||
    element.textContent ||
    ""
  ).trim();
};

const handleFocus = (
  event: FocusEvent,
) => {
  const target =
    event.target as HTMLElement;

  if (!target) return;

  const text =
    getElementDescription(target);

  if (!text) return;

  speak(text);
};

const handleMouseOver = (
  event: MouseEvent,
) => {
  const target =
    event.target as HTMLElement;

  if (!target) return;

  const text =
    getElementDescription(target);

  if (!text) return;

  speak(text);
};

document.addEventListener(
  "focusin",
  handleFocus,
);

document.addEventListener(
  "mouseover",
  handleMouseOver,
);

return () => {
  document.removeEventListener(
    "focusin",
    handleFocus,
  );

  document.removeEventListener(
    "mouseover",
    handleMouseOver,
  );
};

}, [settings.voiceAssist]);

const toggleSetting = (
setting: keyof AccessibilitySettings,
) => {
setSettings((currentSettings) => ({
...currentSettings,
[setting]:
!currentSettings[setting],
}));
};

const value =
useMemo<AccessibilityContextValue>(
() => ({
...settings,
toggleSetting,
message,
announce,
speak,
}),
[settings, message],
);

return (
<AccessibilityContext.Provider
value={value}
>
{children}
</AccessibilityContext.Provider>
);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccessibility(): AccessibilityContextValue {
const context =
useContext(AccessibilityContext);

if (!context) {
throw new Error(
"useAccessibility must be used inside AccessibilityProvider",
);
}

return context;
}
