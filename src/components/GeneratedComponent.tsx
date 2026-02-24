import React, { useState, useMemo } from "react";

// 1. Definimos las interfaces basadas en el esquema del ingeniero
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

interface Props {
  spec: ComponentSpec;
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export const GeneratedComponent = ({ spec }: Props) => {
  // Inicializamos el estado con un objeto de tipos definidos
  const [stateValues, setStateValues] = useState<Record<string, unknown>>(
    () => {
      const initial: Record<string, unknown> = {};
      spec.state.forEach((s) => {
        initial[s.name] = s.initial;
      });
      return initial;
    },
  );

  const handlers = useMemo(() => {
    const h: Record<string, (...args: unknown[]) => void> = {};
    const setters: Record<string, (val: unknown) => void> = {};

    Object.keys(stateValues).forEach((key) => {
      setters["set" + cap(key)] = (val: unknown) =>
        setStateValues((prev) => ({ ...prev, [key]: val }));
    });

    spec.handlers.forEach((fn) => {
      h[fn.name] = new Function(
        ...Object.keys(stateValues),
        ...Object.keys(setters),
        fn.body,
      ).bind(null, ...Object.values(stateValues), ...Object.values(setters));
    });
    return h;
  }, [stateValues, spec.handlers]);

  // Función de renderizado recursiva corregida
  // Agregamos el índice para la "key" y evitar Math.random()
  function renderNode(node: NodeSpec, index: number): React.ReactNode {
    if (node.type === "text") {
      return node.props?.value as string;
    }

    const props: Record<string, unknown> = {};

    if (node.props) {
      for (const [k, v] of Object.entries(node.props)) {
        if (typeof v === "string" && v in stateValues) {
          props[k] = stateValues[v];
        } else if (typeof v === "string" && v in handlers) {
          props[k] = handlers[v];
        } else {
          props[k] = v;
        }
      }
    }

    return React.createElement(
      node.type,
      {
        ...props,
        // Usamos una combinación del tipo y el índice para una key estable
        key: `${node.type}-${index}`,
      },
      node.children?.map((child, i) => renderNode(child, i)),
    );
  }

  return <div className="w-full">{renderNode(spec.tree, 0)}</div>;
};
