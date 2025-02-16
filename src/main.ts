import { bangs } from "./bang";
import { Footer } from "./components/footer";
import "./global.css";
import { getCustomBangs } from "./utils";

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div class="root-container">
      <a href="/settings" class="settings-link icon-button">
        <img src="/settings.svg" alt="Settings" />
      </a>
      <div class="content-container">
        <h1>Unduck</h1>
        <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
        <div class="url-container"> 
          <input 
            type="text" 
            class="url-input"
            value="https://unduck.link?q=%s"
            readonly 
          />
          <button class="icon-button copy-button">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
        </div>
      </div>
     ${Footer()}
    </div>
  `;

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
    }, 2000);
  });
}

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";

function getBangRedirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  // Remove the first bang from the query
  const cleanQuery = query.replace(/![a-z0-9]+\s*/i, "").trim();

  const customBangs = getCustomBangs();

  const match = query.match(/!([a-z0-9]+)/i);
  const bangCandidate = match?.[1]?.toLowerCase();
  const customBang = customBangs.find((bang) => bang.key === bangCandidate);
  const selectedBang = bangs[bangCandidate ?? LS_DEFAULT_BANG];

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = (customBang?.url ?? selectedBang?.u)?.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangRedirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();
