import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import aiAnimation from "../assets/animations/ai-loading.json";
import { Maximize2, X, Monitor, Smartphone, Tablet } from "lucide-react";

interface Props {
  preview: React.ReactNode;
  code: string;
  isLoading: boolean;
}

const LOADING_MESSAGES = [
  {
    title: "Analizando tu solicitud...",
    desc: "Interpretando los requisitos de tu componente.",
  },
  {
    title: "Diseñando la estructura...",
    desc: "Definiendo la jerarquía de nodos y elementos HTML.",
  },
  {
    title: "Aplicando estilos...",
    desc: "Generando las propiedades CSS y el diseño visual.",
  },
  {
    title: "Escribiendo la lógica...",
    desc: "Programando los estados y manejadores de eventos.",
  },
  {
    title: "Refinando detalles...",
    desc: "Asegurando que el JSON sea válido y el código esté limpio.",
  },
  {
    title: "Casi listo...",
    desc: "Dando los últimos toques a la interfaz generada.",
  },
];

// ✅ AQUÍ ESTÁ: Exportando explícitamente como Preview
export const Preview = ({ preview, code, isLoading }: Props) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
      setMessageIndex(0);
    };
  }, [isLoading]);

  const getWidth = () => {
    if (viewMode === "mobile") return "max-w-[375px]";
    if (viewMode === "tablet") return "max-w-[768px]";
    return "max-w-full";
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-6 bg-slate-800 rounded-xl border border-slate-700">
        <div className="w-64 h-64">
          <Lottie animationData={aiAnimation} loop={true} autoplay={true} />
        </div>
        <div className="max-w-md transition-all duration-500">
          <p className="text-xl font-bold text-cyan-400 animate-pulse">
            {LOADING_MESSAGES[messageIndex]?.title || "Cargando..."}
          </p>
          <p className="text-sm text-slate-400 mt-2 h-10">
            {LOADING_MESSAGES[messageIndex]?.desc ||
              "Por favor espera un momento."}
          </p>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6 gap-4 bg-slate-800 rounded-xl border border-slate-700 border-dashed opacity-70">
        <Monitor size={64} className="text-slate-600" />
        <p className="font-medium text-lg">Panel de Vista Previa</p>
        <p className="text-sm max-w-xs">
          Describe un componente y aquí verás el resultado.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full relative">
      {/* CONTENEDOR DE VISTA PREVIA PEQUEÑA */}
      <div className="bg-white rounded-2xl shadow-xl p-8 shrink-0 relative group border border-slate-200">
        <button
          onClick={() => setIsFullScreen(true)}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 rounded-full transition-all shadow-sm z-10"
          title="Ver en pantalla completa"
        >
          <Maximize2 size={18} />
        </button>

        <div className="w-full rounded-lg p-6 bg-gray-50 relative overflow-auto max-h-[45vh] border border-gray-200">
          {preview}
        </div>
      </div>

      {/* MODAL FULLSCREEN */}
      {isFullScreen && (
        <div className="fixed inset-0 z-100 bg-slate-950 flex flex-col animate-in fade-in duration-200">
          {/* Header del Modal */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shadow-xl">
            <div className="flex items-center gap-6">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Vista en Vivo
              </h3>

              {/* Selectores de tamaño */}
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button
                  onClick={() => setViewMode("desktop")}
                  className={`p-1.5 rounded ${viewMode === "desktop" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  <Monitor size={18} />
                </button>
                <button
                  onClick={() => setViewMode("tablet")}
                  className={`p-1.5 rounded ${viewMode === "tablet" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  <Tablet size={18} />
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  className={`p-1.5 rounded ${viewMode === "mobile" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  <Smartphone size={18} />
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsFullScreen(false)}
              className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Área de Renderizado Full */}
          <div className="flex-1 overflow-auto bg-slate-900 p-4 lg:p-10 flex justify-center">
            <div
              className={`w-full ${getWidth()} transition-all duration-300 shadow-2xl bg-white h-fit min-h-full rounded-sm overflow-hidden`}
            >
              {preview}
            </div>
          </div>
        </div>
      )}

      {/* CÓDIGO GENERADO */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 flex flex-col min-h-0 flex-1">
        <h4 className="text-sm text-slate-300 px-4 pt-4 pb-3 shrink-0 font-medium border-b border-slate-700/50">
          Código Fuente
        </h4>
        <div className="overflow-auto flex-1 px-4 pb-4 mt-2">
          <pre className="text-xs text-blue-300 whitespace-pre-wrap font-mono leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
