import React, { useState } from "react";
import { 
  Award, Copy, Check, LogOut, ShieldAlert, Sparkles, Share2, 
  RefreshCcw, FileText, Download, Import, CheckCircle, Smartphone 
} from "lucide-react";
import { PlayerProgress } from "../types";
import { clearProgress, exportProgressToCode, BADGES_LIST } from "../utils/gameHelpers";

interface ProfileProps {
  progress: PlayerProgress;
  onLogout: () => void;
  onImportProgress: (imported: PlayerProgress) => void;
}

export default function Profile({ progress, onLogout, onImportProgress }: ProfileProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [copiedCertificateCode, setCopiedCertificateCode] = useState(false);

  // Generate backup save code
  const saveCode = exportProgressToCode(progress);

  const handleCopySaveCode = () => {
    navigator.clipboard.writeText(saveCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // WhatsApp share link for progress
  const handleShareWhatsApp = () => {
    const text = `🎮 Olhe meu progresso no jogo-convite JS75: Próxima Fase!\n⚡ Usuário: ${progress.username}\n🏆 Perfil: ${progress.answers.archetype || "Recruta"}\n💎 XP total: ${progress.xp} XP\n🏅 Badges: ${progress.badges.join(", ") || "Nenhum ainda"}\n🎯 Minha presença no Encontro do dia 12/07/26 está ${progress.presenceConfirmed ? "CONFIRMADA!" : "Pendente"}\n\nCopie meu código para conectar redes comigo: ${progress.friendCode}\n\nJogue você também e garanta seu certificado!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  // Reset function
  const handleReset = () => {
    if (confirm("Atenção! Isso apagará todo o seu progresso local de jogo. Tem certeza que deseja reiniciar sua jornada?")) {
      clearProgress();
      onLogout();
    }
  };

  return (
    <div className="space-y-6" id="profile-container-hub">
      {/* Player Identity Header Card */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
          {/* Avatar Preview in Profile hub */}
          <div className="w-20 h-20 rounded-full bg-slate-950 border-2 border-cyan-500/50 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.25)] flex-shrink-0">
            {progress.avatar ? (
              progress.avatar.startsWith("data:image") ? (
                <img src={progress.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-4xl select-none">{progress.avatar}</span>
              )
            ) : (
              <span className="text-4xl">⚡</span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <span className="px-2.5 py-0.5 text-[9px] uppercase font-mono tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full inline-block">
                Holograma Ativo
              </span>
              <h3 className="text-xl font-sans font-extrabold text-white mt-1">
                {progress.username}
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Classe: <span className="text-purple-400 font-bold">{progress.answers.archetype || "Ainda não escolhido"}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1">
              <div className="text-xs font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-cyan-400">
                <strong>{progress.xp}</strong> XP Acumulado
              </div>
              <div className="text-xs font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-purple-400">
                Fase Ativa: <strong>{progress.phase === 8 ? "Fase Final" : `${progress.phase}/7`}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Digital Certificate Unlocked Card */}
      {progress.badges.includes("Vencedor JS75") && (
        <div className="bg-gradient-to-r from-purple-950/20 via-indigo-950/20 to-cyan-950/20 border-2 border-cyan-500/30 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
          <span className="text-2xl animate-bounce inline-block">📜</span>
          <h4 className="text-lg font-sans font-extrabold text-white">
            Seu Certificado Digital de Vitória está Disponível!
          </h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-mono">
            Você desbloqueou o encontro presencial do CAC UFPE e se consagrou um jovem vencedor invencível. Visualize ou compartilhe seu diploma!
          </p>

          <button
            onClick={() => setShowCertificate(!showCertificate)}
            className="py-2.5 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans font-bold rounded-xl shadow-lg transition-all text-xs inline-flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>{showCertificate ? "OCULTAR CERTIFICADO" : "VISUALIZAR MEU CERTIFICADO"}</span>
          </button>

          {showCertificate && (
            <div className="pt-4 animate-fade-in text-left">
              {/* Virtual Certificate Card with Neon Border and circuits */}
              <div className="bg-slate-950 border-2 border-cyan-400/80 p-6 rounded-3xl relative overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.25)] space-y-6 max-w-xl mx-auto">
                {/* Visual lines background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#090e1d_1px,transparent_1px),linear-gradient(to_bottom,#090e1d_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>

                {/* Certificate Header */}
                <div className="text-center relative z-10 border-b border-slate-800 pb-4 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">CERTIFICADO DIGITAL DE CONSAGRAÇÃO</span>
                  <h3 className="text-2xl font-sans font-extrabold text-white tracking-tight">JS75: PRÓXIMA FASE</h3>
                  <p className="text-[9px] font-mono text-purple-400 uppercase">
                    RM PE NORTE & SUL • JUVENTUDE SOKA BRASIL
                  </p>
                </div>

                {/* Body */}
                <div className="space-y-4 relative z-10 text-center font-mono text-xs text-slate-300">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">Certificamos com imensa honra que o jovem herói</p>
                  
                  <div className="py-2">
                    <span className="text-xl font-sans font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-300 tracking-wide block uppercase">
                      {progress.username}
                    </span>
                    <span className="text-[10px] text-purple-300 font-bold block mt-1">ARQUÉTIPO: {progress.answers.archetype || "LÍDER CONECTOR"}</span>
                  </div>

                  <p className="leading-relaxed max-w-md mx-auto text-[11px]">
                    percorreu com determinação inabalável todas as etapas da jornada digital, acumulando <strong className="text-cyan-400 font-bold">{progress.xp} XP</strong>, superando desafios reais de amizade, superação de perdas e diálogo, e confirmando sua presença no encontro do dia <strong className="text-white">12/07/26 no CAC UFPE</strong>.
                  </p>

                  <p className="text-gray-400 leading-normal text-[10px] max-w-sm mx-auto italic">
                    “A verdadeira vitória não é nunca cair, mas levantar e continuar avançando com coragem, amizade e propósito.”
                  </p>
                </div>

                {/* Certificate Footer Stamp */}
                <div className="relative z-10 border-t border-slate-800 pt-4 flex items-center justify-between font-mono text-[9px] text-gray-500">
                  <div className="text-left space-y-1">
                    <span>CÓDIGO DE REDE: {progress.friendCode}</span>
                    <span className="block text-purple-500">Ativação Presencial Confirmada</span>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-cyan-400/40 flex items-center justify-center bg-cyan-950/20 text-cyan-400 text-lg shadow-[0_0_10px_rgba(6,182,212,0.15)] select-none">
                    JS75
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Badges Showcase */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h4 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-4 flex items-center justify-between">
          <span>Seus Badges Conquistados</span>
          <span className="text-[10px] text-cyan-400">{progress.badges.length} / 4</span>
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {BADGES_LIST.map((bg) => {
            const hasBadge = progress.badges.includes(bg.title);
            return (
              <div
                key={bg.id}
                className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
                  hasBadge
                    ? "bg-gradient-to-br from-slate-900 to-purple-950/10 border-purple-500/40 text-white shadow-[0_0_8px_rgba(168,85,247,0.1)]"
                    : "bg-slate-950/50 border-slate-950 text-slate-600 opacity-55"
                }`}
              >
                <div className={`p-2 rounded-lg ${hasBadge ? "bg-purple-500/10 text-purple-400" : "bg-slate-900 text-slate-700"}`}>
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-sans font-bold truncate leading-tight">
                    {bg.title}
                  </h5>
                  <p className="text-[10px] text-gray-400 font-mono leading-tight mt-0.5">
                    {bg.description}
                  </p>
                  {hasBadge && (
                    <span className="text-[9px] font-mono text-cyan-400 mt-1 block font-bold">
                      +{bg.xpBonus} XP Ganho
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup and Share Tools (LocalStorage Portability) */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h4 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-1">
            Salvar e Portabilidade de Progresso
          </h4>
          <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
            Seus dados são salvos 100% de forma gratuita no navegador (LocalStorage). Use as ferramentas abaixo para exportar seu progresso e salvar ou restaurar em outro dispositivo!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleCopySaveCode}
            className="py-3 px-4 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-xl border border-slate-800 text-xs font-mono transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            {copiedCode ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">CÓDIGO COPIADO!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-cyan-400" />
                <span>COPIAR CÓDIGO SALVAMENTO</span>
              </>
            )}
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-3 px-4 bg-emerald-950/30 hover:bg-emerald-900/20 text-emerald-400 rounded-xl border border-emerald-500/20 text-xs font-mono transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span>COMPARTILHAR NO WHATSAPP</span>
          </button>
        </div>
      </div>

      {/* Dangerous/Advanced settings */}
      <div className="bg-slate-900/50 border border-red-500/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-mono text-red-500 uppercase tracking-widest block font-bold">ZONA DE REDE INSTÁVEL</span>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5 leading-tight">
            Se precisar reiniciar o jogo ou usar outra conta no mesmo celular.
          </p>
        </div>

        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto py-2 px-3.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 rounded-xl border border-red-500/20 text-xs font-mono transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span>Resetar Jogo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
