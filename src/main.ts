import { bangs } from "./bang";
import "./global.css";

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <h1>Und*ck</h1>
        <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
        <div class="url-container"> 
          <input 
            type="text" 
            class="url-input"
            value="https://unduck.link?q=%s"
            readonly 
          />
          <button class="copy-button">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
        </div>
        <div class="default-bang-container">
          <label for="default-bang">Default Bang (when no bang is specified):</label>
          <div style="display: flex; gap: 8px; align-items: start;">
            <div style="flex-grow: 1;">
              <input 
                type="text" 
                id="default-bang" 
                class="default-bang-input" 
                value="${LS_DEFAULT_BANG}"
                style="padding: 8px; border-radius: 4px; border: 1px solid #ddd; width: 100%; transition: border-color 0.2s ease-in-out;"
                placeholder="Enter bang (e.g. g, gi, yt, w)"
              />
              <div class="bang-save-status" >Bang save status placeholder</div>
            </div>
            <button class="save-bang-button copy-button" >
              <img src="/save.svg" alt="Save" class="save-icon" />
              <img src="/check.svg" alt="Saved" class="check-icon" style="opacity: 0;" />
            </button>
          </div>
        </div>
      </div>
      <footer class="footer">
        <a href="https://t3.chat" target="_blank">t3.chat</a>
        •
        <a href="https://x.com/theo" target="_blank">theo</a>
        •
        <a href="https://github.com/t3dotgg/unduck" target="_blank">github</a>
      </footer>
    </div>
  `;

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;
  const defaultBangInput = app.querySelector<HTMLInputElement>(
    ".default-bang-input"
  )!;
  const saveBangButton =
    app.querySelector<HTMLButtonElement>(".save-bang-button")!;
  const saveIcon =
    saveBangButton.querySelector<HTMLImageElement>(".save-icon")!;
  const checkIcon =
    saveBangButton.querySelector<HTMLImageElement>(".check-icon")!;
  const bangSaveStatus =
    app.querySelector<HTMLDivElement>(".bang-save-status")!;

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
    }, 2000);
  });

  function validateAndSaveBang() {
    const inputValue = defaultBangInput.value.trim();
    // Remove ! from start or end of input
    const cleanBang = inputValue.replace(/^!|!$/g, "");

    const selectedBang = bangs.find((b) => b.t === cleanBang);

    if (!selectedBang) {
      bangSaveStatus.style.opacity = "1";
      bangSaveStatus.style.color = "#dc3545";
      bangSaveStatus.textContent = `Bang "!${cleanBang}" doesn't exist`;
      defaultBangInput.style.borderColor = "#dc3545";
      return;
    }

    localStorage.setItem("default-bang", cleanBang);

    defaultBangInput.style.borderColor = "#ddd";

    bangSaveStatus.style.opacity = "1";
    bangSaveStatus.style.color = "#28a745";
    bangSaveStatus.textContent = `Using !${cleanBang} (${selectedBang.s}) as default bang`;

    saveIcon.style.opacity = "0";
    checkIcon.style.opacity = "1";

    setTimeout(() => {
      bangSaveStatus.style.opacity = "0";
      saveIcon.style.opacity = "1";
      checkIcon.style.opacity = "0";
    }, 2000);
  }

  saveBangButton.addEventListener("click", validateAndSaveBang);
  defaultBangInput.addEventListener("keypress", (e) => {
    if (e.key !== "Enter") return;

    validateAndSaveBang();
  });
}

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();
