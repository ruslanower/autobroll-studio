'use client';

import React, { useState } from 'react';
import { X, Key, Save, Check, ShieldCheck, Database, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [deepgramKey, setDeepgramKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [pexelsKey, setPexelsKey] = useState('');
  const [runwayKey, setRunwayKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-studio-850 border border-studio-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-studio-border flex items-center justify-between bg-studio-900">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-accent-cyan" />
            <h3 className="text-base font-bold text-white">Studio & AI API Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-studio-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-studio-900/60 p-3 rounded-xl border border-studio-border/60 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
            <p>
              Your keys are saved exclusively in your browser&apos;s local memory and sent directly to the AI providers. Never stored on our backend.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Deepgram Nova-2 / Whisper ASR Key</span>
              <span className="text-[10px] text-slate-400 font-mono">Word Timestamps & Cadence</span>
            </label>
            <input
              type="password"
              placeholder="dg_live_..."
              value={deepgramKey}
              onChange={(e) => setDeepgramKey(e.target.value)}
              className="w-full bg-studio-900 border border-studio-border rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>OpenAI / Claude API Key</span>
              <span className="text-[10px] text-slate-400 font-mono">Semantic Scene Director</span>
            </label>
            <input
              type="password"
              placeholder="sk-proj-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full bg-studio-900 border border-studio-border rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Pexels Footage API Key</span>
              <span className="text-[10px] text-slate-400 font-mono">Real-time Curated Stock</span>
            </label>
            <input
              type="password"
              placeholder="563492ad6f9170000..."
              value={pexelsKey}
              onChange={(e) => setPexelsKey(e.target.value)}
              className="w-full bg-studio-900 border border-studio-border rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Runway / Luma / Fal.ai Video Key</span>
              <span className="text-[10px] text-slate-400 font-mono">GenAI Video Synthesis</span>
            </label>
            <input
              type="password"
              placeholder="fal_key_..."
              value={runwayKey}
              onChange={(e) => setRunwayKey(e.target.value)}
              className="w-full bg-studio-900 border border-studio-border rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
            />
          </div>
        </div>

        <div className="p-4 border-t border-studio-border bg-studio-900 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-accent-cyan text-black hover:opacity-90 flex items-center gap-1.5 transition-all"
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved Locally!' : 'Save Credentials'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
