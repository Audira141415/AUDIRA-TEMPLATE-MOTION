import { StoryboardLine, WordTimestamp } from '@/types/motion';

/**
 * Calculates word-level timestamps for a dialogue line
 */
export function calculateWordTimestamps(text: string, startSec: number, durationSec: number): WordTimestamp[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const wordDuration = durationSec / words.length;
  return words.map((word, idx) => ({
    word,
    start: Number((startSec + idx * wordDuration).toFixed(2)),
    end: Number((startSec + (idx + 1) * wordDuration).toFixed(2)),
  }));
}

/**
 * Re-balances all line start times and total storyboard duration
 */
export function rebalanceLines(lines: StoryboardLine[]): { lines: StoryboardLine[]; totalDuration: number } {
  let currentStart = 0;
  const updatedLines: StoryboardLine[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const words = line.text.split(/\s+/).filter(Boolean);
    // Dynamic duration based on reading speed: ~0.36s per word, minimum 1.8s
    const calculatedDuration = Math.max(1.8, Number((words.length * 0.36).toFixed(1)));
    const duration = line.durationSec > 0 ? line.durationSec : calculatedDuration;

    const wordsTs = calculateWordTimestamps(line.text, currentStart, duration);

    updatedLines.push({
      ...line,
      startSec: Number(currentStart.toFixed(2)),
      durationSec: Number(duration.toFixed(2)),
      words: wordsTs,
    });

    currentStart += duration + 0.1; // 0.1s natural pause between speakers
  }

  const totalDuration = Number((currentStart + 1.2).toFixed(1)); // extra 1.2s for comment outro

  return {
    lines: updatedLines,
    totalDuration,
  };
}

