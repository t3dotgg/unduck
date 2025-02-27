import { bangs } from "./bang";
import "./global.css";

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
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
          <button class="copy-button">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
          <br>
          <p class="customize-link-container">
            <a href="#" class="customize-link">Want to customize the default bang?</a>
          </p>
          <div class="customize-section" style="display: none;">
            <div class="customize-row">
              <label for="default-bang-input">Default bang:</label>
              <input 
                type="text" 
                id="default-bang-input"
                class="url-input default-bang-input"
                placeholder="g (default)" 
              />
            </div>
            <div class="customize-row">
              <label for="bang-char-input">Bang character:</label>
              <input 
                type="text" 
                id="bang-char-input"
                class="url-input bang-char-input"
                maxlength="1"
                placeholder="! (default)" 
              />
            </div>
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
  const customizeLink = app.querySelector<HTMLLinkElement>(".customize-link")!;
  const customizeSection = app.querySelector<HTMLDivElement>(".customize-section")!;
  const defaultBangInput = customizeSection.querySelector<HTMLInputElement>(".default-bang-input")!;
  const customizeLinkContainer = app.querySelector<HTMLParagraphElement>(".customize-link-container")!;
  const bangCharInput = app.querySelector(".bang-char-input") as HTMLInputElement;
  const originalUrl = urlInput.value;

  customizeLink.addEventListener("click", (e) => {
    e.preventDefault();
    customizeSection.style.display = "block";
    customizeLinkContainer.style.display = "none";
  });

  const updateUrl = () => {
    const defaultBang = defaultBangInput.value.trim();
    const bangChar = bangCharInput.value.trim();
    
    let newUrl = originalUrl;
    
    if (defaultBang || bangChar) {
      newUrl = "https://unducked.vercel.app/?q=%s";
      
      if (defaultBang) {
        newUrl += `&default=${defaultBang}`;
      }
      
      if (bangChar) {
        newUrl += `&char=${encodeURIComponent(bangChar)}`;
      }
    }
    
    urlInput.value = newUrl;
  };

  defaultBangInput.addEventListener("input", updateUrl);
  bangCharInput.addEventListener("input", updateUrl);

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
    }, 2000);
  });
}

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  const urlDefault = url.searchParams.get("default")?.trim() ?? localStorage.getItem("default-bang") ?? "g";
  const defaultBang = bangs.find((b) => b.t === urlDefault);
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  // let user select a different character to use as a bang (i.e. mobile)
  const bangChar = url.searchParams.get("char") ?? "!";

  // Escape the bangChar for use in a RegExp pattern
  const escapedBangChar = bangChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create the RegExp patterns with the custom bang character
  const bangPattern = new RegExp(`${escapedBangChar}([a-z0-9]+)`, 'i');
  const cleanPattern = new RegExp(`${escapedBangChar}[a-z0-9]+\\s*`, 'i');

  const match = query.match(bangPattern);
  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;
  // Remove the first bang from the query
  const cleanQuery = query.replace(cleanPattern, "").trim();

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
