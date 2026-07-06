import React, { useState, useEffect } from "react";
import { 
  Sparkles, Award, Play, RotateCcw, Share2, Smartphone, 
  MapPin, Calendar, Users, Gamepad2, AlertCircle, FileText, CheckCircle2 
} from "lucide-react";
import { PlayerProgress } from "./types";
import { loadProgress, saveProgress } from "./utils/gameHelpers";
import Login from "./components/Login";
import GameMap from "./components/GameMap";
import PhaseCard from "./components/PhaseCard";
import Profile from "./components/Profile";
import FinalUnlock from "./components/FinalUnlock";
import { 
  isFirebaseConfigured, 
  loginAnonymously, 
  loadPlayerFromFirestore, 
  savePlayerToFirestore 
} from "./firebase";

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"map" | "profile" | "instructions">("map");
  const [selectedMapPhaseId, setSelectedMapPhaseId] = useState<number>(1);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // New badge / XP Toast notification state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    badgeTitle?: string;
    xpAmount?: number;
  } | null>(null);

  // Load progress and check temporal bounds (Active only until 14/07/2026)
  useEffect(() => {
    // 1. Instant offline load from local storage
    const loaded = loadProgress();
    if (loaded) {
      setProgress(loaded);
      setSelectedMapPhaseId(loaded.phase);
    }

    // Check expiration date: July 14th, 2026
    const expirationDate = new Date("2026-07-15T00:00:00-03:00");
    const now = new Date();
    if (now > expirationDate) {
      setIsExpired(true);
    }

    // 2. Async synchronization with Firestore (free, no credit card)
    async function syncFirestore() {
      if (!isFirebaseConfigured) {
        console.warn("Firebase não configurado nas variáveis de ambiente (.env). Operando localmente.");
        return;
      }
      setIsSyncing(true);
      try {
        const user = await loginAnonymously();
        if (user) {
          setFirebaseUid(user.uid);
          
          // Pull source of truth from Firestore
          const cloudProgress = await loadPlayerFromFirestore(user.uid);
          if (cloudProgress) {
            setProgress(cloudProgress);
            saveProgress(cloudProgress); // keep local storage cache in sync
            setSelectedMapPhaseId(cloudProgress.phase);
            triggerToast("Progresso sincronizado com a nuvem!");
          } else {
            // New cloud account, migrate existing local progress if any
            const localProgress = loadProgress();
            if (localProgress) {
              await savePlayerToFirestore(user.uid, localProgress);
            }
          }
        }
      } catch (err) {
        console.warn("Falha na sincronização inicial do Firestore (operando em modo offline/localStorage):", err);
        // Fallback is already loaded from localStorage, app remains operational
      } finally {
        setIsSyncing(false);
      }
    }

    syncFirestore();
  }, []);

  // Handle manual/automatic save
  const handleUpdateProgress = async (updated: PlayerProgress) => {
    setProgress(updated);
    saveProgress(updated);
    setSelectedMapPhaseId(updated.phase);

    // Persist to Cloud in background
    if (firebaseUid) {
      try {
        await savePlayerToFirestore(firebaseUid, updated);
      } catch (err) {
        console.warn("Erro ao salvar progresso em nuvem (salvando localmente):", err);
      }
    }
  };

  // Login handler
  const handleLoginSuccess = async (newProgress: PlayerProgress) => {
    setProgress(newProgress);
    saveProgress(newProgress);
    setHasStarted(true);
    setSelectedMapPhaseId(newProgress.phase);
    
    // Award first entry XP toast
    triggerToast("Identidade sincronizada com a rede!", undefined, 50);

    // Persist to Cloud in background
    if (firebaseUid) {
      try {
        await savePlayerToFirestore(firebaseUid, newProgress);
      } catch (err) {
        console.warn("Erro ao registrar jogador em nuvem (salvando localmente):", err);
      }
    }
  };

  // XP addition utility with toast callback (now triggers the toast notification while PhaseCard handles single progress state updates)
  const handleAddXP = (amount: number, badgeTitle?: string) => {
    triggerToast(
      badgeTitle ? `Novo badge conquistado: ${badgeTitle}!` : `Você ganhou +${amount} XP!`,
      badgeTitle,
      amount
    );
  };

  // Toast trigger helper
  const triggerToast = (message: string, badgeTitle?: string, xpAmount?: number) => {
    setToast({ visible: true, message, badgeTitle, xpAmount });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Date formatted helper for local presentation
  const getFormattedDate = () => {
    return new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // RENDER: EXPIRED ARCHIVE VIEW (Post 14/07/2026)
  if (isExpired) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 bg-cyber-grid relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-full max-w-lg bg-slate-900/90 border border-red-500/30 p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none"></div>
          
          <span className="text-5xl block animate-pulse">🛰️</span>
          
          <div className="space-y-2">
            <span className="px-3 py-1 text-[10px] uppercase font-mono tracking-widest bg-red-500/15 text-red-400 border border-red-500/20 rounded-full inline-block">
              Transmissão Concluída
            </span>
            <h2 className="text-3xl font-sans font-extrabold text-white tracking-tight">
              JS75: Próxima Fase
            </h2>
            <p className="text-sm text-gray-400 font-mono">
              Obrigado por sua grande participação!
            </p>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed max-w-sm mx-auto">
            Este jogo-convite temporário encerrou seu ciclo ativo em 14 de julho de 2026. No entanto, as conexões humanas, a revolução individual e a determinação da Juventude Soka PE Norte e Sul continuam avançando todos os dias!
          </p>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono text-purple-400 uppercase tracking-widest">Coordenadas Históricas</h4>
            <div className="text-xs text-slate-400 font-mono space-y-1">
              <p>📍 CAC UFPE — Recife, PE</p>
              <p>📅 12 de Julho de 2026 • 10h</p>
              <p>🎯 Vitória Comprovada com Coragem e Amizade</p>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-gray-600 font-mono">
            RMs Pernambuco Norte e Sul • 2026
          </div>
        </div>
      </div>
    );
  }

  // RENDER: LANDING SEQUENCER
  if (!hasStarted && !progress) {
    return (
      <div className="min-h-screen bg-slate-950 bg-cyber-grid text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden">
        {/* Animated ambient particles */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

        {/* Header decoration */}
        <header className="w-full max-w-7xl mx-auto flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 tracking-tighter">
              JS75
            </span>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest border-l border-slate-800 pl-2">
              Pernambuco
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800/80">
            Sinal Ativo • {getFormattedDate()}
          </span>
        </header>

        {/* Main Content sequence */}
        <main className="w-full max-w-lg mx-auto text-center space-y-8 my-auto z-10 relative">
          <div className="space-y-4">
            <span className="px-3.5 py-1 text-xs uppercase font-mono tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full inline-block animate-float">
              Desafio do Protagonista
            </span>
            
            <h1 className="text-5xl md:text-6xl font-sans font-black tracking-tighter leading-none">
              <span className="block text-white">JS75:</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                Próxima Fase
              </span>
            </h1>

            <p className="text-base text-gray-300 font-sans max-w-md mx-auto leading-relaxed">
              A jornada começa antes do encontro. Você está pronto para continuar avançando?
            </p>
          </div>

          {/* Interactive Portal Launcher Button */}
          <div className="space-y-4">
            <button
              onClick={() => setHasStarted(true)}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans font-extrabold rounded-2xl shadow-xl shadow-purple-500/25 tracking-wider flex items-center justify-center space-x-3 mx-auto transition-all transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer group"
            >
              <Play className="h-5 w-5 fill-white text-white group-hover:rotate-12 transition-transform" />
              <span>INICIAR MISSÃO</span>
            </button>

            <p className="text-[11px] text-slate-500 font-mono">
              Encontro dos Jovens das RMs PE Norte e Sul • 12/07/2026 às 10h • CAC UFPE
            </p>
          </div>

          {/* Soka values info-bento */}
          <div className="grid grid-cols-2 gap-3 pt-6 max-w-sm mx-auto">
            <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl text-left">
              <Users className="h-4 w-4 text-cyan-400 mb-1" />
              <h4 className="text-[11px] font-bold text-slate-200">Amizade Real</h4>
              <p className="text-[9px] text-gray-500 font-mono mt-0.5 leading-snug">Conecte-se e compartilhe códigos com outros heróis.</p>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl text-left">
              <Gamepad2 className="h-4 w-4 text-purple-400 mb-1" />
              <h4 className="text-[11px] font-bold text-slate-200">Revolução Soka</h4>
              <p className="text-[9px] text-gray-500 font-mono mt-0.5 leading-snug">Supere o desânimo, extraia sabedoria e vença desafios.</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full text-center py-4 z-10">
          <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest block">
            Desenvolvido sob o espírito de criação de valor • PE 2026
          </span>
        </footer>
      </div>
    );
  }

  // RENDER: REGISTER SCREEN (Has clicked Start, but no profile saved)
  if (hasStarted && !progress) {
    return (
      <div className="min-h-screen bg-slate-950 bg-cyber-grid text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden">
        <header className="w-full max-w-7xl mx-auto flex items-center justify-between z-10">
          <button
            onClick={() => setHasStarted(false)}
            className="text-xs text-gray-400 hover:text-white font-mono flex items-center space-x-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Voltar</span>
          </button>
          <span className="text-[10px] font-mono text-gray-500">JS75 v1.0.0</span>
        </header>

        <main className="w-full my-auto z-10">
          <Login onLoginSuccess={handleLoginSuccess} />
        </main>

        <footer className="w-full text-center py-4 z-10">
          <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
            LocalStorage offline-first • Segurança e Privacidade de dados
          </span>
        </footer>
      </div>
    );
  }

  // RENDER: MASTER GAME BOARD INTERFACE (Logged in user dashboard)
  return (
    <div className="min-h-screen bg-slate-950 bg-cyber-grid text-slate-100 flex flex-col justify-between p-4 md:p-6 relative">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Dynamic Floating Toast Notification */}
      {toast && toast.visible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950 border-2 border-cyan-400 p-4 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-float flex items-start space-x-3 max-w-md w-full">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 flex-shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Atualização de Rede Sincronizada!
            </h5>
            <p className="text-sm font-sans font-bold text-white mt-0.5 leading-tight">
              {toast.message}
            </p>
            {toast.badgeTitle && (
              <span className="inline-block text-[9px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full mt-1 font-bold">
                Badge Unlocked: {toast.badgeTitle}
              </span>
            )}
            {toast.xpAmount && (
              <span className="inline-block text-[9px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-full mt-1 ml-1.5 font-bold">
                +{toast.xpAmount} XP Obtido
              </span>
            )}
          </div>
        </div>
      )}

      {/* Dashboard Main Header */}
      <header className="w-full max-w-7xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-black text-white text-lg tracking-tighter shadow-lg shadow-purple-500/10 select-none">
            JS
          </div>
          <div>
            <h1 className="text-base font-sans font-extrabold text-white leading-tight">
              JS75: Próxima Fase
            </h1>
            <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest leading-none mt-0.5">
              RM PE Norte e Sul • Juventude Soka
            </p>
          </div>
        </div>

        {/* Tab Navigation Hub */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("map")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === "map" ? "bg-slate-800 text-cyan-400" : "text-gray-400 hover:text-white"
            }`}
          >
            Painel da Jornada
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === "profile" ? "bg-slate-800 text-purple-400" : "text-gray-400 hover:text-white"
            }`}
          >
            Perfil & Conquistas
          </button>
          <button
            onClick={() => setActiveTab("instructions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === "instructions" ? "bg-slate-800 text-gray-200" : "text-gray-400 hover:text-white"
            }`}
          >
            Regulamento
          </button>
        </div>

        {/* Small Player Bubble widget */}
        {progress && (
          <div className="flex items-center space-x-2.5 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800">
            <div className="w-7 h-7 rounded-full bg-purple-950 border border-cyan-500/40 flex items-center justify-center overflow-hidden flex-shrink-0">
              {progress.avatar ? (
                progress.avatar.startsWith("data:image") ? (
                  <img src={progress.avatar} alt="P" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-sm select-none">{progress.avatar}</span>
                )
              ) : (
                <span className="text-sm">⚡</span>
              )}
            </div>
            <div className="text-left">
              <span className="text-[10px] font-mono text-white block font-bold leading-tight truncate max-w-[85px]">
                {progress.username}
              </span>
              <span className="text-[9px] font-mono text-cyan-400 leading-none">
                {progress.xp} XP
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Main Responsive Grid Layout */}
      <main className="w-full max-w-7xl mx-auto flex-1 z-10">
        
        {/* TAB 1: MAIN GAME MAP AND CURRENT PHASE CARD */}
        {activeTab === "map" && progress && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side: Interactive Map & Live Countdown */}
            <div className="lg:col-span-1 space-y-6">
              <GameMap 
                progress={progress} 
                onSelectPhase={(phaseId) => setSelectedMapPhaseId(phaseId)}
                activePhaseId={selectedMapPhaseId}
              />
              
              <FinalUnlock 
                isUnlocked={progress.badges.includes("Vencedor JS75")} 
                onUnlockSuccess={() => {
                  triggerToast("Fase Final Desbloqueada!", "Vencedor JS75", 500);
                }}
              />
            </div>

            {/* Right side: Dynamic Phase Card of focused node */}
            <div className="lg:col-span-2">
              <PhaseCard 
                progress={progress} 
                onUpdateProgress={handleUpdateProgress}
                onAddXP={handleAddXP}
              />
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE PROFILE AND CERTIFICATE */}
        {activeTab === "profile" && progress && (
          <div className="max-w-3xl mx-auto">
            <Profile 
              progress={progress} 
              onLogout={() => {
                setProgress(null);
                setHasStarted(false);
              }}
              onImportProgress={async (imported) => {
                setProgress(imported);
                saveProgress(imported);
                setSelectedMapPhaseId(imported.phase);
                triggerToast("Progresso restaurado com sucesso!", undefined, 100);
                if (firebaseUid) {
                  try {
                    await savePlayerToFirestore(firebaseUid, imported);
                  } catch (err) {
                    console.warn("Erro ao salvar progresso importado no Firestore (salvando localmente):", err);
                  }
                }
              }}
            />
          </div>
        )}

        {/* TAB 3: GAMEPLAY INSTRUCTIONS / REGULAMENTO */}
        {activeTab === "instructions" && (
          <div className="max-w-2xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4 text-center">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">Código de Conduta Digital</span>
              <h3 className="text-xl font-sans font-extrabold text-white mt-1">Manual de Operações JS75</h3>
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>Bem-vindo à Próxima Fase!</strong> O JS75 é um jogo-convite temporário interativo projetado para os jovens das RMs Pernambuco Norte e Sul, estimulando a reflexão, companheirismo e protagonismo.
              </p>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h5 className="font-sans font-bold text-white text-xs">Regras e Dinâmica:</h5>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong>Progressão Linear:</strong> Conclua a fase atual para liberar a seguinte.</li>
                  <li><strong>LocalStorage Seguro:</strong> Seus dados não saem do seu celular. São totalmente gratuitos e offline.</li>
                  <li><strong>Rede de Amizade:</strong> Compartilhe seu código de amizade com amigos para se apoiarem na pontuação.</li>
                  <li><strong>Passaporte Presencial:</strong> Conclua a Fase 7 para reservar seu lugar no Encontro do dia 12 de Julho de 2026.</li>
                  <li><strong>Diploma Digital:</strong> Cole o código revelado ao vivo no CAC UFPE para consagrar seu certificado de Vencedor.</li>
                </ul>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl flex items-start space-x-2.5">
                <AlertCircle className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-[10px] text-cyan-300">
                  Importante: Este jogo-convite temporário ficará ativo somente até o dia 14 de julho de 2026. Guarde seu código de salvamento caso queira trocar de aparelho!
                </span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto text-center pt-8 pb-2 border-t border-slate-900/60 mt-8">
        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest block">
          Pernambuco Conectado • Juventude Soka • CAC UFPE 12/07/26
        </span>
      </footer>
    </div>
  );
}
