import React, { useState, useRef } from "react";
import { 
  User, Camera, Sparkles, Check, Import, AlertCircle, FileText, ChevronRight 
} from "lucide-react";
import { INITIAL_PROGRESS, importProgressFromCode } from "../utils/gameHelpers";
import { PlayerProgress } from "../types";
import { compressAvatar } from "../utils/imageCompressor";

interface LoginProps {
  onLoginSuccess: (progress: PlayerProgress) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [importCode, setImportCode] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [error, setError] = useState("");
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar presets
  const presets = [
    "🔥", "💻", "🚀", "🛰️", "🎮", "⚡", "⚛️", "🧬"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError("");
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const rawBase64 = event.target.result as string;
          try {
            const compressed = await compressAvatar(rawBase64);
            setAvatar(compressed);
          } catch (err) {
            console.error("Erro ao comprimir imagem:", err);
            setAvatar(rawBase64); // Fallback
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (emoji: string) => {
    setAvatar(emoji);
    setError("");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = username.trim();
    if (!trimmedName) {
      setError("Por favor, digite seu nome de usuário.");
      return;
    }
    if (trimmedName.length < 3) {
      setError("O nome de usuário deve ter pelo menos 3 caracteres.");
      return;
    }

    const newProgress = INITIAL_PROGRESS(trimmedName, avatar);
    onLoginSuccess(newProgress);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError("");
    const progress = importProgressFromCode(importCode);
    if (progress) {
      onLoginSuccess(progress);
    } else {
      setImportError("Código de progresso inválido ou corrompido.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" id="login-container">
      {/* Glitch Tech Header */}
      <div className="text-center mb-8 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-9xl font-mono text-purple-500 select-none">JS75</span>
        </div>
        <div className="relative z-10">
          <span className="px-3 py-1 text-xs uppercase font-mono tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full inline-block mb-3 animate-pulse">
            Sincronização de Rede
          </span>
          <h2 className="text-3xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 tracking-tight">
            Perfil do Jogador
          </h2>
          <p className="text-sm text-gray-400 mt-2 font-mono">
            Registre sua identidade digital para iniciar a missão
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-2xl shadow-purple-500/5 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {!showImport ? (
          <form onSubmit={handleRegister} className="space-y-6 relative z-10">
            {/* Input Nome */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-xs font-mono uppercase tracking-wider text-gray-400">
                Nome de Usuário (Obrigatório)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="username"
                  type="text"
                  maxLength={15}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Seu nome ou apelido..."
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-sm font-mono transition-all"
                />
              </div>
            </div>

            {/* Upload Foto ou escolher Emoji */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400">
                Foto de Perfil (Opcional)
              </label>

              <div className="flex items-center space-x-4">
                {/* Avatar Preview */}
                <div className="relative flex-shrink-0 w-16 h-16 rounded-full bg-slate-950 border-2 border-dashed border-purple-500/40 flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    avatar.startsWith("data:image") ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-3xl select-none">{avatar}</span>
                    )
                  ) : (
                    <User className="h-8 w-8 text-slate-600" />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                  >
                    <Camera className="h-5 w-5 text-cyan-400" />
                  </button>
                </div>

                <div className="flex-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors flex items-center justify-center space-x-2 border border-slate-700"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Upload Foto</span>
                  </button>
                  <p className="text-[10px] text-gray-500 font-mono">
                    Ou selecione um holograma padrão abaixo:
                  </p>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Preset Holograms */}
              <div className="grid grid-cols-8 gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className={`w-full py-2 text-xl bg-slate-950 hover:bg-purple-950/40 rounded-lg border transition-all ${
                      avatar === p ? "border-cyan-500 bg-cyan-950/10 scale-105" : "border-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl flex items-start space-x-2 text-red-400 text-xs font-mono">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans font-bold rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2 group transition-all"
              >
                <Sparkles className="h-5 w-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>INICIAR MISSÃO</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="border-t border-slate-800/80 pt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setShowImport(true);
                  setError("");
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center justify-center space-x-1 mx-auto"
              >
                <Import className="h-3.5 w-3.5" />
                <span>Importar progresso salvo</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleImport} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label htmlFor="importCode" className="block text-xs font-mono uppercase tracking-wider text-gray-400">
                Insira o seu Código de Salvamento
              </label>
              <textarea
                id="importCode"
                rows={4}
                value={importCode}
                onChange={(e) => {
                  setImportCode(e.target.value);
                  if (importError) setImportError("");
                }}
                placeholder="Cole o código exportado anteriormente..."
                className="block w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-xs font-mono transition-all"
              />
              <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
                Este código contém todo o seu progresso, XP e badges salvos localmente.
              </p>
            </div>

            {importError && (
              <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl flex items-start space-x-2 text-red-400 text-xs font-mono">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{importError}</span>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowImport(false);
                  setImportError("");
                }}
                className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-mono transition-colors border border-slate-700"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-sans font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-1"
              >
                <Check className="h-4 w-4" />
                <span>Restaurar Progresso</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Culture Hint Footer */}
      <div className="text-center mt-6">
        <span className="text-[10px] font-mono text-slate-500/80 uppercase tracking-widest block">
          Pernambuco Conectado • Juventude Soka 2026
        </span>
      </div>
    </div>
  );
}
