import { bangs } from "./bang";
import "./global.css";

// Preload the default bang to avoid lookup inside redirect function
const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

/**
 * Renders the default page when no search query is provided
 */
function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  // Use DocumentFragment for better performance when setting innerHTML
  const fragment = document.createDocumentFragment();
  const container = document.createElement('div');
  container.style.cssText = "display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;";

  container.innerHTML = `
    <div class="content-container">
      <h1>Und*ck</h1>
      <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
      <div class="url-container">
        <input
          type="text"
          class="url-input"
          value="https://unduck.formalsnake.dev?q=%s"
          readonly
        />
        <button class="copy-button">
          <img src="/clipboard.svg" alt="Copy" />
        </button>
      </div>
    </div>
    <footer class="footer">
      <a href="https://t3.chat" target="_blank">t3.chat</a>
      •
      <a href="https://x.com/theo" target="_blank">theo</a>
      •
      <a href="https://github.com/formalsnake/unduck" target="_blank">github</a>
    </footer>
  `;

  fragment.appendChild(container);
  app.appendChild(fragment);

  // Initialize copy button functionality
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

/**
 * Get the bang redirect URL based on the query parameter
 * @returns {string|null} The redirect URL or null if no redirect is needed
 */
function getBangredirectUrl() {
  // Fast URL parameter extraction using location.search
  const queryParam = new URLSearchParams(location.search).get("q");
  if (!queryParam?.trim()) {
    noSearchDefaultPageRender();
    return null;
  }

  const query = queryParam.trim();

  // Faster bang extraction with early return for performance
  const bangMatch = query.match(/!(\S+)/i);
  if (!bangMatch) {
    // No bang found, use default
    return defaultBang?.u.replace(
      "{{{s}}}",
      encodeURIComponent(query).replace(/%2F/g, "/")
    );
  }

  const bangCandidate = bangMatch[1].toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // Format and return the URL
  return selectedBang?.u.replace(
    "{{{s}}}",
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
  );
}

/**
 * Perform the redirect immediately
 */
function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (searchUrl) {
    // Use replace for faster redirects without history entries
    window.location.replace(searchUrl);
  }
}

// Execute redirect on page load
// Using requestAnimationFrame to ensure DOM is ready but not block rendering
requestAnimationFrame(() => {
  doRedirect();
});
