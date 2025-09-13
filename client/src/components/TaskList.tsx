import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import TaskCard from "./TaskCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, Filter } from "lucide-react";
import type { Task } from "@shared/schema";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onViewTaskDetails?: (taskId: string) => void;
  className?: string;
  isLoading?: boolean;
}

export default function TaskList({ tasks, onUpdateTask, onViewTaskDetails, className }: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const isMobile = useIsMobile();

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    notStarted: tasks.filter(t => t.status === "not_started").length,
    failed: tasks.filter(t => t.status === "failed").length,
  };

  const handleUpdateStatus = (taskId: string, status: string) => {
    onUpdateTask?.(taskId, { status, updatedAt: new Date() });
  };

  return (
    <div className={`space-y-4 md:space-y-6 ${className || ""}`} data-testid="task-list">
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-base md:text-lg">eRupi Pilot Program Progress</span>
            <Badge variant="outline" className="text-xs sm:ml-auto">
              {taskStats.completed}/{taskStats.total} Completed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-chart-2">{taskStats.completed}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-chart-3">{taskStats.inProgress}</div>
              <div className="text-xs md:text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-muted-foreground">{taskStats.notStarted}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Not Started</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-destructive">{taskStats.failed}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isMobile ? "Search..." : "Search tasks..."}
                className="pl-10 min-h-[44px]"
                data-testid="input-search-tasks"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full min-h-[44px]" data-testid="select-status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full min-h-[44px]" data-testid="select-priority-filter">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Grid */}
      <div className={`grid gap-3 md:gap-4 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredTasks.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-8 md:py-12">
              <Filter className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">No tasks found</h3>
              <p className="text-sm md:text-base text-muted-foreground text-center">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                  ? "Try adjusting your filters to see more tasks"
                  : "No tasks have been created yet"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateStatus={handleUpdateStatus}
              onViewDetails={onViewTaskDetails}
              activityCount={Math.floor(Math.random() * 5) + 1} // todo: remove mock functionality
            />
          ))
        )}
      </div>
    </div>
  );
}