import ActivityLog from '../ActivityLog';
import type { Activity } from "@shared/schema";

export default function ActivityLogExample() {
  // todo: remove mock functionality
  const mockActivities: Activity[] = [
    {
      id: "activity-1",
      taskId: "task-1",
      type: "created",
      description: "Task created",
      remarks: "Initial task setup for mall partnerships",
      userId: "admin",
      createdAt: new Date("2024-01-01T10:00:00Z"),
    },
    {
      id: "activity-2",
      taskId: "task-1",
      type: "status_change",
      description: "Status changed from Not Started to In Progress",
      remarks: "Started reaching out to potential mall partners",
      userId: "partnership-team",
      createdAt: new Date("2024-01-02T14:30:00Z"),
    },
    {
      id: "activity-3",
      taskId: "task-1",
      type: "comment",
      description: "Added progress update",
      remarks: "Contacted 5 malls, 2 have shown initial interest. Following up with detailed proposals.",
      userId: "partnership-team",
      createdAt: new Date("2024-01-03T16:45:00Z"),
    },
    {
      id: "activity-4",
      taskId: "task-1",
      type: "updated",
      description: "Task details updated",
      remarks: "Added specific mall contact information and updated timeline",
      userId: "admin",
      createdAt: new Date("2024-01-04T09:15:00Z"),
    },
  ];

  return (
    <div className="max-w-md">
      <ActivityLog activities={mockActivities} />
    </div>
  );
}