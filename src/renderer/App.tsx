import { useEffect, useState } from 'react';
import type { AppVersionInfo, ProjectImportAnalysisResult } from '@shared/types';

export function App() {
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ProjectImportAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void window.electron.getAppVersion().then((response) => {
      if (response.success) setVersionInfo(response.data);
    });
  }, []);

  async function handleSelectProject(): Promise<void> {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await window.electron.analyzeProjectImports();
      setAnalysisResult(result.projectPath ? result : null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to analyze project imports');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main className="app-shell">
      <div className="app-panel">
        <p className="eyebrow">Step 3</p>
        <h1>Import resolver</h1>
        <p className="summary">
          Select a local folder to scan source files, read imports, and resolve relative paths.
        </p>

        <button className="primary-action" onClick={handleSelectProject} disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Select Project Folder'}
        </button>

        {error ? <p className="error-message">{error}</p> : null}

        {analysisResult ? (
          <section className="scan-results">
            <div className="scan-header">
              <div>
                <h2>Resolved imports</h2>
                <p>{analysisResult.projectPath}</p>
              </div>
              <span>{analysisResult.files.length}</span>
            </div>

            {analysisResult.files.length > 0 ? (
              <ul className="file-list">
                {analysisResult.files.map((file) => (
                  <li key={file.filePath}>
                    <div className="file-path">{file.filePath}</div>
                    {file.imports.length > 0 ? (
                      <ul className="import-list">
                        {file.imports.map((importInfo, index) => (
                          <li key={`${file.filePath}:${importInfo.moduleSpecifier}:${index}`}>
                            <div className="import-details">
                              <span>moduleSpecifier: {importInfo.moduleSpecifier}</span>
                              <span>resolvedPath: {importInfo.resolvedPath ?? 'null'}</span>
                            </div>
                            <em>isResolved: {String(importInfo.isResolved)}</em>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-imports">No imports found.</p>
                    )}
                  </li>
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
