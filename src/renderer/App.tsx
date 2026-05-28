import { useEffect, useState } from 'react';
import type { AppVersionInfo } from '@shared/types';

export function App() {
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);

  useEffect(() => {
    void window.electron.getAppVersion().then((response) => {
      if (response.success) setVersionInfo(response.data);
    });
  }, []);

  return (
    <main className="app-shell">
      <div className="app-panel">
        <p className="eyebrow">Electron starter</p>
        <h1>Ready to build</h1>
        <p className="summary">
          Core Electron, preload, IPC, React, and Vite setup are in place.
        </p>

        <dl className="metadata">
          <div>
            <dt>App</dt>
            <dd>{versionInfo?.version ?? 'Loading...'}</dd>
          </div>
          <div>
            <dt>Electron</dt>
            <dd>{versionInfo?.electron ?? 'Loading...'}</dd>
          </div>
          <div>
            <dt>Platform</dt>
            <dd>{versionInfo ? `${versionInfo.platform} ${versionInfo.arch}` : 'Loading...'}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
