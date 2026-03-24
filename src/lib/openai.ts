import OpenAI from "openai";

export const TEXT_MODEL = "gpt-4o";
export const IMAGE_MODEL = "gpt-image-1";

export function getOpenAIClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey });
}
