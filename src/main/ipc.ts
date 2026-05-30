import { BrowserWindow, ipcMain, app, dialog } from 'electron';
import { IPC_CHANNELS } from '../shared/types';
import type {
  AppVersionInfo,
  IpcResponse,
  ProjectImportAnalysisResult,
  ProjectScanResult,
} from '../shared/types';
import { scanProjectFiles } from './file-scanner';
import { parseFileImports } from './parser/import-parser';
import { resolveFileImports } from '../resolver/import-resolver';

function ok<T>(id: string, data: T): IpcResponse<T> {
  return { id, success: true, data };
}

function err(id: string, error: string): IpcResponse<never> {
  return { id, success: false, error };
}

async function selectProjectPath(
  sender: Electron.WebContents
): Promise<string | null> {
  const window = BrowserWindow.fromWebContents(sender);
  const dialogOptions: Electron.OpenDialogOptions = {
    title: 'Select project folder',
    properties: ['openDirectory'],
  };
  const result = window
    ? await dialog.showOpenDialog(window, dialogOptions)
    : await dialog.showOpenDialog(dialogOptions);

  if (result.canceled || !result.filePaths[0]) {
    return null;
  }

  return result.filePaths[0];
}

function registerAppHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.APP_VERSION, (_event, id: string): IpcResponse<AppVersionInfo> => {
    return ok(id, {
      version: app.getVersion(),
      build: process.env['BUILD_NUMBER'] ?? 'local',
      platform: process.platform,
      arch: process.arch,
      electron: process.versions.electron ?? 'unknown',
      node: process.versions.node,
      chrome: process.versions.chrome ?? 'unknown',
    });
  });

  ipcMain.handle(IPC_CHANNELS.APP_QUIT, () => {
    app.quit();
  });
}

function registerProjectHandlers(): void {
  ipcMain.handle(
    IPC_CHANNELS.PROJECT_SELECT_FOLDER,
    async (event, id: string): Promise<IpcResponse<ProjectScanResult>> => {
      try {
        const projectPath = await selectProjectPath(event.sender);

        if (!projectPath) {
          return ok(id, { projectPath: '', files: [] });
        }

        const files = await scanProjectFiles(projectPath);

        return ok(id, { projectPath, files });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to scan project folder';
        return err(id, message);
      }
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.PROJECT_ANALYZE_IMPORTS,
    async (event, id: string): Promise<IpcResponse<ProjectImportAnalysisResult>> => {
      try {
        const projectPath = await selectProjectPath(event.sender);

        if (!projectPath) {
          return ok(id, { projectPath: '', files: [] });
        }

        const files = await scanProjectFiles(projectPath);
        const parsedFiles = await parseFileImports(files, projectPath);
        const resolvedFiles = resolveFileImports(parsedFiles, projectPath);

        return ok(id, { projectPath, files: resolvedFiles });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to analyze project imports';
        return err(id, message);
      }
    }
  );
}

export function registerAllHandlers(): void {
  registerAppHandlers();
  registerProjectHandlers();
}
