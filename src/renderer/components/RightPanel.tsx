import { motion } from 'framer-motion';
import { ArrowUpRight, FileText, FolderTree, Layers3, LineChart } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const scanItems = [
  { date: 'May 12, 2024 10:30 AM', status: 'Healthy', files: '1,246 files' },
  { date: 'May 11, 2024 10:30 AM', status: 'Healthy', files: '1,238 files' },
  { date: 'May 10, 2024 10:30 AM', status: 'Warnings', files: '1,210 files' },
];

export function RightPanel() {
  return (
    <aside className="hidden w-[320px] flex-shrink-0 flex-col gap-6 overflow-y-auto pb-6 pt-6 lg:flex">
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">payment-service</h3>
              <p className="text-sm text-slate-500">Service</p>
            </div>
            <Badge variant="info">TypeScript</Badge>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-slate-400" />
              <span>/src/payment-service</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />
              <span>12,540 LOC</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-slate-400" />
              <span>Dependencies: 28</span>
            </div>
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-slate-400" />
              <span>Dependents: 18</span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <span className="text-slate-500">Complexity</span>
            <Badge variant="warning">Medium</Badge>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
        <Card className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-900">Impact Analysis</h4>
              <Badge variant="default">Beta</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-500">Changes to this module may impact</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-slate-900">18 modules</p>
            <p className="text-sm text-slate-500">in 6 services</p>
          </div>
          <Button variant="outline" className="w-full justify-between">
            View Impact Analysis
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-slate-900">Recent Scans</h4>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="space-y-3">
            {scanItems.map((scan) => (
              <div key={scan.date} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">{scan.date}</p>
                  <p className="text-xs text-slate-500">{scan.files}</p>
                </div>
                <Badge variant={scan.status === 'Healthy' ? 'success' : 'warning'}>{scan.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </aside>
  );
}
