export const WORDS_PER_MINUTE = 200;

export interface ReadingStats {
  words: number;
  minutes: number;
}

export function countWords(text: string): number {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

export function computeReadingStats(text: string): ReadingStats {
  const words = countWords(text);
  return { words, minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)) };
}

function stripMarkdownLine(line: string): string {
  return line
    .replace(/^#{1,6}\s+/, "")
    .replace(/^>\s?/, "")
    .replace(/^[-*+]\s+/, "")
    .replace(/^\d+[.)]\s+/, "")
    .replace(/[*_`~]/g, "")
    .trim();
}

export function excerptOfMarkdown(markdown: string, maxLength = 200): string {
  const blocks = markdown.split(/\n\s*\n/);
  for (const block of blocks) {
    const lines = block.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length === 0) continue;
    if (/^#{1,6}\s+/.test(lines[0].trim())) continue;
    const line = lines.map(stripMarkdownLine).join(" ").trim();
    if (line.length > 0) {
      if (line.length <= maxLength) return line;
      return `${line.slice(0, maxLength - 1).trimEnd()}…`;
    }
  }
  return "";
}
