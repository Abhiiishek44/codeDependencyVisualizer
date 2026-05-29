export const IPC_CHANNELS = {
  APP_VERSION: 'app:version',
  APP_QUIT: 'app:quit',
  PROJECT_SELECT_FOLDER: 'project:select-folder',
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

export type ProjectScanResult = {
  projectPath: string;
  files: string[];
};
