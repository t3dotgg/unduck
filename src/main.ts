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
        <form class="bang-form">
          <label for="bang-input">Care to pick a default bang?</label>
          <div class="bang-container">
            <input
              id="bang-input"
              type="text"
              class="bang-input"
              value="g"
              list="bang-list"
              spellcheck="false"
            />
            <input type="submit" value="Apply" class"bang-confirm"/>
          </div>
          <datalist id="bang-list"></datalist>
        </form>
        <p class="bang-error"></p>
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
  const bangDatalist = app.querySelector<HTMLDataListElement>("#bang-list")!;
  const bangForm = app.querySelector<HTMLFormElement>(".bang-form")!;
  const bangInput = app.querySelector<HTMLInputElement>("#bang-input")!;
  const bangErrorDiv = app.querySelector<HTMLParagraphElement>(".bang-error")!;

  bangs.forEach((b) => {
    const option = document.createElement("option");
    option.value = b.t;
    bangDatalist.appendChild(option);
  })

  bangForm.addEventListener("submit", (submitEvent: SubmitEvent) => {
    submitEvent.preventDefault();
    const bangName = bangInput.value.trim();
    if (!bangs.find((b) => b.t === bangName)) {
      bangErrorDiv.innerHTML = `This bang is not known. Check the <a href="https://duckduckgo.com/bang.html" target="_blank">list of available bangs.</a>`;
      return;
    }
    bangErrorDiv.innerHTML = "";
    urlInput.value = `https://unduck.link?q=%s&default_bang=${encodeURIComponent(bangName)}`;
  })

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
    }, 2000);
  });
}

function findBang(url: URL) {
  //Honoring legacy local-storage defined bangs
  const LS_DEFAULT_BANG = localStorage.getItem("default-bang");
  if (LS_DEFAULT_BANG) {
    const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);
    if (defaultBang)
      return defaultBang;
  }

  //Obtaining default bang from URL
  const URL_DEFAULT_BANG = url.searchParams.get("default_bang")?.trim() ?? "g"; //can contain invalid bang
  const defaultUrlBang = bangs.find((b) => b.t == URL_DEFAULT_BANG);
  if (defaultUrlBang)
    return defaultUrlBang;

  //In case everything else is invalid
  return bangs.find((b) => b.t == "g")!;
}

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? findBang(url);

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
