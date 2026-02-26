import { useState } from "react";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Navbar } from "../components/Navbar";
import { Preview } from "../components/Preview";
import { generateComponentFromIA } from "../components/Generator";
import { GeneratedComponent } from "../components/GeneratedComponent";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
}

interface StateSpec {
  name: string;
  initial: string | number | boolean;
}

interface HandlerSpec {
  name: string;
  body: string;
}

interface NodeSpec {
  type: string;
  props?: Record<string, unknown>;
  children?: NodeSpec[];
}

interface ComponentSpec {
  name: string;
  state: StateSpec[];
  handlers: HandlerSpec[];
  tree: NodeSpec;
}

// Capitaliza la primera letra
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// Convierte el JSON spec a código JSX/TSX legible
function specToJSX(spec: ComponentSpec): string {
  const stateLines = spec.state.length > 0
    ? spec.state
        .map((s) => `  const [${s.name}, set${cap(s.name)}] = useState(${JSON.stringify(s.initial)});`)
        .join("\n")
    : "";

  const handlerLines = spec.handlers.length > 0
    ? spec.handlers
        .map((h) => `  const ${h.name} = () => { ${h.body} };`)
        .join("\n")
    : "";

  function nodeToJSX(node: NodeSpec, indent = 4): string {
  const pad = " ".repeat(indent);

  if (node.type === "text") {
    return `${pad}${node.props?.value ?? ""}`;
  }

  const propsStr = Object.entries(node.props || {})
    .filter(([k]) => k !== "value") // ignorar "value", es contenido hijo no un prop
    .map(([k, v]) => {
      if (k === "style" && typeof v === "object") {
        const styleStr = Object.entries(v as Record<string, unknown>)
          .map(([sk, sv]) => `${sk}: ${JSON.stringify(sv)}`)
          .join(", ");
        return `style={{ ${styleStr} }}`;
      }
      if (typeof v === "string") {
        return `${k}={${v}}`;
      }
      return `${k}={${JSON.stringify(v)}}`;
    })
    .join(" ");

  const openTag = `<${node.type}${propsStr ? " " + propsStr : ""}>`;
  const closeTag = `</${node.type}>`;

  // Si tiene prop "value" y no tiene children, usarlo como texto interior
  const textContent =
    node.props?.value !== undefined && (!node.children || node.children.length === 0)
      ? `${pad}  ${node.props.value}`
      : null;

  if (textContent !== null) {
    return `${pad}${openTag}\n${textContent}\n${pad}${closeTag}`;
  }

  if (!node.children || node.children.length === 0) {
    return `${pad}${openTag}${closeTag}`;
  }

  const childrenStr = node.children
    .map((child) => nodeToJSX(child, indent + 2))
    .join("\n");

  return `${pad}${openTag}\n${childrenStr}\n${pad}${closeTag}`;
}

  const imports = spec.state.length > 0
    ? `import { useState } from "react";`
    : `import React from "react";`;

  return `${imports}

export const ${spec.name} = () => {
${stateLines}${stateLines ? "\n" : ""}${handlerLines}${handlerLines ? "\n" : ""}
  return (
${nodeToJSX(spec.tree)}
  );
};
`.trim();
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
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);

  // Historial de mensajes para OpenAI (memoria de contexto)
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    // 1. Agregar mensaje del usuario al chat visible
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentPrompt = input;

    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    // 2. Llamada a la IA con el historial completo para mantener contexto
    const resultJSON = await generateComponentFromIA(currentPrompt, chatHistory);

    let assistantText = "";

    if (resultJSON) {
      assistantText =
        "Componente compilado con éxito. He generado la estructura y los manejadores de estado solicitados.";

      // 3. Convertir el JSON a código JSX legible
      const jsxCode = specToJSX(resultJSON as ComponentSpec);
      setPreviewCode(jsxCode);

      // 4. Renderizar el componente dinámicamente
      setPreviewComponent(<GeneratedComponent spec={resultJSON} />);

      // 5. Actualizar historial para la próxima llamada
      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: currentPrompt },
        { role: "assistant", content: JSON.stringify(resultJSON) },
      ]);
    } else {
      assistantText =
        "Lo siento, hubo un error al generar el componente. Por favor, intenta de nuevo o revisa tu conexión.";
      setPreviewCode("// Error en la generación");
      setPreviewComponent(null);
    }

    // 6. Agregar respuesta del asistente al chat visible
    const assistantResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: assistantText,
    };

    setMessages((prev) => [...prev, assistantResponse]);
    setIsLoading(false);
  };

  const copyCodeToClipboard = async () => {
    if (!previewCode) return alert("No hay código para copiar");
    try {
      await navigator.clipboard.writeText(previewCode);
      alert("Código copiado al portapapeles");
    } catch (err) {
      alert("No se pudo copiar el código");
      console.log(err);
    }
  };

  const downloadCode = () => {
    if (!previewCode) return alert("No hay código para descargar");
    const blob = new Blob([previewCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-component.tsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const toggleMaximize = () => setIsPreviewMaximized((v) => !v);

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-hidden w-full p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">

          {/* PANEL DE CHAT */}
          <div className="lg:col-span-1 flex flex-col h-full bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden shadow-inner">
            <ScrollArea className="flex-1 p-4 overflow-y-auto">
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

            <form
              onSubmit={handleSendMessage}
              className="p-6 border-t border-slate-700 bg-slate-800/40"
            >
              <div className="flex gap-4 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe tu componente aquí..."
                  rows={4}
                  className="flex-1 px-5 py-4 bg-slate-700/70 border border-slate-600 rounded-xl text-white placeholder-slate-400 resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all shadow-md"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-linear-to-r from-blue-500 to-cyan-500 text-white px-6 rounded-lg h-auto"
                  >
                    Generar
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setInput("");
                      setSelectedImage(null);
                    }}
                    className="text-xs text-slate-300/80 hover:text-slate-100"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* PANEL DE VISTA PREVIA */}
          <div className="lg:col-span-3 flex flex-col h-full bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-white">Live Render</h3>
                <p className="text-sm text-slate-400">
                  Vista previa en tiempo real del componente generado
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={copyCodeToClipboard}
                  className="text-sm bg-slate-700/40 hover:bg-slate-700 px-3 py-1 rounded-md text-slate-200 border border-slate-600"
                >
                  Copiar código
                </button>
                <button
                  onClick={downloadCode}
                  className="text-sm bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-3 py-1 rounded-md text-white font-medium"
                >
                  Descargar
                </button>
                <button
                  onClick={toggleMaximize}
                  className="text-sm bg-slate-700/30 hover:bg-slate-700 px-3 py-1 rounded-md text-slate-200 border border-slate-600"
                >
                  {isPreviewMaximized ? "Restaurar" : "Maximizar"}
                </button>
                {isLoading && (
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-hidden p-6">
              <Preview preview={previewComponent} code={previewCode} />
            </div>
          </div>
        </div>

        {/* PANTALLA COMPLETA */}
        {isPreviewMaximized && (
          <div className="fixed inset-0 z-50 bg-slate-900/95 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Live Render — Pantalla completa
                </h3>
                <p className="text-sm text-slate-300">
                  Vista previa ampliada. Presiona Cerrar para volver.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={copyCodeToClipboard}
                  className="text-sm bg-slate-700/40 hover:bg-slate-700 px-3 py-1 rounded-md text-slate-200 border border-slate-600"
                >
                  Copiar
                </button>
                <button
                  onClick={downloadCode}
                  className="text-sm bg-linear-to-r from-blue-500 to-cyan-500 px-3 py-1 rounded-md text-white font-medium"
                >
                  Descargar
                </button>
                <button
                  onClick={toggleMaximize}
                  className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto rounded-lg">
              <Preview preview={previewComponent} code={previewCode} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};