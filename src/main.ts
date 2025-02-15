import { bangs } from "./bang";
import "./global.css";

type CustomBang = {
  key: string;
  url: string;
};

const LS_CUSTOM_BANG_KEY = "custom-bangs";

function isCustomBang(value: unknown): value is CustomBang {
  return (
    value !== null &&
    typeof value === "object" &&
    "key" in value &&
    "url" in value &&
    typeof value.key === "string" &&
    typeof value.url === "string"
  );
}

function isCustomBangArray(value: unknown) {
  return Array.isArray(value) && value.every(isCustomBang);
}

// Example usage when retrieving custom bangs from localStorage
function getCustomBangs(): CustomBang[] {
  const storedValue = localStorage.getItem(LS_CUSTOM_BANG_KEY);
  if (!storedValue) {
    return [];
  }

  try {
    const customBangs: unknown = JSON.parse(storedValue);
    if (!isCustomBangArray(customBangs)) {
      throw new Error("Invalid custom bangs format");
    }

    return customBangs;
  } catch (error) {
    console.error("Error parsing custom bangs:", error);

    return [];
  }
}

type SaveCustomBangsResult = {
  success: boolean;
  message: string;
};

function saveCustomBangs(
  tableBody: HTMLTableSectionElement
): SaveCustomBangsResult {
  try {
    const rows = tableBody.querySelectorAll("tr");
    const customBangs: CustomBang[] = [];
    const seenKeys = new Set<string>();

    for (const row of rows) {
      const keyInput = row.querySelector("input[name='t']");
      if (!(keyInput instanceof HTMLInputElement)) {
        return {
          success: false,
          message: "Error parsing custom bangs: key input not found",
        };
      }
      const key = keyInput.value.trim();
      if (!key) {
        return { success: false, message: "Key is required" };
      }

      if (seenKeys.has(key)) {
        return {
          success: false,
          message: `Duplicate key "${key}" found in table`,
        };
      }
      seenKeys.add(key);

      const urlInput = row.querySelector("input[name='u']");
      if (!(urlInput instanceof HTMLInputElement)) {
        return {
          success: false,
          message: "Error parsing custom bangs: url input not found",
        };
      }
      const url = urlInput.value.trim();
      if (!url) {
        return { success: false, message: "Search URL is required" };
      }

      if (!url.includes("{{{s}}}")) {
        return {
          success: false,
          message: `Search URL must contain {{{s}}} as the search placeholder`,
        };
      }

      if (!URL.canParse(url)) {
        return {
          success: false,
          message: `Invalid search URL for key "${key}"`,
        };
      }

      customBangs.push({ key, url });
    }

    localStorage.setItem(LS_CUSTOM_BANG_KEY, JSON.stringify(customBangs));

    return {
      success: true,
      message: "Custom bangs saved successfully!",
    };
  } catch (error) {
    console.error("Error saving custom bangs:", error);
    return {
      success: false,
      message: `Error saving custom bangs: ${(error as Error).message}`,
    };
  }
}

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div class="root-container">
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
        </div>
      </div>
      <div class="custom-bangs-header">
        <h3 class="custom-bangs-heading">Custom Bangs</h3>
        <span id="add-custom-bang">+ Add</span>
      </div>
      <div id="custom-bang-ui"></div>
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

  renderCustomBangsUI(app);
}

function renderCustomBangsUI(app: HTMLDivElement) {
  const customBangUI = app.querySelector<HTMLDivElement>("#custom-bang-ui")!;
  customBangUI.innerHTML = `
    <div class="custom-bangs-table-container">
      <table id="custom-bangs-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          <!-- Table rows will be inserted here -->
        </tbody>
      </table>
      <div id="status-message" class="status-message"></div>
      <button id="save-custom-bangs">Save</button>
    </div>
  `;

  const statusMessage =
    customBangUI.querySelector<HTMLDivElement>("#status-message")!;
  const customBangsTableBody =
    customBangUI.querySelector<HTMLTableSectionElement>(
      "#custom-bangs-table tbody"
    )!;
  const saveCustomBangsButton =
    customBangUI.querySelector<HTMLButtonElement>("#save-custom-bangs")!;

  function toggleTableVisibility() {
    const table = customBangUI.querySelector(".custom-bangs-table-container");
    if (customBangsTableBody.rows.length === 0) {
      table?.classList.add("hidden");
    } else {
      table?.classList.remove("hidden");
    }
  }

  const addCustomBangButton =
    app.querySelector<HTMLSpanElement>("#add-custom-bang")!;

  addCustomBangButton.addEventListener("click", () => {
    const newRow = customBangsTableBody.insertRow();

    const keyCell = newRow.insertCell();
    const keyInput = document.createElement("input");
    keyInput.type = "text";
    keyInput.name = "t";
    keyInput.placeholder = "Unique key (e.g., x)";
    keyInput.required = true;
    keyCell.appendChild(keyInput);
    keyInput.focus();

    const urlCell = newRow.insertCell();
    urlCell.innerHTML =
      '<input type="url" name="u" placeholder="Search URL, use {{{s}}} for query" required />' +
      '<button class="delete-row"><img src="/trash.svg" alt="Delete" /></button>';

    const deleteButton =
      newRow.querySelector<HTMLButtonElement>(".delete-row")!;
    deleteButton.addEventListener("click", () => {
      newRow.remove();
    });

    toggleTableVisibility();
  });

  saveCustomBangsButton.addEventListener("click", () => {
    statusMessage.classList.add("hidden");
    const result = saveCustomBangs(customBangsTableBody);

    statusMessage.classList.remove("hidden");
    statusMessage.classList.toggle("validation-success", result.success);
    statusMessage.textContent = result.message;

    if (result.success) {
      setTimeout(() => {
        statusMessage.classList.add("hidden");
        toggleTableVisibility();
      }, 3000);
    }
  });

  const customBangs = getCustomBangs();
  for (const customBang of customBangs) {
    const newRow = customBangsTableBody.insertRow();

    const keyCell = newRow.insertCell();
    keyCell.innerHTML = `<input type="text" name="t" placeholder="Unique key (e.g., x)" required value="${customBang.key}" />`;

    const searchURLCell = newRow.insertCell();
    searchURLCell.innerHTML =
      `<input type="url" name="u" placeholder="Search URL, use {{{s}}} for query" required value="${customBang.url}" />` +
      '<button class="delete-row"><img src="/trash.svg" alt="Delete" /></button>';

    // Mark this row as existing to prevent duplicate key validation on itself
    newRow.dataset.existing = "true";

    const deleteButton =
      newRow.querySelector<HTMLButtonElement>(".delete-row")!;
    deleteButton.addEventListener("click", () => {
      newRow.remove();
      toggleTableVisibility();
    });
  }

  toggleTableVisibility();
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
