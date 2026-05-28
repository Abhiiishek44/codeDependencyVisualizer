export const IPC_CHANNELS = {
  APP_VERSION: 'app:version',
  APP_QUIT: 'app:quit',
} as const;

export type AppVersionInfo = {
  version: string;
  build: string;
  platform: string;
  arch: string;
  electron: string;
  node: string;
  chrome: string;
};

export type IpcResponse<T = unknown> = 
  | { id: string; success: true; data: T }
  | { id: string; success: false; error: string };
