import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageSquare, CheckCircle, Play, AlertCircle, Plus } from "lucide-react";
import type { Activity } from "@shared/schema";

interface ActivityLogProps {
  activities: Activity[];
  className?: string;
}

export default function ActivityLog({ activities, className }: ActivityLogProps) {
  const isMobile = useIsMobile();
  
  const getActivityIcon = (type: string) => {
    const iconSize = isMobile ? "h-3 w-3" : "h-4 w-4";
    switch (type) {
      case "created":
        return <Plus className={`${iconSize} text-chart-4`} />;
      case "updated":
        return <AlertCircle className={`${iconSize} text-chart-3`} />;
      case "completed":
        return <CheckCircle className={`${iconSize} text-chart-2`} />;
      case "status_change":
        return <Play className={`${iconSize} text-primary`} />;
      case "comment":
        return <MessageSquare className={`${iconSize} text-muted-foreground`} />;
      default:
        return <MessageSquare className={`${iconSize} text-muted-foreground`} />;
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
      month: isMobile ? 'numeric' : 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...(isMobile ? {} : { year: undefined })
    }).format(new Date(date));
  };

  return (
    <Card className={`${className || ""}`} data-testid="activity-log">
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="text-base md:text-lg">Activity Log</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className={`${isMobile ? 'h-80' : 'h-96'} px-3 md:px-4`}>
          {activities.length === 0 ? (
            <div className="text-center text-muted-foreground py-6 md:py-8">
              <MessageSquare className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm md:text-base">No activities yet</p>
              <p className="text-xs md:text-sm">Task activities will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4 pb-3 md:pb-4">
              {activities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex gap-2 md:gap-3 group"
                  data-testid={`activity-${activity.id}`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`flex-shrink-0 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-muted flex items-center justify-center`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    {index < activities.length - 1 && (
                      <div className={`w-px ${isMobile ? 'h-6' : 'h-8'} bg-border mt-2`} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 pb-3 md:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium">{activity.description}</p>
                        {activity.remarks && (
                          <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">{activity.remarks}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
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
                      
                      <span className="text-xs text-muted-foreground whitespace-nowrap self-start">
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