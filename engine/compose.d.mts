import type { Storyboard } from '../src/types/motion';

export type Beat = {
  kind: 'line' | 'hook';
  speaker: string;
  emotion: string;
  start: number;
  end: number;
  words: { text: string; start: number; end: number }[];
};

export type VoiceTimeline = { duration: number; timeline: Beat[] };

export const FORMAT_IDS: string[];
export const CAPTION_STYLES: Record<string, string>;
export const TRANSITIONS: Record<string, string>;
export function estimateTimeline(storyboard: Storyboard, opts?: { lead?: number; gap?: number; tail?: number }): VoiceTimeline;
export function composeReel(storyboard: Storyboard, voice: VoiceTimeline, opts?: { sfx?: boolean; preview?: boolean }): string;
