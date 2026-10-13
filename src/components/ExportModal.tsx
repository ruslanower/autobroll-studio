'use client';

import React, { useState } from 'react';
import { X, Download, FileCode, Film, CheckCircle2, Loader2, Sparkles, Sliders } from 'lucide-react';
import { ProjectData } from '@/types';
import { generatePremiereXML, generateFCPXML, generateDaVinciEDL, triggerDownload } from '@/utils/xmlGenerators';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [isRenderingMP4, setIsRenderingMP4] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderComplete, setRenderComplete] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPremiereXML = () => {
    const xml = generatePremiereXML(project);
    const filename = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_Premiere.xml`;
    triggerDownload(filename, xml, 'application/xml');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  const handleDownloadFCPXML = () => {
    const fcpxml = generateFCPXML(project);
    const filename = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}.fcpxml`;
    triggerDownload(filename, fcpxml, 'application/xml');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  const handleDownloadDaVinciEDL = () => {
    const edl = generateDaVinciEDL(project);
    const filename = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}.edl`;
    triggerDownload(filename, edl, 'text/plain');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  const handleStartMP4Render = () => {
    setIsRenderingMP4(true);
    setRenderProgress(0);
    setRenderComplete(false);

    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRenderingMP4(false);
          setRenderComplete(true);
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } });
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-studio-850 border border-studio-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-studio-border flex items-center justify-between bg-studio-900">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-accent-cyan" />
              Export Studio Timeline & Package
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {project.clips.length} B-Roll Clips • {project.audioDuration}s • Aspect {project.aspectRatio}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-studio-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Section 1: Pro NLE Formats */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileCode className="w-4 h-4 text-accent-cyan" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Pro NLE Timelines (Zero Compression / Raw Native Cuts)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Premiere Pro XML */}
              <button
                onClick={handleDownloadPremiereXML}
                className="p-4 rounded-xl bg-studio-900 border border-studio-border hover:border-accent-cyan/80 hover:bg-studio-800/80 text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#9999FF]/20 text-[#9999FF] flex items-center justify-center font-black text-xs mb-2">
                    Pr
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-accent-cyan">
                    Premiere Pro XML
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Standard .xml sequence with tracks, cuts, and in/out points.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-accent-cyan">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .xml</span>
                </div>
              </button>

              {/* Final Cut Pro X */}
              <button
                onClick={handleDownloadFCPXML}
                className="p-4 rounded-xl bg-studio-900 border border-studio-border hover:border-accent-cyan/80 hover:bg-studio-800/80 text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs mb-2">
                    FCP
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-accent-cyan">
                    Final Cut Pro X
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Native .fcpxml file for macOS Final Cut editing.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-accent-cyan">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .fcpxml</span>
                </div>
              </button>

              {/* DaVinci Resolve EDL */}
              <button
                onClick={handleDownloadDaVinciEDL}
                className="p-4 rounded-xl bg-studio-900 border border-studio-border hover:border-accent-cyan/80 hover:bg-studio-800/80 text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs mb-2">
                    Dv
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-accent-cyan">
                    DaVinci Resolve
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    CMX 3600 standard EDL for color grading & conforming.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-accent-cyan">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .edl</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Rendered MP4 */}
          <div className="pt-2 border-t border-studio-border">
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-4 h-4 text-accent-purple" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Direct To Publish (Render MP4 with Subtitles & Audio)
              </h4>
            </div>

            <div className="bg-studio-900 p-4 rounded-xl border border-studio-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Full HD MP4 (1080p / 60fps)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-emerald/20 text-accent-emerald font-semibold">
                    Ready for TikTok & Reels
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Burned-in kinetic karaoke captions, Ken Burns camera zooms, and auto-mixed SFX bed.
                </p>
              </div>

              {!isRenderingMP4 && !renderComplete && (
                <button
                  onClick={handleStartMP4Render}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-black bg-gradient-to-r from-accent-cyan to-accent-indigo hover:opacity-90 shadow-lg shadow-accent-cyan/20 shrink-0 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Render Final MP4</span>
                </button>
              )}

              {isRenderingMP4 && (
                <div className="w-48 flex flex-col gap-1.5 shrink-0">
                  <div className="flex justify-between text-[11px] font-mono text-slate-300">
                    <span>Rendering...</span>
                    <span>{renderProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-studio-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${renderProgress}%` }}
                      className="h-full bg-accent-cyan transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {renderComplete && (
                <div className="flex items-center gap-2 text-accent-emerald font-semibold text-xs shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Render Complete!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
