#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import scaffr from '../index';
import logger from '../logger';

const program = new Command();
program
	.name('scaffr')
	.version('0.0.1')
	.argument('<template>', 'Template path')
	.argument('<dest>', 'Destination path')
	.option('-o, --overwrite', 'Overwrite existing files')
	.description('Scaffold a new project');

const options = program.parse(process.argv);
const [templatePath, destPath] = options.args;

try {
	scaffr(templatePath, destPath, options.opts());
} catch (error) {
	if (error instanceof Error) {
		logger.error(chalk.red(error.message));
	}
	process.exit(1);
}
