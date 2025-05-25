import { storage } from "./libs";
import { CONSTANTS } from "./main";

const createTemplate = (data: { searchCount: string }) => `
 <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
  <header style="position: absolute; top: 1rem; width: 100%;">
   <div style="display: flex; justify-content: space-between; padding: 0 1rem;">
    <span>${data.searchCount} ${data.searchCount === "1" ? "search" : "searches"}</span>
   </div>
  </header>
  <div class="content-container">
   <h1 id="cutie">${CONSTANTS.CUTIES.NOTFOUND[Math.floor(Math.random() * CONSTANTS.CUTIES.NOTFOUND.length)]}</h1>
   <p>404 Page not found</p>
  </div>
  <footer class="footer">
   made with ♥ by <a href="https://github.com/taciturnaxolotl" target="_blank">Kieran Klukas</a> as <a href="https://github.com/taciturnaxolotl/unduck" target="_blank">open source</a> software
  </footer>
 </div>
`;

export default function notFoundPageRender() {
	const searchCount =
		storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_COUNT) || "0";
	const app = document.querySelector<HTMLDivElement>("#app");
	if (!app) throw new Error("App element not found");

	app.innerHTML = createTemplate({
		searchCount,
	});
}
