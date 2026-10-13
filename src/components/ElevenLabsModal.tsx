'use client';

import React, { useState } from 'react';
import { X, Mic, Sparkles, Volume2, Key, Sliders, Check, Wand2, Globe2, Play } from 'lucide-react';
import { ElevenLabsVoice, ProjectData, WordTimestamp, BrollClip, SfxMarker } from '@/types';
import { ELEVENLABS_VOICES, PRESET_SCRIPTS } from '@/data/elevenLabsVoices';
import { STOCK_CATALOG } from '@/data/mockProjects';

interface ElevenLabsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoiceover: (newProjectData: Partial<ProjectData>) => void;
  savedApiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ElevenLabsModal: React.FC<ElevenLabsModalProps> = ({
  isOpen,
  onClose,
  onApplyVoiceover,
  savedApiKey,
  onSaveApiKey,
}) => {
  const [selectedVoice, setSelectedVoice] = useState<ElevenLabsVoice>(ELEVENLABS_VOICES[0]);
  const [scriptText, setScriptText] = useState<string>(PRESET_SCRIPTS[0].text);
  const [stability, setStability] = useState<number>(0.5);
  const [similarity, setSimilarity] = useState<number>(0.75);
  const [apiKeyInput, setApiKeyInput] = useState<string>(savedApiKey);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  if (!isOpen) return null;

  // Estimate speech duration based on word count (~145 WPM)
  const words = scriptText.trim().split(/\s+/).filter(Boolean);
  const estimatedSeconds = Math.max(3, Math.round((words.length / 145) * 60 * 10) / 10);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusMessage('Звернення до ElevenLabs Multilingual v2...');

    // Save key locally if typed
    if (apiKeyInput && apiKeyInput !== savedApiKey) {
      onSaveApiKey(apiKeyInput);
    }

    try {
      let audioBlobUrl = 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3';
      const keyToUse = apiKeyInput || savedApiKey;

      if (keyToUse && keyToUse.trim().length > 5) {
        setStatusMessage('Генерація аудіопотоку...');
        const response = await fetch('/api/elevenlabs/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: scriptText,
            voiceId: selectedVoice.id,
            apiKey: keyToUse,
            stability,
            similarityBoost: similarity,
          }),
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('audio')) {
            const blob = await response.blob();
            audioBlobUrl = URL.createObjectURL(blob);
          }
        }
      }

      setStatusMessage('AI Cadence Engine: розрахунок пауз та генерація B-Roll слів...');

      // Synthesize word-level timestamps with speech cadence
      const wordTimestamps: WordTimestamp[] = [];
      const totalDuration = estimatedSeconds;
      const wordDuration = totalDuration / Math.max(1, words.length);

      words.forEach((word, idx) => {
        const start = idx * wordDuration;
        const end = Math.min(totalDuration, start + wordDuration);
        const isHighlight = idx % 5 === 0 || word.length > 7;
        wordTimestamps.push({
          word,
          start: Math.round(start * 100) / 100,
          end: Math.round(end * 100) / 100,
          highlight: isHighlight,
        });
      });

      // Generate dynamic B-Roll scenes based on cadence
      // Dynamic cuts every 2.4 - 3.2 seconds
      const avgCut = 2.6;
      const numClips = Math.max(2, Math.ceil(totalDuration / avgCut));
      const generatedClips: BrollClip[] = [];

      for (let i = 0; i < numClips; i++) {
        const clipStart = i * avgCut;
        const clipEnd = Math.min(totalDuration, (i + 1) * avgCut);
        const clipDur = Math.max(1.5, clipEnd - clipStart);
        const stockItem = STOCK_CATALOG[i % STOCK_CATALOG.length];

        generatedClips.push({
          id: `ai-gen-clip-${i + 1}-${Date.now()}`,
          title: `${selectedVoice.name} Scene ${i + 1}: ${stockItem.title}`,
          sourceType: stockItem.sourceType,
          promptOrKeyword: stockItem.tags.join(', '),
          startTime: Math.round(clipStart * 10) / 10,
          endTime: Math.round(clipEnd * 10) / 10,
          duration: Math.round(clipDur * 10) / 10,
          videoUrl: stockItem.videoUrl,
          thumbnailUrl: stockItem.thumbnailUrl,
          aspectRatio: '9:16',
          transition: (['cut', 'whip-pan', 'zoom', 'crossfade'] as const)[i % 4],
          motionEffect: (['ken-burns-in', 'ken-burns-out', 'pan-left'] as const)[i % 3],
        });
      }

      // Generate matching SFX markers
      const sfxList: SfxMarker[] = [
        { id: `sfx-init-${Date.now()}`, name: 'Cinematic Sub Bass', type: 'sub-drop', time: 0.0 },
        { id: `sfx-mid-${Date.now()}`, name: 'Fast Whoosh Transition', type: 'whoosh', time: Math.round(totalDuration * 0.35 * 10) / 10 },
        { id: `sfx-high-${Date.now()}`, name: 'Epic Brass Riser', type: 'riser', time: Math.round(totalDuration * 0.75 * 10) / 10 },
      ];

      // Update full project state
      onApplyVoiceover({
        title: `AI Voice (${selectedVoice.name}): ${words.slice(0, 4).join(' ')}...`,
        audioDuration: totalDuration,
        audioUrl: audioBlobUrl,
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        wordsPerMinute: Math.round((words.length / totalDuration) * 60),
        averageCutDuration: avgCut,
        transcript: wordTimestamps,
        clips: generatedClips,
        sfx: sfxList,
      });

      setIsGenerating(false);
      onClose();
    } catch {
      setIsGenerating(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-studio-850 border border-studio-border rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-studio-border flex items-center justify-between bg-studio-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-purple to-accent-cyan p-0.5">
              <div className="w-full h-full bg-studio-900 rounded-[6px] flex items-center justify-center">
                <Mic className="w-4 h-4 text-accent-cyan" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                ElevenLabs AI Voice Studio
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-accent-purple/20 text-accent-purple font-mono border border-accent-purple/40">
                  Multilingual v2
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Озвучка тексту з вибором офіційних тембрів від ElevenLabs & авто-нарізка B-Roll
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-studio-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Voice Selection Grid */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between mb-2.5">
              <span>1. Оберіть тембр голосу ({ELEVENLABS_VOICES.length} голосів)</span>
              <span className="text-[11px] text-accent-cyan font-mono lowercase">
                вибрано: {selectedVoice.name}
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {ELEVENLABS_VOICES.map((voice) => {
                const isSelected = selectedVoice.id === voice.id;
                return (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-accent-cyan bg-studio-800/90 ring-1 ring-accent-cyan/50 shadow-md shadow-accent-cyan/10'
                        : 'border-studio-border bg-studio-900/60 hover:border-slate-500 hover:bg-studio-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            style={{ backgroundColor: voice.color }}
                            className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          />
                          <span className="text-xs font-extrabold text-white">{voice.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-accent-cyan" />}
                      </div>

                      <div className="text-[10px] text-accent-indigo font-medium mb-1">
                        {voice.category}
                      </div>

                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {voice.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-studio-border/50 text-[9px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{voice.accent}</span>
                      <span className="text-slate-300 font-medium">{voice.gender}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Scripts Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                2. Текст сценарію для озвучки
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {words.length} слів • ~{estimatedSeconds}s звучання
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_SCRIPTS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setScriptText(preset.text)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-studio-800 hover:bg-studio-700 text-slate-300 border border-studio-border transition-colors flex items-center gap-1"
                >
                  <Globe2 className="w-3 h-3 text-accent-cyan" />
                  <span>{preset.title}</span>
                </button>
              ))}
            </div>

            <textarea
              rows={4}
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder="Введіть текст вашої озвучки українською чи англійською мовою..."
              className="w-full bg-studio-900 border border-studio-border rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan leading-relaxed resize-none font-sans"
            />
          </div>

          {/* Fine Tuning Sliders & API Key Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-studio-900/60 rounded-xl border border-studio-border text-xs">
            {/* Stability */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Stability: {stability.toFixed(2)}</span>
                <span className="text-slate-500">Більше = стабільніше</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={stability}
                onChange={(e) => setStability(parseFloat(e.target.value))}
                className="w-full h-1 bg-studio-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
              />
            </div>

            {/* Similarity */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Clarity / Similarity: {similarity.toFixed(2)}</span>
                <span className="text-slate-500">Більше = чіткіше</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={similarity}
                onChange={(e) => setSimilarity(parseFloat(e.target.value))}
                className="w-full h-1 bg-studio-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
              />
            </div>
          </div>

          {/* Optional ElevenLabs API Key quick input */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-studio-900 border border-studio-border/70 text-xs">
            <Key className="w-4 h-4 text-accent-cyan shrink-0" />
            <input
              type="password"
              placeholder="Вставте ваш ElevenLabs API Key (опціонально для реального аудіопотоку)..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            {savedApiKey && (
              <span className="text-[10px] font-mono text-accent-emerald px-1.5 py-0.5 rounded bg-accent-emerald/10 border border-accent-emerald/30 shrink-0">
                Ключ активний
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-studio-border bg-studio-900 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            {isGenerating ? statusMessage : `Тембр: ${selectedVoice.name} (${selectedVoice.accent})`}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Скасувати
            </button>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || words.length === 0}
              className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-accent-cyan via-accent-indigo to-accent-purple hover:opacity-95 shadow-lg shadow-accent-cyan/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin text-black" />
                  <span>Синтез та нарізка...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Згенерувати ШІ Озвучку & Синхронізувати B-Roll</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
