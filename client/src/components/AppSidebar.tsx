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
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">eRupi Tracker</h2>
            <p className="text-xs text-sidebar-foreground/70">Pilot Program</p>
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
                      className="flex items-center gap-2 w-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
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
          <SidebarGroupLabel>Project Progress</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-sidebar-foreground">Overall Progress</span>
                  <span className="text-sidebar-foreground/70">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              
              <div className="space-y-2">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 text-sm">
                    <stat.icon className={`h-3 w-3 ${stat.color}`} />
                    <span className="flex-1 text-sidebar-foreground/70">{stat.label}</span>
                    <span className={`font-medium ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-sidebar-foreground/50 text-center">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}