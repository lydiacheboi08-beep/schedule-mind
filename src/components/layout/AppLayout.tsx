import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { BottomNavigation } from './BottomNavigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/30">
        {!isMobile && <AppSidebar />}
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-sm px-4">
            {!isMobile && <SidebarTrigger />}
            <div className="flex items-center gap-2 flex-1">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Smart To-Do Scheduler
              </h1>
            </div>
            <ThemeToggle />
          </header>
          
          <main className={`flex-1 p-6 ${isMobile ? 'pb-20' : ''}`}>
            {children}
          </main>
        </div>
        
        {isMobile && <BottomNavigation />}
      </div>
    </SidebarProvider>
  );
}