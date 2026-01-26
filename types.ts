
export interface Match {
  id: string;
  opponent: string;
  date: string;
  isHome: boolean;
  actualHomeScore?: number;
  actualAwayScore?: number;
  status: 'upcoming' | 'finished';
}

export interface Prediction {
  matchId: string;
  homeScore: number;
  awayScore: number;
}

export interface BonusQuestion {
  id: string;
  question: string;
  answer?: string;
  correctAnswer?: string;
  points: number;
}

export interface UserPoule {
  id: string;
  name: string;
  predictions: Prediction[];
  bonusAnswers: Record<string, string>;
  totalPoints: number;
  avatar: string;
}

export type ViewState = 'dashboard' | 'matches' | 'bonus' | 'leaderboard' | 'admin';
