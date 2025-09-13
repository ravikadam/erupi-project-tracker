import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquare, 
  BarChart3, 
  FileText,
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react";

interface AppSidebarProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export function AppSidebar({ currentPage = "dashboard", onPageChange }: AppSidebarProps) {
  const isMobile = useIsMobile();
  
  // todo: remove mock functionality
  const progressData = {
    completed: 3,
    total: 17,
    inProgress: 5,
    overdue: 1
  };

  const completionPercentage = Math.round((progressData.completed / progressData.total) * 100);

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "tasks",
      title: "All Tasks",
      icon: CheckSquare,
      badge: progressData.total.toString(),
    },
    {
      id: "chat",
      title: "AI Assistant",
      icon: MessageSquare,
      badge: "GPT-5",
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      badge: null,
    },
    {
      id: "reports",
      title: "Reports",
      icon: FileText,
      badge: null,
    },
  ];

  const quickStats = [
    {
      label: "In Progress",
      value: progressData.inProgress,
      icon: Clock,
      color: "text-chart-3",
    },
    {
      label: "Overdue",
      value: progressData.overdue,
      icon: AlertCircle,
      color: "text-destructive",
    },
    {
      label: "Completion",
      value: `${completionPercentage}%`,
      icon: TrendingUp,
      color: "text-chart-2",
    },
  ];

  return (
    <Sidebar data-testid="app-sidebar">
      <SidebarHeader className="p-3 md:p-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 md:h-8 md:w-8 rounded bg-primary flex items-center justify-center">
            <FileText className="h-5 w-5 md:h-4 md:w-4 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-sidebar-foreground text-sm md:text-base truncate">eRupi Tracker</h2>
            <p className="text-xs text-sidebar-foreground/70 truncate">Pilot Program</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    isActive={currentPage === item.id}
                    data-testid={`sidebar-nav-${item.id}`}
                  >
                    <button
                      onClick={() => onPageChange?.(item.id)}
                      className="flex items-center gap-3 w-full min-h-[44px] px-3 py-2 rounded-md transition-colors"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="flex-1 text-left text-sm md:text-base">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs md:text-sm">Project Progress</SidebarGroupLabel>
          <SidebarGroupContent className="px-2 md:px-3">
            <div className="space-y-3 md:space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs md:text-sm mb-2">
                  <span className="text-sidebar-foreground">Overall Progress</span>
                  <span className="text-sidebar-foreground/70">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2 md:h-3" />
              </div>
              
              <div className="space-y-2 md:space-y-3">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 text-xs md:text-sm min-h-[36px] p-2 rounded hover-elevate">
                    <stat.icon className={`h-4 w-4 shrink-0 ${stat.color}`} />
                    <span className="flex-1 text-sidebar-foreground/70 truncate">{stat.label}</span>
                    <span className={`font-medium ${stat.color} shrink-0`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 md:p-4">
        <div className="text-xs text-sidebar-foreground/50 text-center">
          {isMobile ? "Updated today" : `Last updated: ${new Date().toLocaleDateString()}`}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}