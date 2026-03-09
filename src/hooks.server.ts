import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';
import 'dotenv/config';

export const handle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		// Restriction: Only allow @reysilvaa (identified by email or name)
		const ALLOWED_EMAILS = [process.env.GITHUB_EMAIL]; // Add your github email here
		const isOwner = ALLOWED_EMAILS.includes(session.user.email) || session.user.name === 'Rey Silva';

		if (isOwner) {
			event.locals.session = session.session;
			event.locals.user = session.user;
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
};
