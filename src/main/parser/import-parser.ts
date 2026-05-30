import { isAbsolute, resolve } from 'path';
import { Project } from 'ts-morph';
import type { ParsedFileImportInfo } from '../../shared/types';

function resolveFilePath(filePath: string, cwd?: string): string {
  if (isAbsolute(filePath)) {
    return filePath;
  }

  return resolve(cwd ?? process.cwd(), filePath);
}

function isRelativeImport(moduleSpecifier: string): boolean {
  return moduleSpecifier.startsWith('.');
}

export async function parseFileImports(
  filePaths: string[],
  cwd?: string
): Promise<ParsedFileImportInfo[]> {
  const project = new Project({
    compilerOptions: {
      allowJs: true,
    },
    skipFileDependencyResolution: true,
  });

  return filePaths.map((filePath) => {
    const sourceFile = project.addSourceFileAtPathIfExists(resolveFilePath(filePath, cwd));

    if (!sourceFile) {
      throw new Error(`Source file not found: ${filePath}`);
    }

    return {
      filePath,
      imports: sourceFile.getImportDeclarations().map((declaration) => {
        const moduleSpecifier = declaration.getModuleSpecifierValue();

        return {
          moduleSpecifier,
          isRelative: isRelativeImport(moduleSpecifier),
        };
      }),
    };
  });
}
