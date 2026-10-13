'use client';

import React from 'react';
import { Sliders, Download, Github, Video, Layers, Wand2, Mic } from 'lucide-react';
import { ProjectData } from '@/types';

interface HeaderProps {
  currentProject: ProjectData;
  onSelectProject: (projectId: string) => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  onOpenElevenLabs: () => void;
  onRegenerateAll: () => void;
  isRegenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  onSelectProject,
  onOpenExport,
  onOpenSettings,
  onOpenElevenLabs,
  onRegenerateAll,
  isRegenerating,
}) => {
  return (
    <header className="h-16 border-b border-studio-border bg-studio-900/95 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Project Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-purple via-accent-indigo to-accent-cyan p-0.5 shadow-lg shadow-accent-cyan/20">
            <div className="w-full h-full bg-[#0b0d13] rounded-[10px] flex items-center justify-center">
              <Video className="w-4 h-4 text-accent-cyan" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                AutoB-Roll
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
                  STUDIO
                </span>
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">by VanzaLabs</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              AI Cadence-Aware Engine v1.0
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-studio-border mx-1 hidden md:block" />

        {/* Project Selector dropdown */}
        <div className="relative hidden md:block">
          <select
            value={currentProject.id}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-studio-800/80 hover:bg-studio-700/80 text-xs font-medium text-slate-200 border border-studio-border rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-accent-cyan transition-colors cursor-pointer appearance-none"
          >
            <option value="ai-revolution">🚀 The AI Revolution (9:16 Vertical Reel)</option>
            <option value="saas-growth">📈 How We Scaled $1M ARR (16:9 Explainer)</option>
          </select>
          <Layers className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Middle Status Pill */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-studio-800/60 border border-studio-border text-xs">
          <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
          <span className="text-slate-400">Cadence Rhythm:</span>
          <span className="font-medium text-slate-200">
            {currentProject.pacingMode === 'high-energy-reels' ? 'Viral Fast (2.4s / cut)' : 'Deep Narrative (3.6s / cut)'}
          </span>
        </div>
        <div className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded-md bg-studio-800/40 border border-studio-border/50">
          {currentProject.voiceName ? `Voice: ${currentProject.voiceName}` : 'Custom Audio'} • {currentProject.clips.length} Clips
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-2">
        {/* ElevenLabs AI Voiceover Generator Button */}
        <button
          onClick={onOpenElevenLabs}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-accent-purple/30 to-accent-indigo/30 hover:from-accent-purple/40 hover:to-accent-indigo/40 text-purple-200 border border-accent-purple/50 shadow-sm shadow-accent-purple/20 transition-all active:scale-95"
          title="Генерація ШІ Озвучки з вибором голосу від ElevenLabs"
        >
          <Mic className="w-3.5 h-3.5 text-accent-cyan" />
          <span>ШІ Озвучка ElevenLabs</span>
        </button>

        {/* AI Auto-Direct */}
        <button
          onClick={onRegenerateAll}
          disabled={isRegenerating}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-studio-800 hover:bg-studio-700 text-slate-200 border border-studio-border transition-all active:scale-95 disabled:opacity-50"
          title="Regenerate all B-Roll scenes using AI Cadence Director"
        >
          <Wand2 className={`w-3.5 h-3.5 text-accent-cyan ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>AI Auto-Direct</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-studio-800 hover:bg-studio-700 text-slate-300 border border-studio-border transition-colors"
          title="Studio & API Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        <a
          href="https://github.com/ruslanower/autobroll-studio"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-studio-800 hover:bg-studio-700 text-slate-300 border border-studio-border transition-colors hidden sm:block"
          title="GitHub Repository"
        >
          <Github className="w-4 h-4" />
        </a>

        {/* Primary Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg font-semibold text-xs text-black bg-gradient-to-r from-accent-cyan to-accent-indigo hover:opacity-95 shadow-lg shadow-accent-cyan/20 active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Studio</span>
        </button>
      </div>
    </header>
  );
};
