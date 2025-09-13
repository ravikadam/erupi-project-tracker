import { Badge } from "@/components/ui/badge";

type TaskStatus = "not_started" | "in_progress" | "completed" | "failed";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case "not_started":
        return {
          label: "Not Started",
          variant: "secondary" as const,
          className: "text-muted-foreground"
        };
      case "in_progress":
        return {
          label: "In Progress",
          variant: "default" as const,
          className: "bg-chart-3 text-white"
        };
      case "completed":
        return {
          label: "Completed",
          variant: "default" as const,
          className: "bg-chart-2 text-white"
        };
      case "failed":
        return {
          label: "Failed",
          variant: "destructive" as const,
          className: ""
        };
      default:
        return {
          label: "Unknown",
          variant: "secondary" as const,
          className: ""
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} ${className || ""}`}
      data-testid={`status-badge-${status}`}
    >
      {config.label}
    </Badge>
  );
}