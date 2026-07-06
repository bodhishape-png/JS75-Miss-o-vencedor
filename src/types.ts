export interface PlayerProgress {
  username: string;
  avatar: string; // base64 string or empty
  phase: number; // 1 to 8 (Fases 1 to 7, plus Fase Final/Certificado)
  xp: number;
  badges: string[]; // List of badge titles earned
  answers: {
    archetype?: string; // Fase 1 choice
    fase2Choice?: string; // Fase 2 decision
    fase3Reflection?: string; // Fase 3 note
    fase4Answers?: string[]; // Fase 4 text answers (4 questions)
    fase6QuizAnswers?: Record<string, number>; // Fase 6 answers
  };
  fragments: number[]; // Indices of unlocked fragments (0 to 3)
  presenceConfirmed: boolean; // Fase 7 choice
  createdAt: string;
  lastAccess: string;
  friendCode: string; // Their own generated friend code
  connectedFriendCodes: string[]; // Codes they have connected with
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  xpBonus: number;
}
