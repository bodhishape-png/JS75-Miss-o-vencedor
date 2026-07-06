import { PlayerProgress } from "../types";

export function generateFriendCode(username: string): string {
  const clean = username.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const seed = clean.substring(0, 3) || "JS";
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `JS75-${seed}-${randomPart}`;
}

export const INITIAL_PROGRESS = (username: string, avatar: string = ""): PlayerProgress => {
  const code = generateFriendCode(username);
  const now = new Date().toISOString();
  return {
    username,
    avatar,
    phase: 1,
    xp: 0,
    badges: [],
    answers: {
      fase4Answers: ["", "", "", ""],
      fase6QuizAnswers: {},
    },
    fragments: [],
    presenceConfirmed: false,
    createdAt: now,
    lastAccess: now,
    friendCode: code,
    connectedFriendCodes: [],
  };
};

const STORAGE_KEY = "js75_proxima_fase_progress_v1";

export function saveProgress(progress: PlayerProgress): void {
  try {
    progress.lastAccess = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error("Erro ao salvar progresso no localStorage", err);
  }
}

export function loadProgress(): PlayerProgress | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data) as PlayerProgress;
    // Backwards compatibility / structure safety
    if (!parsed.answers) parsed.answers = {};
    if (!parsed.answers.fase4Answers) parsed.answers.fase4Answers = ["", "", "", ""];
    if (!parsed.fragments) parsed.fragments = [];
    if (!parsed.connectedFriendCodes) parsed.connectedFriendCodes = [];
    return parsed;
  } catch (err) {
    console.error("Erro ao carregar progresso do localStorage", err);
    return null;
  }
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Export progress to a safe code (base64 of JSON)
export function exportProgressToCode(progress: PlayerProgress): string {
  try {
    const jsonStr = JSON.stringify(progress);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    return encoded;
  } catch (err) {
    console.error("Erro ao exportar progresso", err);
    return "";
  }
}

// Import progress from code
export function importProgressFromCode(code: string): PlayerProgress | null {
  try {
    const trimmed = code.trim();
    if (!trimmed) return null;
    const decodedStr = decodeURIComponent(escape(atob(trimmed)));
    const parsed = JSON.parse(decodedStr) as PlayerProgress;
    if (parsed && typeof parsed.username === "string" && typeof parsed.phase === "number") {
      // Basic validation passed
      return parsed;
    }
    return null;
  } catch (err) {
    console.error("Erro ao importar progresso", err);
    return null;
  }
}

// Archetype descriptors for local info
export const ARCHETYPES = [
  {
    id: "Visionário",
    description: "Vê o futuro em detalhes e inspira outros a criar valor.",
    perks: "Habilidade Especial: Clarividência Digital (+25% XP em Enigmas)",
    accentColor: "from-cyan-500 to-blue-500",
    quote: "A revolução humana começa na imaginação de quem ousa transformar."
  },
  {
    id: "Conector",
    description: "Liga mentes e corações, tecendo pontes inquebráveis de amizade.",
    perks: "Habilidade Especial: Empatia de Rede (+25% XP em Cooperações)",
    accentColor: "from-purple-500 to-pink-500",
    quote: "Uma única conexão de amizade sincera pode iluminar o mundo inteiro."
  },
  {
    id: "Estrategista",
    description: "Analisa o cenário para traçar o caminho mais sábio e seguro.",
    perks: "Habilidade Especial: Mente Tática (+25% XP em Decisões)",
    accentColor: "from-blue-600 to-indigo-600",
    quote: "Vencer não é sorte; é determinação alinhada com sabedoria profunda."
  },
  {
    id: "Explorador",
    description: "Desbrava o desconhecido com coragem invencível.",
    perks: "Habilidade Especial: Espírito Pioneiro (+25% XP em Desafios)",
    accentColor: "from-teal-400 to-emerald-600",
    quote: "Cada nova fronteira é uma oportunidade de expandir o próprio potencial."
  },
  {
    id: "Construtor",
    description: "Coloca a mão na massa e ergue as estruturas de um novo amanhã.",
    perks: "Habilidade Especial: Força de Criação (+25% XP em Projetos)",
    accentColor: "from-fuchsia-500 to-rose-500",
    quote: "Palavras inspiram, mas são as ações consistentes que constroem a história."
  }
];

// Badge list definitions
export const BADGES_LIST = [
  {
    id: "Primeiro Passo",
    title: "Primeiro Passo",
    description: "Desperte seu potencial e registre sua jornada de juventude.",
    icon: "Rocket",
    xpBonus: 100
  },
  {
    id: "Ponte Humana",
    title: "Ponte Humana",
    description: "Construa uma conexão autêntica rompendo o isolamento.",
    icon: "Heart",
    xpBonus: 150
  },
  {
    id: "Avanço Compartilhado",
    title: "Avanço Compartilhado",
    description: "Compartilhe códigos e junte-se a outros jovens heróis da nova era.",
    icon: "Users",
    xpBonus: 200
  },
  {
    id: "Vencedor JS75",
    title: "Vencedor JS75",
    description: "Desbloqueou o enigma final do encontro presencial. Você é invencível!",
    icon: "Award",
    xpBonus: 500
  }
];

// Phase names and unlocks
export const PHASES = [
  { id: 1, title: "Fase 1: O Chamado", description: "Escolha seu perfil inicial", xpBonus: 100 },
  { id: 2, title: "Fase 2: A Queda", description: "O aprendizado na frustração", xpBonus: 150 },
  { id: 3, title: "Fase 3: Conexão", description: "Uma ponte humana de afeto", xpBonus: 150 },
  { id: 4, title: "Fase 4: Fragmentos", description: "O enigma visual do guerreiro", xpBonus: 200 },
  { id: 5, title: "Fase 5: Cooperação", description: "Sinergia e código de amizade", xpBonus: 200 },
  { id: 6, title: "Fase 6: Desafio da Determinação", description: "O quiz da mente Soka", xpBonus: 250 },
  { id: 7, title: "Fase 7: Transmissão Bloqueada", description: "O segredo do CAC UFPE", xpBonus: 300 },
  { id: 8, title: "Fase Final: Presencial", description: "A consagração e certificado", xpBonus: 500 }
];
