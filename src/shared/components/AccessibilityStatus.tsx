import { useAccessibility } from "../context/AccessibilityContext";

export function AccessibilityStatus() {
  const {
    hearingAid,
    cognitiveMode,
    visualAid,
    motorAid,
    voiceAssist,
    reduceMotion,
    message,
  } = useAccessibility();

  const enabledItems = [
    hearingAid && "Auditivo",
    cognitiveMode && "Cognitivo",
    visualAid && "Visual",
    motorAid && "Motor",
    voiceAssist && "Voz",
    reduceMotion && "Sin movimiento",
  ].filter(Boolean);

  if (!enabledItems.length) {
    return null;
  }

  return (
    <div
      data-a11y-ignore="true"
      style={{
        position: "fixed",
        left: "12px",
        bottom: "12px",
        zIndex: 2147483647,
        width: "320px",
        maxWidth: "320px",
      }}
    >
      <div
        style={{
          background: "#111",
          border: "1px solid #7f1d1d",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,.5)",
        }}
      >
        <div
          style={{
            padding: "12px",
            borderBottom: "1px solid #27272a",
          }}
        >
          <strong>Accesibilidad activa</strong>
          <br />
          {enabledItems.join(", ")}
        </div>

        {hearingAid && (
          <div style={{ padding: "12px" }}>
            <strong>Transcripción</strong>

            <div
              style={{
                marginTop: "8px",
                padding: "10px",
                background: "#172554",
                borderRadius: "8px",
                wordBreak: "break-word",
              }}
            >
              {message || "Esperando contenido..."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}