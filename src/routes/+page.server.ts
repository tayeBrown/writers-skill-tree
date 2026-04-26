import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = ({ locals }) => {
	return {
		authenticated: locals.authenticated,
		editUrl: env.EDIT_URL ?? null,
		publicUrl: env.PUBLIC_URL ?? null
	};
};
