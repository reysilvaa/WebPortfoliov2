import path from 'node:path';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import tailwind from 'eslint-plugin-tailwindcss';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

const rootDir = import.meta.dirname ?? process.cwd();

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	...[].concat(tailwind.configs.recommended),
	prettier,
	...svelte.configs['flat/prettier'],
	{
		settings: {
			tailwindcss: {
				cssConfigPath: path.resolve(rootDir, 'src/routes/layout.css')
			}
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', '.vercel/', 'src/lib/paraglide/']
	}
);
