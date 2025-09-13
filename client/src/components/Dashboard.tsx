import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi, activityApi } from "@/lib/api";
import TaskList from "./TaskList";
import ChatInterface from "./ChatInterface";
import ActivityLog from "./ActivityLog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Users, 
  Calendar, 
  TrendingUp,
  MessageSquare,
  CheckSquare,
  Clock,
  AlertTriangle
} from "lucide-react";
import type { Task, Activity } from "@shared/schema";

interface DashboardProps {
  currentPage: string;
}

export default function Dashboard({ currentPage }: DashboardProps) {
  // Fetch real data from API
  const { data: tasks = [], isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ["/api/tasks"],
    queryFn: () => taskApi.getAllTasks(),
  });

  const { data: allActivities = [] } = useQuery({
    queryKey: ["/api/activities"],
    queryFn: async () => {
      const activities = [];
      for (const task of tasks) {
        const taskActivities = await activityApi.getTaskActivities(task.id);
        activities.push(...taskActivities);
      }
      return activities.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    },
    enabled: tasks.length > 0,
  });

  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) => 
      taskApi.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
  });

  // Mock tasks for fallback display
  const mockTasks: Task[] = [
    {
      id: "task-1",
      title: "Finalize two Malls and communicate with Malls",
      description: "Obtain consent to participate in program and establish partnership agreements",
      status: "in_progress",
      dependencies: null,
      assignedTo: "Partnership Team",
      dueDate: new Date("2024-01-15"),
      priority: "high",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-10"),
    },
    {
      id: "task-2",
      title: "Define nature of Program",
      description: "Define Title, participating merchants, T&C, How to Use, Artwork for voucher, Brand and Logo Images",
      status: "not_started",
      dependencies: null,
      assignedTo: "Design Team",
      dueDate: new Date("2024-01-20"),
      priority: "medium",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "task-3",
      title: "Obtain/Repurpose MID from bank",
      description: "Get MID from ICICI showing Fincentive – Mall Name – pilot in voucher title",
      status: "completed",
      dependencies: null,
      assignedTo: "Banking Team",
      dueDate: new Date("2024-01-10"),
      priority: "critical",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-08"),
    },
    {
      id: "task-4",
      title: "Mobilising physical field force",
      description: "Organize and deploy field teams for customer engagement and data collection",
      status: "not_started",
      dependencies: null,
      assignedTo: "Operations Team",
      dueDate: new Date("2024-01-25"),
      priority: "medium",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "task-5",
      title: "Collect customer information",
      description: "Collect customer Name, Mobile number associated with Bank and Gpay. Install and register Gpay if needed",
      status: "not_started",
      dependencies: null,
      assignedTo: "Field Team",
      dueDate: new Date("2024-02-01"),
      priority: "high",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    }
  ];

  const activities = allActivities.length > 0 ? allActivities : [
    {
      id: "activity-1",
      taskId: "task-1",
      type: "created",
      description: "Task created for mall partnerships",
      remarks: "Initial task setup",
      userId: "admin",
      createdAt: new Date("2024-01-01T10:00:00Z"),
    },
    {
      id: "activity-2",
      taskId: "task-1", 
      type: "status_change",
      description: "Status changed to In Progress",
      remarks: "Started reaching out to potential partners",
      userId: "partnership-team",
      createdAt: new Date("2024-01-02T14:30:00Z"),
    },
    {
      id: "activity-3",
      taskId: "task-3",
      type: "completed",
      description: "MID obtained from ICICI bank",
      remarks: "Successfully configured with pilot program parameters",
      userId: "banking-team",
      createdAt: new Date("2024-01-08T16:45:00Z"),
    }
  ];

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTaskMutation.mutate({ id: taskId, updates });
  };

  const handleViewTaskDetails = (taskId: string) => {
    console.log(`Viewing details for task: ${taskId}`);
  };

  if (tasksError) {
    console.error("Error loading tasks:", tasksError);
  }

  const displayTasks = tasks.length > 0 ? tasks : mockTasks;

  const stats = {
    total: displayTasks.length,
    completed: displayTasks.filter(t => t.status === "completed").length,
    inProgress: displayTasks.filter(t => t.status === "in_progress").length,
    overdue: displayTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed").length,
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              eRupi Pilot Program
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.completed} this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Active tasks
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>
                Latest updates from the eRupi Pilot Program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {task.description}
                      </p>
                    </div>
                    <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Tasks
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <ActivityLog activities={activities.slice(0, 5)} />
        </div>
      </div>
    </div>
  );

  const renderTasks = () => (
    <TaskList 
      tasks={displayTasks}
      onUpdateTask={handleUpdateTask}
      onViewTaskDetails={handleViewTaskDetails}
    />
  );

  const renderChat = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">AI Task Assistant</h2>
        <p className="text-muted-foreground">
          Ask me to create, update, complete, or manage your eRupi Pilot Program tasks
        </p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChatInterface 
            onSendMessage={(message) => {
              console.log(`AI message sent: ${message}`);
            }}
          />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Create new task
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <CheckSquare className="h-4 w-4 mr-2" />
                Update task status
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Add task remarks
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View progress report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderComingSoon = (title: string) => (
    <div className="flex flex-col items-center justify-center min-h-96">
      <div className="text-center">
        <TrendingUp className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">
          This feature will be available soon. Stay tuned for updates!
        </p>
      </div>
    </div>
  );

  const getPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return renderOverview();
      case "tasks":
        return renderTasks();
      case "chat":
        return renderChat();
      case "analytics":
        return renderComingSoon("Analytics Dashboard");
      case "reports":
        return renderComingSoon("Reports & Insights");
      default:
        return renderOverview();
    }
  };

  return (
    <div className="flex-1 p-6" data-testid="dashboard-content">
      {getPageContent()}
    </div>
  );
}