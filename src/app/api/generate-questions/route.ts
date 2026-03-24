import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, TEXT_MODEL } from "@/lib/openai";
import { questionsPrompt } from "@/lib/prompts";

function stripEmDashes(text: string): string {
  return text.replace(/\u2014/g, ",").replace(/\u2013/g, ",");
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 });
  }

  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const openai = getOpenAIClient(apiKey);
    const response = await openai.chat.completions.create({
      model: TEXT_MODEL,
      messages: [{ role: "user", content: questionsPrompt(text) }],
      temperature: 0.8,
    });

    const raw = response.choices[0]?.message?.content || "[]";
    const cleaned = stripEmDashes(raw);

    // Extract JSON array from response
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid response format" },
        { status: 500 }
      );
    }

    const questions: string[] = JSON.parse(match[0]);
    return NextResponse.json({ questions });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate questions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
