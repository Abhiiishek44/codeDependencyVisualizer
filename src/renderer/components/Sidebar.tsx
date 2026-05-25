import type { DependencyGraph } from '../../shared/index';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { Badge } from './ui/Badge';

interface SidebarProps {
  onOpenProject: () => void;
  graph: DependencyGraph | null;
  isAnalyzing: boolean;
}

export function Sidebar({ onOpenProject, graph, isAnalyzing }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="5" cy="12" r="3" fill="var(--color-primary)" />
            <circle cx="19" cy="5" r="3" fill="var(--color-success)" />
            <circle cx="19" cy="19" r="3" fill="var(--color-warning)" />
            <line x1="7.5" y1="11" x2="16.5" y2="6.5" stroke="var(--color-border)" strokeWidth="1.5" />
            <line x1="7.5" y1="13" x2="16.5" y2="17.5" stroke="var(--color-border)" strokeWidth="1.5" />
            <line x1="16" y1="8" x2="16" y2="16" stroke="var(--color-border)" strokeWidth="1.5" />
          </svg>
          <span className="sidebar__logo-text">DepViz</span>
        </div>
      </div>

      <div className="sidebar__content">
        <Button
          variant="primary"
          size="md"
          onClick={onOpenProject}
          isLoading={isAnalyzing}
          style={{ width: '100%' }}
        >
          {isAnalyzing ? 'Analyzing…' : '📂 Open Project'}
        </Button>

        {graph && (
          <div className="sidebar__stats">
            <h3 className="sidebar__stats-title">Analysis Results</h3>
            <div className="stat-row">
              <span className="stat-row__label">Files</span>
              <Badge variant="info">{graph.metadata.totalFiles}</Badge>
            </div>
            <div className="stat-row">
              <span className="stat-row__label">Edges</span>
              <Badge variant="default">{graph.metadata.totalEdges}</Badge>
            </div>
            <div className="stat-row">
              <span className="stat-row__label">Circular</span>
              <Badge variant={graph.metadata.circularDependencies.length > 0 ? 'error' : 'success'}>
                {graph.metadata.circularDependencies.length}
              </Badge>
            </div>
          </div>
        )}

        {!graph && !isAnalyzing && (
          <div className="sidebar__empty">
            <p>Open a project directory to visualize its dependency graph.</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="sidebar__analyzing">
            <Spinner size="md" label="Analyzing project…" />
            <p>Scanning files…</p>
          </div>
        )}
      </div>
    </aside>
  );
}
