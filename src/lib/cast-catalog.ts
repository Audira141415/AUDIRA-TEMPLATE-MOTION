export interface CastMember {
  id: string;
  name: string;
  role: 'human' | 'ai';
  title: string;
  avatarColor: string;
  hoodieColor?: string;
  botAccentColor?: string;
}

export interface LocationScene {
  id: string;
  name: string;
  wallColor: string;
  neonText: string;
  accentColor: string;
}

export const HUMAN_CAST: CastMember[] = [
  { id: 'ash', name: 'Ash', role: 'human', title: 'Aspiring Streamer', avatarColor: '#fbcfe8', hoodieColor: '#c2410c' },
  { id: 'noob', name: 'Noob Blox', role: 'human', title: 'Level 1 Obby Player', avatarColor: '#ffd900', hoodieColor: '#0055bf' },
  { id: 'kai', name: 'Kai', role: 'human', title: 'Tech Developer', avatarColor: '#fed7aa', hoodieColor: '#2563eb' },
  { id: 'june', name: 'June', role: 'human', title: 'Creative Designer', avatarColor: '#fef08a', hoodieColor: '#9333ea' },
  { id: 'nara', name: 'Nara', role: 'human', title: 'Sharp Analyst', avatarColor: '#e2e8f0', hoodieColor: '#059669' },
  { id: 'reza', name: 'Reza', role: 'human', title: 'Corporate Hustler', avatarColor: '#fdba74', hoodieColor: '#475569' },
];

export const AI_CAST: CastMember[] = [
  { id: 'bacon', name: 'Pro Bacon', role: 'ai', title: 'Top 1 Global Obby', avatarColor: '#f5d0a9', botAccentColor: '#dc2626' },
  { id: 'claude', name: 'Claude', role: 'ai', title: 'Brutally Honest AI', avatarColor: '#f4f3f0', botAccentColor: '#c2410c' },
  { id: 'bubble', name: 'Bubble', role: 'ai', title: 'Curious ChatGPT Bot', avatarColor: '#ffffff', botAccentColor: '#06b6d4' },
  { id: 'cyber', name: 'CyberCore', role: 'ai', title: 'High-Tech Supercomputer', avatarColor: '#18181b', botAccentColor: '#a855f7' },
  { id: 'pixel', name: 'BitBot', role: 'ai', title: 'Retro 8-bit Sprite', avatarColor: '#052e16', botAccentColor: '#10b981' },
];

export const SCENE_LOCATIONS: LocationScene[] = [
  { id: 'roblox_tower', name: 'Tower of Hell (Obby)', wallColor: '#0a1128', neonText: 'OBBY STAGE 42', accentColor: '#00a2ff' },
  { id: 'diner', name: '24-Hour Neon Diner', wallColor: '#1a1829', neonText: 'BANTER CAFE', accentColor: '#c2410c' },
  { id: 'cafe', name: 'Modern Coffee Shop', wallColor: '#292524', neonText: 'ROAST & CO', accentColor: '#d97706' },
  { id: 'office', name: 'High-Rise Tech Office', wallColor: '#0f172a', neonText: 'DEV LAB 404', accentColor: '#2563eb' },
  { id: 'podcast', name: 'Acoustic Podcast Studio', wallColor: '#18181b', neonText: 'ON AIR', accentColor: '#ef4444' },
  { id: 'bedroom', name: 'Cozy Midnight Room', wallColor: '#172554', neonText: 'LATE NIGHTS', accentColor: '#06b6d4' },
];
