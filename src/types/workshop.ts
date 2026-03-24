export interface UploadedFile {
  name: string;
  text: string;
}

export interface WordArtPair {
  word: string;
  feelingUrl: string;
  emotionUrl: string;
}

export interface WorkshopState {
  // Step 6
  uploadedFiles: UploadedFile[];
  doodleUrls: string[];

  // Step 7
  generatedQuestions: string[] | null;
  adoptedQuestion: string | null;
  adoptedResponse: string | null;

  // Step 8
  wordInputs: string[];
  wordArtPairs: WordArtPair[];

  // Step 9
  reflection: string | null;

  // Navigation
  currentStep: number;
}

export type WorkshopAction =
  | { type: "SET_UPLOADED_FILES"; payload: UploadedFile[] }
  | { type: "ADD_UPLOADED_FILE"; payload: UploadedFile }
  | { type: "REMOVE_UPLOADED_FILE"; payload: number }
  | { type: "SET_DOODLE_URLS"; payload: string[] }
  | { type: "SET_GENERATED_QUESTIONS"; payload: string[] }
  | { type: "SET_ADOPTED_QA"; payload: { question: string; response: string } }
  | { type: "SET_WORD_INPUTS"; payload: string[] }
  | { type: "SET_WORD_ART_PAIRS"; payload: WordArtPair[] }
  | { type: "SET_REFLECTION"; payload: string }
  | { type: "SET_STEP"; payload: number };
