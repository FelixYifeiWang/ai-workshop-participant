import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, TEXT_MODEL } from "@/lib/openai";
import { reflectionPrompt } from "@/lib/prompts";

function stripEmDashes(text: string): string {
  return text.replace(/\u2014/g, ",").replace(/\u2013/g, ",");
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 });
  }

  try {
    const data = await req.json();

    const openai = getOpenAIClient(apiKey);
    const response = await openai.chat.completions.create({
      model: TEXT_MODEL,
      messages: [{ role: "user", content: reflectionPrompt(data) }],
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content || "";
    const reflection = stripEmDashes(raw);

    return NextResponse.json({ reflection });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate reflection";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
