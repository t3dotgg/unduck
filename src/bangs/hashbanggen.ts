import rawBangs from "./bangs.json" with { type: "json" };

// Developer script that converts ./bang.ts' array to hashmap.
const hashbang: {
	[key: string]: {
		t: string;
		u: string;
	};
} = {
	t3: {
		t: "t3",
		u: "https://www.t3.chat/new?q={{{s}}}",
	},
	t3b: {
		t: "t3b",
		u: "https://beta.t3.chat/new?q={{{s}}}",
	},
	m2: {
		t: "m2",
		u: "https://meta.dunkirk.sh/search?q={{{s}}}",
	},
	tiktok: {
		t: "tiktok",
		u: "https://www.tiktok.com/search?q={{{s}}}",
	},
};
for (const bang of rawBangs) hashbang[bang.t] = {t: bang.t, u:bang.u};

Bun.write(
	"./src/bangs/hashbang.ts",
	`export const bangs: {[key: string]: ({ t: string, u: string })} = ${JSON.stringify(hashbang)};`,
);
