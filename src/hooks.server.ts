import { auth } from '$lib/server/auth';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

const SECURITY_HEADERS: Record<string, string> = {
	'Content-Security-Policy': [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline'",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"font-src 'self' https://fonts.gstatic.com",
		"img-src 'self' data: https://github.com https://avatars.githubusercontent.com https://*.githubusercontent.com https://i.ibb.co.com https://*.ibb.co https://api.microlink.io https://assets.website-files.com https://udemy-certificate.s3.amazonaws.com",
		"connect-src 'self'",
		"object-src 'none'",
		"base-uri 'self'",
		"frame-ancestors 'none'",
		"form-action 'self'"
	].join('; '),
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'Referrer-Policy': 'strict-origin-when-cross-origin'
};

export const handle: Handle = async ({ event, resolve }) => {
	event.setHeaders(dev ? { 'X-Content-Type-Options': 'nosniff' } : SECURITY_HEADERS);

	if (event.url.pathname.startsWith('/api/auth')) {
		return resolve(event);
	}

	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		if (env.GITHUB_EMAIL && session.user.email === env.GITHUB_EMAIL) {
			event.locals.session = session.session;
			event.locals.user = session.user;
		}
	}

	return resolve(event);
};
