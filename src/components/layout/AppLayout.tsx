import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/30">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-sm px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Smart To-Do Scheduler
              </h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}