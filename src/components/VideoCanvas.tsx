'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Smartphone, Monitor, Type } from 'lucide-react';
import { ProjectData, BrollClip, CaptionStyle } from '@/types';

interface VideoCanvasProps {
  project: ProjectData;
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  aspectRatio: '9:16' | '16:9';
  onToggleAspectRatio: () => void;
  captionStyle: CaptionStyle;
  onChangeCaptionStyle: (style: CaptionStyle) => void;
  showCaptions: boolean;
  onToggleCaptions: () => void;
  isAudioMuted: boolean;
  onToggleMute: () => void;
}

export const VideoCanvas: React.FC<VideoCanvasProps> = ({
  project,
  currentTime,
  isPlaying,
  onTogglePlay,
  onSeek,
  aspectRatio,
  onToggleAspectRatio,
  captionStyle,
  onChangeCaptionStyle,
  showCaptions,
  onToggleCaptions,
  isAudioMuted,
  onToggleMute,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Determine current active clip
  const currentClip = project.clips.find(
    (c) => currentTime >= c.startTime && currentTime <= c.endTime
  ) || project.clips[0];

  // Determine current active words for captions (find word within ±0.4s)
  const currentWordIndex = project.transcript.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );
  const activeWord = currentWordIndex !== -1 ? project.transcript[currentWordIndex] : null;

  // Sync HTML5 video currentTime with global timeline currentTime
  useEffect(() => {
    if (videoRef.current && currentClip) {
      const clipLocalTime = Math.max(0, currentTime - currentClip.startTime);
      if (Math.abs(videoRef.current.currentTime - clipLocalTime) > 0.4) {
        videoRef.current.currentTime = clipLocalTime;
      }
    }
  }, [currentTime, currentClip]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, playbackSpeed, currentClip?.videoUrl]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}.${ms}`;
  };

  const getMotionAnimationClass = (motion: BrollClip['motionEffect']) => {
    switch (motion) {
      case 'ken-burns-in':
        return 'scale-110 transition-transform duration-[4000ms] ease-out';
      case 'ken-burns-out':
        return 'scale-100 transition-transform duration-[4000ms] ease-out';
      case 'pan-left':
        return '-translate-x-4 transition-transform duration-[4000ms] ease-out';
      default:
        return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#07090d] items-center justify-between p-3 lg:p-5 overflow-hidden">
      {/* Top Toolbar */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-2 px-2 py-1 mb-2 text-xs">
        {/* Aspect Ratio Switch */}
        <div className="flex items-center gap-1 bg-studio-850 p-1 rounded-lg border border-studio-border">
          <button
            onClick={onToggleAspectRatio}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              aspectRatio === '9:16'
                ? 'bg-studio-700 text-accent-cyan shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16 Reel</span>
          </button>
          <button
            onClick={onToggleAspectRatio}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              aspectRatio === '16:9'
                ? 'bg-studio-700 text-accent-cyan shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>16:9 YouTube</span>
          </button>
        </div>

        {/* Current Scene Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-studio-850/80 rounded-full border border-studio-border text-slate-300">
          <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="font-mono text-slate-400">Current Scene:</span>
          <span className="font-semibold text-white truncate max-w-[200px]">{currentClip.title}</span>
        </div>

        {/* Caption Style Switcher */}
        <div className="flex items-center gap-1.5 bg-studio-850 p-1 rounded-lg border border-studio-border">
          <button
            onClick={onToggleCaptions}
            className={`p-1.5 rounded transition-colors ${
              showCaptions ? 'text-accent-cyan bg-studio-700' : 'text-slate-500 hover:text-white'
            }`}
            title="Toggle Captions"
          >
            <Type className="w-3.5 h-3.5" />
          </button>

          {showCaptions && (
            <select
              value={captionStyle}
              onChange={(e) => onChangeCaptionStyle(e.target.value as CaptionStyle)}
              className="bg-transparent text-[11px] font-semibold text-slate-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="hormozi-yellow" className="bg-studio-800 text-white">Hormozi Pop</option>
              <option value="cyber-cyan" className="bg-studio-800 text-white">Cyber Neon</option>
              <option value="minimal-clean" className="bg-studio-800 text-white">Clean Sans</option>
              <option value="vox-boxed" className="bg-studio-800 text-white">Vox Box</option>
            </select>
          )}
        </div>
      </div>

      {/* Main Video Viewport Stage */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center w-full relative min-h-[260px] max-h-[500px]"
      >
        <div
          className={`relative rounded-2xl overflow-hidden border-2 border-studio-border shadow-2xl bg-black flex items-center justify-center transition-all duration-300 ${
            aspectRatio === '9:16'
              ? 'aspect-[9/16] h-full max-h-[460px] w-auto'
              : 'aspect-video w-full max-w-3xl h-auto'
          }`}
        >
          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            src={currentClip.videoUrl}
            poster={currentClip.thumbnailUrl}
            muted={isAudioMuted}
            playsInline
            loop
            className={`w-full h-full object-cover select-none pointer-events-none ${getMotionAnimationClass(
              currentClip.motionEffect
            )}`}
          />

          {/* Watermark / Brand in Corner */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider text-slate-300 border border-white/10 z-10">
            AUTO B-ROLL • VANZALABS
          </div>

          {/* Source pill */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-semibold text-accent-cyan border border-accent-cyan/30 z-10 uppercase">
            {currentClip.sourceType}
          </div>

          {/* Kinetic Karaoke Subtitles Overlay */}
          {showCaptions && activeWord && (
            <div className="absolute bottom-8 inset-x-4 flex justify-center text-center pointer-events-none z-20">
              {captionStyle === 'hormozi-yellow' && (
                <div className="text-xl sm:text-2xl font-black tracking-tight text-amber-300 uppercase caption-glow-yellow transform scale-110 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-bounce duration-150">
                  {activeWord.word}
                </div>
              )}

              {captionStyle === 'cyber-cyan' && (
                <div className="text-lg sm:text-xl font-extrabold tracking-wide text-accent-cyan caption-glow-cyan bg-black/75 px-3 py-1 rounded-lg border border-accent-cyan/40">
                  {activeWord.word}
                </div>
              )}

              {captionStyle === 'minimal-clean' && (
                <div className="text-base sm:text-lg font-medium text-white bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                  {activeWord.word}
                </div>
              )}

              {captionStyle === 'vox-boxed' && (
                <div className="text-sm sm:text-base font-bold uppercase tracking-wider text-black bg-white px-2 py-0.5 shadow-xl">
                  {activeWord.word}
                </div>
              )}
            </div>
          )}

          {/* Center Play Overlay Trigger when paused */}
          {!isPlaying && (
            <button
              onClick={onTogglePlay}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-accent-cyan/20 hover:bg-accent-cyan/30 border border-accent-cyan/50 backdrop-blur-sm flex items-center justify-center text-accent-cyan transition-all scale-100 hover:scale-110 z-20"
            >
              <Play className="w-6 h-6 fill-accent-cyan ml-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Transport Controls Bar */}
      <div className="w-full max-w-4xl bg-studio-850 border border-studio-border rounded-xl px-4 py-2 mt-2 flex items-center justify-between gap-4">
        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-lg bg-accent-cyan text-black flex items-center justify-center font-bold hover:opacity-90 transition-all active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
          </button>

          <button
            onClick={() => onSeek(0)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-studio-750 transition-colors"
            title="Reset to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="font-mono text-xs text-slate-300 ml-1">
            <span className="text-white font-bold">{formatTime(currentTime)}</span>
            <span className="text-slate-500"> / {formatTime(project.audioDuration)}</span>
          </div>
        </div>

        {/* Global Progress Scrubber Bar */}
        <div className="flex-1 flex items-center px-2">
          <input
            type="range"
            min={0}
            max={project.audioDuration}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-studio-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan focus:outline-none"
          />
        </div>

        {/* Right Aux Controls */}
        <div className="flex items-center gap-2.5">
          {/* Speed selector */}
          <button
            onClick={() => {
              const speeds = [1, 1.25, 1.5, 2];
              const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
              setPlaybackSpeed(speeds[nextIndex]);
            }}
            className="px-2 py-1 rounded bg-studio-800 text-[11px] font-mono text-slate-300 hover:text-white border border-studio-border transition-colors"
            title="Playback Speed"
          >
            {playbackSpeed}x
          </button>

          {/* Audio Mute */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded text-slate-400 hover:text-white transition-colors"
            title="Toggle Mute"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
