import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, IMAGE_MODEL } from "@/lib/openai";
import { doodlePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const openai = getOpenAIClient();
    const response = await openai.images.generate({
      model: IMAGE_MODEL,
      prompt: doodlePrompt(text),
      n: 1,
      size: "1024x1024",
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) {
      throw new Error("No image data returned");
    }

    const imageUrl = `data:image/png;base64,${b64}`;
    return NextResponse.json({ imageUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate doodle";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
