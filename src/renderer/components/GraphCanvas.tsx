import type { DependencyGraph } from '../../shared/index';
import { truncate } from '../../shared/index';
import { Spinner } from './ui/Spinner';

interface GraphCanvasProps {
  graph: DependencyGraph | null;
  isAnalyzing: boolean;
}

export function GraphCanvas({ graph, isAnalyzing }: GraphCanvasProps) {
  if (isAnalyzing) {
    return (
      <div className="canvas canvas--loading">
        <Spinner size="lg" label="Building dependency graph…" />
        <p className="canvas__loading-text">Resolving module graph…</p>
      </div>
    );
  }

  if (!graph) {
    return (
      <div className="canvas canvas--empty">
        <div className="canvas__placeholder">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
            <circle cx="20" cy="40" r="10" fill="none" stroke="var(--color-border)" strokeWidth="2" />
            <circle cx="60" cy="20" r="10" fill="none" stroke="var(--color-border)" strokeWidth="2" />
            <circle cx="60" cy="60" r="10" fill="none" stroke="var(--color-border)" strokeWidth="2" />
            <line x1="29" y1="37" x2="51" y2="23" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="29" y1="43" x2="51" y2="57" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="60" y1="30" x2="60" y2="50" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
          <h2>No Project Open</h2>
          <p>Open a project directory from the sidebar to visualize its dependency graph.</p>
        </div>
      </div>
    );
  }

  // Simple SVG node-link diagram (production would use D3 or Cytoscape)
  return (
    <div className="canvas">
      <div className="canvas__header">
        <span className="canvas__root">{truncate(graph.metadata.rootDir, 60)}</span>
        <span className="canvas__timestamp">
          Analyzed {new Date(graph.metadata.analyzedAt).toLocaleTimeString()}
        </span>
      </div>
      <div className="canvas__nodes">
        {graph.nodes.map((node) => (
          <div key={node.id} className={`dep-node dep-node--${node.type}`}>
            <div className="dep-node__icon">
              {node.type === 'file' ? '📄' : node.type === 'external' ? '📦' : '🔗'}
            </div>
            <div className="dep-node__info">
              <span className="dep-node__label">{node.label}</span>
              <span className="dep-node__path">{truncate(node.path, 50)}</span>
            </div>
            <div className="dep-node__meta">
              <span title="Imports" className="dep-node__count dep-node__count--out">
                ↗ {node.dependencies.length}
              </span>
              <span title="Depended on by" className="dep-node__count dep-node__count--in">
                ↙ {node.dependents.length}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
