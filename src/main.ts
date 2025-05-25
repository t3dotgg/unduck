import { bangs } from "./bangs/hashbang.ts";
import {
	addToSearchHistory,
	clearSearchHistory,
	createAudio,
	getSearchHistory,
	storage,
} from "./libs.ts";

import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "./global.css";
import notFoundPageRender from "./404.ts";

export const CONSTANTS = {
	MAX_HISTORY: 500,
	ANIMATION_DURATION: 375,
	LOCAL_STORAGE_KEYS: {
		SEARCH_HISTORY: "search-history",
		SEARCH_COUNT: "search-count",
		HISTORY_ENABLED: "history-enabled",
		DEFAULT_BANG: "default-bang",
		CUSTOM_BANGS: "custom-bangs",
	},
	CUTIES: {
		NOTFOUND: [
			"(╯︵╰,)",
			"(｡•́︿•̀｡)",
			"(⊙_☉)",
			"(╯°□°）╯︵ ┻━┻",
			"(ಥ﹏ಥ)",
			"(✿◕‿◕✿)",
			"(╥﹏╥)",
			"(｡•́︿•̀｡)",
			"(✧ω✧)",
			"(•́_•̀)",
			"(╯°□°）╯︵ ┻━┻",
		],
		LEFT: ["╰（°□°╰）", "(◕‿◕´)", "(・ω・´)"],
		RIGHT: ["(╯°□°）╯", "(｀◕‿◕)", "(｀・ω・)"],
		UP: ["(↑°□°)↑", "(´◕‿◕)↑", "↑(´・ω・)↑"],
		DOWN: ["(↓°□°)↓", "(´◕‿◕)↓", "↓(´・ω・)↓"],
	},
};
const customBangs: {
	[key: string]: {
		c?: string;
		d: string;
		r: number;
		s: string;
		sc?: string;
		t: string;
		u: string;
	};
} = JSON.parse(localStorage.getItem("custom-bangs") || "{}");

function getFocusableElements(
	root: HTMLElement = document.body,
): HTMLElement[] {
	return Array.from(
		root.querySelectorAll<HTMLElement>(
			'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
		),
	);
}

function setOutsideElementsTabindex(modal: HTMLElement, tabindex: number) {
	const modalElements = getFocusableElements(modal);
	const allElements = getFocusableElements();

	for (const element of allElements) {
		if (!modalElements.includes(element)) {
			element.setAttribute("tabindex", tabindex.toString());
		}
	}
}

const createTemplate = (data: {
	searchCount: string;
	historyEnabled: boolean;
	searchHistory: Array<{
		bang: string;
		query: string;
		name: string;
		timestamp: number;
	}>;
	LS_DEFAULT_BANG: string;
}) => `
	<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
		<header style="position: absolute; top: 1rem; width: 100%;">
			<div style="display: flex; justify-content: space-between; padding: 0 1rem;">
				<span>${data.searchCount} ${data.searchCount === "1" ? "search" : "searches"}</span>
				<button class="settings-button">
					<img src="/gear.svg" alt="Settings" class="settings" />
				</button>
			</div>
		</header>
		<div class="content-container">
			<h1 id="cutie">┐( ˘_˘ )┌</h1>
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
				${
					data.historyEnabled
						? `
							<h2 style="margin-top: 24px;">Recent Searches</h2>
							<div style="max-height: 200px; overflow-y: auto; text-align: left;">
							${
								data.searchHistory.length === 0
									? `<div style="padding: 8px; text-align: center;">No search history</div>`
									: data.searchHistory
											.map(
												(search) => `
													<div style="padding: 8px; border-bottom: 1px solid var(--border-color);">
														<a href="?q=!${search.bang} ${search.query}">${search.name}: ${search.query}</a>
														<span style="float: right; color: var(--text-color-secondary);">
															${new Date(search.timestamp).toLocaleString()}
														</span>
													</div>
											`,
											)
											.join("")
							}
							</div>
						`
						: ""
				}
		</div>
		<footer class="footer">
			made with ♥ by <a href="https://github.com/taciturnaxolotl" target="_blank">Kieran Klukas</a> as <a href="https://github.com/taciturnaxolotl/unduck" target="_blank">open source</a> software
		</footer>
		<div class="modal" id="settings-modal">
			<div class="modal-content">
					<button class="close-modal">&times;</button>
					<h2>Settings</h2>
					<div class="settings-section">
					    <h3>Bangs</h3>
							<label for="default-bang" id="bang-description">Default Bang: ${bangs[data.LS_DEFAULT_BANG].s || "Unknown bang"}</label>
							<div class="bang-select-container">
									<input type="text" id="default-bang" class="bang-select" value="${data.LS_DEFAULT_BANG}">
							</div>
							<p class="help-text">The best way to add new bangs is by submitting them on <a href="https://duckduckgo.com/newbang" target="_blank">DuckDuckGo</a> but you can also add them below</p>
							<div style="margin-top: 16px;">
								<h4>Add Custom Bang</h4>
								<div class="custom-bang-inputs">
									<input type="text" placeholder="Bang name" id="bang-name" class="bang-name">
									<input type="text" placeholder="Shortcut (e.g. !ddg)" id="bang-shortcut" class="bang-shortcut">
									<input type="text" placeholder="Search URL with {{{s}}}" id="bang-search-url" class="bang-search-url">
									<input type="text" placeholder="Base domain" id="bang-base-url" class="bang-base-url">
									<div style="text-align: right;">
										<button class="add-bang">Add Bang</button>
									</div>
								</div>
								${
									Object.keys(customBangs).length > 0
										? `
  								<h4>Your Custom Bangs</h4>
  								<div class="custom-bangs-list">
  								${Object.entries(customBangs)
										.map(
											([shortcut, bang]) => `
  									<div class="custom-bang-item">
   									<table class="custom-bang-info">
   											<tr>
  												<td class="custom-bang-name">${bang.t}</td>
  												<td class="custom-bang-shortcut"><code>!${shortcut}</code></td>
  												<td class="custom-bang-base">${bang.d}</td>
   											</tr>
   									</table>
  										<div class="custom-bang-url">${bang.u}</div>
  										<button class="remove-bang" data-shortcut="${shortcut}">Remove</button>
  									</div>
  								`,
										)
										.join("")}
  								</div>
								`
										: ""
								}
							</div>
					</div>
					<div class="settings-section">
							<h3>Search History (${data.searchHistory.length}/500)</h3>
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<label class="switch">
										<label for="history-toggle">Enable Search History</label>
										<input type="checkbox" id="history-toggle" ${data.historyEnabled ? "checked" : ""}>
										<span class="slider round"></span>
									</label>
									<button class="clear-history">Clear History</button>
							</div>
					</div>
				</div>
			</div>
		</div>
	</div>
`;

function noSearchDefaultPageRender() {
	const searchCount =
		storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_COUNT) || "0";
	const historyEnabled =
		storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.HISTORY_ENABLED) === "true";
	const searchHistory = getSearchHistory();
	const app = document.querySelector<HTMLDivElement>("#app");
	if (!app) throw new Error("App element not found");

	app.innerHTML = createTemplate({
		searchCount,
		historyEnabled,
		searchHistory,
		LS_DEFAULT_BANG,
	});

	const elements = {
		app,
		cutie: app.querySelector<HTMLHeadingElement>("#cutie"),
		copyInput: app.querySelector<HTMLInputElement>(".url-input"),
		copyButton: app.querySelector<HTMLButtonElement>(".copy-button"),
		copyIcon: app.querySelector<HTMLImageElement>(".copy-button img"),
		urlInput: app.querySelector<HTMLInputElement>(".url-input"),
		settingsButton: app.querySelector<HTMLButtonElement>(".settings-button"),
		modal: app.querySelector<HTMLDivElement>("#settings-modal"),
		closeModal: app.querySelector<HTMLSpanElement>(".close-modal"),
		defaultBangSelect: app.querySelector<HTMLSelectElement>("#default-bang"),
		description: app.querySelector<HTMLParagraphElement>("#bang-description"),
		historyToggle: app.querySelector<HTMLInputElement>("#history-toggle"),
		clearHistory: app.querySelector<HTMLButtonElement>(".clear-history"),
		bangName: app.querySelector<HTMLInputElement>(".bang-name"),
		bangShortcut: app.querySelector<HTMLInputElement>(".bang-shortcut"),
		bangSearchUrl: app.querySelector<HTMLInputElement>(".bang-search-url"),
		bangBaseUrl: app.querySelector<HTMLInputElement>(".bang-base-url"),
		addBang: app.querySelector<HTMLButtonElement>(".add-bang"),
		removeBangs: app.querySelectorAll<HTMLButtonElement>(".remove-bang"),
	} as const;

	// Validate all elements exist
	for (const [key, element] of Object.entries(elements)) {
		if (!element) throw new Error(`${key} not found`);
	}

	// After validation, we can assert elements are non-null
	const validatedElements = elements as {
		[K in keyof typeof elements]: NonNullable<(typeof elements)[K]>;
	};

	validatedElements.urlInput.value = `${window.location.protocol}//${window.location.host}?q=%s`;

	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	if (!prefersReducedMotion) {
		// Add mouse tracking behavior
		document.addEventListener("click", (e) => {
			const x = e.clientX;
			const y = e.clientY;
			const centerX = window.innerWidth / 2;
			const centerY = window.innerHeight / 2;
			const differenceX = x - centerX;
			const differenceY = y - centerY;

			if (
				Math.abs(differenceX) > Math.abs(differenceY) &&
				Math.abs(differenceX) > 100
			) {
				validatedElements.cutie.textContent =
					differenceX < 0
						? CONSTANTS.CUTIES.LEFT[
								Math.floor(Math.random() * CONSTANTS.CUTIES.LEFT.length)
							]
						: CONSTANTS.CUTIES.RIGHT[
								Math.floor(Math.random() * CONSTANTS.CUTIES.RIGHT.length)
							];
			} else if (Math.abs(differenceY) > 100) {
				validatedElements.cutie.textContent =
					differenceY < 0
						? CONSTANTS.CUTIES.UP[
								Math.floor(Math.random() * CONSTANTS.CUTIES.UP.length)
							]
						: CONSTANTS.CUTIES.DOWN[
								Math.floor(Math.random() * CONSTANTS.CUTIES.DOWN.length)
							];
			}
		});

		const audio = {
			spin: createAudio("/heavier-tick-sprite.mp3"),
			toggleOff: createAudio("/toggle-button-off.mp3"),
			toggleOn: createAudio("/toggle-button-on.mp3"),
			click: createAudio("/click-button.mp3"),
			warning: createAudio("/double-button.mp3"),
			copy: createAudio("/foot-switch.mp3"),
		};

		validatedElements.copyButton.addEventListener("click", () => {
			audio.copy.currentTime = 0;
			audio.copy.play();
		});

		validatedElements.settingsButton.addEventListener("mouseenter", () => {
			audio.spin.play();
		});

		validatedElements.settingsButton.addEventListener("mouseleave", () => {
			audio.spin.pause();
			audio.spin.currentTime = 0;
		});

		validatedElements.historyToggle.addEventListener("change", () => {
			if (validatedElements.historyToggle.checked) {
				audio.toggleOff.pause();
				audio.toggleOff.currentTime = 0;
				audio.toggleOn.currentTime = 0;
				audio.toggleOn.play();
			} else {
				audio.toggleOn.pause();
				audio.toggleOn.currentTime = 0;
				audio.toggleOff.currentTime = 0;
				audio.toggleOff.play();
			}
		});

		validatedElements.clearHistory.addEventListener("click", () => {
			audio.warning.play();
		});

		validatedElements.defaultBangSelect.addEventListener("bangError", () => {
			audio.warning.currentTime = 0;
			audio.warning.play();
		});

		validatedElements.defaultBangSelect.addEventListener("bangSuccess", () => {
			audio.click.currentTime = 0;
			audio.click.play();
		});

		validatedElements.closeModal.addEventListener("closed", () => {
			validatedElements.settingsButton.classList.remove("rotate");
			audio.spin.playbackRate = 0.7;
			audio.spin.currentTime = 0;
			audio.spin.play();
			audio.spin.onended = () => {
				audio.spin.playbackRate = 1;
			};
		});

		validatedElements.addBang.addEventListener("click", () => {
			audio.click.currentTime = 0.1;
			audio.click.playbackRate = 2;
			audio.click.play();
		});

		validatedElements.removeBangs.forEach((button) => {
			button.addEventListener("click", () => {
				audio.warning.currentTime = 0;
				audio.warning.play();
			});
		});
	}

	validatedElements.copyButton.addEventListener("click", async () => {
		await navigator.clipboard.writeText(validatedElements.urlInput.value);
		validatedElements.copyIcon.src = "/clipboard-check.svg";

		if (!prefersReducedMotion)
			validatedElements.copyInput.classList.add("flash-white");

		setTimeout(() => {
			validatedElements.copyInput.classList.remove("flash-white");
			validatedElements.copyIcon.src = "/clipboard.svg";
		}, 375);
	});

	validatedElements.settingsButton.addEventListener("click", () => {
		validatedElements.settingsButton.classList.add("rotate");
		validatedElements.modal.style.display = "block";
		setOutsideElementsTabindex(validatedElements.modal, -1);
	});

	validatedElements.closeModal.addEventListener("click", () => {
		validatedElements.closeModal.dispatchEvent(new Event("closed"));
	});

	window.addEventListener("click", (event) => {
		if (event.target === validatedElements.modal) {
			validatedElements.closeModal.dispatchEvent(new Event("closed"));
		}
	});

	validatedElements.closeModal.addEventListener("closed", () => {
		validatedElements.modal.style.display = "none";
		setOutsideElementsTabindex(validatedElements.modal, 0);

		if (validatedElements.historyToggle.checked !== historyEnabled)
			if (!prefersReducedMotion)
				setTimeout(() => {
					window.location.reload();
				}, 300);
			else window.location.reload();
	});

	validatedElements.defaultBangSelect.addEventListener("change", (event) => {
		const newDefaultBang = (event.target as HTMLSelectElement).value.replace(
			/^!+/,
			"",
		);
		const bang = customBangs[newDefaultBang] || bangs[newDefaultBang];

		if (!bang) {
			validatedElements.defaultBangSelect.value = LS_DEFAULT_BANG;
			validatedElements.defaultBangSelect.classList.add("shake", "flash-red");
			validatedElements.defaultBangSelect.dispatchEvent(
				new CustomEvent("bangError"),
			);
			setTimeout(() => {
				validatedElements.defaultBangSelect.classList.remove(
					"shake",
					"flash-red",
				);
			}, 300);
			return;
		}

		validatedElements.defaultBangSelect.dispatchEvent(
			new CustomEvent("bangSuccess"),
		);
		storage.set(CONSTANTS.LOCAL_STORAGE_KEYS.DEFAULT_BANG, newDefaultBang);
		validatedElements.description.innerText = "Default Bang: " + bang.s;
	});

	validatedElements.historyToggle.addEventListener("change", (event) => {
		storage.set(
			CONSTANTS.LOCAL_STORAGE_KEYS.HISTORY_ENABLED,
			(event.target as HTMLInputElement).checked.toString(),
		);
	});

	validatedElements.clearHistory.addEventListener("click", () => {
		clearSearchHistory();
		if (!prefersReducedMotion)
			setTimeout(() => {
				window.location.reload();
			}, 375);
		else window.location.reload();
	});

	validatedElements.addBang.addEventListener("click", () => {
		const name = validatedElements.bangName.value.trim();
		const shortcut = validatedElements.bangShortcut.value
			.trim()
			.replace(/^!+/, "");
		const searchUrl = validatedElements.bangSearchUrl.value.trim();
		const baseUrl = validatedElements.bangBaseUrl.value.trim();

		if (!name || !searchUrl || !baseUrl) return;

		customBangs[shortcut] = {
			t: name,
			s: shortcut,
			u: searchUrl,
			d: baseUrl,
			r: 0,
		};
		storage.set(
			CONSTANTS.LOCAL_STORAGE_KEYS.CUSTOM_BANGS,
			JSON.stringify(customBangs),
		);

		if (!prefersReducedMotion)
			setTimeout(() => {
				window.location.reload();
			}, 375);
		else window.location.reload();
	});

	validatedElements.removeBangs.forEach((button) => {
		button.addEventListener("click", (event) => {
			const shortcut = (event.target as HTMLButtonElement).dataset
				.shortcut as string;
			delete customBangs[shortcut];
			storage.set(
				CONSTANTS.LOCAL_STORAGE_KEYS.CUSTOM_BANGS,
				JSON.stringify(customBangs),
			);

			if (!prefersReducedMotion)
				setTimeout(() => {
					window.location.reload();
				}, 375);
			else window.location.reload();
		});
	});
}

const LS_DEFAULT_BANG =
	storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.DEFAULT_BANG) ?? "ddg";
const defaultBang = bangs[LS_DEFAULT_BANG];

function ensureProtocol(url: string, defaultProtocol = "https://") {
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.href; // If valid, return as is
	} catch (e) {
		return `${defaultProtocol}${url}`;
	}
}

function getBangredirectUrl() {
	const url = new URL(window.location.href);
	const query = url.searchParams.get("q")?.trim() ?? "";

	switch (url.pathname.replace(/\/$/, "")) {
		case "": {
			if (!query || query === "!" || query === "!settings") {
				noSearchDefaultPageRender();
				return null;
			}

			const count = (
				Number.parseInt(
					storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_COUNT) || "0",
				) + 1
			).toString();
			storage.set(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_COUNT, count);

			const match = query.toLowerCase().match(/^!(\S+)|!(\S+)$/i);
			const selectedBang = match
				? customBangs[match[1] || match[2]] || bangs[match[1] || match[2]]
				: defaultBang;
			const cleanQuery = match
				? query.replace(/!\S+\s*|^(\S+!|!\S+)$/i, "").trim()
				: query;

			// Redirect to base domain if cleanQuery is empty
			if (!cleanQuery && selectedBang?.d) {
				return ensureProtocol(selectedBang.d);
			}

			if (
				storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.HISTORY_ENABLED) === "true"
			) {
				addToSearchHistory(cleanQuery, {
					bang: selectedBang?.t || "",
					name: selectedBang?.s || "",
					url: selectedBang?.u || "",
				});
			}

			return selectedBang?.u.replace(
				"{{{s}}}",
				encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
			);
		}
		default:
			notFoundPageRender();
			return null;
	}
}

function doRedirect() {
	const searchUrl = getBangredirectUrl();
	if (!searchUrl) return;
	window.location.replace(searchUrl);
}

doRedirect();
