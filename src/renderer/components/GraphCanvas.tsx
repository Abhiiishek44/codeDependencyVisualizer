import { motion } from 'framer-motion';
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  type Edge,
  type Node,
} from 'reactflow';
import { Filter, LayoutGrid, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const categoryStyles: Record<string, string> = {
  Controllers: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Services: 'border-blue-200 bg-blue-50 text-blue-700',
  Repositories: 'border-orange-200 bg-orange-50 text-orange-700',
  Gateways: 'border-purple-200 bg-purple-50 text-purple-700',
  External: 'border-rose-200 bg-rose-50 text-rose-700',
  Core: 'border-indigo-200 bg-indigo-50 text-indigo-700',
};

const legendItems = [
  { label: 'Controllers', color: 'bg-emerald-500' },
  { label: 'Services', color: 'bg-blue-500' },
  { label: 'Repositories', color: 'bg-orange-500' },
  { label: 'Gateways', color: 'bg-purple-500' },
  { label: 'External', color: 'bg-rose-500' },
];

function DependencyNode({ data }: { data: { label: string; group: string; subtitle?: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`node-float rounded-2xl border px-4 py-3 shadow-sm ${categoryStyles[data.group]}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{data.group}</p>
      <p className="text-sm font-semibold text-slate-900">{data.label}</p>
      {data.subtitle && <p className="text-xs text-slate-500">{data.subtitle}</p>}
    </motion.div>
  );
}

export function GraphCanvas() {
  const { nodes, edges } = useMemo(() => {
    const baseNodes: Node[] = [
      {
        id: 'core',
        type: 'dependency',
        position: { x: 0, y: 0 },
        data: { label: 'payment-service', group: 'Core', subtitle: 'Service' },
      },
      { id: 'webhook', type: 'dependency', position: { x: -220, y: -220 }, data: { label: 'webhook.controller.ts', group: 'Controllers' } },
      { id: 'payment-controller', type: 'dependency', position: { x: 0, y: -260 }, data: { label: 'payment.controller.ts', group: 'Controllers' } },
      { id: 'refund-controller', type: 'dependency', position: { x: 220, y: -220 }, data: { label: 'refund.controller.ts', group: 'Controllers' } },
      { id: 'payment-service', type: 'dependency', position: { x: 280, y: -40 }, data: { label: 'payment.service.ts', group: 'Services' } },
      { id: 'invoice-service', type: 'dependency', position: { x: 320, y: 80 }, data: { label: 'invoice.service.ts', group: 'Services' } },
      { id: 'refund-service', type: 'dependency', position: { x: 280, y: 200 }, data: { label: 'refund.service.ts', group: 'Services' } },
      { id: 'notification-service', type: 'dependency', position: { x: 120, y: 260 }, data: { label: 'notification.service.ts', group: 'Services' } },
      { id: 'payment-repo', type: 'dependency', position: { x: -120, y: 250 }, data: { label: 'payment.repo.ts', group: 'Repositories' } },
      { id: 'invoice-repo', type: 'dependency', position: { x: 0, y: 310 }, data: { label: 'invoice.repo.ts', group: 'Repositories' } },
      { id: 'refund-repo', type: 'dependency', position: { x: 140, y: 340 }, data: { label: 'refund.repo.ts', group: 'Repositories' } },
      { id: 'customer-repo', type: 'dependency', position: { x: -240, y: 320 }, data: { label: 'customer.repo.ts', group: 'Repositories' } },
      { id: 'stripe', type: 'dependency', position: { x: -320, y: 40 }, data: { label: 'stripe.gateway.ts', group: 'Gateways' } },
      { id: 'paypal', type: 'dependency', position: { x: -340, y: -80 }, data: { label: 'paypal.gateway.ts', group: 'Gateways' } },
      { id: 'adyen', type: 'dependency', position: { x: -300, y: -200 }, data: { label: 'adyen.gateway.ts', group: 'Gateways' } },
      { id: 'prisma', type: 'dependency', position: { x: 120, y: 420 }, data: { label: '@prisma/client', group: 'External' } },
      { id: 'nestjs', type: 'dependency', position: { x: 0, y: 430 }, data: { label: '@nestjs/common', group: 'External' } },
      { id: 'bull', type: 'dependency', position: { x: -140, y: 430 }, data: { label: 'bull', group: 'External' } },
      { id: 'ioredis', type: 'dependency', position: { x: 260, y: 400 }, data: { label: 'ioredis', group: 'External' } },
    ];

    const baseEdges: Edge[] = baseNodes
      .filter((node) => node.id !== 'core')
      .map((node) => ({
        id: `edge-${node.id}`,
        source: 'core',
        target: node.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#94a3b8', strokeWidth: 1.2 },
      }));

    return { nodes: baseNodes, edges: baseEdges };
  }, []);

  const nodeTypes = useMemo(() => ({ dependency: DependencyNode }), []);

  return (
    <Card className="flex h-full min-h-[640px] flex-1 flex-col overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-4">
        <Button variant="outline" size="sm">
          <LayoutGrid className="mr-2 h-4 w-4" />
          Graph View
        </Button>
        <Button variant="outline" size="sm">Force Directed</Button>
        <Button variant="outline" size="sm">Group by: Layer</Button>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        <div className="ml-auto flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 shadow-sm">
          <Search className="h-4 w-4" />
          <input
            className="w-40 bg-transparent text-xs text-slate-600 outline-none placeholder:text-slate-400"
            placeholder="Search nodes"
          />
        </div>
      </div>

      <div className="flex-1">
        <ReactFlow
          fitView
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          className="bg-white"
        >
          <Background gap={24} size={1} color="#E5E7EB" />
          <Controls position="top-left" className="mt-24" showInteractive={false} />
          <MiniMap position="bottom-left" pannable zoomable className="rounded-xl border border-slate-200" />
          <Panel position="bottom-center" className="mb-4 flex items-center gap-4 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-slate-500">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                {item.label}
              </div>
            ))}
          </Panel>
        </ReactFlow>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <Badge variant="success">Healthy</Badge>
            <span>76 modules · 1,246 files</span>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Direct dependency edges · animated</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
