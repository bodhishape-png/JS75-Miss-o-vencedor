import React, { useState, useEffect } from "react";
import { 
  Rocket, Heart, Users, Award, CheckCircle2, Lock, Unlock, Sparkles, 
  Copy, Check, Send, AlertCircle, RefreshCw, MapPin, Calendar, Clock, 
  FileText, ShieldCheck, Gamepad2, Info
} from "lucide-react";
import { PlayerProgress } from "../types";
import { ARCHETYPES, BADGES_LIST } from "../utils/gameHelpers";

interface PhaseCardProps {
  progress: PlayerProgress;
  onUpdateProgress: (updated: PlayerProgress) => void;
  onAddXP: (amount: number, badgeTitle?: string) => void;
}

export default function PhaseCard({ progress, onUpdateProgress, onAddXP }: PhaseCardProps) {
  // Local state for active phase tab (can review previous unlocked phases)
  const [activeTab, setActiveTab] = useState<number>(progress.phase);

  // Sync activeTab with progress.phase as player unlocks new phases
  useEffect(() => {
    setActiveTab(progress.phase);
  }, [progress.phase]);

  // Phase 1 Archetype state
  const [selectedArch, setSelectedArch] = useState<string>("");

  // Phase 2 Choice states
  const [fase2Selection, setFase2Selection] = useState<string>("");
  const [fase2Feedback, setFase2Feedback] = useState<string>("");
  const [fase2Complete, setFase2Complete] = useState<boolean>(false);

  // Phase 3 Reflection
  const [reflection, setReflection] = useState<string>("");
  const [fase3Success, setFase3Success] = useState<boolean>(false);

  // Phase 4 Fragments
  const [fragAnswers, setFragAnswers] = useState<string[]>(["", "", "", ""]);
  const [unlockedFrags, setUnlockedFrags] = useState<number[]>([]);
  const [fragSuccess, setFragSuccess] = useState<boolean>(false);

  // Phase 5 Code
  const [friendCodeInput, setFriendCodeInput] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<string>("");
  const [codeSuccess, setCodeSuccess] = useState<string>("");

  // Phase 6 Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizError, setQuizError] = useState<string>("");

  // Phase 8 Live code state
  const [liveCode, setLiveCode] = useState<string>("");
  const [liveError, setLiveError] = useState<string>("");
  const [liveSuccess, setLiveSuccess] = useState<boolean>(false);

  // Phase descriptions
  const phasesData = [
    { id: 1, title: "O Chamado", icon: Rocket, summary: "Desperte sua identidade de juventude" },
    { id: 2, title: "A Queda", icon: RefreshCw, summary: "Transforme a dor em avanço" },
    { id: 3, title: "Conexão", icon: Heart, summary: "Construa pontes reais de amizade" },
    { id: 4, title: "Fragmentos", icon: ShieldCheck, summary: "Sintetize a determinação guerreira" },
    { id: 5, title: "Cooperação", icon: Users, summary: "Integre a rede com códigos de amizade" },
    { id: 6, title: "Determinação", icon: Gamepad2, summary: "O quiz do espírito invencível" },
    { id: 7, title: "Transmissão", icon: Info, summary: "O enigma bloqueado do CAC UFPE" },
    { id: 8, title: "Fase Final", icon: Award, summary: "A consagração de herói presencial" }
  ];

  // Helper to copy self friend code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(progress.friendCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Phase 1 Action: Set Archetype
  const handleSelectArchetype = (archId: string) => {
    setSelectedArch(archId);
  };

  const handleRegisterArchetype = () => {
    if (!selectedArch) return;
    
    const updated = { ...progress };
    updated.answers.archetype = selectedArch;
    updated.phase = 2;
    
    // Earn Badge & XP
    if (!updated.badges.includes("Primeiro Passo")) {
      updated.badges.push("Primeiro Passo");
      onAddXP(100, "Primeiro Passo");
    }
    
    onUpdateProgress(updated);
  };

  // Phase 2 Action: Choices
  const handleFase2Submit = (option: string) => {
    setFase2Selection(option);
    if (option === "desisto") {
      setFase2Feedback("Essa escolha é compreensível. A frustração pesa nos ombros de quem tenta. Mas será que desistir abrirá novas portas em sua revolução pessoal? Existe outro caminho de perseverança.");
    } else if (option === "culpo") {
      setFase2Feedback("Atribuir o resultado a fatores externos é uma reação humana natural para aliviar a dor. Porém, que tal retomar o leme do seu destino? Existe uma força maior dentro de você.");
    } else if (option === "respiro") {
      setFase2Feedback("Resposta incrível! Vencedores também sentem dor, cansaço e frustração. A diferença é que eles usam o vento contrário para decolar, respiram fundo, aprendem e avançam mais fortes.");
      setFase2Complete(true);
    }
  };

  const handleFase2Advance = () => {
    const updated = { ...progress };
    updated.answers.fase2Choice = "respiro";
    updated.phase = 3;
    onAddXP(150);
    onUpdateProgress(updated);
  };

  // Phase 3 Action: Connection Reflection
  const handleFase3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reflection.trim().length < 10) {
      return;
    }
    setFase3Success(true);
  };

  const handleFase3Advance = () => {
    const updated = { ...progress };
    updated.answers.fase3Reflection = reflection;
    updated.phase = 4;
    
    if (!updated.badges.includes("Ponte Humana")) {
      updated.badges.push("Ponte Humana");
      onAddXP(150, "Ponte Humana");
    } else {
      onAddXP(150);
    }
    onUpdateProgress(updated);
  };

  // Phase 4 Action: Fragment Quiz
  const fragQuestions = [
    { id: 0, text: "O que te faz continuar mesmo sob tempestades?", phrase: "Os vencedores não são" },
    { id: 1, text: "Quem caminha ao seu lado nessa jornada da vida?", phrase: " os que nunca caem." },
    { id: 2, text: "Qual perda ou desafio já te ensinou sua maior lição?", phrase: " São os que decidem" },
    { id: 3, text: "Que futuro brilhante você quer começar a construir hoje?", phrase: " levantar mais uma vez." }
  ];

  const handleUnlockFragment = (index: number) => {
    if (!fragAnswers[index].trim()) return;
    if (!unlockedFrags.includes(index)) {
      const nextFrags = [...unlockedFrags, index];
      setUnlockedFrags(nextFrags);
      if (nextFrags.length === 4) {
        setFragSuccess(true);
      }
    }
  };

  const handleFase4Advance = () => {
    const updated = { ...progress };
    updated.answers.fase4Answers = fragAnswers;
    updated.fragments = unlockedFrags;
    updated.phase = 5;
    onAddXP(200);
    onUpdateProgress(updated);
  };

  // Phase 5 Action: Friend Code
  const handleFriendCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError("");
    setCodeSuccess("");

    const code = friendCodeInput.trim().toUpperCase();
    if (!code) {
      setCodeError("Por favor, digite o código de amizade do seu amigo.");
      return;
    }

    if (code === progress.friendCode.toUpperCase()) {
      setCodeError("Você não pode inserir o seu próprio código de amizade! Encontre o código de outro jogador.");
      return;
    }

    // Accept codes following the structural format JS75-XXXX-YYYY or generic JS75-XXXX
    const regex = /^JS75-[A-Z0-9]+-[A-Z0-9]+$/i;
    const fallbackRegex = /^JS75-[A-Z0-9]+$/i;
    const testCode = regex.test(code) || fallbackRegex.test(code) || code === "VENCER75";

    if (!testCode) {
      setCodeError("Formato de código inválido! Deve ser algo como: JS75-NOM-XXXX");
      return;
    }

    setCodeSuccess("Código validado com sucesso! Sinergia de rede estabelecida. Amizade gera vitória compartilhada!");
  };

  const handleFase5Advance = () => {
    const updated = { ...progress };
    const code = friendCodeInput.trim().toUpperCase();
    if (!updated.connectedFriendCodes.includes(code)) {
      updated.connectedFriendCodes.push(code);
    }
    updated.phase = 6;
    
    if (!updated.badges.includes("Avanço Compartilhado")) {
      updated.badges.push("Avanço Compartilhado");
      onAddXP(200, "Avanço Compartilhado");
    } else {
      onAddXP(200);
    }
    onUpdateProgress(updated);
  };

  // Phase 6 Action: Inspiring Quiz
  const quizQuestions = [
    {
      id: 1,
      q: "Qual é o pilar central para superar perdas e frustrações segundo a filosofia budista de criação de valor?",
      options: [
        "Ignorar os problemas e focar no lazer temporário.",
        "Acreditar que tudo é azar e resignar-se com as perdas.",
        "Extrair aprendizado de cada crise, transformando o próprio sofrimento em combustível para avançar."
      ],
      correct: 2,
      explanation: "A filosofia de Nichiren Daishonin ensina o princípio de 'transformar veneno em remédio', onde todo obstáculo vira rampa de crescimento."
    },
    {
      id: 2,
      q: "Ninguém vence sozinho. Qual o papel da amizade sincera na conquista da felicidade absoluta?",
      options: [
        "Apenas divertir-se sem refletir sobre o propósito da vida.",
        "Ser uma rede de apoio mútuo que nos incentiva a não desistir de nossos sonhos nos momentos difíceis.",
        "Criar concorrência para ver quem se dá bem primeiro."
      ],
      correct: 1,
      explanation: "Os laços de companheirismo na juventude nos sustentam e multiplicam nossa determinação diante de qualquer rasteira do destino."
    },
    {
      id: 3,
      q: "No contexto do Encontro JS75, o que simboliza a 'Próxima Fase'?",
      options: [
        "Apenas um marco no celular de entretenimento.",
        "O compromisso individual de cada jovem em se levantar, agir com coragem e ser protagonista de sua própria história no mundo real.",
        "Esperar o tempo passar para que o futuro se resolva sozinho."
      ],
      correct: 1,
      explanation: "A verdadeira revolução humana é ativa: começa em nossas decisões diárias e se consolida no encontro presencial de mentes brilhantes!"
    }
  ];

  const handleQuizAnswer = (qId: number, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    setQuizError("");
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(quizAnswers).length < 3) {
      setQuizError("Por favor, responda a todas as 3 perguntas inspiradoras.");
      return;
    }

    // Check if answers are correct (encourage constructive ones)
    const incorrects = quizQuestions.filter(q => quizAnswers[q.id] !== q.correct);
    if (incorrects.length > 0) {
      setQuizError("Alguma resposta não reflete a visão mais construtiva de superação. Tente reler com o coração e ajustar!");
      return;
    }

    setQuizSubmitted(true);
  };

  const handleFase6Advance = () => {
    const updated = { ...progress };
    updated.answers.fase6QuizAnswers = quizAnswers;
    updated.phase = 7;
    onAddXP(250);
    onUpdateProgress(updated);
  };

  // Phase 7 Action: Confirm Presence
  const handleConfirmPresence = () => {
    const updated = { ...progress };
    updated.presenceConfirmed = true;
    updated.phase = 8;
    onAddXP(300);
    onUpdateProgress(updated);
  };

  // Phase 8 Action: Secret Live Code
  const handleLiveCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLiveError("");
    if (liveCode.trim().toUpperCase() === "VENCER75") {
      setLiveSuccess(true);
    } else {
      setLiveError("Código incorreto. Este código será revelado presencialmente no Encontro JS75 no dia 12/07/26!");
    }
  };

  const handleFase8Advance = () => {
    const updated = { ...progress };
    
    if (!updated.badges.includes("Vencedor JS75")) {
      updated.badges.push("Vencedor JS75");
      onAddXP(500, "Vencedor JS75");
    }
    
    onUpdateProgress(updated);
  };

  // Progress percentage calculation
  const progressPercent = Math.min(100, Math.round(((progress.phase - 1) / 7) * 100));

  return (
    <div className="space-y-6" id="game-map-wrapper">
      {/* Progression Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">Painel Holográfico</span>
          <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
            Progresso da Jornada
            <span className="text-xs py-0.5 px-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full font-mono">
              {progressPercent}%
            </span>
          </h3>
        </div>
        
        {/* Progress Bar with glowing neon markers */}
        <div className="w-full md:flex-1 max-w-md bg-slate-950 h-3.5 rounded-full border border-slate-800 p-0.5 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* XP tracker */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></div>
          <span className="text-sm font-mono text-cyan-400 font-bold">{progress.xp} XP</span>
        </div>
      </div>

      {/* Holographic Nav Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {phasesData.map((ph) => {
          const isUnlocked = ph.id <= progress.phase;
          const isActive = activeTab === ph.id;
          const IconComponent = ph.icon;

          return (
            <button
              key={ph.id}
              onClick={() => isUnlocked && setActiveTab(ph.id)}
              disabled={!isUnlocked}
              className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-xl border font-mono text-xs transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                  : isUnlocked 
                    ? "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300"
                    : "bg-slate-950/40 border-slate-900 text-slate-700 cursor-not-allowed"
              }`}
            >
              {isUnlocked ? (
                <IconComponent className={`h-3.5 w-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
              ) : (
                <Lock className="h-3 w-3 text-slate-800" />
              )}
              <span>Fase {ph.id}</span>
            </button>
          );
        })}
      </div>

      {/* Active Phase Dynamic Box */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        {/* Subtle tech mesh background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1020_1px,transparent_1px),linear-gradient(to_bottom,#0c1020_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Phase Title Block */}
        <div className="relative z-10 border-b border-slate-800/80 pb-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-1 font-mono text-xs tracking-wider uppercase">
              <span>Módulo {activeTab}</span>
              <span>•</span>
              <span className="text-purple-400">{phasesData[activeTab - 1].summary}</span>
            </div>
            <h2 className="text-2xl font-sans font-extrabold text-white">
              {activeTab}. {phasesData[activeTab - 1].title}
            </h2>
          </div>
          
          <div className="flex-shrink-0">
            {activeTab < progress.phase ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-mono text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>COMPLETO</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full font-mono text-xs">
                <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
                <span>FASE ATIVA</span>
              </span>
            )}
          </div>
        </div>

        {/* GAMEPLAY ROUTER BY ACTIVE TAB */}
        <div className="relative z-10 min-h-[300px] flex flex-col justify-between">
          
          {/* FASE 1: O CHAMADO */}
          {activeTab === 1 && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-center space-y-2">
                <blockquote className="text-slate-300 italic text-sm font-sans leading-relaxed">
                  “Uma geração que transforma o futuro não nasce pronta. Ela se levanta, aprende, cria valor e continua avançando.”
                </blockquote>
                <cite className="block text-[11px] font-mono text-purple-400 uppercase tracking-widest not-italic">
                  — Princípio da Juventude Soka
                </cite>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-wider text-gray-400">
                  Selecione seu Arquétipo de Juventude:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  {ARCHETYPES.map((arch) => {
                    const isSelected = selectedArch === arch.id || progress.answers.archetype === arch.id;
                    return (
                      <button
                        key={arch.id}
                        type="button"
                        onClick={() => progress.phase === 1 && handleSelectArchetype(arch.id)}
                        disabled={progress.phase > 1}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all h-full ${
                          isSelected
                            ? "bg-gradient-to-b from-cyan-950/30 to-purple-950/30 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.15)] scale-[1.02]"
                            : "bg-slate-950 hover:bg-slate-900 border-slate-800"
                        }`}
                      >
                        <div>
                          <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${arch.accentColor} mb-2`}></div>
                          <h5 className="font-sans font-bold text-white text-sm">{arch.id}</h5>
                          <p className="text-[11px] text-gray-400 font-mono mt-1 leading-normal">
                            {arch.description}
                          </p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-slate-900 text-[9px] font-mono text-cyan-400 uppercase">
                          {arch.perks}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedArch && (
                <div className="p-4 bg-slate-950/80 rounded-xl border border-purple-500/10 space-y-2 animate-fade-in">
                  <span className="text-[10px] font-mono text-purple-400 uppercase">Mentalidade do {selectedArch}:</span>
                  <p className="text-xs text-slate-300 italic">
                    "{ARCHETYPES.find(a => a.id === selectedArch)?.quote}"
                  </p>
                </div>
              )}

              {progress.phase === 1 ? (
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleRegisterArchetype}
                    disabled={!selectedArch}
                    className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-45 text-white font-sans font-bold rounded-xl shadow-lg shadow-purple-500/10 transition-all flex items-center space-x-2"
                  >
                    <Rocket className="h-4 w-4" />
                    <span>REGISTRAR PERFIL INICIAL</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-center">
                  <p className="text-sm text-emerald-400 font-mono">
                    ✓ Perfil registrado como <strong>{progress.answers.archetype}</strong>. Sua jornada começou!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FASE 2: A QUEDA */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-4">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">Simulador de Decisão</span>
                <p className="text-sm text-white font-sans leading-relaxed">
                  Imagine a seguinte situação: Você se preparou incansavelmente para um objetivo muito importante (um vestibular, um projeto inovador, ou um cargo dos sonhos), mas o resultado veio negativo. O desânimo tenta tomar conta. Qual o seu próximo passo?
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  disabled={progress.phase > 2 || fase2Complete}
                  onClick={() => handleFase2Submit("desisto")}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    fase2Selection === "desisto" 
                      ? "bg-slate-950 border-red-500/50" 
                      : "bg-slate-950 hover:bg-slate-900 border-slate-800"
                  }`}
                >
                  <span className="text-xl block mb-2">😞</span>
                  <h5 className="text-sm font-sans font-bold text-white mb-1">Opção A: Desistir</h5>
                  <p className="text-xs text-slate-400 font-mono">
                    "Desisto. Acho que não nasci para isso e não vale a pena sofrer mais."
                  </p>
                </button>

                <button
                  type="button"
                  disabled={progress.phase > 2 || fase2Complete}
                  onClick={() => handleFase2Submit("culpo")}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    fase2Selection === "culpo" 
                      ? "bg-slate-950 border-orange-500/50" 
                      : "bg-slate-950 hover:bg-slate-900 border-slate-800"
                  }`}
                >
                  <span className="text-xl block mb-2">😤</span>
                  <h5 className="text-sm font-sans font-bold text-white mb-1">Opção B: Culpar os Outros</h5>
                  <p className="text-xs text-slate-400 font-mono">
                    "Culpo as circunstâncias e as pessoas. Não tive culpa de nada."
                  </p>
                </button>

                <button
                  type="button"
                  disabled={progress.phase > 2 || fase2Complete}
                  onClick={() => handleFase2Submit("respiro")}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    fase2Selection === "respiro" || progress.phase > 2
                      ? "bg-gradient-to-b from-cyan-950/20 to-purple-950/20 border-cyan-500" 
                      : "bg-slate-950 hover:bg-slate-900 border-slate-800"
                  }`}
                >
                  <span className="text-xl block mb-2">⚡</span>
                  <h5 className="text-sm font-sans font-bold text-white mb-1">Opção C: Superar</h5>
                  <p className="text-xs text-slate-400 font-mono">
                    "Respiro, acolho a dor, extraio os aprendizados e tento novamente com sabedoria."
                  </p>
                </button>
              </div>

              {fase2Feedback && (
                <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed transition-all ${
                  fase2Selection === "respiro" || progress.phase > 2
                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-950/80 border-slate-800 text-slate-300"
                }`}>
                  <div className="flex items-start space-x-2">
                    <Info className={`h-4 w-4 mt-0.5 flex-shrink-0 ${fase2Selection === "respiro" ? "text-emerald-400" : "text-cyan-400"}`} />
                    <span>{fase2Feedback}</span>
                  </div>
                </div>
              )}

              {progress.phase === 2 && fase2Complete && (
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleFase2Advance}
                    className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans font-bold rounded-xl shadow-lg shadow-purple-500/10 transition-all flex items-center space-x-2"
                  >
                    <span>AVANÇAR NA JORNADA</span>
                    <Rocket className="h-4 w-4" />
                  </button>
                </div>
              )}

              {progress.phase > 2 && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-center">
                  <p className="text-sm text-emerald-400 font-mono">
                    ✓ Decisão tomada! Você provou compreender que heróis também caem, mas decidem se levantar com aprendizado.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FASE 3: CONEXÃO */}
          {activeTab === 3 && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">Missão no Mundo Real</span>
                <p className="text-sm text-slate-200 font-sans leading-relaxed">
                  A tecnologia deve encurtar distâncias, não isolar. Sua missão agora é real:
                  <strong className="text-cyan-400"> envie uma mensagem curta, um áudio ou ligue</strong> para alguém que você admira, que sinta saudades ou que não conversa há algum tempo. Pergunte como ela está, envie carinho.
                </p>
                <p className="text-xs text-slate-400 italic">
                  Abra o WhatsApp, Telegram ou telefone, faça a ponte humana e volte aqui para registrar a reflexão.
                </p>
              </div>

              {!fase3Success && progress.phase === 3 ? (
                <form onSubmit={handleFase3Submit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="reflection" className="block text-xs font-mono uppercase tracking-wider text-gray-400">
                      O que essa conexão despertou em você? (Reflexão pós-mensagem)
                    </label>
                    <textarea
                      id="reflection"
                      rows={3}
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                      placeholder="Compartilhe brevemente em palavras o sentimento dessa ponte..."
                      className="block w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-xs font-mono"
                    />
                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                      <span>Mínimo 10 caracteres</span>
                      <span>{reflection.length} digitados</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={reflection.trim().length < 10}
                      className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-45 text-white font-sans font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>CONCLUIR CONEXÃO</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl space-y-2 text-center">
                    <p className="text-sm text-emerald-400 font-mono">
                      ✓ Reflexão registrada com maestria!
                    </p>
                    <p className="text-xs text-slate-300 italic font-mono max-w-xl mx-auto">
                      "{progress.phase === 3 ? reflection : progress.answers.fase3Reflection}"
                    </p>
                  </div>

                  {progress.phase === 3 && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleFase3Advance}
                        className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2"
                      >
                        <span>AVANÇAR PARA FASE 4</span>
                        <Rocket className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* FASE 4: FRAGMENTOS */}
          {activeTab === 4 && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">Enigma Visual dos Fragmentos</span>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  Responda às questões reflexivas para descriptografar os 4 blocos da frase de vitória.
                </p>
              </div>

              {/* Puzzle Screen Display */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {fragQuestions.map((q, idx) => {
                  const isUnlocked = unlockedFrags.includes(idx) || progress.fragments?.includes(idx) || progress.phase > 4;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col justify-between min-h-[140px] transition-all relative overflow-hidden ${
                        isUnlocked
                          ? "bg-gradient-to-b from-cyan-950/20 to-purple-950/20 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                          : "bg-slate-950/90 border-slate-800"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-mono text-gray-500 uppercase">Fragmento #{idx + 1}</span>
                          {isUnlocked ? (
                            <Unlock className="h-3.5 w-3.5 text-cyan-400" />
                          ) : (
                            <Lock className="h-3.5 w-3.5 text-slate-700" />
                          )}
                        </div>
                        {isUnlocked ? (
                          <div className="text-center py-4">
                            <span className="text-sm font-sans font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                              "{q.phrase}"
                            </span>
                          </div>
                        ) : (
                          <p className="text-[10px] text-gray-400 font-mono leading-normal italic">
                            "{q.text}"
                          </p>
                        )}
                      </div>

                      {progress.phase === 4 && !isUnlocked && (
                        <div className="mt-3 pt-2 border-t border-slate-900 space-y-2">
                          <input
                            type="text"
                            placeholder="Sua resposta..."
                            value={fragAnswers[idx]}
                            onChange={(e) => {
                              const next = [...fragAnswers];
                              next[idx] = e.target.value;
                              setFragAnswers(next);
                            }}
                            className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] font-mono text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleUnlockFragment(idx)}
                            disabled={!fragAnswers[idx].trim()}
                            className="w-full py-1 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded text-[9px] font-mono text-cyan-400 uppercase transition-colors"
                          >
                            Descriptografar
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Phrase Synthesis indicator */}
              {(fragSuccess || progress.phase > 4) && (
                <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/30 text-center space-y-2 animate-pulse">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">Código Descriptografado</span>
                  <p className="text-lg font-sans font-extrabold text-white">
                    “Os vencedores não são os que nunca caem. São os que decidem levantar mais uma vez.”
                  </p>
                </div>
              )}

              {progress.phase === 4 && fragSuccess && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleFase4Advance}
                    className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2"
                  >
                    <span>SINTETIZAR FRAGMENTOS</span>
                    <Rocket className="h-4 w-4" />
                  </button>
                </div>
              )}

              {progress.phase > 4 && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-center">
                  <p className="text-sm text-emerald-400 font-mono">
                    ✓ Todos os fragmentos sintetizados com sucesso! A mentalidade guerreira está ativa.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FASE 5: COOPERAÇÃO */}
          {activeTab === 5 && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3 text-center">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">Sinergia e Amizade</span>
                <p className="text-sm text-slate-200 font-sans max-w-xl mx-auto leading-relaxed">
                  “Ninguém vence sozinho. Grandes jornadas são construídas com amizade.”
                </p>
                <p className="text-xs text-gray-400">
                  Para avançar, você precisa do código de amizade de outro jogador. Compartilhe o seu e peça o dele!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Your code */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-2">
                      Seu Código de Amizade Único:
                    </h5>
                    <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between font-mono text-sm text-white font-bold tracking-wider select-all">
                      <span>{progress.friendCode}</span>
                      <button
                        onClick={handleCopyCode}
                        className="p-2 hover:bg-slate-800 text-cyan-400 rounded-lg transition-colors cursor-pointer"
                        title="Copiar Código"
                      >
                        {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 font-mono leading-relaxed">
                    Envie este código pelo WhatsApp para um amigo registrar no jogo dele. Quando ele registrar, as redes de vocês se conectam!
                  </p>
                </div>

                {/* Friend's code input */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h5 className="text-xs uppercase font-mono tracking-wider text-gray-400">
                    Inserir Código do Amigo:
                  </h5>
                  
                  {progress.phase === 5 && !codeSuccess ? (
                    <form onSubmit={handleFriendCodeSubmit} className="space-y-3">
                      <input
                        type="text"
                        value={friendCodeInput}
                        onChange={(e) => setFriendCodeInput(e.target.value)}
                        placeholder="Ex: JS75-MARTA-Y3P1"
                        className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-gray-600 uppercase focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />

                      {codeError && (
                        <div className="p-2 bg-red-950/40 border border-red-500/20 rounded-lg flex items-center space-x-1 text-red-400 text-[10px] font-mono">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{codeError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-sans font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-1"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>VALIDAR AMIZADE</span>
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl space-y-2 text-center">
                      <p className="text-xs text-emerald-400 font-mono font-bold">
                        ✓ Amizade Sincera Conectada!
                      </p>
                      <p className="text-[10px] text-slate-300 font-mono">
                        Código registrado: {progress.phase === 5 ? friendCodeInput.toUpperCase() : progress.connectedFriendCodes[0]}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {progress.phase === 5 && codeSuccess && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-3.5 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs font-mono text-cyan-300 text-center leading-relaxed">
                    {codeSuccess}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleFase5Advance}
                      className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2"
                    >
                      <span>CONCLUIR PARCERIA</span>
                      <Rocket className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {progress.phase > 5 && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-center">
                  <p className="text-sm text-emerald-400 font-mono">
                    ✓ Cooperação ativada. Você inseriu um código de amizade e provou que a jornada é construída de forma compartilhada!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FASE 6: DETERMINAÇÃO */}
          {activeTab === 6 && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">Mente Invencível</span>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  Teste seus conhecimentos sobre superação, budismo, amizade e determinação.
                </p>
              </div>

              <form onSubmit={handleQuizSubmit} className="space-y-5">
                {quizQuestions.map((q) => {
                  const selectedOpt = quizAnswers[q.id];
                  return (
                    <div key={q.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <h5 className="text-xs font-mono text-cyan-300">
                        QUESTÃO {q.id}: {q.q}
                      </h5>
                      <div className="space-y-2">
                        {q.options.map((opt, idx) => {
                          const isSelected = selectedOpt === idx || progress.answers.fase6QuizAnswers?.[q.id] === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => progress.phase === 6 && handleQuizAnswer(q.id, idx)}
                              disabled={progress.phase > 6 || quizSubmitted}
                              className={`w-full p-3 rounded-lg border text-left text-xs font-mono transition-all flex items-start space-x-2 ${
                                isSelected
                                  ? "bg-purple-950/30 border-purple-500 text-purple-200"
                                  : "bg-slate-900/60 hover:bg-slate-900 border-slate-900 text-slate-300"
                              }`}
                            >
                              <span className="font-bold flex-shrink-0">{String.fromCharCode(65 + idx)})</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {quizError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl flex items-center space-x-2 text-red-400 text-xs font-mono">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{quizError}</span>
                  </div>
                )}

                {progress.phase === 6 && !quizSubmitted && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans font-bold rounded-xl shadow-lg transition-all flex items-center space-x-1"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>SUBMETER RESPOSTAS</span>
                    </button>
                  </div>
                )}
              </form>

              {(quizSubmitted || progress.phase > 6) && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-xl space-y-1 text-center">
                    <p className="text-sm text-emerald-400 font-mono font-bold">
                      ✓ Desafio da Determinação Superado!
                    </p>
                    <p className="text-xs text-slate-300 font-mono">
                      Você compreende profundamente que a verdadeira vitória budista é a superação contínua de si mesmo!
                    </p>
                  </div>

                  {progress.phase === 6 && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleFase6Advance}
                        className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2"
                      >
                        <span>AVANÇAR PARA SINAL GLITCH</span>
                        <Rocket className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* FASE 7: TRANSMISSÃO BLOQUEADA (GLITCH ENCONTRO) */}
          {activeTab === 7 && (
            <div className="space-y-6">
              {/* Glitch Box */}
              <div className="p-6 bg-slate-950/95 border-2 border-dashed border-red-500/40 rounded-2xl relative overflow-hidden text-center space-y-4 animate-pulse">
                {/* Cyber Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none"></div>

                <div className="space-y-1 relative z-10">
                  <span className="text-xs uppercase font-mono tracking-widest text-red-500 font-bold animate-pulse block">
                    ⚠ SINAL COM INTERFERÊNCIA DE REDE
                  </span>
                  <h3 className="text-2xl font-sans font-extrabold text-white font-mono tracking-tighter">
                    Transmissão quase completa...
                  </h3>
                  <p className="text-xs text-gray-400 font-mono max-w-md mx-auto leading-relaxed">
                    “Última fase bloqueada. A próxima fase não está no app. Ela será desbloqueada presencialmente.”
                  </p>
                </div>
              </div>

              {/* Event Cards details - Beautiful Neon Layout */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/20 space-y-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
                
                <div className="text-center">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">COORDENADAS DO ENCONTRO</span>
                  <h4 className="text-xl font-sans font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 mt-1">
                    Encontro dos Jovens da RMs PE Norte e Sul
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col items-center">
                    <Calendar className="h-6 w-6 text-cyan-400 mb-2" />
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Data</span>
                    <span className="text-sm font-sans font-bold text-white mt-1">12/07/2026</span>
                    <span className="text-[10px] font-mono text-purple-400 mt-0.5">Domingo</span>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col items-center">
                    <Clock className="h-6 w-6 text-cyan-400 mb-2" />
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Horário</span>
                    <span className="text-sm font-sans font-bold text-white mt-1">10:00 AM</span>
                    <span className="text-[10px] font-mono text-purple-400 mt-0.5">Pontual</span>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col items-center">
                    <MapPin className="h-6 w-6 text-cyan-400 mb-2" />
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Local</span>
                    <span className="text-sm font-sans font-bold text-white mt-1">CAC UFPE</span>
                    <span className="text-[10px] font-mono text-purple-400 mt-0.5 leading-tight">C. de Artes e Comunicação</span>
                  </div>
                </div>

                <div className="text-center p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-gray-400 leading-normal">
                  📍 Cidade Universitária, Recife - PE. Traga seus amigos!
                </div>
              </div>

              {progress.phase === 7 && !progress.presenceConfirmed ? (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleConfirmPresence}
                    className="w-full md:w-auto py-3.5 px-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-sans font-bold rounded-xl shadow-xl shadow-purple-900/30 transition-all flex items-center justify-center space-x-2 animate-bounce-slow"
                  >
                    <Check className="h-5 w-5" />
                    <span>CONFIRMAR MINHA PRESENÇA NA REDE</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-center space-y-1">
                    <p className="text-sm text-emerald-400 font-mono font-bold">
                      ✓ Presença confirmada no satélite presencial!
                    </p>
                    <p className="text-xs text-slate-300 font-mono">
                      Seu assento e dados de rede foram reservados para o dia 12/07/26. Prepare-se!
                    </p>
                  </div>

                  {progress.phase === 7 && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const updated = { ...progress };
                          updated.phase = 8;
                          onUpdateProgress(updated);
                        }}
                        className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2"
                      >
                        <span>DESBLOQUEAR TERMINAL FINAL</span>
                        <Rocket className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* FASE 8: FASE FINAL (PRESENCIAL CODE) */}
          {activeTab === 8 && (
            <div className="space-y-6">
              {!liveSuccess && !progress.badges.includes("Vencedor JS75") ? (
                <div className="space-y-6">
                  <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 text-center space-y-3">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">Validação Presencial</span>
                    <h4 className="text-base font-sans font-bold text-white">
                      Digite o código revelado no encontro para desbloquear a fase final.
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto font-mono">
                      (Dica: Para fins de teste/visita antecipada, use o código secreto citado na instrução: <span className="text-cyan-400 font-bold">VENCER75</span>)
                    </p>
                  </div>

                  <form onSubmit={handleLiveCodeSubmit} className="max-w-md mx-auto space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="liveCode" className="block text-xs font-mono uppercase tracking-wider text-gray-400 text-center">
                        Código Secreto de Ativação:
                      </label>
                      <input
                        id="liveCode"
                        type="text"
                        value={liveCode}
                        onChange={(e) => {
                          setLiveCode(e.target.value);
                          setLiveError("");
                        }}
                        placeholder="Digite VENCER75..."
                        className="block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-lg font-mono text-white tracking-widest uppercase placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>

                    {liveError && (
                      <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl flex items-center space-x-2 text-red-400 text-xs font-mono justify-center">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{liveError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans font-bold rounded-xl shadow-lg shadow-cyan-900/20 transition-all flex items-center justify-center space-x-2 uppercase"
                    >
                      <Unlock className="h-4 w-4" />
                      <span>Desbloquear Fase Final</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Victory Animation Message */}
                  <div className="p-6 bg-gradient-to-r from-cyan-950/20 via-slate-950 to-purple-950/20 border-2 border-cyan-500/40 rounded-3xl text-center space-y-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0,transparent_60%)] pointer-events-none"></div>
                    
                    <span className="text-3xl animate-bounce block">🏆</span>
                    
                    <h3 className="text-2xl font-sans font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-300">
                      Jornada Concluída! Você é Vencedor!
                    </h3>

                    <p className="text-sm text-slate-200 font-sans max-w-lg mx-auto leading-relaxed">
                      “Você chegou até aqui. A verdadeira vitória não é nunca perder. É continuar avançando com coragem, amizade e propósito.”
                    </p>

                    <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 rounded-full text-xs font-mono text-purple-300">
                      <Award className="h-4 w-4 text-purple-400" />
                      <span>Badge Conquistado: Vencedor JS75</span>
                    </div>

                    {progress.phase === 8 && !progress.badges.includes("Vencedor JS75") && (
                      <div className="pt-3">
                        <button
                          onClick={handleFase8Advance}
                          className="py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-sans font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 mx-auto text-xs"
                        >
                          <FileText className="h-4 w-4" />
                          <span>GERAR CERTIFICADO DIGITAL</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {progress.badges.includes("Vencedor JS75") && (
                    <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-center">
                      <p className="text-xs text-emerald-400 font-mono">
                        ✓ Fase Final desbloqueada! Seu certificado digital de vitória está pronto no painel lateral de Perfil!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
