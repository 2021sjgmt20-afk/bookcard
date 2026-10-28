export type QuestionType = 'fact' | 'emotion' | 'connection';

export interface QuestionCardData {
  id: string;
  type: QuestionType;
  title: string;
  subtitle: string;
  question: string;
  hint: string;
  starter: string;
}

export interface ApiResponse {
  isAppropriate: boolean;
  friendlyFeedback: string;
  cards: QuestionCardData[];
  error?: string;
}

export interface BookPreset {
  title: string;
  scene: string;
  category: string;
}
