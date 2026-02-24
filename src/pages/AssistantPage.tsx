import { useState } from "react";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Navbar } from "../components/Navbar";
import { Preview } from "../components/Preview"; // Asegúrate de importar tu componente Preview si lo prefieres usar
import { generateComponentFromIA } from "../components/Generator";
import { GeneratedComponent } from "../components/GeneratedComponent";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
}

export const AssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "¡Hola! Soy tu asistente de IA real. Describe el componente que necesitas y lo compilaré dinámicamente.",
    },
  ]);

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewCode, setPreviewCode] = useState("");
  const [previewComponent, setPreviewComponent] = useState<React.ReactNode>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    // 1. Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentPrompt = input;

    // Limpiar UI
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    // 2. Llamada a la IA (OpenAI)
    const resultJSON = await generateComponentFromIA(currentPrompt);

    let assistantText = "";

    if (resultJSON) {
      assistantText = "Componente compilado con éxito. He generado la estructura y los manejadores de estado solicitados.";
      
      // 3. Actualizar la vista previa con el Renderizador Dinámico
      // Guardamos el JSON como string para el panel de código
      setPreviewCode(JSON.stringify(resultJSON, null, 2));
      
      // Renderizamos el componente usando el esquema JSON
      setPreviewComponent(<GeneratedComponent spec={resultJSON} />);
    } else {
      assistantText = "Lo siento, hubo un error al generar el componente. Por favor, intenta de nuevo o revisa tu conexión.";
      setPreviewCode("// Error en la generación");
      setPreviewComponent(null);
    }

    // 4. Agregar respuesta del asistente
    const assistantResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: assistantText,
    };

    setMessages((prev) => [...prev, assistantResponse]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex gap-4 overflow-hidden max-w-8xl mx-auto w-full p-4">
        {/* PANEL DE CHAT */}
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
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 px-4 py-3 rounded-lg text-blue-400 animate-pulse">
                    IA Compilando componente...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ej: Crea un formulario de contacto con validación de email..."
                rows={3}
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white resize-none focus:outline-none focus:border-blue-500"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 rounded-lg h-auto"
              >
                Generar
              </Button>
            </div>
          </form>
        </div>

        {/* PANEL DE VISTA PREVIA (Usando tu componente Preview) */}
        <div className="w-[500px] flex flex-col bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Live Render</h3>
            {isLoading && <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>}
          </div>
          
          <div className="flex-1 overflow-hidden">
            <Preview preview={previewComponent} code={previewCode} />
          </div>
        </div>
      </div>
    </div>
  );
};