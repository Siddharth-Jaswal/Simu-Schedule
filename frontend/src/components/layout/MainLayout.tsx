import { ReactNode, useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial state
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans pb-32 transition-colors duration-500">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sim-blue/10 via-background to-background transition-colors duration-500"></div>
      
      {/* Header */}
      <header className="border-b border-black/10 dark:border-white/5 bg-white/20 dark:bg-black/20 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-500">
        <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo and title removed as requested */}
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-primary" />}
          </button>
        </div>
      </header>

      {/* Main Content Area - Single Column Narrative */}
      <main className="container mx-auto max-w-5xl px-4 py-8 flex flex-col gap-4">
        {children}
      </main>
    </div>
  );
}
