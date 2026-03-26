import { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Navbar } from "../components/Navbar";
import { Preview } from "../components/Preview";
import { generateComponentFromIA } from "../components/Generator";
import { GeneratedComponent } from "../components/GeneratedComponent";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { BrainCircuit } from "lucide-react";
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

const AVAILABLE_MODELS = [
  { id: "gpt-5.2", name: "GPT-5.2 (Calidad Premium • Proceso Lento)" },
  { id: "gpt-4o", name: "GPT-4o (Más rápido y capaz)" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo (Económico)" },
];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// ... (Función specToJSX permanece igual)
function specToJSX(spec: ComponentSpec): string {
  const stateLines = spec.state.length
    ? spec.state
        .map(
          (s) =>
            `  const [${s.name}, set${cap(
              s.name,
            )}] = useState(${JSON.stringify(s.initial)});`,
        )
        .join("\n")
    : "";

  const handlerLines = spec.handlers.length
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
      .filter(([k]) => k !== "value")
      .map(([k, v]) => {
        if (k === "style" && typeof v === "object") {
          const styleStr = Object.entries(v as Record<string, unknown>)
            .map(([sk, sv]) => `${sk}: ${JSON.stringify(sv)}`)
            .join(", ");
          return `style={{ ${styleStr} }}`;
        }
        if (typeof v === "string") return `${k}={${v}}`;
        return `${k}={${JSON.stringify(v)}}`;
      })
      .join(" ");

    const openTag = `<${node.type}${propsStr ? " " + propsStr : ""}>`;
    const closeTag = `</${node.type}>`;

    if (!node.children?.length && node.props?.value !== undefined) {
      return `${pad}${openTag}
${pad}  ${node.props.value}
${pad}${closeTag}`;
    }

    if (!node.children?.length) {
      return `${pad}${openTag}${closeTag}`;
    }

    const childrenStr = node.children
      .map((child) => nodeToJSX(child, indent + 2))
      .join("\n");

    return `${pad}${openTag}
${childrenStr}
${pad}${closeTag}`;
  }

  return `
import { useState } from "react";

export const ${spec.name} = () => {
${stateLines}
${handlerLines}

  return (
${nodeToJSX(spec.tree)}
  );
};
`.trim();
}

export const AssistantPage = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState("Usuario");

  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  const getNameFromEmail = (email: string | null) => {
    if (!email) return "Usuario";

    const name = email.split("@")[0];
    const match = name.match(/^[a-zA-Z]+/);

    const firstName = match ? match[0] : name;

    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.email) {
        setUserName(getNameFromEmail(currentUser.email));
      }
    });
    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `¡Hola ${userName}!  Describe el componente que necesitas y lo generaré dinámicamente utilizando IA.`,
    },
  ]);

  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewCode, setPreviewCode] = useState("");
  const [previewComponent, setPreviewComponent] =
    useState<React.ReactNode>(null);

  const handleSendMessage = async (
    e?: React.FormEvent | React.KeyboardEvent,
  ) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [userMessage, ...prev]);
    scrollToBottom();

    const currentPrompt = input;
    setInput("");
    setIsLoading(true);

    const resultJSON = await generateComponentFromIA(
      currentPrompt,
      selectedModel,
      chatHistory,
    );

    let assistantText = "";

    if (resultJSON) {
      assistantText =
        "Componente generado correctamente. Puedes verlo en el panel de la derecha.";

      const jsxCode = specToJSX(resultJSON as ComponentSpec);
      setPreviewCode(jsxCode);
      setPreviewComponent(<GeneratedComponent spec={resultJSON} />);

      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: currentPrompt },
        { role: "assistant", content: JSON.stringify(resultJSON) },
      ]);
    } else {
      assistantText = `Hubo un error generando el componente usando ${selectedModel}. Por favor, intenta de nuevo o cambia de modelo.`;
    }

    setMessages((prev) => [
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantText,
      },
      ...prev,
    ]);

    scrollToBottom();
    setIsLoading(false);
  };

  const clearAll = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: `¡Hola ${userName}! Describe el componente que necesitas y lo generaré dinámicamente.`,
      },
    ]);
    setChatHistory([]);
    setPreviewCode("");
    setPreviewComponent(null);
    setInput("");
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 overflow-hidden">
        {/* CHAT */}
        <div className="lg:col-span-1 flex flex-col bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          {/* 🔄 CAMBIO: Selector de Modelo UI */}
          <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <div className="flex-1">
              <label
                htmlFor="modelSelect"
                className="text-xs text-slate-400 block mb-1"
              >
                Modelo de IA
              </label>
              <select
                id="modelSelect"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-700 text-white text-sm rounded-md px-2 py-1.5 border border-slate-600 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                disabled={isLoading} // Deshabilitar mientras genera
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {isLoading && (
              <div className="text-cyan-400 animate-pulse text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                Pensando el código...
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-xl ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-700 text-slate-100 rounded-bl-none"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-700 bg-slate-800"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe tu componente (ej: 'Un botón rojo redondeado que diga Enviar')..."
              rows={3}
              className="w-full bg-slate-700 text-white rounded-lg p-3 resize-none border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSendMessage(e);
                }
              }}
            />

            <div className="flex justify-between mt-3 gap-2">
              <button
                type="button"
                onClick={clearAll}
                className="text-sm text-slate-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                Limpiar chat
              </button>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {isLoading ? "Generando..." : "Generar"}
              </Button>
            </div>
          </form>
        </div>

        {/* PREVIEW */}
        <div className="lg:col-span-3 flex flex-col overflow-hidden">
          {/* Movimos el padding dentro de Preview para que el estado de carga ocupe todo el espacio */}
          <Preview
            preview={previewComponent}
            code={previewCode}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
