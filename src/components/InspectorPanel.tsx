'use client';

import React, { useState } from 'react';
import { FileText, Clapperboard, Music, Sparkles, RefreshCw, Volume2, VolumeX, Flame, Compass, FastForward, Mic } from 'lucide-react';
import { ProjectData, BrollClip } from '@/types';

interface InspectorPanelProps {
  project: ProjectData;
  currentTime: number;
  selectedClip: BrollClip | null;
  onSeek: (time: number) => void;
  onOpenSwapModal: (clip: BrollClip) => void;
  onRegenerateClip: (clipId: string) => void;
  onOpenElevenLabs: () => void;
  isAudioMuted: boolean;
  onToggleMute: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  project,
  currentTime,
  selectedClip,
  onSeek,
  onOpenSwapModal,
  onRegenerateClip,
  onOpenElevenLabs,
  isAudioMuted,
  onToggleMute,
}) => {
  const [activeTab, setActiveTab] = useState<'transcript' | 'clip' | 'audio'>('transcript');

  // Find the currently active clip on timeline based on currentTime
  const currentTimelineClip = project.clips.find(
    (c) => currentTime >= c.startTime && currentTime <= c.endTime
  ) || project.clips[0];

  const displayClip = selectedClip || currentTimelineClip;

  return (
    <aside className="w-full lg:w-96 flex flex-col bg-studio-850 border-r border-studio-border h-[420px] lg:h-full">
      {/* Tabs Header */}
      <div className="flex items-center border-b border-studio-border bg-studio-900/60 p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('transcript')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'transcript'
              ? 'bg-studio-800 text-accent-cyan shadow-sm border border-studio-border'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Cadence Script</span>
        </button>

        <button
          onClick={() => setActiveTab('clip')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'clip'
              ? 'bg-studio-800 text-accent-cyan shadow-sm border border-studio-border'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clapperboard className="w-3.5 h-3.5" />
          <span>Scene Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'audio'
              ? 'bg-studio-800 text-accent-cyan shadow-sm border border-studio-border'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>SFX & Audio</span>
        </button>
      </div>

      {/* Tab 1: Transcript & Word-Level Cadence */}
      {activeTab === 'transcript' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Cadence Metrics Bar */}
          <div className="p-3 bg-studio-900/80 border-b border-studio-border grid grid-cols-3 gap-2 text-center">
            <div className="bg-studio-800/80 p-2 rounded-lg border border-studio-border/50">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Cadence</div>
              <div className="text-xs font-bold text-accent-cyan flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3 h-3 text-accent-amber" />
                {project.wordsPerMinute} WPM
              </div>
            </div>
            <div className="bg-studio-800/80 p-2 rounded-lg border border-studio-border/50">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Cut Pace</div>
              <div className="text-xs font-bold text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                <FastForward className="w-3 h-3 text-accent-indigo" />
                {project.averageCutDuration}s / cut
              </div>
            </div>
            <div className="bg-studio-800/80 p-2 rounded-lg border border-studio-border/50">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Voice Engine</div>
              <div className="text-xs font-bold text-accent-emerald flex items-center justify-center gap-1 mt-0.5">
                <Compass className="w-3 h-3" />
                {project.voiceName || 'Multilingual'}
              </div>
            </div>
          </div>

          {/* Interactive Word Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Interactive Word Alignment (click to seek):</span>
              <span className="font-mono text-accent-cyan">{currentTime.toFixed(2)}s</span>
            </div>

            <div className="flex flex-wrap gap-1.5 leading-relaxed bg-studio-900/40 p-3.5 rounded-xl border border-studio-border/40 text-sm">
              {project.transcript.map((item, idx) => {
                const isCurrent = currentTime >= item.start && currentTime <= item.end;
                const isPast = currentTime > item.end;

                return (
                  <button
                    key={idx}
                    onClick={() => onSeek(item.start)}
                    className={`px-1.5 py-0.5 rounded text-xs font-medium transition-all ${
                      isCurrent
                        ? 'bg-accent-cyan text-black font-extrabold scale-110 shadow-md shadow-accent-cyan/30 z-10'
                        : isPast
                        ? 'text-slate-400 hover:text-white hover:bg-studio-700/60'
                        : item.highlight
                        ? 'text-accent-amber font-semibold bg-accent-amber/10 border border-accent-amber/20 hover:bg-accent-amber/20'
                        : 'text-slate-300 hover:text-white hover:bg-studio-700/60'
                    }`}
                  >
                    {item.word}
                  </button>
                );
              })}
            </div>

            {/* Quick ElevenLabs banner inside transcript */}
            <div className="bg-gradient-to-r from-accent-purple/15 to-accent-indigo/15 p-3 rounded-lg border border-accent-purple/30 text-xs">
              <div className="flex items-center justify-between font-semibold text-purple-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>ШІ Озвучка ElevenLabs</span>
                </span>
                <button
                  onClick={onOpenElevenLabs}
                  className="px-2 py-0.5 rounded bg-accent-cyan text-black font-bold text-[10px] hover:opacity-90"
                >
                  Змінити голос
                </button>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Поточний голос: <strong className="text-white">{project.voiceName || 'Adam (ElevenLabs)'}</strong>. Ви можете ввести будь-який український текст та обрати інший тембр.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scene & Clip Inspector */}
      {activeTab === 'clip' && displayClip && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent-cyan">
                SCENE {project.clips.findIndex((c) => c.id === displayClip.id) + 1}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  displayClip.sourceType === 'genai'
                    ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/40'
                    : 'bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/40'
                }`}
              >
                {displayClip.sourceType === 'genai' ? '✦ AI Generated' : 'Stock Footage'}
              </span>
            </div>

            <span className="text-xs font-mono text-slate-400">
              {displayClip.duration.toFixed(1)}s ({displayClip.startTime.toFixed(1)}s - {displayClip.endTime.toFixed(1)}s)
            </span>
          </div>

          {/* Clip Thumbnail Card */}
          <div className="relative rounded-xl overflow-hidden border border-studio-border aspect-video group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayClip.thumbnailUrl}
              alt={displayClip.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <div className="text-xs font-semibold text-white drop-shadow">
                {displayClip.title}
              </div>
            </div>
          </div>

          {/* Scene Prompt / Keyword */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase font-mono text-slate-400">
              Visual Scene Prompt
            </label>
            <div className="bg-studio-900 p-2.5 rounded-lg border border-studio-border text-xs text-slate-200 font-mono leading-relaxed">
              &quot;{displayClip.promptOrKeyword}&quot;
            </div>
          </div>

          {/* Effects & Motion Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-studio-900 p-2.5 rounded-lg border border-studio-border">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Transition</div>
              <div className="font-semibold text-slate-200 capitalize mt-0.5">
                {displayClip.transition}
              </div>
            </div>
            <div className="bg-studio-900 p-2.5 rounded-lg border border-studio-border">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Motion Camera</div>
              <div className="font-semibold text-accent-cyan capitalize mt-0.5">
                {displayClip.motionEffect.replace(/-/g, ' ')}
              </div>
            </div>
          </div>

          {/* Quick Clip Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => onOpenSwapModal(displayClip)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-accent-cyan/15 hover:bg-accent-cyan/25 text-accent-cyan border border-accent-cyan/40 rounded-lg text-xs font-semibold transition-all active:scale-98"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Swap or Search Footage</span>
            </button>

            <button
              onClick={() => onRegenerateClip(displayClip.id)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-studio-800 hover:bg-studio-700 text-slate-200 border border-studio-border rounded-lg text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
              <span>Regenerate with GenAI (Runway/Luma)</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Sound Design & SFX */}
      {activeTab === 'audio' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* ElevenLabs Voice Switcher Box */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-accent-purple/20 to-accent-indigo/20 border border-accent-purple/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-accent-cyan" />
                <span className="text-xs font-bold text-white">ШІ Голос ElevenLabs</span>
              </div>
              <button
                onClick={onOpenElevenLabs}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-accent-cyan text-black hover:opacity-90 transition-all"
              >
                Вибрати інший тембр
              </button>
            </div>
            <div className="text-[11px] text-slate-300">
              Поточний: <strong className="text-accent-cyan">{project.voiceName || 'Adam'}</strong> ({project.wordsPerMinute} WPM)
            </div>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-studio-border">
            <span className="text-xs font-semibold text-slate-200">Main Audio Voiceover</span>
            <button
              onClick={onToggleMute}
              className={`p-1.5 rounded-lg text-xs border ${
                isAudioMuted
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-studio-800 text-accent-cyan border-studio-border'
              }`}
              title="Toggle Audio Mute"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase">
              Auto SFX Cut Bed ({project.sfx.length} events)
            </div>

            <div className="space-y-1.5">
              {project.sfx.map((sfxItem) => (
                <div
                  key={sfxItem.id}
                  onClick={() => onSeek(sfxItem.time)}
                  className="flex items-center justify-between p-2 rounded-lg bg-studio-900 border border-studio-border hover:border-accent-cyan/50 cursor-pointer text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-amber" />
                    <span className="font-medium text-slate-200">{sfxItem.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-studio-800 text-[10px] uppercase">
                      {sfxItem.type}
                    </span>
                    <span>{sfxItem.time.toFixed(1)}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
