import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema.js';
import { env } from '$env/dynamic/private';

const url = env.DATABASE_URL || 'file:local.db';
const authToken = env.DATABASE_AUTH_TOKEN || '';

const client = createClient({ url, authToken });

export const db = drizzle(client, { schema });
