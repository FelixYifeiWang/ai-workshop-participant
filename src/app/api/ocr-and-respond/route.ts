import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, TEXT_MODEL } from "@/lib/openai";
import { ocrAndRespondSystemPrompt } from "@/lib/prompts";

function stripEmDashes(text: string): string {
  return text.replace(/\u2014/g, ",").replace(/\u2013/g, ",");
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const images = formData.getAll("images") as File[];

    if (images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    // Convert images to base64 data URLs
    const imageContents = await Promise.all(
      images.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString("base64");
        const mimeType = file.type || "image/jpeg";
        return {
          type: "image_url" as const,
          image_url: {
            url: `data:${mimeType};base64,${base64}`,
          },
        };
      })
    );

    const openai = getOpenAIClient(apiKey);
    const response = await openai.chat.completions.create({
      model: TEXT_MODEL,
      messages: [
        { role: "system", content: ocrAndRespondSystemPrompt() },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Here are photos of questions from the classroom. Please read them, adopt one, and respond.",
            },
            ...imageContents,
          ],
        },
      ],
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content || "";
    const cleaned = stripEmDashes(raw);

    // Extract JSON from response
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid response format" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(match[0]);
    return NextResponse.json({
      adoptedQuestion: parsed.adoptedQuestion,
      response: parsed.response,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to process images";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
