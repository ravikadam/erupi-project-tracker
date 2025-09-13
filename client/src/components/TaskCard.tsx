import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import { Calendar, User, MessageSquare } from "lucide-react";
import type { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
  onUpdateStatus?: (taskId: string, status: string) => void;
  onViewDetails?: (taskId: string) => void;
  activityCount?: number;
}

export default function TaskCard({ task, onUpdateStatus, onViewDetails, activityCount = 0 }: TaskCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "No due date";
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(new Date(date));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-chart-3 text-white";
      case "medium": return "bg-chart-4 text-white";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover-elevate" data-testid={`task-card-${task.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-lg truncate">{task.title}</CardTitle>
          {task.description && (
            <CardDescription className="text-sm mt-1 line-clamp-2">
              {task.description}
            </CardDescription>
          )}
        </div>
        <StatusBadge status={task.status as any} />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {task.priority && (
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()}
            </Badge>
          )}
          
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          
          {task.assignedTo && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{task.assignedTo}</span>
            </div>
          )}
          
          {activityCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{activityCount} activities</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onViewDetails?.(task.id)}
            data-testid={`button-view-details-${task.id}`}
          >
            View Details
          </Button>
          
          {task.status !== "completed" && (
            <Button 
              size="sm" 
              onClick={() => {
                const nextStatus = task.status === "not_started" ? "in_progress" : "completed";
                onUpdateStatus?.(task.id, nextStatus);
              }}
              data-testid={`button-update-status-${task.id}`}
            >
              {task.status === "not_started" ? "Start Task" : "Complete"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}