// centralized default configuration for AI Skipper
// This file allows easy contribution to the default blocklists.

export const DEFAULT_KEYWORDS = [
  "ai cover", "aicover", "ai generated", "aigenerated", 
  "ai music", "aimusic", "suno ai", "sunoai", "udio", 
  "synthetic voice", "syntheticvoice", "ai voice", "aivoice",
  "cloned voice", "clonedvoice", "chatgpt", "midjourney",
  "stable audio", "udis", "justtesing"
];

export const DEFAULT_CHANNELS = [
  "AI Music Channel"
];

export const DEFAULT_REGEX = [
  "\\(AI .* Cover\\)",  // Matches: (AI 1960s Cover)
  "\\[AI Cover\\]",     // Matches: [AI Cover]
  "\\(AI Version\\)"    // Matches: (AI Version)
];

export const DEFAULT_CHECK_INTERVAL = 1000; // ms
