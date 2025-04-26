import { bangs, type Bang, type SubBang } from "./bang";
import "./global.css";

function formatQuery(query: string) {
    return encodeURIComponent(query)
        .replace(/%2F/g, "/")
        .replace(/%23/g, "#")
        .trim();
}

type Error = {
    t: string;
    b: SubBang;
}

type requiredBang extends Error {
    t: "requiredBang"; // type
}

type invalidLength extends Error {
    t: "invalidLength"; // type
    l: number; // length
    e: number; // expected
}


function noSearchDefaultPageRender() {
    const app = document.querySelector<HTMLDivElement>("#app")!;
    app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;" id="container">
      <div class="content-container">
        <h1>Und*ck</h1>
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

function missingRequiredBang(errors: Error[]) {
    const errorTypes:Record<Error["t"], Error[]> = {};
    errors.forEach((e) => {
        if (!errorTypes[e.t]) {
            errorTypes[e.t] = [];
        }
        errorTypes[e.t].push(e);
    });
    const generateError = (error: Error) => {
        switch (error.t) {
            case "requiredBang":
                return `!${error.b}`;
            case "invalidLength":
                return `Expected ${error.e} but got ${error.l}`;
            default:
                return "Unknown error";
        }
    }

    const generateErrorType = (type: string) => {
        switch (type) {
            case "requiredBang":
                return "Missing Required Bangs";
            case "invalidLength":
                return "IBang has invalid length";
            default:
                return "Unknown error";
        }
    
        
    }

    const container = document.querySelector<HTMLDivElement>("#container")!;
    container.prepend(`
        <div class="bg-red-500 text-white p-4 rounded-lg">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    ${errorTypes.map((type, errors) => {
                        return `
                            <div class="mt-2 text-sm text-red-700">
                                <h3 class="text-sm font-medium text-red-800">${generateErrorType(type)}</h3>
                                <div class="mt-2 text-sm text-red-700">
                                <ul role="list" class="list-disc pl-5 space-y-1">
                                    ${errors.map((e) => {
                                        return `
                                            <li>${generateError(e)}</li>
                                        `;
                                    })}
                                </ul>
                                </div>
                            </div>
                        `
                    })}
                </div>
        </div>
    `)
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
        const invalidBangs:SubBang[] = [];
        for (const b of mainBang.sb) {
            const bangToken = `!${b.b}`;
            if (splitQuery.includes(bangToken)) {
                let value = "";
                if (b.l === 0) {
                    value = b.v ?? b.d ?? "";
                } else {
                    const index = splitQuery.indexOf(bangToken);
                    let v = "";
                    // Collect all tokens after bangToken until next bang or end
                    let i = 0;
                    for (let i = 0; i < Math.min(splitQuery.length-index, b.l); i++) {
                        if (splitQuery[index+1].startsWith("!")) break;
                        v += (v ? " " : "") + splitQuery[index+1];
                        splitQuery.splice(index+1, 1); // remove current token, do not increment i
                    }
                    if (i !== b.l) {
                        invalidBangs.push(b);
                    }
                    value = v || b.d || "";
                    splitQuery.splice(index, 1); // remove the bang token itself
                }
                if (b.k) {
                    query = query.replace(`{{{${b.k}}}}`, formatQuery(value));
                } else if (b.u) {
                    queryParams.set(b.u, value);
                }
            } else {
                // Check default / required
                const value = b.d;
                if (!value) {
                    noSearchDefaultPageRender();
                    missingRequiredBang(b);
                    return null;
                }
                if (b.k && value) {
                    query = query.replace(`{{{${b.k}}}}`, formatQuery(value));
                } else if (b.u && value) {
                    queryParams.set(b.u, value);
                }
            }
        }
    }

    return {
        searchUrl: query,
    };
}

function getBang(query: string): { bang: Bang; query: string } {
    // Find all bang matches like !g, !yt, etc.
    const matches = query.match(/!(\S+)/gi) ?? [];
    const bangCandidates = matches.map((m) => m.toLowerCase());

    // Find the first bang in bangs that matches any candidate
    const selectedBang =
        bangs.find((b) => bangCandidates.includes("!" + b.t.toLowerCase())) ??
        defaultBang;

    if (!selectedBang) {
        return { bang: defaultBang, query };
    }

    // Remove the bang token from the query
    const regex = new RegExp(`!${selectedBang.t}`, "i");
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

    const { searchUrl } = getBangs(query);

    if (!searchUrl) return null;
    return searchUrl;
}

function doRedirect() {
    const searchUrl = getBangRedirectUrl();
    if (!searchUrl) return;
    window.location.replace(searchUrl);
}

doRedirect();
