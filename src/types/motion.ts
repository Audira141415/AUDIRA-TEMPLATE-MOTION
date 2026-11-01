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
  | 'sticky_notes'
  | 'roblox_story'
  | 'what_if_3d'
  | 'zombie_survival'
  | 'how_its_built'
  | 'cosmic_voyage';

export type CharacterArchetype =
  | 'roblox_blocky'
  | 'lowpoly_humanoid'
  | 'cyber_hologram'
  | 'tactical_survivor'
  | 'vector_expressive';

export type CaptionStyle = 'auto' | 'pop' | 'box' | 'karaoke' | 'bounce' | 'neon' | 'typewriter' | 'minimal' | 'outline';
export type TransitionStyle = 'auto' | 'flash' | 'wipe' | 'zoom' | 'glitch' | 'shutter' | 'whip' | 'iris';
export type ReelStyle = { caption?: CaptionStyle; transition?: TransitionStyle };

export type SubtitlePositionPreset = 'top' | 'upper_mid' | 'center' | 'lower_mid' | 'bottom';
export type SubtitleSize = 'sm' | 'md' | 'lg';
export type SubtitleBoxStyle = 'shadow' | 'glass' | 'solid' | 'neon';
export type SubtitleAnimationStyle = 'highlight' | 'pop_bounce' | 'karaoke' | 'flash_word' | 'hormozi_box';
export type SubtitleFontFamily = 'montserrat' | 'impact' | 'the_bold_font' | 'komika' | 'inter';

export interface SubtitleConfig {
  enabled: boolean;
  position?: SubtitlePositionPreset;
  customY?: number; // 10 to 88 percentage
  size: SubtitleSize;
  boxStyle: SubtitleBoxStyle;
  highlightColor?: string;
  showSpeakerTag?: boolean;
  animationStyle?: SubtitleAnimationStyle;
  fontFamily?: SubtitleFontFamily;
}

export interface AudioMixerConfig {
  voiceVolume: number; // 0 to 1 (default 1)
  bgmVolume: number;   // 0 to 1 (default 0.25)
  sfxVolume: number;   // 0 to 1 (default 0.6)
  customBgmUrl?: string;
  customBgmName?: string;
}

export interface VisualLayoutConfig {
  showHeader?: boolean;
  showGraphic?: boolean;
  showGraphics?: boolean;
  showCallout?: boolean;
  graphicScale?: 'compact' | 'normal' | 'large';
  canvasTheme?: string;
  backgroundTheme?: 'default' | 'obsidian' | 'cyber_grid' | 'amber_studio' | 'neon_bloom';
  aspectRatio?: '9:16' | '1:1' | '16:9';
  customMediaUrl?: string;
  customMediaLabel?: string;
  // News Broadcast specific options
  newsMode?: 'forensic_leak' | 'anchor_studio' | 'field_live_cam';
  newsUrgency?: 'breaking' | 'flash' | 'investigasi' | 'special';
  customTicker?: string;
}

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
  subtitleConfig?: SubtitleConfig;
  visualLayout?: VisualLayoutConfig;
  audioMixer?: AudioMixerConfig;
  visualTheme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
}
