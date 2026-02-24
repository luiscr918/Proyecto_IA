import OpenAI from "openai";

const openai = new OpenAI({
  apiKey:import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Necesario para React
});

const SYSTEM_INSTRUCTIONS = `... 
You are a React Component Compiler.

Your job is to convert natural language UI requests into a valid JSON
representation of a React component using a strict component schema.

You do NOT generate JSX.
You do NOT generate explanations.
You ONLY generate JSON that follows the provided schema.

Your output will be parsed and executed by a React runtime.
Any deviation or missing field will break the application.

You must follow this schema exactly.

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
  className?: string
}

Rules:
1. Every state variable referenced in props or handlers MUST be declared in state.
2. Every handler referenced in props MUST be declared in handlers.
3. Event props (onClick, onChange, etc) must reference handlers.
4. If a prop value matches a state name, it binds to that state.
5. Text nodes must use: { "type": "text", "props": { "value": string } }
6. Use only standard HTML elements (div, input, button, span, etc).
7. No JSX. No explanations. Only JSON.
...`;

export const generateComponentFromIA = async (prompt: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // O el modelo que prefieras
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTIONS },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error("Error llamando a OpenAI:", error);
    return null;
  }
};
