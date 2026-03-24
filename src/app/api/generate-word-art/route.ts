import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, IMAGE_MODEL } from "@/lib/openai";
import { wordArtFeelingPrompt, wordArtEmotionPrompt } from "@/lib/prompts";
import { toFile } from "openai";

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json();
    if (!word) {
      return NextResponse.json({ error: "Word required" }, { status: 400 });
    }

    const openai = getOpenAIClient();

    // Step 1: Generate the feeling doodle first
    const feelingRes = await openai.images.generate({
      model: IMAGE_MODEL,
      prompt: wordArtFeelingPrompt(word),
      n: 1,
      size: "1024x1024",
    });

    const feelingB64 = feelingRes.data?.[0]?.b64_json;
    if (!feelingB64) {
      throw new Error("Failed to generate feeling image");
    }

    // Step 2: Generate the emotion doodle, passing the feeling image as reference
    const feelingBuffer = Buffer.from(feelingB64, "base64");
    const feelingFile = await toFile(feelingBuffer, "feeling.png", {
      type: "image/png",
    });

    const emotionRes = await openai.images.edit({
      model: IMAGE_MODEL,
      prompt: wordArtEmotionPrompt(word),
      image: feelingFile,
      size: "1024x1024",
    });

    const emotionB64 = emotionRes.data?.[0]?.b64_json;
    if (!emotionB64) {
      throw new Error("Failed to generate emotion image");
    }

    return NextResponse.json({
      feelingImageUrl: `data:image/png;base64,${feelingB64}`,
      emotionImageUrl: `data:image/png;base64,${emotionB64}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate art";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
