import type { Handle } from '@sveltejs/kit';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { env } from '$env/dynamic/private';

// jose handles JWKS key rotation internally via re-fetch on cache miss.
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
	if (!jwks) {
		jwks = createRemoteJWKSet(
			new URL(`https://${env.CF_TEAM_DOMAIN}.cloudflareaccess.com/cdn-cgi/access/certs`)
		);
	}
	return jwks;
}

export const handle: Handle = async ({ event, resolve }) => {
	if (!env.EDIT_HOST) {
		// Local dev: no subdomain setup, assume owner
		event.locals.authenticated = true;
		return resolve(event);
	}

	const host = event.request.headers.get('host') ?? event.url.host;

	if (host !== env.EDIT_HOST) {
		// Public subdomain: read-only
		event.locals.authenticated = false;
		return resolve(event);
	}

	// Edit subdomain: validate CF JWT injected by Cloudflare Access
	const token = event.request.headers.get('cf-access-jwt-assertion');

	if (!token) {
		event.locals.authenticated = false;
		return resolve(event);
	}

	try {
		const { payload } = await jwtVerify(token, getJwks(), {
			audience: env.CF_ACCESS_AUD,
			issuer: `https://${env.CF_TEAM_DOMAIN}.cloudflareaccess.com`
		});
		event.locals.authenticated = (payload['email'] as string | undefined) === env.OWNER_EMAIL;
	} catch {
		event.locals.authenticated = false;
	}

	return resolve(event);
};
