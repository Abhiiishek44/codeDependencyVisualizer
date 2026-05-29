import { readdir } from 'fs/promises';
import { extname, join, relative } from 'path';

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);
const IGNORED_DIRECTORIES = new Set([
  'node_modules',
  'dist',
  'build',
  'out',
  '.git',
  '.next',
  'coverage',
]);

function toPosixPath(filePath: string): string {
  return filePath.split('\\').join('/');
}

export async function scanProjectFiles(projectPath: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(directoryPath: string): Promise<void> {
    const entries = await readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;

      const entryPath = join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name)) continue;
        await walk(entryPath);
        continue;
      }

      if (entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name))) {
        files.push(toPosixPath(relative(projectPath, entryPath)));
      }
    }
  }

  await walk(projectPath);
  return files.sort();
}
