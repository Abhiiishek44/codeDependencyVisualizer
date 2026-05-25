import { ipcMain, app, dialog } from 'electron';
import { IPC_CHANNELS } from '../shared/types';
import type {
  AppVersionInfo,
  FileDialogOptions,
  FileDialogResult,
  IpcResponse,
  Theme,
  ThemeConfig,
} from '../shared/types';
import log from 'electron-log';
import Store from 'electron-store';

type StoreSchema = { theme: Theme };
const store = new (Store as any).default({ defaults: { theme: 'system' } });

// ── Helper: wrap handler result in IpcResponse ────────────────────────────────
function ok<T>(id: string, data: T): IpcResponse<T> {
  return { id, success: true, data };
}
function err(id: string, message: string): IpcResponse<never> {
  return { id, success: false, error: message };
}

// ── App Version ───────────────────────────────────────────────────────────────
function registerAppHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.APP_VERSION, (_event, id: string): IpcResponse<AppVersionInfo> => {
    log.debug('[IPC] app:version');
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
    log.info('[IPC] app:quit — quitting');
    app.quit();
  });
}

// ── File System ───────────────────────────────────────────────────────────────
function registerFsHandlers(): void {
  ipcMain.handle(
    IPC_CHANNELS.FS_OPEN_DIALOG,
    async (_event, id: string, options: FileDialogOptions): Promise<IpcResponse<FileDialogResult>> => {
      log.debug('[IPC] fs:openDialog', options);
      try {
        const dialogOptions: Electron.OpenDialogOptions = {
          properties: options.properties ?? ['openFile'],
        };
        if (options.title) dialogOptions.title = options.title;
        if (options.defaultPath) dialogOptions.defaultPath = options.defaultPath;
        if (options.filters) dialogOptions.filters = options.filters;
        const result = await dialog.showOpenDialog(dialogOptions);
        return ok(id, { canceled: result.canceled, filePaths: result.filePaths });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        log.error('[IPC] fs:openDialog error', msg);
        return err(id, msg);
      }
    }
  );
}

// ── Theme ─────────────────────────────────────────────────────────────────────
function registerThemeHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.THEME_GET, (_event, id: string): IpcResponse<ThemeConfig> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const current: Theme = (store as any).get('theme', 'system') as Theme;
    const resolved = current === 'system'
      ? (require('electron').nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
      : current;
    return ok(id, { current, resolved });
  });

  ipcMain.handle(
    IPC_CHANNELS.THEME_SET,
    (_event, id: string, theme: Theme): IpcResponse<ThemeConfig> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (store as any).set('theme', theme);
      const { nativeTheme } = require('electron');
      nativeTheme.themeSource = theme;
      const resolved = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
      log.debug('[IPC] theme:set', theme, '→', resolved);
      return ok(id, { current: theme, resolved });
    }
  );
}

// ── Register all ──────────────────────────────────────────────────────────────
export function registerAllHandlers(): void {
  registerAppHandlers();
  registerFsHandlers();
  registerThemeHandlers();
  log.info('[IPC] All handlers registered');
}
