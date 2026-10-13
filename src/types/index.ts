export interface WordTimestamp {
  word: string;
  start: number; // in seconds
  end: number;
  highlight?: boolean;
}

export interface BrollClip {
  id: string;
  title: string;
  sourceType: 'stock' | 'genai' | 'vault';
  promptOrKeyword: string;
  startTime: number; // timeline start in seconds
  endTime: number;   // timeline end in seconds
  duration: number;  // clip duration in seconds
  videoUrl: string;
  thumbnailUrl: string;
  aspectRatio: '16:9' | '9:16';
  transition: 'cut' | 'crossfade' | 'zoom' | 'whip-pan';
  motionEffect: 'ken-burns-in' | 'ken-burns-out' | 'pan-left' | 'static';
  locked?: boolean;
}

export interface SfxMarker {
  id: string;
  name: string;
  type: 'whoosh' | 'riser' | 'click' | 'sub-drop' | 'ambient';
  time: number;
}

export interface ElevenLabsVoice {
  id: string;
  name: string;
  category: string;
  description: string;
  previewAudioUrl?: string;
  gender: 'male' | 'female';
  accent: string;
  color: string;
  recommendedFor: string;
}

export interface ProjectData {
  id: string;
  title: string;
  aspectRatio: '9:16' | '16:9';
  audioDuration: number;
  audioUrl: string;
  voiceId?: string;
  voiceName?: string;
  pacingMode: 'high-energy-reels' | 'narrative-documentary' | 'tech-explainer';
  wordsPerMinute: number;
  averageCutDuration: number;
  transcript: WordTimestamp[];
  clips: BrollClip[];
  sfx: SfxMarker[];
}

export type CaptionStyle = 'hormozi-yellow' | 'minimal-clean' | 'cyber-cyan' | 'vox-boxed';
