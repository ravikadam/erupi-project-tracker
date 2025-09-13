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

function MainApp() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Custom sidebar width for better content layout
  const style = {
    "--sidebar-width": "20rem",       // 320px for better navigation
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full" data-testid="main-layout">
        <AppSidebar 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div>
                <h1 className="text-xl font-semibold">eRupi Pilot Program Tracker</h1>
                <p className="text-sm text-muted-foreground">
                  AI-powered project management with intelligent task assistance
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
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