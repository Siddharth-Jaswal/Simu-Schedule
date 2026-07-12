import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans pb-32">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sim-blue/10 via-background to-background"></div>
      
      {/* Header */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-sim-purple flex items-center justify-center font-bold shadow-lg shadow-primary/20">
              OS
            </div>
            <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Scheduler Lab
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content Area - Single Column Narrative */}
      <main className="container mx-auto max-w-5xl px-4 py-8 flex flex-col gap-4">
        {children}
      </main>
    </div>
  );
}
