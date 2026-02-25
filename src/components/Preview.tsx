interface Props {
  preview: React.ReactNode;
  code: string;
}

export const Preview = ({ preview, code }: Props) => {
  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 text-center p-6">
        <div>
          <div className="text-5xl mb-3">👀</div>
          <p className="text-lg">Aquí aparecerá la vista previa del componente generado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-[2] flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 flex items-start justify-center">
          <div className="w-full bg-slate-50 rounded-lg p-6 shadow-inner max-h-[70vh] overflow-auto">
            {preview}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-800 rounded-lg p-4 overflow-auto border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm text-slate-300 font-medium">Código generado</h4>
        </div>
        <pre className="text-xs text-slate-300 overflow-auto whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};