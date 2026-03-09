import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';

const authMiddleware: Handle = ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth, building });
};

const sessionMiddleware: Handle = async ({ event, resolve }) => {
	// Skip session check for auth API routes themselves to avoid redundancy
	if (event.url.pathname.startsWith('/api/auth')) {
		return resolve(event);
	}

	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		// Restriction: Only allow the owner (identified by email or name)
		const ALLOWED_EMAILS = [env.GITHUB_EMAIL];
		const isOwner =
			ALLOWED_EMAILS.includes(session.user.email) || session.user.name === 'Rey Silva';

		if (isOwner) {
			event.locals.session = session.session;
			event.locals.user = session.user;
		}
	}

	return resolve(event);
};

export const handle = sequence(authMiddleware, sessionMiddleware);
