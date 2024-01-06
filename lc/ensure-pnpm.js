const kleur = require('kleur');

if (!process.env.PNPM_SCRIPT_SRC_DIR) {
	console.error(kleur.red('Error: running outside pnpm'));
	console.log(kleur.yellow('Note: Use PNPM to publish.'));
	process.exit(1);
}
