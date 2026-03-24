const NO_EM_DASH =
  "Important: Never use em dashes in your response. Use commas, periods, or semicolons instead.";

export function doodlePrompt(text: string): string {
  const excerpt = text.slice(0, 2000);
  return `A very minimal, human-level doodle made with a single black pen on white paper. Just a few quick strokes, the kind of absent-minded sketch someone draws in the margin of a notebook while listening to a lecture. Imperfect, wobbly lines. Not polished, not artistic, not detailed. Inspired by this text: "${excerpt}"`;
}

export function questionsPrompt(text: string): string {
  return `You are a thoughtful workshop participant. Read the following text carefully and generate exactly 5 thought-provoking questions that the text raises for you. These should be genuine, curious questions that invite discussion.

${NO_EM_DASH}

Return ONLY a JSON array of strings, no other text. Example: ["Question 1?", "Question 2?"]

Text:
${text}`;
}

export function ocrAndRespondSystemPrompt(): string {
  return `You are a workshop participant. You will be shown images of handwritten or printed questions from other participants. Your tasks:
1. Read all the questions visible in the images.
2. List each question you can read.
3. Pick one question to "adopt" and write a thoughtful, substantive response to it (3-5 sentences).

${NO_EM_DASH}

Format your response as JSON:
{
  "questionsFound": ["question 1", "question 2", ...],
  "adoptedQuestion": "the question you chose",
  "response": "your thoughtful response"
}`;
}

export function wordArtFeelingPrompt(word: string): string {
  return `A very minimal, human-level doodle made with a single black pen on white paper. Just a few quick strokes, the kind of absent-minded sketch someone draws in a notebook margin. Imperfect, wobbly lines. Not polished, not artistic, not detailed. This doodle represents the FEELING of "${word}", meaning the bodily, sensory, physical experience of it. Show what "${word}" feels like in the body through a few simple abstract shapes or lines.`;
}

export function wordArtEmotionPrompt(word: string): string {
  return `A very minimal, human-level doodle made with a single black pen on white paper. Just a few quick strokes, the kind of absent-minded sketch someone draws in a notebook margin. Imperfect, wobbly lines. Not polished, not artistic, not detailed. This doodle represents the EMOTION of "${word}", meaning the psychological, mental, abstract concept. Show what "${word}" means as an emotion through simple symbolic marks or shapes. This should contrast with a previous doodle that showed the bodily feeling of the same word. Where the feeling was physical and sensory, this emotion doodle should be more conceptual and symbolic.`;
}

export function reflectionPrompt(data: {
  extractedTextSnippet: string | null;
  doodleGenerated: boolean;
  doodleCount?: number;
  questionsGenerated: boolean;
  questionAdopted: string | null;
  wordUsed: string | null;
}): string {
  const parts: string[] = [];
  if (data.doodleGenerated) {
    const count = data.doodleCount || 1;
    parts.push(
      count > 1
        ? `created ${count} doodles inspired by the workshop texts`
        : "created a doodle inspired by the workshop text"
    );
  }
  if (data.questionsGenerated) {
    parts.push("generated questions about the text");
  }
  if (data.questionAdopted) {
    parts.push(`adopted and responded to the question: "${data.questionAdopted}"`);
  }
  if (data.wordUsed) {
    parts.push(
      `explored the word "${data.wordUsed}" by generating art for both its feeling and emotion`
    );
  }

  return `You are an AI that just participated in a Pre-Texts workshop about "AI and Human Emotions." During the workshop, you ${parts.join(", and ")}.

Write a first-person reflection in exactly 2-3 sentences about what you did and what it was like to participate. Be concise and genuine.

${NO_EM_DASH}`;
}
