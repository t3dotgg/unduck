// This file was (mostly) ripped from https://duckduckgo.com/bang.js

// Removed all bangs I don't use and customized the ones I do use.

export const bangs = [
  {
    c: "AI",
    d: "www.t3.chat",
    r: 0,
    s: "T3 Chat",
    sc: "AI",
    t: "t3",
    u: "https://www.t3.chat/new?q={{{s}}}",
  },
  {
    c: "Tech",
    d: "www.archlinux.org",
    r: 4,
    s: "ArchLinux Packages",
    sc: "Languages (other)",
    t: "apkgs",
    u: "https://www.archlinux.org/packages/?sort=&q={{{s}}}",
  },
  {
    c: "Tech",
    d: "flathub.org",
    r: 4,
    s: "flathub Packages",
    sc: "Languages (other)",
    t: "fpkgs",
    u: "  https://flathub.org/apps/search?q={{{s}}}",
  },

  {
    c: "Tech",
    d: "aur.archlinux.org",
    r: 12,
    s: "ArchLinux User Repository",
    sc: "Languages (other)",
    t: "aur",
    u: "https://aur.archlinux.org/packages.php?O=0&K={{{s}}}&do_Search=Go",
  },
  {
    c: "Tech",
    d: "wiki.archlinux.org",
    r: 3840,
    s: "ArchLinux Wiki",
    sc: "Sysadmin (Arch)",
    t: "arch",
    u: "https://wiki.archlinux.org/index.php?title=Special%3ASearch&search={{{s}}}&go=Go",
  },
  {
    c: "Online Services",
    d: "www.google.com",
    r: 0,
    s: "Google (Past 6 Months)",
    sc: "Google",
    t: "g6",
    u: "https://www.google.com/search?tbs=qdr:m6&q={{{s}}}&safe=off&ie=utf-8&oe=utf-8",
  },
  {
    c: "Online Services",
    d: "www.google.com",
    r: 1942262,
    s: "Google",
    sc: "Google",
    t: "g",
    u: "https://www.google.com/search?q={{{s}}}",
  },
  {
    c: "Online Services",
    d: "duckduckgo.com",
    r: 3693,
    s: "DuckDuckGo",
    sc: "Search (DDG)",
    t: "d",
    u: "https://duckduckgo.com/?q={{{s}}}",
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
    c: "Online Services",
    d: "www.reddit.com",
    r: 40882,
    s: "Reddit",
    sc: "Social",
    t: "r",
    u: "https://www.reddit.com/search?q={{{s}}}",
  },
  {
    c: "Tech",
    d: "github.com",
    r: 15975,
    s: "GitHub",
    sc: "Programming",
    t: "gh",
    u: "https://github.com/search?utf8=%E2%9C%93&q={{{s}}}",
  },
  {
    c: "AI",
    d: "www.perplexity.ai",
    r: 0,
    s: "Perplexity",
    sc: "AI",
    t: "p",
    u: "https://www.perplexity.ai/?q={{{s}}}",
  },
  {
    c: "AI",
    d: "chat.openai.com",
    r: 0,
    s: "ChatGPT",
    sc: "AI",
    t: "c",
    u: "https://chat.openai.com?q={{{s}}}",
  },
  {
    c: "Online Services",
    d: "leta.mullvad.net",
    r: 0,
    s: "Leta",
    sc: "Search (Leta)",
    t: "l",
    u: "https://leta.mullvad.net/?q={{{s}}}",
  },
  {
    c: "Online Services",
    d: "x.com",
    r: 7870,
    s: "X",
    sc: "Social",
    t: "x",
    u: "https://x.com/search?q={{{s}}}",
  },
  {
    c: "Online Services",
    d: "www.facebook.com",
    r: 5129,
    s: "Facebook",
    sc: "Social",
    t: "fb",
    u: "https://www.facebook.com/search.php/?q={{{s}}}",
  },
  {
    c: "Entertainment",
    d: "www.netflix.com",
    r: 444,
    s: "Netflix",
    sc: "Movies",
    t: "nf",
    u: "https://www.netflix.com/search?q={{{s}}}",
  },
  {
    c: "Entertainment",
    d: "apps.disneyplus.com",
    r: 444,
    s: "Netflix",
    sc: "Movies",
    t: "dp",
    u: "https://www.apps.disneyplus.com/explore?search_query={{{s}}}",
  },
];
