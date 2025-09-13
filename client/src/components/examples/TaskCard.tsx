import TaskCard from '../TaskCard';
import type { Task } from "@shared/schema";

export default function TaskCardExample() {
  // todo: remove mock functionality
  const mockTask: Task = {
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
  };

  const handleUpdateStatus = (taskId: string, status: string) => {
    console.log(`Updating task ${taskId} to status: ${status}`);
  };

  const handleViewDetails = (taskId: string) => {
    console.log(`Viewing details for task: ${taskId}`);
  };

  return (
    <div className="max-w-md">
      <TaskCard 
        task={mockTask} 
        onUpdateStatus={handleUpdateStatus}
        onViewDetails={handleViewDetails}
        activityCount={3}
      />
    </div>
  );
}