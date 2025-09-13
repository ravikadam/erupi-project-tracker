import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, CheckCircle, Play, AlertCircle, Plus } from "lucide-react";
import type { Activity } from "@shared/schema";

interface ActivityLogProps {
  activities: Activity[];
  className?: string;
}

export default function ActivityLog({ activities, className }: ActivityLogProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "created":
        return <Plus className="h-4 w-4 text-chart-4" />;
      case "updated":
        return <AlertCircle className="h-4 w-4 text-chart-3" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-chart-2" />;
      case "status_change":
        return <Play className="h-4 w-4 text-primary" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
      default:
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "created":
        return "text-chart-4";
      case "updated":
        return "text-chart-3";
      case "completed":
        return "text-chart-2";
      case "status_change":
        return "text-primary";
      case "comment":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <Card className={`${className || ""}`} data-testid="activity-log">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Activity Log</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-96 px-4">
          {activities.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No activities yet</p>
              <p className="text-sm">Task activities will appear here</p>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {activities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex gap-3 group"
                  data-testid={`activity-${activity.id}`}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    {index < activities.length - 1 && (
                      <div className="w-px h-8 bg-border mt-2" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        {activity.remarks && (
                          <p className="text-sm text-muted-foreground mt-1">{activity.remarks}</p>
                        )}
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className={`text-xs ${getActivityColor(activity.type)}`}>
                            {activity.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          
                          {activity.userId && (
                            <span className="text-xs text-muted-foreground">
                              by {activity.userId}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}