export const generateFinalPrompt = async (prompt: string, keys: any) => {
  let finalPrompt = prompt;
  for (let index in keys) {
    finalPrompt = finalPrompt.replace(
      new RegExp(`\\key${index}`, "g"),
      keys[index]
    );
  }
  return finalPrompt;
};
