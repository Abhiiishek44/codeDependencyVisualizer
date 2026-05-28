import { ipcMain, app } from 'electron';
import { IPC_CHANNELS } from '../shared/types';
import type {
  AppVersionInfo,
  IpcResponse,
} from '../shared/types';

function ok<T>(id: string, data: T): IpcResponse<T> {
  return { id, success: true, data };
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

export function registerAllHandlers(): void {
  registerAppHandlers();
}
