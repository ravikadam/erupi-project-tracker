import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TaskOperation {
  action: "create" | "update" | "complete" | "delete" | "add_remark" | "get_status" | "list_tasks";
  taskId?: string;
  title?: string;
  description?: string;
  status?: "not_started" | "in_progress" | "completed" | "failed";
  priority?: "low" | "medium" | "high" | "critical";
  assignedTo?: string;
  dueDate?: string;
  remarks?: string;
}

export async function parseTaskIntent(userMessage: string): Promise<TaskOperation> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for the eRupi Pilot Program task management system. Parse user requests into task operations.

Available actions:
- create: Create a new task
- update: Update existing task details (title, description, priority, assignedTo, dueDate)
- complete: Mark a task as completed
- delete: Remove a task
- add_remark: Add activity/comment to a task
- get_status: Get status of specific task or overall progress
- list_tasks: List all tasks or filtered tasks

Extract relevant information and respond with JSON in this format:
{
  "action": "create|update|complete|delete|add_remark|get_status|list_tasks",
  "taskId": "optional - only for update/complete/delete/add_remark/get_status",
  "title": "optional - for create/update",
  "description": "optional - for create/update", 
  "status": "optional - for update (not_started|in_progress|completed|failed)",
  "priority": "optional - for create/update (low|medium|high|critical)",
  "assignedTo": "optional - for create/update",
  "dueDate": "optional - for create/update (ISO date string)",
  "remarks": "optional - for add_remark"
}

If user mentions specific task by number/title, try to match it. Be intelligent about inferring the intent.`
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as TaskOperation;
  } catch (error) {
    console.error("Failed to parse task intent:", error);
    return { action: "list_tasks" }; // Default fallback
  }
}

export async function generateTaskResponse(operation: TaskOperation, result: any): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for the eRupi Pilot Program task management system. Generate helpful, conversational responses about task operations.

Be friendly, concise, and informative. Reference specific task details when available. If there was an error, explain it clearly and suggest next steps.

Context about the eRupi Pilot Program:
- This is a voucher pilot program with GPay
- There are 17 key tasks covering mall partnerships, program setup, customer onboarding, and monitoring
- Tasks involve ecosystem partners like ICICI bank, GPay, and malls
- The goal is to test eRupi vouchers in real market conditions`
        },
        {
          role: "user",
          content: `Task operation completed:
Operation: ${operation.action}
${operation.taskId ? `Task ID: ${operation.taskId}` : ''}
${operation.title ? `Title: ${operation.title}` : ''}
Result: ${JSON.stringify(result, null, 2)}

Generate a helpful response about what happened.`
        },
      ],
    });

    return response.choices[0].message.content || "Task operation completed successfully.";
  } catch (error) {
    console.error("Failed to generate response:", error);
    return "Task operation completed. There was an issue generating a detailed response.";
  }
}