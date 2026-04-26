import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadProgress, saveProgress } from '$lib/server/db';

// Intentionally public — visitors see the owner's progress read-only.
export const GET: RequestHandler = () => {
	return json({ completed: Array.from(loadProgress()) });
};

export const PATCH: RequestHandler = async ({ locals, request }) => {
	if (!locals.authenticated) {
		error(401, 'Unauthorized');
	}

	const body = (await request.json()) as { completed?: unknown };

	if (
		!Array.isArray(body?.completed) ||
		!body.completed.every((x) => typeof x === 'string')
	) {
		error(400, 'Invalid body');
	}

	saveProgress(new Set(body.completed as string[]));
	return json({ ok: true });
};
