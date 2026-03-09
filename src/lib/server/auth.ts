import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL || (env.ORIGIN ? `${env.ORIGIN}/api/auth` : undefined),
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: { enabled: false },
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET
		}
	},
	trustedOrigins: [env.BETTER_AUTH_URL, env.ORIGIN].filter(Boolean) as string[],
	plugins: [sveltekitCookies(getRequestEvent)]
});
