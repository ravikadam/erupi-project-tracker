import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { parseTaskIntent, generateTaskResponse } from "./openai";
import { insertTaskSchema, insertActivitySchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.use(express.json());

  // Task endpoints
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Failed to fetch task:", error);
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedTask = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedTask);
      
      // Create activity log for task creation
      await storage.createActivity({
        taskId: task.id,
        type: "created",
        description: `Task "${task.title}" created`,
        remarks: task.description || undefined,
        userId: "system",
      });

      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid task data", details: error.errors });
      }
      console.error("Failed to create task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const updates = req.body;
      const originalTask = await storage.getTask(req.params.id);
      
      if (!originalTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      const updatedTask = await storage.updateTask(req.params.id, updates);
      
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Create activity log for task update
      const changes = Object.keys(updates).map(key => {
        const oldValue = originalTask[key as keyof typeof originalTask];
        const newValue = updates[key];
        return `${key}: ${oldValue} → ${newValue}`;
      }).join(", ");

      await storage.createActivity({
        taskId: updatedTask.id,
        type: updates.status ? "status_change" : "updated",
        description: `Task updated: ${changes}`,
        remarks: `Updated by user`,
        userId: "user",
      });

      res.json(updatedTask);
    } catch (error) {
      console.error("Failed to update task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const success = await storage.deleteTask(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Failed to delete task:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Activity endpoints
  app.get("/api/tasks/:id/activities", async (req, res) => {
    try {
      const activities = await storage.getTaskActivities(req.params.id);
      res.json(activities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.post("/api/tasks/:id/activities", async (req, res) => {
    try {
      const validatedActivity = insertActivitySchema.parse({
        ...req.body,
        taskId: req.params.id,
      });
      const activity = await storage.createActivity(validatedActivity);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid activity data", details: error.errors });
      }
      console.error("Failed to create activity:", error);
      res.status(500).json({ error: "Failed to create activity" });
    }
  });

  // Chat endpoints
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await storage.getChatMessages(limit);
      res.json(messages.reverse()); // Return in chronological order
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Message content is required" });
      }

      // Save user message
      const userMessage = await storage.createChatMessage({
        content,
        role: "user",
      });

      // Parse user intent with AI
      const taskOperation = await parseTaskIntent(content);
      let operationResult: any = { success: false };

      try {
        // Execute the task operation
        switch (taskOperation.action) {
          case "create":
            if (taskOperation.title) {
              const newTask = await storage.createTask({
                title: taskOperation.title,
                description: taskOperation.description || "",
                status: taskOperation.status || "not_started",
                priority: taskOperation.priority || "medium",
                assignedTo: taskOperation.assignedTo || null,
                dueDate: taskOperation.dueDate ? new Date(taskOperation.dueDate) : null,
                dependencies: null,
              });
              
              await storage.createActivity({
                taskId: newTask.id,
                type: "created",
                description: `Task created via AI assistant`,
                remarks: `Created from chat: "${content}"`,
                userId: "ai-assistant",
              });
              
              operationResult = { success: true, task: newTask };
            }
            break;

          case "update":
            if (taskOperation.taskId) {
              const updates: any = {};
              if (taskOperation.title) updates.title = taskOperation.title;
              if (taskOperation.description) updates.description = taskOperation.description;
              if (taskOperation.status) updates.status = taskOperation.status;
              if (taskOperation.priority) updates.priority = taskOperation.priority;
              if (taskOperation.assignedTo) updates.assignedTo = taskOperation.assignedTo;
              if (taskOperation.dueDate) updates.dueDate = new Date(taskOperation.dueDate);
              
              const updatedTask = await storage.updateTask(taskOperation.taskId, updates);
              operationResult = { success: true, task: updatedTask };
            }
            break;

          case "complete":
            if (taskOperation.taskId) {
              const completedTask = await storage.updateTask(taskOperation.taskId, { 
                status: "completed" 
              });
              
              await storage.createActivity({
                taskId: taskOperation.taskId,
                type: "completed",
                description: "Task marked as completed via AI assistant",
                remarks: `Completed from chat: "${content}"`,
                userId: "ai-assistant",
              });
              
              operationResult = { success: true, task: completedTask };
            }
            break;

          case "add_remark":
            if (taskOperation.taskId && taskOperation.remarks) {
              const activity = await storage.createActivity({
                taskId: taskOperation.taskId,
                type: "comment",
                description: "Comment added via AI assistant",
                remarks: taskOperation.remarks,
                userId: "ai-assistant",
              });
              operationResult = { success: true, activity };
            }
            break;

          case "list_tasks":
            const tasks = await storage.getAllTasks();
            operationResult = { success: true, tasks };
            break;

          case "get_status":
            if (taskOperation.taskId) {
              const task = await storage.getTask(taskOperation.taskId);
              const activities = await storage.getTaskActivities(taskOperation.taskId);
              operationResult = { success: true, task, activities };
            } else {
              const allTasks = await storage.getAllTasks();
              const stats = {
                total: allTasks.length,
                completed: allTasks.filter(t => t.status === "completed").length,
                inProgress: allTasks.filter(t => t.status === "in_progress").length,
                notStarted: allTasks.filter(t => t.status === "not_started").length,
                failed: allTasks.filter(t => t.status === "failed").length,
              };
              operationResult = { success: true, stats, tasks: allTasks };
            }
            break;

          default:
            operationResult = { success: false, error: "Unknown action" };
        }
      } catch (opError) {
        console.error("Task operation failed:", opError);
        operationResult = { success: false, error: opError.message };
      }

      // Generate AI response
      const aiResponseContent = await generateTaskResponse(taskOperation, operationResult);
      
      // Save AI response
      const aiMessage = await storage.createChatMessage({
        content: aiResponseContent,
        role: "assistant",
        taskId: operationResult.task?.id || null,
      });

      res.json({
        userMessage,
        aiMessage,
        operationResult,
      });

    } catch (error) {
      console.error("Failed to process chat message:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}