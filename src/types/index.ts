// Data models for the Sherlock Holmes App Blocker

export interface BlockedApp {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  isBlocked: boolean;
  timeLimit: number; // minutes per day
  timeUsed: number; // minutes used today
  lastAccessed: Date | null;
}

export interface SherlockPuzzle {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  category: "trivia" | "logic" | "riddle" | "deduction";
  hint?: string;
  explanation?: string;
}

export interface PuzzleAttempt {
  puzzleId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timestamp: Date;
  timeToSolve: number; // seconds
}

export interface AppSettings {
  weeklyLimitChangeDate: Date | null;
  puzzleDifficulty: "easy" | "medium" | "hard" | "mixed";
  requirePuzzleForAccess: boolean;
  maxDailyAttempts: number;
  emergencyAccessCode?: string;
  themeMode: "light" | "dark" | "auto";
}

export interface UserStats {
  totalPuzzlesSolved: number;
  correctAnswers: number;
  currentStreak: number;
  longestStreak: number;
  averageTimeToSolve: number;
  favoriteCategory: string;
  totalTimeBlocked: number; // minutes
}

export type AppScreen =
  | "home"
  | "apps"
  | "puzzle"
  | "settings"
  | "stats"
  | "access-request";

export interface AppState {
  currentScreen: AppScreen;
  selectedApp: BlockedApp | null;
  currentPuzzle: SherlockPuzzle | null;
  isLoading: boolean;
  error: string | null;
}
