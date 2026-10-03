export type QuestionType = 'mcq' | 'boolean' | 'matching' | 'sorting' | 'ordering';

export interface BaseQuestion {
  id: string;
  lessonId: string;
  lessonTitle: string;
  concept: string; // The specific concept tested
  standard: string; // e.g. C0701.1
  sourceReference?: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  question: string;
  contextScenario?: string;
  explanation: string;
}

export interface McqQuestion extends BaseQuestion {
  type: 'mcq';
  options: string[];
  correctAnswerIndex: number; // 0-based
}

export interface BooleanQuestion extends BaseQuestion {
  type: 'boolean';
  correctAnswer: boolean;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  leftItems: { id: string; text: string }[];
  rightItems: { id: string; text: string }[];
  correctPairs: { leftId: string; rightId: string }[];
}

export interface SortingQuestion extends BaseQuestion {
  type: 'sorting';
  categories: { id: string; title: string }[];
  items: { id: string; text: string; correctCategoryId: string }[];
}

export interface OrderingQuestion extends BaseQuestion {
  type: 'ordering';
  items: { id: string; text: string }[];
  correctOrderIds: string[]; // Order of IDs
  orderLabel?: string; // e.g. "من الأكثر إلى الأقل كثافة"
}

export type Question = McqQuestion | BooleanQuestion | MatchingQuestion | SortingQuestion | OrderingQuestion;

export interface LessonInfo {
  id: string;
  number: string;
  title: string;
  standard: string;
  description: string;
  objectives: string[];
}

export interface UserAnswerRecord {
  questionId: string;
  question: Question;
  isCorrect: boolean;
  userSelectionText?: string;
  timestamp: number;
}

export interface StudentProfile {
  name: string;
  totalScore: number;
  completedLessons: string[];
}
