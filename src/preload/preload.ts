/**
 * Preload Script — Secure IPC Bridge
 *
 * This file runs in a privileged context but exposes only safe, typed APIs
 * to the renderer process via contextBridge. The renderer NEVER has access
 * to the full Electron or Node.js API.
 *
 * Security rules enforced here:
 *  - Only whitelisted channels can be invoked from the renderer
 *  - Events from main → renderer are filtered to allowed channels only
 *  - No raw ipcRenderer is exposed
 */
import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/types';
import type {
  DependencyGraph,
  AppVersionInfo,
  FileDialogOptions,
  FileDialogResult,
  IpcResponse,
  ThemeConfig,
  Theme,
} from '../shared/types';
import { generateId as generateIpcId } from '../shared/utils';

// ── Allowed channels ──────────────────────────────────────────────────────────
const INVOKE_CHANNELS = new Set<string>(Object.values(IPC_CHANNELS));
const LISTEN_CHANNELS = new Set<string>(['menu:open-project', IPC_CHANNELS.THEME_CHANGED]);

function assertAllowedInvoke(channel: string): void {
  if (!INVOKE_CHANNELS.has(channel)) {
    throw new Error(`[preload] Blocked invoke on disallowed channel: "${channel}"`);
  }
}

function assertAllowedListen(channel: string): void {
  if (!LISTEN_CHANNELS.has(channel)) {
    throw new Error(`[preload] Blocked listener on disallowed channel: "${channel}"`);
  }
}

// ── Typed API exposed to renderer ─────────────────────────────────────────────
const electronAPI = {
  // ── App ──────────────────────────────────────────────────────────────────
  getAppVersion(): Promise<IpcResponse<AppVersionInfo>> {
    const id = generateIpcId();
    assertAllowedInvoke(IPC_CHANNELS.APP_VERSION);
    return ipcRenderer.invoke(IPC_CHANNELS.APP_VERSION, id) as Promise<IpcResponse<AppVersionInfo>>;
  },

  quitApp(): void {
    ipcRenderer.invoke(IPC_CHANNELS.APP_QUIT);
  },

  // ── File System ──────────────────────────────────────────────────────────
  openFileDialog(options: FileDialogOptions): Promise<IpcResponse<FileDialogResult>> {
    const id = generateIpcId();
    assertAllowedInvoke(IPC_CHANNELS.FS_OPEN_DIALOG);
    return ipcRenderer.invoke(
      IPC_CHANNELS.FS_OPEN_DIALOG,
      id,
      options
    ) as Promise<IpcResponse<FileDialogResult>>;
  },

  // ── Theme ────────────────────────────────────────────────────────────────
  getTheme(): Promise<IpcResponse<ThemeConfig>> {
    const id = generateIpcId();
    assertAllowedInvoke(IPC_CHANNELS.THEME_GET);
    return ipcRenderer.invoke(IPC_CHANNELS.THEME_GET, id) as Promise<IpcResponse<ThemeConfig>>;
  },

  setTheme(theme: Theme): Promise<IpcResponse<ThemeConfig>> {
    const id = generateIpcId();
    assertAllowedInvoke(IPC_CHANNELS.THEME_SET);
    return ipcRenderer.invoke(IPC_CHANNELS.THEME_SET, id, theme) as Promise<IpcResponse<ThemeConfig>>;
  },

  // ── Generic event listener (allow-listed) ────────────────────────────────
  on(channel: string, callback: (...args: unknown[]) => void): () => void {
    assertAllowedListen(channel);
    const handler = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => callback(...args);
    ipcRenderer.on(channel, handler);
    // Return cleanup function
    return () => ipcRenderer.removeListener(channel, handler);
  },
};

// ── Expose under window.electron ─────────────────────────────────────────────
contextBridge.exposeInMainWorld('electron', electronAPI);

// ── TypeScript type augmentation for renderer ─────────────────────────────────
export type ElectronAPI = typeof electronAPI;
