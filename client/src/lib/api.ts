import type { Task, Activity, ChatMessage, InsertTask, InsertActivity } from "@shared/schema";

const API_BASE = "/api";

export interface ChatResponse {
  userMessage: ChatMessage;
  aiMessage: ChatMessage;
  operationResult: any;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
  }
  return response.json();
}

// Task API functions
export const taskApi = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE}/tasks`);
    return handleResponse(response);
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`);
    return handleResponse(response);
  },

  createTask: async (task: InsertTask): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return handleResponse(response);
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
    }
  },
};

// Activity API functions
export const activityApi = {
  getTaskActivities: async (taskId: string): Promise<Activity[]> => {
    const response = await fetch(`${API_BASE}/tasks/${taskId}/activities`);
    return handleResponse(response);
  },

  createActivity: async (taskId: string, activity: Omit<InsertActivity, "taskId">): Promise<Activity> => {
    const response = await fetch(`${API_BASE}/tasks/${taskId}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    });
    return handleResponse(response);
  },
};

// Chat API functions
export const chatApi = {
  getMessages: async (limit?: number): Promise<ChatMessage[]> => {
    const url = limit ? `${API_BASE}/chat/messages?limit=${limit}` : `${API_BASE}/chat/messages`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  sendMessage: async (content: string): Promise<ChatResponse> => {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    return handleResponse(response);
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await fetch(`${API_BASE}/health`);
    return handleResponse(response);
  },
};