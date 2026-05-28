import { motion } from 'framer-motion';
import {
  Activity,
  Boxes,
  FileText,
  GitBranch,
  LayoutGrid,
  ListTree,
  Package,
  PieChart,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const navItems = [
  { label: 'Overview', icon: LayoutGrid },
  { label: 'Dependency Graph', icon: GitBranch, active: true },
  { label: 'Modules', icon: Boxes },
  { label: 'Services', icon: Users },
  { label: 'Packages', icon: Package },
  { label: 'Cycles', icon: Activity },
  { label: 'Impact Analysis', icon: PieChart },
  { label: 'Reports', icon: FileText },
  { label: 'Settings', icon: Settings },
];

const projects = [
  { name: 'payment-service', active: true },
  { name: 'user-service' },
  { name: 'order-service' },
  { name: 'inventory-service' },
  { name: 'notification-service' },
];

export function Sidebar() {
  return (
    <aside className="flex w-72 flex-col bg-[#0B1020] text-slate-200">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600">
          <ListTree className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-lg font-semibold text-white">DepViz</p>
          <p className="text-xs text-slate-400">Code Dependency Visualizer</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        <Card className="border-white/10 bg-white/5 text-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Acme Corp</p>
              <p className="text-xs text-slate-400">Enterprise Plan</p>
            </div>
            <Badge variant="info" className="bg-white/10 text-slate-200">AC</Badge>
          </div>
        </Card>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  item.active
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Projects</p>
          <div className="mt-3 space-y-2">
            {projects.map((project) => (
              <div
                key={project.name}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
                  project.active ? 'bg-white/10 text-white' : 'text-slate-400'
                }`}
              >
                <span>{project.name}</span>
                {project.active && <Badge variant="success">Active</Badge>}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-white/10 bg-white/5 text-slate-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Enterprise Plan</p>
              <Badge variant="default" className="bg-white/10 text-slate-200">12/20</Badge>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10">
              <div className="h-2 w-[60%] rounded-full bg-indigo-500" />
            </div>
            <Button variant="outline" size="sm" className="w-full border-white/10 text-white hover:bg-white/10">
              Upgrade Plan
            </Button>
          </div>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-t border-white/10 px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
            SK
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Sarah Kim</p>
            <p className="text-xs text-slate-400">sarah.kim@acme.com</p>
          </div>
          <ShieldCheck className="ml-auto h-4 w-4 text-emerald-400" />
        </div>
      </motion.div>
    </aside>
  );
}
