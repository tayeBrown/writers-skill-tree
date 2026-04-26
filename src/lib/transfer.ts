import { nodeMap } from './state';

const EXPORT_VERSION = 1;

interface ProgressFile {
	version: number;
	exportedAt: string;
	completedNodes: string[];
}

function isProgressFile(value: unknown): value is ProgressFile {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;
	return (
		obj.version === EXPORT_VERSION &&
		typeof obj.exportedAt === 'string' &&
		Array.isArray(obj.completedNodes) &&
		obj.completedNodes.every((entry) => typeof entry === 'string')
	);
}

export function exportProgress(completed: Set<string>): void {
	const payload: ProgressFile = {
		version: EXPORT_VERSION,
		exportedAt: new Date().toISOString(),
		completedNodes: Array.from(completed)
	};

	const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = 'wst-progress.json';
	anchor.click();
	URL.revokeObjectURL(url);
}

export type ImportResult =
	| { ok: true; completed: Set<string>; unknownIds: string[] }
	| { ok: false; error: string };

export async function importProgress(file: File): Promise<ImportResult> {
	let parsed: unknown;

	try {
		const text = await file.text();
		parsed = JSON.parse(text);
	} catch {
		return { ok: false, error: 'The file could not be read as JSON.' };
	}

	if (!isProgressFile(parsed)) {
		return {
			ok: false,
			error: 'The file does not look like a valid wst progress export.'
		};
	}

	const unknownIds: string[] = [];
	const completed = new Set<string>();

	for (const id of parsed.completedNodes) {
		if (nodeMap.has(id)) {
			completed.add(id);
		} else {
			unknownIds.push(id);
		}
	}

	return { ok: true, completed, unknownIds };
}
