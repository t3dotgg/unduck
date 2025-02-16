export type CustomBang = {
  key: string;
  url: string;
};

const LS_CUSTOM_BANG_KEY = "custom-bangs";
const LS_DEFAULT_BANG_KEY = "default-bang";

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
  customBangs: CustomBang[]
): SaveCustomBangsResult {
  try {
    const seenKeys = new Set<string>();

    for (const { key, url } of customBangs) {
      if (seenKeys.has(key)) {
        return {
          success: false,
          message: `Duplicate key "${key}" found in table`,
        };
      }
      seenKeys.add(key);

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

export function deleteCustomBang(key: string): void {
  const customBangs = getCustomBangs();

  const updatedBangs = customBangs.filter((bang) => bang.key !== key);

  localStorage.setItem(LS_CUSTOM_BANG_KEY, JSON.stringify(updatedBangs));
}

export function getDefaultBang(): string {
  const storedValue = localStorage.getItem(LS_DEFAULT_BANG_KEY);
  return storedValue || "g";
}

export function saveDefaultBang(defaultBang: string): void {
  localStorage.setItem(LS_DEFAULT_BANG_KEY, defaultBang);
}
