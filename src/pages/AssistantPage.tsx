import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { generateComponentFromPrompt } from "../components/Generator";

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
      content:
        "¡Hola! Soy tu asistente de IA. Describe el componente React que necesitas (por ejemplo: footer, navbar o button).",
    },
  ]);

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewCode, setPreviewCode] = useState("");
  const [previewComponent, setPreviewComponent] =
    useState<React.ReactNode>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentPrompt = input; //  guardamos el prompt antes de limpiar

    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = generateComponentFromPrompt(currentPrompt);

      let assistantText = "";

      if (result) {
        assistantText =
          "He generado un componente basado en tu solicitud. Puedes ver la vista previa a la derecha y copiar el código.";

        setPreviewCode(result.code);
        setPreviewComponent(result.preview);
      } else {
        assistantText =
          "No pude identificar el tipo de componente. Intenta usar palabras como: footer, navbar o button.";

        setPreviewCode("// No se encontró un componente para esa solicitud");
        setPreviewComponent(null);
      }

      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantText,
      };

      setMessages((prev) => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 1500);
  };

 /*  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }; */

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-8xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient from-blue-400 to-cyan-400">
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
        {/* CHAT */}
        <div className="flex-1 flex flex-col bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
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
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 px-4 py-3 rounded-lg">
                    Generando componente...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-700"
          >
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe el componente React que necesitas..."
                rows={3}
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white resize-none"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-linear-to-r from-blue-500 to-cyan-500 text-white px-4 rounded-lg h-16"
              >
                Enviar
              </Button>
            </div>
          </form>
        </div>

        {/* PREVIEW */}
        <div className="w-96 flex flex-col bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">
              Vista Previa
            </h3>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {previewCode ? (
              <>
                {/* COMPONENTE RENDERIZADO */}
                <div className="flex-1 overflow-auto p-4 bg-gray-900 border-b border-slate-700">
                  <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center min-h-full">
                    {previewComponent}
                  </div>
                </div>

                {/* CÓDIGO */}
                <div className="flex-1 overflow-auto p-4 bg-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">
                      Código TSX
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(previewCode);
                        alert("Código copiado");
                      }}
                      className="text-xs text-blue-400"
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
              <div className="flex-1 flex items-center justify-center text-slate-400">
                👀 Aquí aparecerá la vista previa
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};