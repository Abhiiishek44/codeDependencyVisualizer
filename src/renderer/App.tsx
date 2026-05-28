import { Sidebar } from './components/Sidebar';
import { GraphCanvas } from './components/GraphCanvas';
import { TopHeader } from './components/TopHeader';
import { RightPanel } from './components/RightPanel';

export function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopHeader />
          <main className="flex flex-1 gap-6 overflow-hidden bg-slate-50 px-6 pb-6">
            <div className="flex min-w-0 flex-1 flex-col">
              <GraphCanvas />
            </div>
            <RightPanel />
          </main>
        </div>
      </div>
    </div>
  );
}
