import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  controls?: ReactNode;
  metrics?: ReactNode;
}

export function MainLayout({ children, controls, metrics }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            OS
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-glow">Scheduler Lab</h1>
        </div>
        
        {/* Navigation or top level status can go here */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sim-green animate-pulse"></span>
            System Ready
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* Left column for Simulation Controls & Setup */}
        <aside className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
          <div className="glass-card p-5 sticky top-24">
            {controls || (
              <div className="text-muted-foreground text-sm italic">Controls placeholder</div>
            )}
          </div>
        </aside>

        {/* Center column for CPU & Queues Visualization */}
        <section className="flex-1 flex flex-col gap-6 min-w-0">
          {children}
        </section>

      </main>

      {/* Bottom section for Metrics & Timeline */}
      <footer className="w-full border-t border-white/5 bg-black/20 backdrop-blur-xl mt-auto">
        <div className="max-w-[1600px] mx-auto p-6">
          {metrics || (
            <div className="text-muted-foreground text-sm italic">Metrics placeholder</div>
          )}
        </div>
      </footer>
    </div>
  );
}
