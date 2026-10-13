'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { InspectorPanel } from '@/components/InspectorPanel';
import { VideoCanvas } from '@/components/VideoCanvas';
import { Timeline } from '@/components/Timeline';
import { SwapModal } from '@/components/SwapModal';
import { ExportModal } from '@/components/ExportModal';
import { SettingsModal } from '@/components/SettingsModal';
import { SAMPLE_PROJECTS } from '@/data/mockProjects';
import { ProjectData, BrollClip, CaptionStyle } from '@/types';

export default function AutoBrollStudioApp() {
  const [project, setProject] = useState<ProjectData>(SAMPLE_PROJECTS['ai-revolution']);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedClip, setSelectedClip] = useState<BrollClip | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>(project.aspectRatio);
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>('hormozi-yellow');
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSwapOpen, setIsSwapOpen] = useState<boolean>(false);
  const [swapTargetClip, setSwapTargetClip] = useState<BrollClip | null>(null);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync project switch
  const handleSelectProject = (projectId: string) => {
    if (SAMPLE_PROJECTS[projectId]) {
      setIsPlaying(false);
      setCurrentTime(0);
      const nextProj = SAMPLE_PROJECTS[projectId];
      setProject(nextProj);
      setAspectRatio(nextProj.aspectRatio);
      setSelectedClip(nextProj.clips[0]);
    }
  };

  // Playhead loop timer
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= project.audioDuration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, project.audioDuration]);

  // Audio play/pause sync
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(newTime, project.audioDuration));
    setCurrentTime(clamped);
    if (audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleToggleAspectRatio = () => {
    setAspectRatio((prev) => (prev === '9:16' ? '16:9' : '9:16'));
  };

  const handleOpenSwapModal = (clip: BrollClip) => {
    setSwapTargetClip(clip);
    setIsSwapOpen(true);
  };

  const handleSelectAlternative = (clipId: string, newClipData: Partial<BrollClip>) => {
    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => (c.id === clipId ? { ...c, ...newClipData } : c)),
    }));
  };

  const handleRegenerateClip = (clipId: string) => {
    handleSelectAlternative(clipId, {
      title: 'AI Dream Generation',
      sourceType: 'genai',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traffic-at-night-in-a-futuristic-city-43187-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    });
  };

  const handleRegenerateAll = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      // Shuffle transition effects and re-optimize cadence
      setProject((prev) => ({
        ...prev,
        clips: prev.clips.map((c, i) => ({
          ...c,
          transition: (['cut', 'whip-pan', 'zoom', 'crossfade'] as const)[i % 4],
          motionEffect: (['ken-burns-in', 'ken-burns-out', 'pan-left', 'static'] as const)[i % 4],
        })),
      }));
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090b10]">
      {/* Hidden Audio element for voiceover sync */}
      <audio
        ref={audioRef}
        src={project.audioUrl}
        muted={isAudioMuted}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Top Studio Navbar */}
      <Header
        currentProject={project}
        onSelectProject={handleSelectProject}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRegenerateAll={handleRegenerateAll}
        isRegenerating={isRegenerating}
      />

      {/* Center Studio Workspace: Left Inspector + Right Video Canvas */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <InspectorPanel
          project={project}
          currentTime={currentTime}
          selectedClip={selectedClip}
          onSeek={handleSeek}
          onOpenSwapModal={handleOpenSwapModal}
          onRegenerateClip={handleRegenerateClip}
          isAudioMuted={isAudioMuted}
          onToggleMute={() => setIsAudioMuted((prev) => !prev)}
        />

        <VideoCanvas
          project={project}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onSeek={handleSeek}
          aspectRatio={aspectRatio}
          onToggleAspectRatio={handleToggleAspectRatio}
          captionStyle={captionStyle}
          onChangeCaptionStyle={setCaptionStyle}
          showCaptions={showCaptions}
          onToggleCaptions={() => setShowCaptions((prev) => !prev)}
          isAudioMuted={isAudioMuted}
          onToggleMute={() => setIsAudioMuted((prev) => !prev)}
        />
      </main>

      {/* Bottom Professional NLE Timeline */}
      <Timeline
        project={project}
        currentTime={currentTime}
        selectedClip={selectedClip}
        onSelectClip={setSelectedClip}
        onSeek={handleSeek}
        onOpenSwapModal={handleOpenSwapModal}
      />

      {/* Modals & Drawers */}
      <SwapModal
        isOpen={isSwapOpen}
        onClose={() => setIsSwapOpen(false)}
        clip={swapTargetClip}
        onSelectAlternative={handleSelectAlternative}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
