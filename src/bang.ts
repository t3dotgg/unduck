// This file was ripped from https://duckduckgo.com/bang.js
import rawBangs from "./bangs.json" with {type: "json"};

type Bang = {
  c?: string;
  d: string;
  r: number;
  s: string;
  sc?: string;
  t: string;
  u: string;
};

console.log("this ran, but not on client")

export const bangs: Record<string, Bang> = {
  t3: {
    c: "AI",
    d: "www.t3.chat",
    r: 0,
    s: "T3 Chat",
    sc: "AI",
    t: "t3",
    u: "https://www.t3.chat/new?q={{{s}}}",
  },
  ...Object.fromEntries(
    rawBangs.map((bang) => {
      return [bang.t, bang];
    })
  ),
};
