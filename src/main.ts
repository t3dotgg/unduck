import { bangs, type Bang, type SubBang } from "./bang";
import "./global.css";

function formatQuery(query: string) {
    return encodeURIComponent(query.trim())
        .replace(/%2F/g, "/")
        .replace(/%23/g, "#");
}

// Base error interface for all errors
interface ErrorBase {
    b: SubBang;
}

// Specific error types with discriminated union on 't'
interface RequiredBang extends ErrorBase {
    t: "requiredBang";
}

interface InvalidLength extends ErrorBase {
    t: "invalidLength";
    l: number; // length found
    e: number; // expected length
}

// Generic error for any other error types (optional)
interface OtherError extends ErrorBase {
    t: string; // any other string except reserved ones
}

// Union of all error types
type Error = RequiredBang | InvalidLength | OtherError;

function noSearchDefaultPageRender() {
    const app = document.querySelector<HTMLDivElement>("#app")!;
    app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;" id="container">
      <div class="content-container">
        <h1>Quick D*ck</h1>
        <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
        <div class="url-container"> 
          <input
            type="text" 
            class="url-input"
            value="https://quickduck.vercel.app?q=%s"
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
        <a href="https://github.com/t3dotgg/unduck" target="_blank">github</a>
      </footer>
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

function runErrors(errors: Error[]) {
    const errorTypes: Record<string, Error[]> = {};
    errors.forEach((e) => {
        if (!errorTypes[e.t]) {
            errorTypes[e.t] = [];
        }
        errorTypes[e.t].push(e);
    });

    const generateError = (error: Error) => {
        switch (error.t) {
            case "requiredBang":
                return `!${error.b.b}`;
            case "invalidLength":
                // @ts-ignore
                return `Expected ${error.e} but got ${error.l}`;
            default:
                return "Unknown error";
        }
    };

    const generateErrorType = (type: string) => {
        switch (type) {
            case "requiredBang":
                return "Missing required bang";
            case "invalidLength":
                return "Invalid length";
            default:
                return "Unknown error type";
        }
    };

    const app = document.querySelector<HTMLDivElement>("#app")!;
    app.innerHTML = `
    <div class="errors">
      <div class="error-img">
<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
</svg>
      </div>
      <div class="error-container">
        ${Object.entries(errorTypes)
            .map(
                ([type, errors]) => `
          <div class="error-type">
            <h3>${generateErrorType(type)}</h3>
            <div class="error-list">
              <ul role="list" class="">
                ${errors
                    .map(
                        (e) =>
                            `<li style="font-weight: bold;">${generateError(
                                e
                            )}</li>`
                    )
                    .join("")}
              </ul>
            </div>
          </div>
        `
            )
            .join("")}
      </div>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;" id="container">

      <div class="content-container">
        <h1>Quick D*ck</h1>
        <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
        <div class="url-container"> 
          <input 
            type="text" 
            class="url-input"
            value="https://quickduck.vercel.app?q=%s"
            readonly
          />
          <button class="copy-button">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
        </div>
      </div>
      <footer class="footer">
        <a href="https://github.com/t3dotgg/unduck" target="_blank">unduck</a>
        •
        <a href="https://github.com/r5dan/quickduck" target="_blank">github</a>
        •
        <a href="#" target="_blank">placeholder</a>
      </footer>
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
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG) ?? bangs[0];

function getBangs(q: string) {
    let { bang: mainBang, query } = getBang(q);
    const splitQuery = query.split(" ");

    const queryParams = new URLSearchParams();

    if (q.trim() === `!${mainBang.t}`) {
        return {
            searchUrl: mainBang.d,
        };
    }

    if (mainBang.sb.length > 0) {
        const invalidBangs: Error[] = [];

        // We will collect indices to remove after processing to avoid mutation during iteration
        const indicesToRemove: number[] = [];

        for (const b of mainBang.sb) {
            const bangToken = `!${b.b}`;
            const index = splitQuery.indexOf(bangToken);

            if (index !== -1) {
                let value = "";
                if (b.l === 0) {
                    value = b.v ?? b.d ?? "";
                    // Remove bang token
                    indicesToRemove.push(index);
                } else {
                    let v = "";
                    let count = 0;
                    for (
                        let i = index + 1;
                        i < splitQuery.length && count < b.l;
                        i++, count++
                    ) {
                        if (splitQuery[i].startsWith("!")) break;
                        v += (v ? " " : "") + splitQuery[i];
                    }
                    if (count !== b.l) {
                        invalidBangs.push({
                            t: "invalidLength",
                            l: count,
                            e: b.l,
                            b,
                        });
                    }
                    value = v || b.d || "";
                    // Mark tokens for removal: bang token + collected tokens
                    indicesToRemove.push(index);
                    for (let i = 0; i < count; i++) {
                        indicesToRemove.push(index + 1 + i);
                    }
                }

                if (b.k) {
                    query = query.replace(`{{{${b.k}}}}`, formatQuery(value));
                } else if (b.u) {
                    queryParams.set(b.u, value);
                }
            } else {
                // Check default / required
                const value = b.d;
                if (!value && b.k) {
                    invalidBangs.push({
                        t: "requiredBang",
                        b,
                    });
                } else if (b.k && value) {
                    query = query.replace(`{{{${b.k}}}}`, formatQuery(value));
                } else if (b.u && value) {
                    queryParams.set(b.u, value);
                }
            }
        }

        // Remove tokens in descending order to avoid index shift
        indicesToRemove
            .sort((a, b) => b - a)
            .forEach((idx) => splitQuery.splice(idx, 1));

        if (invalidBangs) {
            runErrors(invalidBangs);
            return null;
        }
    }

    // Append queryParams to query if any
    const paramString = queryParams.toString();
    const separator = query.includes("?") ? "&" : "?";
    const finalQuery = paramString
        ? `${query}${separator}${paramString}`
        : query;

    return {
        searchUrl: finalQuery,
    };
}

function getBang(query: string): { bang: Bang; query: string } {
    // Find all bang matches like !g, !yt, etc.
    const matches = query.match(/!(\S+)/gi) ?? [];
    const bangCandidates = matches.map((m) => m.toLowerCase());

    // Find the first bang in bangs that matches any candidate
    const selectedBang =
        bangs.find((b) => bangCandidates.includes("!" + b.t.toLowerCase())) ??
        null;

    if (!selectedBang) {
        return { bang: defaultBang, query };
    }

    // Remove all occurrences of the selected bang token (case-insensitive)
    const regex = new RegExp(`!${selectedBang.t}`, "gi");
    const newQuery = query.replace(regex, "").trim();

    return {
        bang: selectedBang,
        query: newQuery,
    };
}

function getBangRedirectUrl() {
    const url = new URL(window.location.href);
    const query = url.searchParams.get("q")?.trim() ?? "";
    if (!query) {
        noSearchDefaultPageRender();
        return null;
    }

    const resp = getBangs(query);

    if (!resp) return null;
    return resp.searchUrl;
}

function doRedirect() {
    const searchUrl = getBangRedirectUrl();
    if (!searchUrl) return;
    window.location.replace(searchUrl);
}

doRedirect();
