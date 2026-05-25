export const IPC_CHANNELS = {
  APP_VERSION: 'app:version',
  APP_QUIT: 'app:quit',
  FS_OPEN_DIALOG: 'fs:openDialog',
  THEME_GET: 'theme:get',
  THEME_SET: 'theme:set',
  DEPS_ANALYZE: 'deps:analyze',
} as const;

export type Theme = 'system' | 'light' | 'dark';
export type ThemeConfig = { current: Theme; resolved: 'light' | 'dark' };

export type AppVersionInfo = {
  version: string;
  build: string;
  platform: string;
  arch: string;
  electron: string;
  node: string;
  chrome: string;
};

export type FileDialogOptions = {
  title?: string;
  defaultPath?: string;
  filters?: { name: string; extensions: string[] }[];
  properties?: ('openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles')[];
};

export type FileDialogResult = {
  canceled: boolean;
  filePaths: string[];
};

export type IpcResponse<T = unknown> = 
  | { id: string; success: true; data: T }
  | { id: string; success: false; error: string };

export type FileNode = {
  id: string;
  path: string;
  name: string;
  size?: number;
  type: 'file' | 'directory';
};

export type DependencyEdge = {
  source: string;
  target: string;
  type: 'import' | 'require' | 'export';
};

export type DependencyGraph = {
  nodes: FileNode[];
  edges: DependencyEdge[];
};
