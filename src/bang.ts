// This file was (mostly) ripped from https://duckduckgo.com/bang.js

export const bangs = [
  {
    c: "AI",
    d: "chatgpt.com",
    r: 0,
    s: "ChatGPT",
    sc: "AI",
    t: "gpt",
    u: "chatgpt.com/?q={{{s}}}",
  },
  {
    c: "Tech",
    d: "github.com",
    r: 26,
    s: "Github",
    sc: "Programming",
    t: "ghr",
    u: "https://github.com/{{{s}}}",
  },
  {
    c: "Entertainment",
    d: "minecraft.wiki",
    r: 485,
    s: "Official Minecraft Wiki",
    sc: "Games (Minecraft)",
    t: "mc",
    u: "http://minecraft.wiki?search={{{s}}}",
  },
  {
    c: "Multimedia",
    d: "www.youtube.com",
    r: 463021,
    s: "YouTube",
    sc: "Video",
    t: "yt",
    u: "https://www.youtube.com/results?search_query={{{s}}}",
  },
  {
    c: "Social",
    d: "bsky.app",
    r: 0,
    s: "Bluesky",
    sc: "Social Media",
    t: "bsky",
    u: "https://bsky.app/search?q={{{s}}}",
  },
  {
    c: "Entertainment",
    d: "namemc.com",
    r: 0,
    s: "NameMC",
    sc: "Games (Minecraft)",
    t: "namemc",
    u: "https://namemc.com/search?q={{{s}}}",
  }
];
