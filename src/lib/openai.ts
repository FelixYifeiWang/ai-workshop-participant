import OpenAI from "openai";

export const TEXT_MODEL = "gpt-4o";
export const IMAGE_MODEL = "gpt-image-1";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}
