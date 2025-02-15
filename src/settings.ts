import { getCustomBangs, saveCustomBangs } from "./utils";
import "./global.css";
import { Footer } from "./components/footer";

window.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  renderCustomBangsUI(app);
});

function renderCustomBangsUI(app: HTMLDivElement) {
  app.innerHTML = `
    <header class="site-header">
      <a href="/" class="btn border-none">
        <img src="/arrow-left.svg" alt="Back" style="vertical-align: middle; margin-right: 0.5rem;" />
        <span>Back to Unduck</span>
      </a>
    </header>
    <main>
      <div class="custom-bangs-header">
        <h3 class="custom-bangs-heading">Custom Bangs</h3>
        <span id="add-custom-bang" class="btn">+ Add</span>
      </div>
      <div id="custom-bang-ui">
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
          <button id="save-custom-bangs" class="btn">Save</button>
        </div>
      </div>
    </main>
    ${Footer()}
  `;

  const customBangUI =
    document.querySelector<HTMLDivElement>("#custom-bang-ui")!;
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
      '<button id="delete-custom-bang-button" class="icon-button"><img src="/trash.svg" alt="Delete" /></button>';

    const deleteButton = newRow.querySelector<HTMLButtonElement>(
      "#delete-custom-bang-button"
    )!;
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
      '<button id="delete-custom-bang-button" class="icon-button"><img src="/trash.svg" alt="Delete" /></button>';

    // Mark this row as existing to prevent duplicate key validation on itself
    newRow.dataset.existing = "true";

    const deleteButton = newRow.querySelector<HTMLButtonElement>(
      "#delete-custom-bang-button"
    )!;
    deleteButton.addEventListener("click", () => {
      newRow.remove();
      toggleTableVisibility();
    });
  }

  toggleTableVisibility();
}
