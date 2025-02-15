export type CustomBang = {
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

export function getCustomBangs(): CustomBang[] {
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

export type SaveCustomBangsResult = {
  success: boolean;
  message: string;
};

export function saveCustomBangs(
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
