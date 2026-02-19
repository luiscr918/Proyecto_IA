import { componentTemplates } from "../data/templates";

export const generateComponentFromPrompt = (prompt: string) => {
  const lowerPrompt = prompt.toLowerCase();

  const foundKey = Object.keys(componentTemplates).find((key) =>
    lowerPrompt.includes(key)
  );

  if (!foundKey) {
    return null;
  }

  return componentTemplates[foundKey as keyof typeof componentTemplates];
};