import { useEffect, useState } from 'react';
import type { AppVersionInfo, ProjectScanResult } from '@shared/types';

export function App() {
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);
  const [scanResult, setScanResult] = useState<ProjectScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void window.electron.getAppVersion().then((response) => {
      if (response.success) setVersionInfo(response.data);
    });
  }, []);

  async function handleSelectProject(): Promise<void> {
    setIsScanning(true);
    setError(null);

    try {
      const result = await window.electron.selectProjectFolder();
      setScanResult(result.projectPath ? result : null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to scan project folder');
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <main className="app-shell">
      <div className="app-panel">
        <p className="eyebrow">Step 1</p>
        <h1>Project scanner</h1>
        <p className="summary">
          Select a local folder to scan for TypeScript and JavaScript source files.
        </p>

        <button className="primary-action" onClick={handleSelectProject} disabled={isScanning}>
          {isScanning ? 'Scanning...' : 'Select Project Folder'}
        </button>

        {error ? <p className="error-message">{error}</p> : null}

        {scanResult ? (
          <section className="scan-results">
            <div className="scan-header">
              <div>
                <h2>Scanned files</h2>
                <p>{scanResult.projectPath}</p>
              </div>
              <span>{scanResult.files.length}</span>
            </div>

            {scanResult.files.length > 0 ? (
              <ul className="file-list">
                {scanResult.files.map((filePath) => (
                  <li key={filePath}>{filePath}</li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No source files found.</p>
            )}
          </section>
        ) : null}

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
