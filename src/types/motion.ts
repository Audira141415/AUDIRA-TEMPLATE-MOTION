export type MotionFormat = 
  | 'character_banter'
  | 'whiteboard'
  | 'pixel_rpg'
  | 'breaking_news'
  | 'clean_explainer'
  | 'docu_story'
  | 'kinetic_type'
  | 'chat_story'
  | 'top_list'
  | 'quiz'
  | 'podcast_clip'
  | 'comic_strip'
  | 'terminal_hack'
  | 'versus'
  | 'map_journey'
  | 'recipe_steps'
  | 'social_post'
  | 'receipt'
  | 'retro_vhs'
  | 'sticky_notes';

export type CaptionStyle = 'auto' | 'pop' | 'box' | 'karaoke' | 'bounce' | 'neon' | 'typewriter' | 'minimal' | 'outline';
export type TransitionStyle = 'auto' | 'flash' | 'wipe' | 'zoom' | 'glitch' | 'shutter' | 'whip' | 'iris';
export type ReelStyle = { caption?: CaptionStyle; transition?: TransitionStyle };

export type MoodType = 'calm' | 'warm' | 'motivational' | 'hyped' | 'frustrated' | 'angry' | 'rude';

export type SpeakerEmotion = 'neutral' | 'hyped' | 'angry' | 'shocked' | 'smug' | 'thoughtful' | 'sarcastic';

export interface WordTimestamp {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
}

export interface StoryboardLine {
  id: string;
  speaker: string;
  speakerRole: 'human' | 'ai' | 'narrator' | 'hero' | 'boss';
  avatar?: string;
  text: string;
  startSec: number;
  durationSec: number;
  emotion: SpeakerEmotion;
  words: WordTimestamp[];
}

export interface Storyboard {
  id: string;
  title: string;
  concept: string;
  format: MotionFormat;
  mood: MoodType;
  durationSec: number;
  fps: number;
  locationName: string;
  characters: {
    characterA: { name: string; title: string; avatar: string };
    characterB: { name: string; title: string; avatar: string };
  };
  lines: StoryboardLine[];
  commentMagnetHook: string;
  style?: ReelStyle;
  visualTheme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
}
