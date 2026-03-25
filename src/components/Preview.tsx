import { Loader2 } from "lucide-react";

interface Props {
  preview: React.ReactNode;
  code: string;
  isLoading: boolean;
}

export const Preview = ({ preview, code, isLoading }: Props) => {

  // 🔄 SOLO loading cuando está generando
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-6">

        <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />

        <div>
          <p className="text-lg font-medium text-slate-300">
            Generando componente...
          </p>
          <p className="text-sm text-slate-500 mt-1">
            La IA está trabajando en tu solicitud
          </p>
        </div>

        {/* Skeleton */}
        <div className="w-full max-w-md space-y-4 mt-6">
          <div className="h-6 bg-slate-700 rounded animate-pulse"></div>
          <div className="h-6 bg-slate-700 rounded animate-pulse w-5/6"></div>
          <div className="h-6 bg-slate-700 rounded animate-pulse w-4/6"></div>
          <div className="h-32 bg-slate-800 rounded-xl animate-pulse mt-4"></div>
        </div>
      </div>
    );
  }

  // 💤 Estado inicial (ANTES de generar)
  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 text-center p-6">
        Aquí aparecerá la vista previa del componente generado
      </div>
    );
  }

  // ✅ Resultado normal
  return (
    <div className="flex flex-col gap-6 h-full">

      <div className="bg-white rounded-2xl shadow-xl p-8 flex-shrink-0">
        <div className="w-full rounded-lg p-6 bg-gray-100 relative overflow-auto max-h-[40vh]">
          {preview}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 flex flex-col min-h-0 flex-1">
        <h4 className="text-sm text-slate-300 px-4 pt-4 pb-3 flex-shrink-0">
          Código generado
        </h4>

        <div className="overflow-auto flex-1 px-4 pb-4">
          <pre className="text-xs text-slate-300 whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        </div>
      </div>

    </div>
  );
};