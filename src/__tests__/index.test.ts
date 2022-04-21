import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import glob from 'glob';
import scaff from '../';

const testProjectName = 'ScaffreeTestProject';
const templatePath = path.resolve(__dirname, '../../examples/template');
const destPath = path.join(os.tmpdir(), testProjectName);

beforeAll(() => {
	scaff(templatePath, destPath);
});

afterAll(() => {
	fs.removeSync(destPath);
});

test('Scaffold a project', () => {
	const fileExists = fs.existsSync(
		path.join(destPath, `${testProjectName}.ts`),
	);
	expect(fileExists).toBe(true);

	// Check number of files generated
	const filesSrc = glob.sync('**/*', {
		cwd: templatePath,
		nodir: true,
	});
	const filesDest = glob.sync('**/*', {
		cwd: destPath,
		nodir: true,
	});

	expect(filesSrc.length).toBe(filesDest.length);
});

test('Overwrite', () => {
	// Should fail without overwrite flag
	expect(() => scaff(templatePath, destPath)).toThrow();

	// Should pass with overwrite flag
	expect(() =>
		scaff(templatePath, destPath, { overwrite: true }),
	).not.toThrow();
});
