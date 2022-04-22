import chalk from 'chalk';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import glob from 'glob';
import fs from 'fs-extra';
import { isBinaryFileSync } from 'isbinaryfile';
import download from 'download';
import _ from 'lodash';
import logger from './logger';

const resolvePath = (pathStr: string) => {
	return pathStr.startsWith('/')
		? pathStr
		: path.resolve(process.cwd(), pathStr);
};

interface IScaffrOptions {
	overwrite?: boolean;
	failOnCompileError?: boolean;
}

const defaultOptions: IScaffrOptions = {
	overwrite: false,
	failOnCompileError: true,
};

/**
 * Generates files and folders from a template.
 */
const scaffr = async (
	template: string,
	dest = '.',
	options: IScaffrOptions = {},
) => {
	const opts = {
		...defaultOptions,
		...options,
	};
	const isURL =
		template.startsWith('http://') || template.startsWith('https://');
	const destPath = resolvePath(dest);
	const name = path.basename(destPath);
	const templatePath = isURL
		? path.join(
				os.tmpdir(),
				crypto.createHash('md5').update(template).digest('hex'),
		  )
		: resolvePath(template);

	logger.info(chalk.magenta('Validating...'));

	if (!isURL && !fs.pathExistsSync(templatePath)) {
		throw new Error(`Template ${templatePath} does not exist.`);
	}

	if (fs.pathExistsSync(destPath) && opts.overwrite !== true) {
		throw new Error(`Destination ${destPath} already exists.`);
	}

	// Download template if it's a URL
	if (isURL) {
		chalk.magenta(`Downloading ${chalk.bold(template)}...`);
		await download(template, templatePath, {
			extract: true,
		});
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
		try {
			const compile = _.template(str, {
				interpolate: /{{([\s\S]+?)}}/g,
			});

			return compile({
				_,
				name,
				destPath,
				templatePath,
			});
		} catch (error) {
			if (opts.failOnCompileError) {
				throw new Error(`Template compilation error: ${error}`);
			}
			logger.error(chalk.red('Template compilation error', error));
			return str;
		}
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

	// Cleanup
	if (isURL) {
		fs.removeSync(templatePath);
	}
};

export default scaffr;
