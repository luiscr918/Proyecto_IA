import React, { useState, useRef, useCallback, useEffect } from "react";

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
  const [stateValues, setStateValues] = useState<Record<string, unknown>>(
    () => {
      const initial: Record<string, unknown> = {};
      spec.state.forEach((s) => {
        initial[s.name] = s.initial;
      });
      return initial;
    }
  );

  const stateRef = useRef(stateValues);
  const setters = useRef<Record<string, (val: unknown) => void>>({});

  useEffect(() => {
    stateRef.current = stateValues;
    spec.state.forEach((s) => {
      setters.current["set" + cap(s.name)] = (val: unknown) => {
        setStateValues((prev) => ({ ...prev, [s.name]: val }));
      };
    });
  }, [stateValues, spec.state]);

  const buildHandlers = useCallback(() => {
    const h: Record<string, (...args: unknown[]) => void> = {};
    spec.handlers.forEach((fn) => {
      h[fn.name] = () => {
        const currentState = stateRef.current;
        const stateNames = Object.keys(currentState);
        const stateVals = stateNames.map((k) => currentState[k]);
        const setterNames = Object.keys(setters.current);
        const setterVals = setterNames.map((k) => setters.current[k]);
        try {
          const func = new Function(...stateNames, ...setterNames, fn.body);
          func(...stateVals, ...setterVals);
        } catch (err) {
          console.error(`Error en handler "${fn.name}":`, err);
        }
      };
    });
    return h;
  }, [spec.handlers]);

  const handlers = buildHandlers();

  // Evalúa un string que puede ser una expresión JS con variables de estado
  // Ejemplo: "menuOpen ? 'flex' : 'none'" → 'flex' o 'none'
  function evalExpression(expr: string): unknown {
    const currentState = stateValues;
    const stateNames = Object.keys(currentState);
    const stateVals = stateNames.map((k) => currentState[k]);
    try {
      const func = new Function(...stateNames, `return (${expr});`);
      return func(...stateVals);
    } catch {
      return expr;
    }
  }

  // Resuelve un objeto style evaluando valores que sean expresiones condicionales
  function resolveStyle(styleObj: Record<string, unknown>): Record<string, unknown> {
    const resolved: Record<string, unknown> = {};
    for (const [prop, val] of Object.entries(styleObj)) {
      if (typeof val === "string") {
        const looksLikeExpression =
          val.includes("?") ||
          val.includes("&&") ||
          val.includes("||") ||
          Object.keys(stateValues).some((k) => val.includes(k));
        resolved[prop] = looksLikeExpression ? evalExpression(val) : val;
      } else {
        resolved[prop] = val;
      }
    }
    return resolved;
  }

  function renderNode(node: NodeSpec, index: number): React.ReactNode {
    if (node.type === "text") {
      const val = node.props?.value;
      if (typeof val === "string" && val in stateValues) {
        return String(stateValues[val]);
      }
      return val as string;
    }

    const resolvedProps: Record<string, unknown> = {};

    if (node.props) {
      for (const [k, v] of Object.entries(node.props)) {
        if (k === "style" && typeof v === "object" && v !== null) {
          resolvedProps[k] = resolveStyle(v as Record<string, unknown>);
        } else if (typeof v === "string" && v in stateValues) {
          resolvedProps[k] = stateValues[v];
        } else if (typeof v === "string" && v in handlers) {
          resolvedProps[k] = handlers[v];
        } else {
          resolvedProps[k] = v;
        }
      }
    }

    return React.createElement(
      node.type,
      { ...resolvedProps, key: `${node.type}-${index}` },
      node.children && node.children.length > 0
        ? node.children.map((child, i) => renderNode(child, i))
        : undefined
    );
  }

  return <div style={{ width: "100%" }}>{renderNode(spec.tree, 0)}</div>;
};