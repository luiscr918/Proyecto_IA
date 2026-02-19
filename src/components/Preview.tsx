interface Props {
  preview: React.ReactNode;
  code: string;
}

export const Preview = ({ preview, code }: Props) => {
  if (!code) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-center p-4">
        <div>
          <div className="text-4xl mb-2">👀</div>
          <p>Aquí aparecerá la vista previa del componente generado</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-auto p-4 bg-gray-900 border-b border-slate-700">
        <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center min-h-full">
          {preview}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-slate-700">
        <pre className="text-xs text-slate-300 overflow-auto">
          <code>{code}</code>
        </pre>
      </div>
    </>
  );
};