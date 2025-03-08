import { bangs, Bang, SubBang } from "./bang";
import "./global.css";

function formatQuery(query: string) {
	return encodeURIComponent(query).replace(/%2F/g, "/").replace("%23", "#");
}

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

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

function getBangs(query: string) {
	let curBang: SubBang | null = null;
	let bangQuery: string[] = [];
	const mainBang: Bang = getBang(query).bang;
	const allBangs: {bang: SubBang, value: string}[] = [];
	const splitQuery = query.split(" ");
	const mainBangQuery = []
	let length = 0;


	for (let i = 1; i < splitQuery.length; i++) {
		const word = splitQuery[i];

		if (word.startsWith("!")) {
			const bang = mainBang.sb.find((b) => `!${b.b}` === word);

			if (!bang) {
				bangQuery.push(word);
				length++;
				continue;
			}


			if (curBang) {
				allBangs.push({bang: curBang, value: bangQuery.reverse().join(" ")});
			}

			if (bang.v) {
				allBangs.push({bang: bang, value: bang.v});
			}

			curBang = bang;
			bangQuery = [];
			length = 0;
			continue;
		}

		if (!curBang) {
			mainBangQuery.push(word);
			continue;
		};

		if (curBang.l !== -1 && length >= curBang.l) {
			allBangs.push({
				bang: curBang,
				value: bangQuery.reverse().join(" "),
			});
			bangQuery = [];
			length = 0;
			curBang = null;
			mainBangQuery.push(word);
			continue;
		}

		bangQuery.push(word);
		length++;
	}


	if (curBang) {
		allBangs.push({bang: curBang, value: bangQuery.reverse().join(" ")});
	}


	mainBang.sb.filter((b) => b.d).forEach((b) => {
    if (allBangs.find((bang) => bang.bang.b === b.b)) return;
    if (!b.d) return; // Must include for type checking
		allBangs.push({bang: b, value: b.d});
	});

	return { sub: allBangs, main: mainBang, query: mainBangQuery.join(" ") };
}


function getBang(query: string): {bang:Bang, query:string} {
	const match = query.match(/!(\S+)/i);

	const bangCandidate = match?.[1]?.toLowerCase();
	const selectedBang = bangs.find((b) => b.t === bangCandidate);
	if (!selectedBang) return { bang: defaultBang as Bang, query };

  return { bang: selectedBang as Bang, query: query.replace(selectedBang.t, "").trim() };
}

function getBangredirectUrl() {
	const url = new URL(window.location.href);
	const query = url.searchParams.get("q")?.trim() ?? "";
	if (!query) {
		noSearchDefaultPageRender();
		return null;
	}


	const { sub: subBangs, main: selectedBang, query: newQuery } = getBangs(query);


	// Format of the url is:
	// https://www.google.com/search?q={{{s}}}
	const urlParams: URLSearchParams = new URLSearchParams();
	let searchUrl = selectedBang.u.replace(
		"{{{s}}}",
		formatQuery(newQuery)
	);


	subBangs.forEach(({ value, bang }) => {
		if (bang.u) {
			urlParams.set(bang.u, value)
			return
		}

		searchUrl = searchUrl.replace(
			`{{{${bang.b}}}}`,
			formatQuery(value)
		);
	});
  const params = urlParams.toString()
  if (params) {
    if (searchUrl.includes("?")) {
      searchUrl += `&${params}`;
    } else {
      searchUrl += `?${params}`;
    }
  }

	if (!searchUrl) return null;
	return searchUrl;
}

function doRedirect() {
	const searchUrl = getBangredirectUrl();
	if (!searchUrl) return;
	window.location.replace(searchUrl);
}

doRedirect();