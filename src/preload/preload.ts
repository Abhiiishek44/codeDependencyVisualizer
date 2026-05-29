import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/types';
import type {
  AppVersionInfo,
  IpcResponse,
  ProjectScanResult,
} from '../shared/types';
import { generateId as generateIpcId } from '../shared/utils';

const INVOKE_CHANNELS = new Set<string>(Object.values(IPC_CHANNELS));

function assertAllowedInvoke(channel: string): void {
  if (!INVOKE_CHANNELS.has(channel)) {
    throw new Error(`[preload] Blocked invoke on disallowed channel: "${channel}"`);
  }
}

const electronAPI = {
  getAppVersion(): Promise<IpcResponse<AppVersionInfo>> {
    const id = generateIpcId();
    assertAllowedInvoke(IPC_CHANNELS.APP_VERSION);
    return ipcRenderer.invoke(IPC_CHANNELS.APP_VERSION, id) as Promise<IpcResponse<AppVersionInfo>>;
  },

  quitApp(): void {
    ipcRenderer.invoke(IPC_CHANNELS.APP_QUIT);
  },

  async selectProjectFolder(): Promise<ProjectScanResult> {
    const id = generateIpcId();
    assertAllowedInvoke(IPC_CHANNELS.PROJECT_SELECT_FOLDER);
    const response = await ipcRenderer.invoke(
      IPC_CHANNELS.PROJECT_SELECT_FOLDER,
      id
    ) as IpcResponse<ProjectScanResult>;

    if (!response.success) {
      throw new Error(response.error);
    }

    return response.data;
  },
};

contextBridge.exposeInMainWorld('electron', electronAPI);

export type ElectronAPI = typeof electronAPI;
