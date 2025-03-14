import { bangs } from "./bang.js";
import fs from "fs";
const minifiedBangs = bangs.map((bang) => {
  return {
    n: bang.s, //name
    b: bang.t, //bang
    u: bang.u, //url
  };
});

fs.writeFileSync(
  "./src/bang/bang-min.js",
  `export const bangs = ${JSON.stringify(minifiedBangs)}`
);
