import type {
  BlockedApp,
  AppSettings,
  UserStats,
  PuzzleAttempt,
} from "../types";

// Storage keys
const STORAGE_KEYS = {
  BLOCKED_APPS: "sherlocked_blocked_apps",
  APP_SETTINGS: "sherlocked_app_settings",
  USER_STATS: "sherlocked_user_stats",
  PUZZLE_ATTEMPTS: "sherlocked_puzzle_attempts",
  LAST_PUZZLE_DATE: "sherlocked_last_puzzle_date",
} as const;

// Default values
const DEFAULT_SETTINGS: AppSettings = {
  weeklyLimitChangeDate: null,
  puzzleDifficulty: "mixed",
  requirePuzzleForAccess: true,
  maxDailyAttempts: 5,
  themeMode: "auto",
};

const DEFAULT_STATS: UserStats = {
  totalPuzzlesSolved: 0,
  correctAnswers: 0,
  currentStreak: 0,
  longestStreak: 0,
  averageTimeToSolve: 0,
  favoriteCategory: "logic",
  totalTimeBlocked: 0,
};

// Helper function to safely parse JSON
const safeJsonParse = <T>(value: string | null, defaultValue: T): T => {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
};

// Blocked Apps Storage
export const getBlockedApps = (): BlockedApp[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.BLOCKED_APPS);
  return safeJsonParse(stored, []);
};

export const saveBlockedApps = (apps: BlockedApp[]): void => {
  localStorage.setItem(STORAGE_KEYS.BLOCKED_APPS, JSON.stringify(apps));
};

export const addBlockedApp = (app: BlockedApp): void => {
  const apps = getBlockedApps();
  const existingIndex = apps.findIndex((a) => a.id === app.id);

  if (existingIndex >= 0) {
    apps[existingIndex] = app;
  } else {
    apps.push(app);
  }

  saveBlockedApps(apps);
};

export const removeBlockedApp = (appId: string): void => {
  const apps = getBlockedApps();
  const filteredApps = apps.filter((app) => app.id !== appId);
  saveBlockedApps(filteredApps);
};

export const updateAppUsage = (appId: string, timeUsed: number): void => {
  const apps = getBlockedApps();
  const appIndex = apps.findIndex((app) => app.id === appId);

  if (appIndex >= 0) {
    apps[appIndex].timeUsed = timeUsed;
    apps[appIndex].lastAccessed = new Date();
    saveBlockedApps(apps);
  }
};

// App Settings Storage
export const getAppSettings = (): AppSettings => {
  const stored = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
  const settings = safeJsonParse(stored, DEFAULT_SETTINGS);

  // Convert date strings back to Date objects
  if (settings.weeklyLimitChangeDate) {
    settings.weeklyLimitChangeDate = new Date(settings.weeklyLimitChangeDate);
  }

  return settings;
};

export const saveAppSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
};

export const canChangeLimits = (): boolean => {
  const settings = getAppSettings();
  if (!settings.weeklyLimitChangeDate) return true;

  const now = new Date();
  const lastChange = new Date(settings.weeklyLimitChangeDate);
  const daysDiff = Math.floor(
    (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysDiff >= 7;
};

export const updateWeeklyLimitChangeDate = (): void => {
  const settings = getAppSettings();
  settings.weeklyLimitChangeDate = new Date();
  saveAppSettings(settings);
};

// User Stats Storage
export const getUserStats = (): UserStats => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
  return safeJsonParse(stored, DEFAULT_STATS);
};

export const saveUserStats = (stats: UserStats): void => {
  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
};

export const updateUserStats = (
  isCorrect: boolean,
  timeToSolve: number,
  category: string
): void => {
  const stats = getUserStats();

  stats.totalPuzzlesSolved++;

  if (isCorrect) {
    stats.correctAnswers++;
    stats.currentStreak++;
    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }

  // Update average time to solve
  const totalTime =
    stats.averageTimeToSolve * (stats.totalPuzzlesSolved - 1) + timeToSolve;
  stats.averageTimeToSolve = totalTime / stats.totalPuzzlesSolved;

  // Update favorite category (simple approach - could be more sophisticated)
  stats.favoriteCategory = category;

  saveUserStats(stats);
};

// Puzzle Attempts Storage
export const getPuzzleAttempts = (): PuzzleAttempt[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PUZZLE_ATTEMPTS);
  const attempts = safeJsonParse(stored, []);

  // Convert timestamp strings back to Date objects
  return attempts.map((attempt: any) => ({
    ...attempt,
    timestamp: new Date(attempt.timestamp),
  }));
};

export const savePuzzleAttempt = (attempt: PuzzleAttempt): void => {
  const attempts = getPuzzleAttempts();
  attempts.push(attempt);

  // Keep only last 100 attempts to prevent storage bloat
  const recentAttempts = attempts.slice(-100);

  localStorage.setItem(
    STORAGE_KEYS.PUZZLE_ATTEMPTS,
    JSON.stringify(recentAttempts)
  );
};

export const getTodaysPuzzleAttempts = (): PuzzleAttempt[] => {
  const attempts = getPuzzleAttempts();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return attempts.filter((attempt) => {
    const attemptDate = new Date(attempt.timestamp);
    attemptDate.setHours(0, 0, 0, 0);
    return attemptDate.getTime() === today.getTime();
  });
};

export const canAttemptPuzzle = (): boolean => {
  const settings = getAppSettings();
  const todaysAttempts = getTodaysPuzzleAttempts();
  return todaysAttempts.length < settings.maxDailyAttempts;
};

// Daily reset utilities
export const resetDailyUsage = (): void => {
  const apps = getBlockedApps();
  const resetApps = apps.map((app) => ({
    ...app,
    timeUsed: 0,
  }));
  saveBlockedApps(resetApps);
};

export const shouldResetDailyUsage = (): boolean => {
  const lastReset = localStorage.getItem("sherlocked_last_reset");
  if (!lastReset) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastResetDate = new Date(lastReset);
  lastResetDate.setHours(0, 0, 0, 0);

  return today.getTime() > lastResetDate.getTime();
};

export const markDailyReset = (): void => {
  localStorage.setItem("sherlocked_last_reset", new Date().toISOString());
};

// Clear all data (for testing or reset)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
  localStorage.removeItem("sherlocked_last_reset");
};

// Export/Import functionality
export const exportData = (): string => {
  const data = {
    blockedApps: getBlockedApps(),
    settings: getAppSettings(),
    stats: getUserStats(),
    attempts: getPuzzleAttempts(),
  };
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);

    if (data.blockedApps) saveBlockedApps(data.blockedApps);
    if (data.settings) saveAppSettings(data.settings);
    if (data.stats) saveUserStats(data.stats);
    if (data.attempts) {
      localStorage.setItem(
        STORAGE_KEYS.PUZZLE_ATTEMPTS,
        JSON.stringify(data.attempts)
      );
    }

    return true;
  } catch {
    return false;
  }
};
