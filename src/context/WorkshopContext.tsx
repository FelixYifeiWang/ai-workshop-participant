"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { WorkshopState, WorkshopAction } from "@/types/workshop";

const initialState: WorkshopState = {
  apiKey: "",
  uploadedFiles: [],
  doodleUrls: [],
  generatedQuestions: null,
  adoptedQuestion: null,
  adoptedResponse: null,
  wordInput: null,
  feelingImageUrl: null,
  emotionImageUrl: null,
  reflection: null,
  currentStep: 0,
};

function workshopReducer(
  state: WorkshopState,
  action: WorkshopAction
): WorkshopState {
  switch (action.type) {
    case "SET_API_KEY":
      return { ...state, apiKey: action.payload };
    case "SET_UPLOADED_FILES":
      return { ...state, uploadedFiles: action.payload, doodleUrls: [] };
    case "ADD_UPLOADED_FILE":
      return {
        ...state,
        uploadedFiles: [...state.uploadedFiles, action.payload],
      };
    case "REMOVE_UPLOADED_FILE":
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.filter(
          (_, i) => i !== action.payload
        ),
      };
    case "SET_DOODLE_URLS":
      return { ...state, doodleUrls: action.payload };
    case "SET_GENERATED_QUESTIONS":
      return { ...state, generatedQuestions: action.payload };
    case "SET_ADOPTED_QA":
      return {
        ...state,
        adoptedQuestion: action.payload.question,
        adoptedResponse: action.payload.response,
      };
    case "SET_WORD_INPUT":
      return { ...state, wordInput: action.payload };
    case "SET_WORD_ART":
      return {
        ...state,
        feelingImageUrl: action.payload.feelingUrl,
        emotionImageUrl: action.payload.emotionUrl,
      };
    case "SET_REFLECTION":
      return { ...state, reflection: action.payload };
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    default:
      return state;
  }
}

const WorkshopContext = createContext<{
  state: WorkshopState;
  dispatch: React.Dispatch<WorkshopAction>;
} | null>(null);

export function WorkshopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workshopReducer, initialState);
  return (
    <WorkshopContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkshopContext.Provider>
  );
}

export function useWorkshop() {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error("useWorkshop must be used within a WorkshopProvider");
  }
  return context;
}
