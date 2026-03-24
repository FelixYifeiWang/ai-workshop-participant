import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, TEXT_MODEL } from "@/lib/openai";
import mammoth from "mammoth";

function getFileType(
  file: File
): "pdf" | "image" | "docx" | "unknown" {
  const name = file.name.toLowerCase();
  const mime = file.type.toLowerCase();

  if (name.endsWith(".pdf") || mime === "application/pdf") return "pdf";
  if (
    name.endsWith(".docx") ||
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "docx";
  if (mime.startsWith("image/")) return "image";

  return "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileType = getFileType(file);
    let text = "";

    if (fileType === "docx") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (fileType === "pdf") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");

      const openai = getOpenAIClient();
      const response = await openai.chat.completions.create({
        model: TEXT_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "file",
                file: {
                  filename: file.name || "document.pdf",
                  file_data: `data:application/pdf;base64,${base64}`,
                },
              },
              {
                type: "text",
                text: "Extract all the text content from this PDF document. Return only the raw text, preserving paragraph structure. Do not add any commentary or formatting.",
              },
            ],
          },
        ],
      });
      text = response.choices[0]?.message?.content || "";
    } else if (fileType === "image") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";

      const openai = getOpenAIClient();
      const response = await openai.chat.completions.create({
        model: TEXT_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64}`,
                },
              },
              {
                type: "text",
                text: "Extract and describe all the text and visual content from this image. If there is text, transcribe it. If there are visual elements, describe them. Return the content as plain text.",
              },
            ],
          },
        ],
      });
      text = response.choices[0]?.message?.content || "";
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF, image, or DOCX file." },
        { status: 400 }
      );
    }

    if (!text.trim()) {
      return NextResponse.json(
        { error: "No text found in file" },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to process file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
