import chalk from 'chalk';
import path from 'path';
import glob from 'glob';
import fs from 'fs-extra';
import { isBinaryFileSync } from 'isbinaryfile';
import _ from 'lodash';
import logger from './logger';

const resolvePath = (pathStr: string) => {
	return pathStr.startsWith('/')
		? pathStr
		: path.resolve(process.cwd(), pathStr);
};

interface IScaffrOptions {
	overwrite?: boolean;
}

const defaultOptions: IScaffrOptions = {
	overwrite: false,
};

/**
 * Generates files and folders from a template.
 */
const scaffr = (template: string, dest = '.', options: IScaffrOptions = {}) => {
	const opts = {
		...defaultOptions,
		...options,
	};
	const destPath = resolvePath(dest);
	const templatePath = resolvePath(template);
	const name = path.basename(destPath);

	logger.info(chalk.magenta('Validating...'));

	if (!fs.pathExistsSync(templatePath)) {
		throw new Error(`Template ${templatePath} does not exist.`);
	}

	if (fs.pathExistsSync(destPath) && opts.overwrite !== true) {
		throw new Error(`Destination ${destPath} already exists.`);
	}

	logger.info(
		chalk.yellow(
			`Initializing destination folder ${chalk.bold(destPath)}...`,
		),
	);
	fs.ensureDirSync(destPath);

	const files = glob.sync('**/*', {
		cwd: templatePath,
		nodir: true,
	});
	const compileString = (str: string) => {
		const compile = _.template(str, {
			interpolate: /{{([\s\S]+?)}}/g,
		});
		return compile({
			_,
			name,
			destPath,
			templatePath,
		});
	};

	files.forEach((file) => {
		const fileName = compileString(file);
		const filePath = path.join(destPath, fileName);
		const srcPath = path.join(templatePath, file);

		logger.info(chalk.yellow(`Creating ${chalk.bold(filePath)}...`));
		fs.ensureFileSync(filePath); // Creates intermediate folders
		if (!isBinaryFileSync(srcPath)) {
			// Process content
			const fileContent = fs.readFileSync(srcPath, 'utf8');
			fs.writeFileSync(filePath, compileString(fileContent));
		} else {
			// No processing for binary files
			fs.copySync(srcPath, filePath, {
				recursive: false,
			});
		}
	});
};

export default scaffr;
