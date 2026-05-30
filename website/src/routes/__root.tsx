import { AppSidebar } from '@/components/AppSidebar';
import { CommandMenu } from '@/components/command-menu';
import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
              </div>
              <div className="flex-1 flex justify-center max-w-sm">
                <CommandMenu />
              </div>
              <div className="flex items-center gap-2">
                <ModeToggle />
              </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:p-8">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
