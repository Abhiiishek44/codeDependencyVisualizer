import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronRight,
  MoreHorizontal,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

const metaItems = [
  { label: 'Last analyzed', value: 'May 12, 2024 10:30 AM' },
  { label: 'Files', value: '1,246 files' },
  { label: 'Modules', value: '76 modules' },
];

export function TopHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-b border-slate-200 bg-white px-6 py-5"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Projects</span>
          <ChevronRight className="h-4 w-4" />
          <span>payment-service</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">Dependency Graph</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-slate-900">payment-service</h1>
                <Badge variant="success">Healthy</Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                {metaItems.map((item, index) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span>{item.label}:</span>
                    <span className="font-medium text-slate-700">{item.value}</span>
                    {index < metaItems.length - 1 && <span className="text-slate-300">•</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Scan
            </Button>
            <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Rescan
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
