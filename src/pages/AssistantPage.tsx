import { useState, useRef } from "react";
import { Button } from "../components/ui/button";
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

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function specToJSX(spec: ComponentSpec): string {
  const stateLines = spec.state.length
    ? spec.state
        .map(
          (s) =>
            `  const [${s.name}, set${cap(
              s.name
            )}] = useState(${JSON.stringify(s.initial)});`
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
  // ✅ ÚNICO CAMBIO NUEVO: ref para scroll programático
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Con flex-col-reverse, scrollTop=0 es el fondo visual (mensajes nuevos)
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "¡Hola! Describe el componente que necesitas y lo generaré dinámicamente.",
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
    e?: React.FormEvent | React.KeyboardEvent
  ) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [userMessage, ...prev]);
    scrollToBottom(); // ✅ baja al mensaje enviado
    const currentPrompt = input;
    setInput("");
    setIsLoading(true);

    const resultJSON = await generateComponentFromIA(
      currentPrompt,
      chatHistory
    );

    let assistantText = "";

    if (resultJSON) {
      assistantText = "Componente generado correctamente.";

      const jsxCode = specToJSX(resultJSON as ComponentSpec);
      setPreviewCode(jsxCode);
      setPreviewComponent(<GeneratedComponent spec={resultJSON} />);

      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: currentPrompt },
        { role: "assistant", content: JSON.stringify(resultJSON) },
      ]);
    } else {
      assistantText = "Hubo un error generando el componente.";
    }

    setMessages((prev) => [
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantText,
      },
      ...prev,
    ]);
    scrollToBottom(); // ✅ baja a la respuesta del asistente

    setIsLoading(false);
  };

  const clearAll = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "¡Hola! Describe el componente que necesitas y lo generaré dinámicamente.",
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
          {/* ✅ ref agregado, todo lo demás idéntico */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {isLoading && (
              <div className="text-blue-400 animate-pulse text-sm">
                Generando componente...
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
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-700"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe tu componente..."
              rows={3}
              className="w-full bg-slate-700 text-white rounded-lg p-3 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSendMessage(e);
                }
              }}
            />

            <div className="flex justify-between mt-3 text-sm text-slate-300">
              <Button type="submit" disabled={isLoading}>
                Generar
              </Button>

              <button
                type="button"
                onClick={clearAll}
                className="text-sm text-slate-300"
              >
                Limpiar todo
              </button>
            </div>
          </form>
        </div>

        {/* PREVIEW */}
        <div className="lg:col-span-3 flex flex-col bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <Preview preview={previewComponent} code={previewCode} />
          </div>
        </div>
      </div>
    </div>
  );
};
