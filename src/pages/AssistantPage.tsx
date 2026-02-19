import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
}

export const AssistantPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "¡Hola! Soy tu asistente de IA. Estoy aquí para ayudarte a crear componentes React. Puedes describirme lo que necesitas o subir una imagen de un diseño para que lo convierta en código React.",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewCode, setPreviewCode] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    // Simular respuesta de la IA
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `He analizado tu solicitud. Aquí está el componente React que generé:\n\nEl componente usa Tailwind CSS y está optimizado para cualquier proyecto React. Puedes ver la vista previa a la derecha y copiar el código para usarlo en tu proyecto.`,
      };
      setMessages((prev) => [...prev, assistantResponse]);

      // Generar código de ejemplo
      const exampleCode = `export const MyComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-cyan-500">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Componente Generado
        </h2>
        <p className="text-gray-600 mb-6">
          Este es un ejemplo del componente que tu IA ha generado.
        </p>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Acción
        </button>
      </div>
    </div>
  );
};`;

      setPreviewCode(exampleCode);
      setIsLoading(false);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Asistente React AI
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-4 overflow-hidden max-w-8xl mx-auto w-full p-4">
        <div className="flex-1 flex flex-col bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-slate-100"
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="uploaded"
                        className="w-full rounded mb-2 max-h-48"
                      />
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-slate-100 px-4 py-3 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="px-4 py-2 border-t border-slate-700 bg-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Imagen seleccionada</span>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              </div>
              <img
                src={selectedImage}
                alt="preview"
                className="max-h-32 rounded border border-slate-600"
              />
            </div>
          )}

          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700">
            <div className="flex gap-2 mb-2">
              <label className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors">
                <span>📷</span>
                <span>Subir Imagen</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe el componente React que necesitas..."
                rows={3}
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none"
              />
              <Button
                type="submit"
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold px-4 rounded-lg transition-all duration-300 h-16"
              >
                Enviar
              </Button>
            </div>
          </form>
        </div>

        <div className="w-96 flex flex-col bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Vista Previa</h3>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {previewCode ? (
              <>
                <div className="flex-1 overflow-auto p-4 bg-gray-900 border-b border-slate-700">
                  <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center min-h-full">
                    {/* Rendered Component Preview */}
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Componente Generado
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Este es un ejemplo del componente que tu IA ha generado.
                      </p>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Acción
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 bg-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">Código TSX</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(previewCode);
                        alert("Código copiado al portapapeles");
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Copiar
                    </button>
                  </div>
                  <pre className="text-xs text-slate-300 overflow-auto">
                    <code>{previewCode}</code>
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-center p-4">
                <div>
                  <div className="text-4xl mb-2">👀</div>
                  <p>Aquí aparecerá la vista previa del componente generado</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
