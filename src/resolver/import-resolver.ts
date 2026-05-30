    import { existsSync, statSync } from 'fs';
    import { dirname, extname, join, relative, resolve } from 'path';
    import type { FileImportInfo, ParsedFileImportInfo, ParsedImportInfo } from '../shared/types';

    const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

    function toPosixPath(filePath: string): string {
      return filePath.split('\\').join('/');
    }

    function fileExists(filePath: string): boolean {
      try {
        return existsSync(filePath) && statSync(filePath).isFile();
      } catch {
        return false;
      }
    }

    function getCandidatePaths(basePath: string): string[] {
      if (SOURCE_EXTENSIONS.includes(extname(basePath))) {
        return [basePath];
      }

      return [
        ...SOURCE_EXTENSIONS.map((extension) => `${basePath}${extension}`),
        ...SOURCE_EXTENSIONS.map((extension) => join(basePath, `index${extension}`)),
      ];
    }

    function resolveRelativeImport(
      filePath: string,
      moduleSpecifier: string,
      projectPath: string
    ): string | null {
      const sourceDirectory = dirname(resolve(projectPath, filePath));
      const importBasePath = resolve(sourceDirectory, moduleSpecifier);
      const resolvedPath = getCandidatePaths(importBasePath).find(fileExists);

      if (!resolvedPath) {
        return null;
      }

      return toPosixPath(relative(projectPath, resolvedPath));
    }

    function resolveImport(
      filePath: string,
      importInfo: ParsedImportInfo,
      projectPath: string
    ): FileImportInfo['imports'][number] {
      if (!importInfo.isRelative) {
        return {
          ...importInfo,
          resolvedPath: null,
          isResolved: false,
        };
      }

      const resolvedPath = resolveRelativeImport(filePath, importInfo.moduleSpecifier, projectPath);

      return {
        ...importInfo,
        resolvedPath,
        isResolved: resolvedPath !== null,
      };
    }

    export function resolveFileImports(
      files: ParsedFileImportInfo[],
      projectPath: string
    ): FileImportInfo[] {
      return files.map((file) => ({
        filePath: file.filePath,
        imports: file.imports.map((importInfo) => resolveImport(file.filePath, importInfo, projectPath)),
      }));
    }
