import { app, BrowserWindow, shell } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';
import { registerAllHandlers } from './ipc';
import { createMenu } from './menu';

const isDev = is.dev;

let mainWindow: BrowserWindow | null = null;

function setupSecurityPolicies(): void {
  app.on('web-contents-created', (_event, contents) => {
    contents.on('will-navigate', (event, url) => {
      const { origin } = new URL(url);
      const devOrigin = process.env['ELECTRON_RENDERER_URL'] || `http://localhost:5173`;
      if (is.dev && origin === new URL(devOrigin).origin) return;
      if (!is.dev && url.startsWith('file://')) return;
      event.preventDefault();
      console.warn(`Blocked navigation to: ${url}`);
    });

    contents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https://') || url.startsWith('http://')) {
        void shell.openExternal(url);
      }
      return { action: 'deny' };
    });
  });
}

async function createWindow(): Promise<BrowserWindow> {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    backgroundColor: '#111827',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      sandbox: true,
      allowRunningInsecureContent: false,
      webSecurity: true,
      preload: join(__dirname, '../preload/index.js'),
    },
  });

  win.once('ready-to-show', () => {
    win.show();
    if (is.dev) win.webContents.openDevTools();
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    await win.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    await win.loadFile(join(__dirname, '../renderer/index.html'));
  }

  return win;
}

app.whenReady().then(async () => {
  console.info('App is ready', { version: app.getVersion(), isDev });

  setupSecurityPolicies();

  mainWindow = await createWindow();
  createMenu(mainWindow);

  registerAllHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow().then((win) => {
        mainWindow = win;
      });
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

export { mainWindow };
