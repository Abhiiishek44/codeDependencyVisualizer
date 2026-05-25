import type { AppVersionInfo, DependencyGraph } from '../../shared/index';

interface StatusBarProps {
  versionInfo: AppVersionInfo | null;
  graph: DependencyGraph | null;
}

export function StatusBar({ versionInfo, graph }: StatusBarProps) {
  return (
    <footer className="status-bar">
      <div className="status-bar__left">
        {graph && (
          <span className="status-bar__item status-bar__item--active">
            ✓ {graph.metadata.totalFiles} files · {graph.metadata.totalEdges} edges
          </span>
        )}
      </div>
      <div className="status-bar__right">
        {versionInfo && (
          <>
            <span className="status-bar__item">v{versionInfo.version}</span>
            <span className="status-bar__sep">·</span>
            <span className="status-bar__item">Electron {versionInfo.electron}</span>
            <span className="status-bar__sep">·</span>
            <span className="status-bar__item">{versionInfo.platform}/{versionInfo.arch}</span>
          </>
        )}
      </div>
    </footer>
  );
}
