export interface Quest {
  id: string;
  title: string;
  xpValue: number;
  durationMinutes: number; // Standard duration for the quest type, e.g., 1440 for a daily quest
  isComplete: boolean;
  timestamp: number; // Creation timestamp
}

export interface IncompleteQuestForAI {
  xpValue: number;
  durationMinutes: number;
  timeRemainingMinutes: number;
}
