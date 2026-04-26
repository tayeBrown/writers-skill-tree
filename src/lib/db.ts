const DB_NAME = 'wst';
const DB_VERSION = 1;
const STORE_NAME = 'progress';
const RECORD_KEY = 'completed';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDatabase(): Promise<IDBDatabase> {
	if (!dbPromise) {
		dbPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					db.createObjectStore(STORE_NAME);
				}
			};

			request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
			request.onerror = (event) => {
				dbPromise = null;
				reject((event.target as IDBOpenDBRequest).error);
			};
		});
	}
	return dbPromise;
}

export function closeDatabase(): void {
	if (dbPromise) {
		dbPromise.then((db) => db.close()).catch(() => {});
		dbPromise = null;
	}
}

export async function loadProgress(): Promise<Set<string>> {
	const db = await getDatabase();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get(RECORD_KEY);

		request.onsuccess = (event) => {
			const result = (event.target as IDBRequest<string[]>).result;
			resolve(new Set(result ?? []));
		};
		request.onerror = (event) => reject((event.target as IDBRequest).error);
	});
}

export async function saveProgress(completed: Set<string>): Promise<void> {
	const db = await getDatabase();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.put(Array.from(completed), RECORD_KEY);

		request.onsuccess = () => resolve();
		request.onerror = (event) => reject((event.target as IDBRequest).error);
	});
}
