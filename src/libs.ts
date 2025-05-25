import { CONSTANTS } from "./main";

const createAudio = (src: string) => {
	const audio = new Audio();
	audio.src = src;
	return audio;
};

const storage = {
	get: (key: string) => localStorage.getItem(key),
	set: (key: string, value: string) => localStorage.setItem(key, value),
	remove: (key: string) => localStorage.removeItem(key),
};

const memoizedGetSearchHistory = (() => {
	let cache: Array<{
		query: string;
		bang: string;
		name: string;
		timestamp: number;
	}> | null = null;
	return () => {
		if (!cache) {
			cache = JSON.parse(
				storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_HISTORY) || "[]",
			);
		}
		return cache;
	};
})();

function addToSearchHistory(
	query: string,
	bang: { bang: string; name: string; url: string },
) {
	const history = memoizedGetSearchHistory();
	if (!history) return;

	history.unshift({
		query,
		bang: bang.bang,
		name: bang.name,
		timestamp: Date.now(),
	});
	history.splice(CONSTANTS.MAX_HISTORY);
	storage.set(
		CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_HISTORY,
		JSON.stringify(history),
	);
}

function getSearchHistory(): Array<{
	query: string;
	bang: string;
	name: string;
	timestamp: number;
}> {
	try {
		return JSON.parse(
			storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_HISTORY) || "[]",
		);
	} catch {
		return [];
	}
}

function clearSearchHistory() {
	storage.set(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_HISTORY, "[]");
}

export {
	createAudio,
	storage,
	memoizedGetSearchHistory,
	addToSearchHistory,
	getSearchHistory,
	clearSearchHistory,
};
