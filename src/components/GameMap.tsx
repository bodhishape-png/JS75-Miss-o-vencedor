import React from "react";
import { MapPin, Sparkles, Zap, Award, CheckCircle2, Lock } from "lucide-react";
import { PlayerProgress } from "../types";

interface GameMapProps {
  progress: PlayerProgress;
  onSelectPhase: (phaseId: number) => void;
  activePhaseId: number;
}

export default function GameMap({ progress, onSelectPhase, activePhaseId }: GameMapProps) {
  // Phase nodes config representing a virtual map coordinates (approx relative layout positions)
  const nodes = [
    { id: 1, label: "Chamado", x: "12%", y: "45%", title: "O Chamado", icon: "🚀", location: "Sertão Digital" },
    { id: 2, label: "Queda", x: "28%", y: "25%", title: "A Queda", icon: "⚡", location: "Agreste de Superação" },
    { id: 3, label: "Conexão", x: "44%", y: "60%", title: "Conexão", icon: "❤", location: "Pontes do Capibaribe" },
    { id: 4, label: "Enigma", x: "58%", y: "30%", title: "Fragmentos", icon: "🧩", location: "Bento-grid Recife" },
    { id: 5, label: "Amizade", x: "72%", y: "65%", title: "Cooperação", icon: "👥", location: "Maracatu Atômico" },
    { id: 6, label: "Mente", x: "85%", y: "35%", title: "Determinação", icon: "🧠", location: "Marco Zero Tecnológico" },
    { id: 7, label: "CAC UFPE", x: "94%", y: "55%", title: "Transmissão Bloqueada", icon: "📍", location: "CAC UFPE Presencial" }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 relative overflow-hidden" id="interactive-gamemap-node">
      {/* Glow lines / Circuits design effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08)_0,transparent_75%)] pointer-events-none"></div>

      {/* Map Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">Mapa Sincronizado</span>
          <h4 className="text-sm font-sans font-extrabold text-white">RMs Pernambuco Norte e Sul</h4>
        </div>
        <span className="text-[10px] font-mono text-gray-500 max-w-[150px] text-right hidden sm:block">
          Toque nos nós desbloqueados para focar
        </span>
      </div>

      {/* Responsive Visual Circuit Grid Stage */}
      <div className="relative w-full h-[240px] bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden select-none">
        
        {/* Decorative holographic grid lines representing Pernambuco's Capibaribe water flow */}
        <svg className="absolute inset-0 w-full h-full text-indigo-950/40" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 120 Q 150 60 300 140 T 600 100 T 900 160 T 1200 110" fill="none" stroke="currentColor" strokeWidth="4" className="stroke-cyan-500/10" />
          <path d="M 0 135 Q 200 180 400 90 T 800 150 T 1200 130" fill="none" stroke="currentColor" strokeWidth="2" className="stroke-purple-500/10" />
          
          {/* Neon circuit linking lines */}
          {nodes.map((node, idx) => {
            if (idx === 0) return null;
            const prev = nodes[idx - 1];
            const prevUnlocked = prev.id <= progress.phase;
            const currentUnlocked = node.id <= progress.phase;

            return (
              <line
                key={idx}
                x1={prev.x}
                y1={prev.y}
                x2={node.x}
                y2={node.y}
                stroke={currentUnlocked && prevUnlocked ? "url(#neonGrad)" : "#1e293b"}
                strokeWidth={currentUnlocked && prevUnlocked ? "2" : "1"}
                strokeDasharray={currentUnlocked ? "none" : "4 4"}
                className={currentUnlocked ? "animate-pulse" : ""}
              />
            );
          })}

          <defs>
            <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Dynamic Nodes Mapping */}
        {nodes.map((n) => {
          const isUnlocked = n.id <= progress.phase;
          const isCurrent = progress.phase === n.id;
          const isSelected = activePhaseId === n.id;

          return (
            <button
              key={n.id}
              onClick={() => isUnlocked && onSelectPhase(n.id)}
              disabled={!isUnlocked}
              style={{ left: n.x, top: n.y }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-cyan-400 to-purple-600 scale-125 border-2 border-white shadow-[0_0_15px_rgba(6,182,212,0.6)] z-20"
                  : isCurrent
                    ? "bg-slate-900 border-2 border-cyan-400 text-cyan-400 scale-110 shadow-[0_0_10px_rgba(6,182,212,0.4)] animate-bounce-slow z-10"
                    : isUnlocked
                      ? "bg-slate-900 hover:bg-slate-800 border border-purple-500/50 text-purple-300 shadow-md"
                      : "bg-slate-950 border border-slate-900 text-slate-800 cursor-not-allowed"
              }`}
              title={`${n.title} (${isUnlocked ? "Desbloqueado" : "Bloqueado"})`}
            >
              <span className="text-sm select-none">{isUnlocked ? n.icon : "🔒"}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details display */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping flex-shrink-0"></div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase block">Localização Regional</span>
            <span className="text-xs font-mono text-white font-bold">
              {nodes[Math.min(nodes.length - 1, activePhaseId - 1)]?.location || "CAC UFPE"}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-gray-400 uppercase block">Missão Atual</span>
          <span className="text-xs font-mono text-purple-400 font-bold">
            {nodes[Math.min(nodes.length - 1, activePhaseId - 1)]?.title || "Transmissão Bloqueada"}
          </span>
        </div>
      </div>
    </div>
  );
}
