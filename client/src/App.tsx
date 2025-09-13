import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "@/components/Dashboard";
import NotFound from "@/pages/not-found";
import { useIsMobile } from "@/hooks/use-mobile";

function MainApp() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const isMobile = useIsMobile();

  // Responsive sidebar width based on screen size
  const style = {
    "--sidebar-width": isMobile ? "16rem" : "20rem",       // Narrower on mobile
    "--sidebar-width-icon": "3rem",   // Consistent icon width
    "--sidebar-width-mobile": "16rem", // Mobile drawer width
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full" data-testid="main-layout">
        <AppSidebar 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-3 md:p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 min-h-[60px]">
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              <SidebarTrigger data-testid="button-sidebar-toggle" className="shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-xl font-semibold truncate">eRupi Pilot Program Tracker</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  AI-powered project management with intelligent task assistance
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />
            </div>
          </header>
          
          <main className="flex-1 overflow-auto bg-background">
            <Switch>
              <Route path="/" component={() => <Dashboard currentPage={currentPage} />} />
              <Route path="/dashboard" component={() => <Dashboard currentPage="dashboard" />} />
              <Route path="/tasks" component={() => <Dashboard currentPage="tasks" />} />
              <Route path="/chat" component={() => <Dashboard currentPage="chat" />} />
              <Route path="/analytics" component={() => <Dashboard currentPage="analytics" />} />
              <Route path="/reports" component={() => <Dashboard currentPage="reports" />} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="erupi-ui-theme">
        <TooltipProvider>
          <MainApp />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;