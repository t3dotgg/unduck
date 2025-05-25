import { bangs } from "./src/bang.ts";
import { writeFileSync } from "fs";

/* Developer script that converts ./bang.ts' array to hashmap.
*   In your terminal of choice enter: cd src && node --experimental-strip-types .\hashbanggen.ts && cd ../
*   If you should happen to enjoy PowerShell: cd src; node --experimental-strip-types .\hashbanggen.ts; cd ../
* */


let hashbang: {[key: string]: ({t: string, u: string })} = {}
bangs.forEach(bang => hashbang[bang.t] = {t: bang.t, u:bang.u});

writeFileSync('./src/hashbang.ts', `export const bangs: {[key: string]: ({t: string, u: string })} = ${JSON.stringify(hashbang)};`, 'utf-8');