import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { GraphCanvas } from './components/GraphCanvas';
import { StatusBar } from './components/StatusBar';
import { useTheme } from './hooks/useTheme';
import { useAppVersion } from './hooks/useAppVersion';
import type { DependencyGraph } from '../../shared/index';

export function App() {
  const { resolvedTheme, setTheme } = useTheme();
  const { versionInfo } = useAppVersion();
  const [graph, setGraph] = useState<DependencyGraph | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync resolved theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const handleOpenProject = async () => {
    const result = await window.electron.openFileDialog({
      title: 'Select Project Root Directory',
      properties: ['openDirectory'],
    });
    if (!result.success || result.data?.canceled) return;
    const [rootDir] = result.data?.filePaths ?? [];
    if (!rootDir) return;

    setIsAnalyzing(true);
    setGraph(null);
    // In a real impl, this would trigger the dep:analyze IPC call
    // For this demo, we simulate a response
    await new Promise((r) => setTimeout(r, 1200));
    setGraph({
      nodes: [
        { id: '1', path: `${rootDir}/src/index.ts`, label: 'index.ts', type: 'file', dependencies: ['2', '3'], dependents: [] },
        { id: '2', path: `${rootDir}/src/utils.ts`, label: 'utils.ts', type: 'file', dependencies: [], dependents: ['1'] },
        { id: '3', path: `${rootDir}/src/app.ts`, label: 'app.ts', type: 'file', dependencies: ['2'], dependents: ['1'] },
      ],
      edges: [
        { source: '1', target: '2', type: 'import' },
        { source: '1', target: '3', type: 'import' },
        { source: '3', target: '2', type: 'import' },
      ],
      metadata: {
        analyzedAt: new Date().toISOString(),
        rootDir: rootDir ?? '',
        totalFiles: 3,
        totalEdges: 3,
        circularDependencies: [],
      },
    });
    setIsAnalyzing(false);
  };

  return (
    <div className="app-shell">
      <div className="app-titlebar" data-platform={process.platform}>
        <span className="app-titlebar__title">Code Dependency Visualizer</span>
        <div className="app-titlebar__actions">
          <button
            className="titlebar-btn"
            title="Toggle theme"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          >
            {resolvedTheme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div className="app-body">
        <Sidebar onOpenProject={handleOpenProject} graph={graph} isAnalyzing={isAnalyzing} />
        <main className="app-main">
          <GraphCanvas graph={graph} isAnalyzing={isAnalyzing} />
        </main>
      </div>

      <StatusBar versionInfo={versionInfo} graph={graph} />
    </div>
  );
}
