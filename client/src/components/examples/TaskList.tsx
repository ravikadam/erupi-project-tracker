import TaskList from '../TaskList';
import type { Task } from "@shared/schema";

export default function TaskListExample() {
  // todo: remove mock functionality
  const mockTasks: Task[] = [
    {
      id: "task-1",
      title: "Finalize two Malls and communicate",
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
    }
  ];

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    console.log(`Updating task ${taskId}:`, updates);
  };

  const handleViewTaskDetails = (taskId: string) => {
    console.log(`Viewing details for task: ${taskId}`);
  };

  return (
    <div className="max-w-6xl">
      <TaskList 
        tasks={mockTasks}
        onUpdateTask={handleUpdateTask}
        onViewTaskDetails={handleViewTaskDetails}
      />
    </div>
  );
}