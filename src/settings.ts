import {
  getCustomBangs,
  saveCustomBangs,
  deleteCustomBang,
  getDefaultBang,
  saveDefaultBang,
} from "./utils";
import "./global.css";
import { Footer } from "./components/footer";
import { openModal } from "./components/modal";

function renderCustomBangsUI() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  let defaultBang = getDefaultBang();

  app.innerHTML = `
    <header class="site-header">
      <a href="/" class="btn border-none">
        <img src="/arrow-left.svg" alt="Back" style="vertical-align: middle; margin-right: 0.5rem;" />
        <span>Back to Unduck</span>
      </a>
    </header>
    <main id="settings">
      <div>
        <h3>Default Bang</h3>
        <input type="text" id="default-bang" name="default-bang" class="url-input" placeholder="e.g. g" value="${defaultBang}" />
      </div>

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
        </div>
        <div id="status-message" class="status-message"></div>
      </div>
    </main>
    ${Footer()}
  `;

  const defaultBangInput =
    app.querySelector<HTMLInputElement>("#default-bang")!;
  defaultBangInput.addEventListener("change", (event) => {
    const newDefaultBang = (event.target as HTMLInputElement).value;
    saveDefaultBang(newDefaultBang);
    defaultBang = newDefaultBang;
    renderCustomBangsUI();
  });

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
    openModal(`
      <div id="add-custom-bang-modal" class="custom-bang-modal">
        <h3>Add Custom Bang</h3>
        <div class="custom-bang-modal-field">
          <label for="key" class="custom-bang-modal-label">Key</label>
          <input type="text" id="key" name="key" class="url-input" placeholder="e.g. gh">
        </div>
        <div class="custom-bang-modal-field">
          <label for="url" class="custom-bang-modal-label">URL</label>
          <input type="text" id="url" name="url" class="url-input" placeholder="e.g. https://github.com/search?q=%s">
        </div>
        <div class="custom-bang-modal-actions">
          <button id="modal-save" class="btn">Save</button>
        </div>
      </div>
    `);

    const modal = document.querySelector(".modal");
    if (!modal) return;

    const modalSaveButton =
      modal.querySelector<HTMLButtonElement>("#modal-save")!;
    if (!modalSaveButton) return;

    modalSaveButton.addEventListener("click", () => {
      const keyInput = modal.querySelector<HTMLInputElement>("#key")!;
      const urlInput = modal.querySelector<HTMLInputElement>("#url")!;
      const key = keyInput.value;
      const url = urlInput.value;

      if (key && url) {
        console.log(saveCustomBangs([...getCustomBangs(), { key, url }]));
        renderCustomBangsUI();
        modal.remove();
      }
    });
  });

  const customBangs = getCustomBangs();
  for (const customBang of customBangs) {
    const newRow = customBangsTableBody.insertRow();

    const keyCell = newRow.insertCell();
    keyCell.innerHTML = `<span class="bang-key">!${customBang.key}</span>`;

    const urlCell = newRow.insertCell();
    urlCell.innerHTML = `
      <div class="url-cell">
        <span class="bang-url">${customBang.url}</span>
        <button id="delete-custom-bang-button" class="icon-button">
          <img src="/trash.svg" alt="Delete" />
        </button>
      </div>
    `;

    // Mark this row as existing to prevent duplicate key validation on itself
    newRow.dataset.existing = "true";

    const deleteButton = newRow.querySelector<HTMLButtonElement>(
      "#delete-custom-bang-button"
    )!;
    deleteButton.addEventListener("click", () => {
      const key = customBang.key;
      deleteCustomBang(key);
      newRow.remove();
      toggleTableVisibility();
    });
  }

  toggleTableVisibility();
}

renderCustomBangsUI();
