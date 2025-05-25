import rawBangs from "./bangs.json" with { type: "json" };

// Developer script that converts ./bang.ts' array to hashmap.

const hashbang: {
	[key: string]: {
		c?: string;
		d: string;
		r: number;
		s: string;
		sc?: string;
		t: string;
		u: string;
	};
} = {
	t3: {
		c: "AI",
		d: "www.t3.chat",
		r: 0,
		s: "T3 Chat",
		sc: "AI",
		t: "t3",
		u: "https://www.t3.chat/new?q={{{s}}}",
	},
	m2: {
		c: "Online Services",
		d: "meta.dunkirk.sh",
		r: 0,
		s: "metasearch2",
		sc: "Search",
		t: "m2",
		u: "https://meta.dunkirk.sh/search?q={{{s}}}",
	},
	tiktok: {
		c: "Multimedia",
		sc: "Video",
		d: "www.tiktok.com",
		r: 0,
		s: "TikTok",
		t: "tiktok",
		u: "https://www.tiktok.com/search?q={{{s}}}",
	},
};
for (const bang of rawBangs) hashbang[bang.t] = bang;

Bun.write(
	"./src/bangs/hashbang.ts",
	`export const bangs: {[key: string]: ({c?:string, d: string, r: number, s:string, sc?: string, t: string, u: string })} = ${JSON.stringify(hashbang)};`,
);
