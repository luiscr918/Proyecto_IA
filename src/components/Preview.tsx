interface Props {
  preview: React.ReactNode;
  code: string;
}

export const Preview = ({ preview, code }: Props) => {
  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 text-center p-6">
        Aquí aparecerá la vista previa del componente generado
      </div>
    );
  }

  return (
    /*
      ✅ El contenedor usa flex-col con h-full para que los dos paneles
      (render + código) se repartan el espacio disponible sin desbordarse.
      Cada panel maneja su propio scroll de forma independiente.
    */
    <div className="flex flex-col gap-6 h-full">

      {/* Render — crece hasta un máximo razonable, luego scrollea solo */}
      <div className="bg-white rounded-2xl shadow-xl p-8 flex-shrink-0">
        <div className="w-full rounded-lg p-6 bg-gray-100 relative overflow-auto max-h-[40vh]">
          {preview}
        </div>
      </div>

      {/* 
        Código — ocupa el espacio restante con flex-1 y su propio overflow-auto.
        Así el scroll del código nunca "escapa" hacia la página padre.
      */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 flex flex-col min-h-0 flex-1">
        <h4 className="text-sm text-slate-300 px-4 pt-4 pb-3 flex-shrink-0">
          Código generado
        </h4>

        {/* overflow-auto aquí: scroll solo dentro de esta caja */}
        <div className="overflow-auto flex-1 px-4 pb-4">
          <pre className="text-xs text-slate-300 whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        </div>
      </div>

    </div>
  );
};
