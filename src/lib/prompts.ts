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
  return `A concrete, figurative doodle drawn with black pen on white paper. Simple but RECOGNIZABLE. This represents the FEELING of "${word}", which is a bodily, physical, sensory experience. Draw something literal and grounded: a body part, a posture, a facial expression, a physical sensation, a gut reaction. For example, if the word were "angry" you might draw clenched fists or a tight jaw. If "sad", drooping shoulders or tears. If "anxious", a knotted stomach or biting nails. The drawing should be rough and imperfect like a human sketch, but the subject must be clearly identifiable as something physical and corporeal. No abstraction. No symbols. Just the raw bodily reality of what "${word}" feels like.`;
}

export function wordArtEmotionPrompt(word: string): string {
  return `A purely ABSTRACT doodle drawn with black pen on white paper. NO recognizable objects, NO faces, NO body parts, NO literal imagery whatsoever. This represents the EMOTION of "${word}", which is a psychological, conceptual, inner experience. Use only abstract marks: jagged lines, spirals, pressure variations, density changes, rhythm, chaos vs order, negative space, clustering, scattering. The mark-making itself should embody the emotion. For "${word}", consider: is this emotion sharp or soft? Dense or sparse? Contained or explosive? Fast or slow? Translate those qualities into pure line and form. This must look completely different from a companion drawing that showed the physical feeling of "${word}" through a recognizable body/figure. This one must be entirely non-representational, like abstract expressionism reduced to its simplest pen strokes.`;
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
