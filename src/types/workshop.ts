export interface UploadedFile {
  name: string;
  text: string;
}

export interface WorkshopState {
  // API key
  apiKey: string;

  // Step 6
  uploadedFiles: UploadedFile[];
  doodleUrls: string[];

  // Step 7
  generatedQuestions: string[] | null;
  adoptedQuestion: string | null;
  adoptedResponse: string | null;

  // Step 8
  wordInput: string | null;
  feelingImageUrl: string | null;
  emotionImageUrl: string | null;

  // Step 9
  reflection: string | null;

  // Navigation
  currentStep: number;
}

export type WorkshopAction =
  | { type: "SET_API_KEY"; payload: string }
  | { type: "ADD_UPLOADED_FILE"; payload: UploadedFile }
  | { type: "REMOVE_UPLOADED_FILE"; payload: number }
  | { type: "SET_DOODLE_URLS"; payload: string[] }
  | { type: "SET_GENERATED_QUESTIONS"; payload: string[] }
  | { type: "SET_ADOPTED_QA"; payload: { question: string; response: string } }
  | { type: "SET_WORD_INPUT"; payload: string }
  | { type: "SET_WORD_ART"; payload: { feelingUrl: string; emotionUrl: string } }
  | { type: "SET_REFLECTION"; payload: string }
  | { type: "SET_STEP"; payload: number };
