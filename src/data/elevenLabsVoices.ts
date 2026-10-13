import { ElevenLabsVoice } from '@/types';

export const ELEVENLABS_VOICES: ElevenLabsVoice[] = [
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    category: 'Deep / Narrative',
    description: 'Глибокий, впевнений голос для кінематографічних відео, документалістики та YouTube-розборів.',
    gender: 'male',
    accent: 'American / Multilingual',
    color: '#4FACFE',
    recommendedFor: 'YouTube Explainers, Deep Dives',
    previewAudioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3'
  },
  {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    category: 'Calm / Professional',
    description: 'Спокійний, теплий і виразний жіночий голос для навчальних курсів, аудіокниг та презентацій.',
    gender: 'female',
    accent: 'American / Clean',
    color: '#00F2FE',
    recommendedFor: 'Online Courses, EdTech, Product Demos',
    previewAudioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3'
  },
  {
    id: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni',
    category: 'Energetic / Fast-Paced',
    description: 'Динамічний, молодий і переконливий голос для вірусних Shorts, TikTok та промо-роликів.',
    gender: 'male',
    accent: 'American / Modern',
    color: '#F59E0B',
    recommendedFor: 'Viral Reels, TikTok, High-Energy',
    previewAudioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3'
  },
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella',
    category: 'Expressive / Commercial',
    description: 'Емоційний, живий жіночий тембр для сторітелінгу, лайфстайл-влогів та реклами.',
    gender: 'female',
    accent: 'American / Warm',
    color: '#E100FF',
    recommendedFor: 'Storytelling, Lifestyle, Reels',
    previewAudioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3'
  },
  {
    id: 'TxGEqnHWrfWFTfGW9XjX',
    name: 'Josh',
    category: 'Cinematic / Resonant',
    description: 'Низький оксамитовий баритон для подкастів, мотиваційних відео та філософських роздумів.',
    gender: 'male',
    accent: 'American / Deep',
    color: '#7F00FF',
    recommendedFor: 'Podcasts, Motivation, Trailers',
    previewAudioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3'
  },
  {
    id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Serhii (Ukrainian Multilingual)',
    category: 'Native Ukrainian Accent',
    description: 'Оптимізований для української мови тембр. Ідеальний для українських стартапів, медіа та оглядів.',
    gender: 'male',
    accent: 'Ukrainian / East Europe',
    color: '#10B981',
    recommendedFor: 'Український контент, Tech News, Огляди',
    previewAudioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3'
  }
];

export const PRESET_SCRIPTS = [
  {
    id: 'ua-ai-future',
    title: '🇺🇦 Український ШІ Маніфест (Швидкий темп)',
    text: 'Штучний інтелект вже змінює правила гри. Компанії, які не впроваджують алгоритми автоматизації сьогодні, зникнуть завтра. Твоя швидкість — це твоя єдина конкурентна перевага у новому цифровому світі.',
    pacingMode: 'high-energy-reels' as const,
  },
  {
    id: 'ua-startup-growth',
    title: '🇺🇦 Як масштабувати стартап без бюджету',
    text: 'Більшість фаундерів витрачають тисячі доларів на рекламу до того, як знайдуть свій product market fit. Справжнє зростання починається тоді, коли кожен клієнт приводить двох нових.',
    pacingMode: 'tech-explainer' as const,
  },
  {
    id: 'en-speed-of-light',
    title: '🇬🇧 The Speed of Algorithms (English Viral)',
    text: 'Artificial intelligence is not coming. It is already here, rewiring every single industry you thought was safe. The creators who leverage algorithms will build empires overnight.',
    pacingMode: 'high-energy-reels' as const,
  }
];
