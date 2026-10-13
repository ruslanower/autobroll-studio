'use client';

import React, { useRef } from 'react';
import { Film, Type, Mic, Volume2, RefreshCw, Lock, Unlock, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import { ProjectData, BrollClip } from '@/types';

interface TimelineProps {
  project: ProjectData;
  currentTime: number;
  selectedClip: BrollClip | null;
  onSelectClip: (clip: BrollClip) => void;
  onSeek: (time: number) => void;
  onOpenSwapModal: (clip: BrollClip) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  project,
  currentTime,
  selectedClip,
  onSelectClip,
  onSeek,
  onOpenSwapModal,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const totalDuration = project.audioDuration;

  // Handle click on timeline to seek
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percentage * totalDuration);
  };

  const playheadPercent = (currentTime / totalDuration) * 100;

  // Generate markers every 2.5 seconds
  const numMarkers = Math.ceil(totalDuration / 2.5);
  const markers = Array.from({ length: numMarkers }, (_, i) => i * 2.5);

  return (
    <div className="h-64 lg:h-72 border-t border-studio-border bg-studio-900 flex flex-col select-none relative z-10">
      {/* Timeline Controls Header */}
      <div className="h-9 px-4 border-b border-studio-border bg-studio-850 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold uppercase tracking-wider text-[11px] text-slate-300 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-accent-cyan" />
            NLE Multi-Track Timeline
          </span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-[11px] text-accent-cyan font-semibold">
            {currentTime.toFixed(2)}s / {totalDuration.toFixed(2)}s
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-studio-800 px-2 py-0.5 rounded border border-studio-border">
            <span>Grid Snap:</span>
            <span className="text-white font-mono font-medium">Beat / Pause</span>
          </div>

          <div className="h-4 w-px bg-studio-border mx-1" />

          <button className="p-1 rounded hover:bg-studio-700 text-slate-400 hover:text-white" title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-studio-700 text-slate-400 hover:text-white" title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Track Container with Left Headers & Right Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Track Names Column */}
        <div className="w-32 sm:w-40 bg-studio-850 border-r border-studio-border flex flex-col shrink-0 text-xs">
          {/* Ruler spacer */}
          <div className="h-6 border-b border-studio-border bg-studio-900/50" />

          {/* V1: B-Roll Video Header */}
          <div className="h-20 border-b border-studio-border p-2 flex items-center justify-between bg-studio-850/60">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Film className="w-3.5 h-3.5 text-accent-cyan" />
              <span>V1: B-Roll</span>
            </div>
            <span className="text-[10px] font-mono text-accent-cyan px-1 py-0.5 rounded bg-accent-cyan/10">
              {project.clips.length} cuts
            </span>
          </div>

          {/* TXT: Captions Header */}
          <div className="h-8 border-b border-studio-border p-2 flex items-center gap-1.5 font-medium text-slate-300 bg-studio-850/40">
            <Type className="w-3.5 h-3.5 text-amber-400" />
            <span>TXT: Subs</span>
          </div>

          {/* A1: Voiceover Header */}
          <div className="h-12 border-b border-studio-border p-2 flex items-center justify-between bg-studio-850/60">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Mic className="w-3.5 h-3.5 text-accent-emerald" />
              <span>A1: Voice</span>
            </div>
            <span className="text-[10px] font-mono text-accent-emerald">Synced</span>
          </div>

          {/* A2: SFX Bed Header */}
          <div className="h-9 p-2 flex items-center gap-1.5 font-medium text-slate-300 bg-studio-850/40">
            <Volume2 className="w-3.5 h-3.5 text-accent-indigo" />
            <span>A2: SFX</span>
          </div>
        </div>

        {/* Right Scrollable Tracks Canvas */}
        <div
          ref={timelineRef}
          onClick={handleTimelineClick}
          className="flex-1 relative bg-[#0a0d14] overflow-x-auto overflow-y-hidden cursor-pointer"
        >
          {/* Time Ruler */}
          <div className="h-6 border-b border-studio-border bg-studio-900/90 relative flex items-center text-[10px] font-mono text-slate-500">
            {markers.map((sec) => {
              const leftPercent = (sec / totalDuration) * 100;
              return (
                <div
                  key={sec}
                  style={{ left: `${leftPercent}%` }}
                  className="absolute top-0 bottom-0 flex flex-col justify-between pl-1 border-l border-slate-700/60 pointer-events-none"
                >
                  <span>{sec.toFixed(1)}s</span>
                  <div className="h-1 w-px bg-slate-600" />
                </div>
              );
            })}
          </div>

          {/* Track 1: V1 B-Roll Video Clips */}
          <div className="h-20 border-b border-studio-border relative flex items-center px-0.5 bg-studio-950/40">
            {project.clips.map((clip) => {
              const left = (clip.startTime / totalDuration) * 100;
              const width = (clip.duration / totalDuration) * 100;
              const isSelected = selectedClip?.id === clip.id;
              const isActive = currentTime >= clip.startTime && currentTime <= clip.endTime;

              return (
                <div
                  key={clip.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectClip(clip);
                    onSeek(clip.startTime);
                  }}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  className={`absolute top-1 bottom-1 rounded-md overflow-hidden border transition-all cursor-pointer group flex flex-col justify-between p-1.5 ${
                    isSelected
                      ? 'border-accent-cyan ring-2 ring-accent-cyan/40 bg-accent-cyan/15 z-10'
                      : isActive
                      ? 'border-accent-cyan/80 bg-studio-800/90'
                      : 'border-studio-border hover:border-slate-500 bg-studio-800/60'
                  }`}
                >
                  {/* Clip Header with Icon & Type */}
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-white truncate max-w-[80%] drop-shadow">
                      {clip.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSwapModal(clip);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded bg-black/60 hover:bg-black text-accent-cyan transition-opacity"
                      title="Swap clip"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Thumbnail snippet */}
                  <div className="flex-1 my-0.5 rounded overflow-hidden relative opacity-70 group-hover:opacity-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={clip.thumbnailUrl}
                      alt={clip.title}
                      className="w-full h-full object-cover"
                    />
                    {clip.sourceType === 'genai' && (
                      <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-purple-950/80 text-[8px] font-bold text-accent-purple border border-purple-500/40">
                        AI
                      </span>
                    )}
                  </div>

                  {/* Bottom Duration Badge */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-300">
                    <span>{clip.duration.toFixed(1)}s</span>
                    <span className="capitalize text-slate-400">{clip.transition}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Track 2: Captions Block */}
          <div className="h-8 border-b border-studio-border relative bg-studio-900/30 flex items-center">
            {project.transcript
              .filter((_, i) => i % 4 === 0)
              .map((word, i) => {
                const left = (word.start / totalDuration) * 100;
                const nextWords = project.transcript.slice(i * 4, i * 4 + 4).map((w) => w.word).join(' ');
                const dur = Math.min(2.5, totalDuration - word.start);
                const width = (dur / totalDuration) * 100;

                return (
                  <div
                    key={i}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    className="absolute top-1 bottom-1 rounded bg-amber-500/15 border border-amber-500/30 px-1.5 flex items-center text-[10px] text-amber-200 truncate font-medium"
                  >
                    {nextWords}
                  </div>
                );
              })}
          </div>

          {/* Track 3: A1 Voiceover Simulated Waveform */}
          <div className="h-12 border-b border-studio-border relative bg-studio-950/80 flex items-center px-1 overflow-hidden">
            <div className="w-full flex items-center justify-between gap-[2px] h-8 opacity-80">
              {Array.from({ length: 120 }).map((_, i) => {
                // Generate a natural-looking voice waveform with pauses
                const isPause = i % 18 === 0 || i % 19 === 0;
                const heightPercent = isPause ? 8 : Math.floor(20 + Math.sin(i * 0.4) * 35 + ((i * 7) % 35));
                const isPassed = (i / 120) * 100 <= playheadPercent;

                return (
                  <div
                    key={i}
                    style={{ height: `${heightPercent}%` }}
                    className={`flex-1 rounded-full transition-colors ${
                      isPassed ? 'bg-accent-emerald' : 'bg-emerald-950/60'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Track 4: A2 SFX Markers */}
          <div className="h-9 relative bg-studio-900/20 flex items-center">
            {project.sfx.map((sfx) => {
              const left = (sfx.time / totalDuration) * 100;
              return (
                <div
                  key={sfx.id}
                  style={{ left: `${left}%` }}
                  className="absolute top-1 bottom-1 px-1.5 rounded bg-accent-indigo/20 border border-accent-indigo/50 flex items-center gap-1 text-[9px] font-mono text-accent-indigo"
                  title={`${sfx.name} (${sfx.type})`}
                >
                  <Volume2 className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[60px]">{sfx.name}</span>
                </div>
              );
            })}
          </div>

          {/* The Live Draggable Playhead */}
          <div
            style={{ left: `${playheadPercent}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-accent-cyan shadow-[0_0_12px_#00F2FE] pointer-events-none z-30"
          >
            {/* Playhead Head Marker */}
            <div className="w-3.5 h-3.5 bg-accent-cyan -translate-x-[6px] -translate-y-0.5 rotate-45 rounded-[2px] shadow-lg flex items-center justify-center">
              <div className="w-1 h-1 bg-black rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
