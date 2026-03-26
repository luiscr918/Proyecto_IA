import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_INSTRUCTIONS = `
Usted es un Compilador de Componentes React.

Su trabajo consiste en convertir solicitudes de interfaz de usuario en lenguaje natural en una representación JSON
válida de un componente React utilizando un esquema de componente estricto.

Usted NO genera JSX.
Usted NO genera explicaciones.
Usted SÓLO genera el JSON que sigue el esquema proporcionado.

Su salida será analizada y ejecutada por un runtime de React.
Cualquier desviación o campo faltante romperá la aplicación.

Debe seguir este esquema exactamente.

ComponentSpec:
{
  name: string,

  state: [
    { name: string, initial: string | number | boolean }
  ],

  handlers: [
    {
      name: string,
      body: string
    }
  ],

  tree: ReactNode
}

ReactNode:
{
  type: string,
  props?: Props,
  children?: ReactNode[]
}

Props (allowed fields only):
{
  value?: string | number | boolean,
  placeholder?: string,
  onClick?: string,
  onChange?: string,
  type?: string,
  style?: object
}

CRITICAL STYLE RULES:
- NEVER use className with Tailwind or any CSS framework.
- ALWAYS use inline "style" objects for ALL styling (colors, layout, typography, spacing, etc).
- Every visual element MUST have a style prop with proper CSS properties.
- Use real CSS property names in camelCase (e.g. backgroundColor, fontSize, padding, display, flexDirection, etc).
- Generate beautiful, complete, visually rich components with full styling.
- For hero sections: use large fonts, gradients via background, proper padding, centered layout with flexbox.
- For navbars: use horizontal flex layout, proper background color, padding, etc.
- For buttons: use background color, color, padding, border radius, cursor pointer.

CONTEXT RULES:
- If the user asks to MODIFY a previous component (e.g. "change the color", "make it bigger", "add a button"), you MUST return the full updated version of that component preserving all existing structure and only applying the requested changes.
- If no previous component exists, generate a new one from scratch.

Rules:
1. Every state variable declared in 'state' MUST be used directly by its name (e.g., use 'count', not 'state.count').
2. For each state variable, a setter function is automatically created following the pattern 'set' + CamelCaseName (e.g., for 'count' use 'setCount').
3. IMPORTANT: NEVER use 'setState'. ALWAYS use the specific setter (e.g., 'setCount(count + 1)').
4. Event props (onClick, onChange) MUST be a string matching exactly the name of a handler in the 'handlers' array.
5. In 'handlers', the 'body' must be pure JavaScript code that will be executed inside a function.
6. CRITICAL TEXT RULE: Elements like button, p, span, h1, etc., MUST NOT use a 'value' prop for their text. ALL text MUST be a child node of type 'text'. Example: "children": [{ "type": "text", "props": { "value": "Click me" } }]
7. To display a state variable, pass its name as the value of the text node: { "type": "text", "props": { "value": "count" } }
8. No JSX. No explanations. Only JSON.
`;

export const generateComponentFromIA = async (
  prompt: string,
  model: string = "gpt-4o",
  history: { role: "user" | "assistant"; content: string }[] = [],
) => {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTIONS },
        ...history,
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = response.choices[0].message.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error("Error llamando a OpenAI:", error);
    return null;
  }
};