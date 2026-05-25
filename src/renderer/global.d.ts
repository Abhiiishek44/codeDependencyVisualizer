import type { ElectronAPI } from '../preload/preload';

/**
 * Augment the global Window interface so TypeScript knows about
 * the API injected by the preload script via contextBridge.
 *
 * This file must be included in the renderer tsconfig and never
 * imported directly — it's a pure ambient declaration.
 */
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
