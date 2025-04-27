import { bangs as Uncategorized } from "./Uncategorized";
import { bangs as AI } from "./AI";
import { bangs as Tech } from "./Tech";
import { bangs as Entertainment } from "./Entertainment";
import { bangs as Online_Services } from "./Online Services";
import { bangs as News } from "./News";
import { bangs as Research } from "./Research";
import { bangs as Shopping } from "./Shopping";
import { bangs as Multimedia } from "./Multimedia";
import { bangs as Translation } from "./Translation";

export const bangs = [
    ...Uncategorized,
    ...AI,
    ...Tech,
    ...Entertainment,
    ...Online_Services,
    ...News,
    ...Research,
    ...Shopping,
    ...Multimedia,
    ...Translation,
    {
        c: "Test",
        d: "www.test.com",
        r: 0,
        s: "Test",
        sc: "Test",
        t: "tst",
        u: "https://www.test.com/{{{test}}}/search?q={{{s}}}",
        sb: [{ b: "ts", k: "test", l: 1 }],
    },
];
export * from "./types";
