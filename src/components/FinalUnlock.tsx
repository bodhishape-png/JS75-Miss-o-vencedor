import React, { useState, useEffect } from "react";
import { Clock, Calendar, ShieldCheck, HelpCircle, Sparkles, AlertCircle } from "lucide-react";

interface FinalUnlockProps {
  onUnlockSuccess: () => void;
  isUnlocked: boolean;
}

export default function FinalUnlock({ onUnlockSuccess, isUnlocked }: FinalUnlockProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time remaining to 12/07/2026 10:00 AM UTC-3 (Pernambuco Local Time)
  useEffect(() => {
    const targetDate = new Date("2026-07-12T10:00:00-03:00");

    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6" id="countdown-banner-widget">
      {/* Target Title */}
      <div className="text-center">
        <span className="px-2.5 py-0.5 text-[9px] uppercase font-mono tracking-widest bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-full inline-block">
          Sincronizador Temporal
        </span>
        <h4 className="text-base font-sans font-extrabold text-white mt-2">
          Contagem Regressiva para o Encontro JS75
        </h4>
        <p className="text-xs text-gray-400 font-mono mt-1">
          12 de Julho de 2026 • 10h • CAC UFPE
        </p>
      </div>

      {/* Countdown Timer Visual Matrix Grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
          <span className="text-2xl font-sans font-extrabold text-cyan-400 block tracking-tight">
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className="text-[9px] font-mono text-gray-500 uppercase">Dias</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
          <span className="text-2xl font-sans font-extrabold text-cyan-400 block tracking-tight">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-[9px] font-mono text-gray-500 uppercase">Horas</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
          <span className="text-2xl font-sans font-extrabold text-cyan-400 block tracking-tight">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-[9px] font-mono text-gray-500 uppercase">Min</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
          <span className="text-2xl font-sans font-extrabold text-purple-400 block tracking-tight animate-pulse">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-[9px] font-mono text-gray-500 uppercase">Seg</span>
        </div>
      </div>

      {/* Event Hype Note */}
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs font-mono text-gray-400 leading-normal flex items-start space-x-2">
        <Sparkles className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
        <span className="text-left text-[11px]">
          Falta pouco para estarmos reunidos presencialmente no Centro de Artes e Comunicação da UFPE! Continue divulgando para seus amigos!
        </span>
      </div>
    </div>
  );
}
