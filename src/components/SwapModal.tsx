'use client';

import React, { useState } from 'react';
import { X, Search, Sparkles, Film, Check, Wand2, Upload } from 'lucide-react';
import { BrollClip } from '@/types';
import { STOCK_CATALOG } from '@/data/mockProjects';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  clip: BrollClip | null;
  onSelectAlternative: (clipId: string, newClipData: Partial<BrollClip>) => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  isOpen,
  onClose,
  clip,
  onSelectAlternative,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'stock' | 'genai'>('all');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  if (!isOpen || !clip) return null;

  const filteredCatalog = STOCK_CATALOG.filter((item) => {
    if (activeFilter === 'stock' && item.sourceType !== 'stock') return false;
    if (activeFilter === 'genai' && item.sourceType !== 'genai') return false;
    if (!searchQuery) return true;
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSimulateGenAI = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      setIsGeneratingAI(false);
      onSelectAlternative(clip.id, {
        title: `AI Dream: ${searchQuery || clip.promptOrKeyword.slice(0, 24)}`,
        sourceType: 'genai',
        promptOrKeyword: searchQuery || clip.promptOrKeyword,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-arm-working-in-a-laboratory-43407-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        motionEffect: 'ken-burns-in',
      });
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-studio-850 border border-studio-border rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-studio-border flex items-center justify-between bg-studio-900">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-accent-cyan" />
              Swap Footage for Scene &quot;{clip.title}&quot;
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Duration needed: {clip.duration.toFixed(1)}s • Cadence: {clip.motionEffect}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-studio-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-studio-border bg-studio-900/40 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stock footage by mood, object, concept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-studio-800 text-xs text-white placeholder-slate-400 rounded-lg pl-9 pr-4 py-2 border border-studio-border focus:outline-none focus:border-accent-cyan transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === 'all'
                  ? 'bg-studio-700 text-white border border-studio-border'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('stock')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === 'stock'
                  ? 'bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Stock
            </button>
            <button
              onClick={() => setActiveFilter('genai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === 'genai'
                  ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ✦ GenAI
            </button>
          </div>
        </div>

        {/* Footage Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* GenAI Generator Special Card */}
          <div className="border border-dashed border-accent-purple/50 bg-gradient-to-b from-accent-purple/10 to-transparent rounded-xl p-3 flex flex-col justify-between hover:border-accent-purple transition-all group">
            <div>
              <div className="flex items-center gap-1.5 text-accent-purple font-bold text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GenAI Synthesis</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Can&apos;t find stock? Generate custom synthetic video via Runway Gen-3 / Luma API.
              </p>
            </div>

            <button
              onClick={handleSimulateGenAI}
              disabled={isGeneratingAI}
              className="mt-3 w-full py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-accent-purple/20 transition-all disabled:opacity-50"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAI ? 'Synthesizing (1.8s)...' : 'Generate Clip'}</span>
            </button>
          </div>

          {filteredCatalog.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectAlternative(clip.id, {
                  title: item.title,
                  sourceType: item.sourceType,
                  videoUrl: item.videoUrl,
                  thumbnailUrl: item.thumbnailUrl,
                  promptOrKeyword: item.tags.join(', '),
                });
                onClose();
              }}
              className="group bg-studio-900 border border-studio-border hover:border-accent-cyan rounded-xl overflow-hidden cursor-pointer flex flex-col transition-all hover:scale-[1.02]"
            >
              <div className="relative aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                  {item.duration}
                </span>
                <span
                  className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    item.sourceType === 'genai'
                      ? 'bg-accent-purple text-white'
                      : 'bg-accent-indigo text-white'
                  }`}
                >
                  {item.sourceType === 'genai' ? 'AI' : 'Stock'}
                </span>
              </div>

              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-100 truncate">{item.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.category}</div>
                </div>

                <div className="mt-2 flex items-center justify-between pt-2 border-t border-studio-border/50 text-[10px] text-slate-400">
                  <span className="truncate max-w-[120px]">{item.tags.slice(0, 3).join(', ')}</span>
                  <span className="text-accent-cyan group-hover:underline flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Swap
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
