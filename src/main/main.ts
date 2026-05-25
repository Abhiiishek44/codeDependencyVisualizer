import { app, BrowserWindow, shell } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';
import log from 'electron-log';
import { registerAllHandlers } from './ipc';
import { createMenu } from './menu';

// ── Configure logger ──────────────────────────────────────────────────────────
log.initialize();
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

const isDev = is.dev;
const RENDERER_PORT = 5173;

let mainWindow: BrowserWindow | null = null;

// ── Security: Prevent navigation to external URLs ─────────────────────────────
function setupSecurityPolicies(): void {
  app.on('web-contents-created', (_event, contents) => {
    // Prevent navigation away from the app
    contents.on('will-navigate', (event, url) => {
      const { origin } = new URL(url);
      const devOrigin = process.env['ELECTRON_RENDERER_URL'] || `http://localhost:5173`;
      if (is.dev && origin === new URL(devOrigin).origin) return;
      if (!is.dev && url.startsWith('file://')) return;
      event.preventDefault();
      log.warn(`Blocked navigation to: ${url}`);
    });

    // Prevent new windows from being created
    contents.setWindowOpenHandler(({ url }) => {
      // Open external links in the system browser instead
      if (url.startsWith('https://') || url.startsWith('http://')) {
        void shell.openExternal(url);
      }
      return { action: 'deny' };
    });
  });
}

// ── Create the main BrowserWindow ─────────────────────────────────────────────
async function createWindow(): Promise<BrowserWindow> {
  const preloadPath = is.dev 
    ? join(__dirname, '../../dist/preload/index.js')
    : join(__dirname, '../preload/index.js');

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false, // reveal after ready-to-show to avoid white flash
    backgroundColor: '#0f1117',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      // ── Security hardening ────────────────────────────────────────────────
      contextIsolation: true,       // Isolate renderer from main process
      nodeIntegration: false,       // NEVER expose Node APIs to renderer
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      sandbox: true,                // Extra OS-level sandbox
      allowRunningInsecureContent: false,
      webSecurity: true,
      // ── Preload ───────────────────────────────────────────────────────────
      preload: preloadPath,
    },
  });

  // Show when fully ready to avoid white flash
  win.once('ready-to-show', () => {
    win.show();
    if (is.dev) win.webContents.openDevTools();
  });

  // Load the app
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    await win.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    await win.loadFile(join(__dirname, '../renderer/index.html'));
  }

  return win;
}

// ── App lifecycle ─────────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  log.info('App is ready', { version: app.getVersion(), isDev });

  setupSecurityPolicies();

  mainWindow = await createWindow();
  createMenu(mainWindow);

  // Register all IPC handlers
  registerAllHandlers();

  app.on('activate', () => {
    // macOS: re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow().then((win) => {
        mainWindow = win;
      });
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    log.info('All windows closed — quitting');
    app.quit();
  }
});

// Prevent second instance
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
