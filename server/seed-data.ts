import { storage } from "./storage";
import type { InsertTask } from "@shared/schema";

// All 17 tasks from the eRupi Pilot Plan communication document
const erupiPilotTasks: InsertTask[] = [
  {
    title: "Finalize two Malls and communicate with Malls",
    description: "Obtain consent to participate in program and establish partnership agreements",
    status: "not_started",
    priority: "high",
    assignedTo: "Partnership Team",
    dueDate: new Date("2024-02-01"),
    dependencies: null,
  },
  {
    title: "Define nature of Program",
    description: "Define Title, participating merchants, T&C, How to Use, Artwork for voucher, Brand and Logo Images",
    status: "not_started", 
    priority: "high",
    assignedTo: "Design Team",
    dueDate: new Date("2024-02-05"),
    dependencies: null,
  },
  {
    title: "Obtain/Repurpose MID from bank",
    description: "Get MID from ICICI clearly showing Fincentive – Mall Name – pilot in voucher title",
    status: "not_started",
    priority: "critical",
    assignedTo: "Banking Team",
    dueDate: new Date("2024-02-10"),
    dependencies: null,
  },
  {
    title: "Mobilising physical field force",
    description: "Organize and deploy field teams for customer engagement and on-ground operations",
    status: "not_started",
    priority: "medium",
    assignedTo: "Operations Team", 
    dueDate: new Date("2024-02-15"),
    dependencies: null,
  },
  {
    title: "Collect customer information",
    description: "Collect customer Name, Mobile number associated with Bank and Gpay. Install and register Gpay if needed",
    status: "not_started",
    priority: "high",
    assignedTo: "Field Team",
    dueDate: new Date("2024-02-20"),
    dependencies: null,
  },
  {
    title: "Share customer list with Gpay for activation",
    description: "Coordinate with Gpay team to activate pilot features for prequalified customers",
    status: "not_started",
    priority: "critical",
    assignedTo: "Integration Team",
    dueDate: new Date("2024-02-25"),
    dependencies: null,
  },
  {
    title: "Activate participating merchant",
    description: "Set up and activate merchant systems for voucher acceptance and processing",
    status: "not_started",
    priority: "high",
    assignedTo: "Merchant Team",
    dueDate: new Date("2024-03-01"),
    dependencies: null,
  },
  {
    title: "Create Pilot Test Distributor",
    description: "Set up internal distributor system for issuing free vouchers to pilot customers",
    status: "not_started",
    priority: "medium",
    assignedTo: "Tech Team",
    dueDate: new Date("2024-03-05"),
    dependencies: null,
  },
  {
    title: "Live guide + Video for customers",
    description: "Create customer education materials and get approval from Gpay and ICICI for brand guidelines",
    status: "not_started",
    priority: "medium",
    assignedTo: "Marketing Team",
    dueDate: new Date("2024-03-10"),
    dependencies: null,
  },
  {
    title: "Verify Google Pay activation for all customers",
    description: "Confirm that all pilot participants have successfully activated Google Pay features",
    status: "not_started",
    priority: "high",
    assignedTo: "Support Team",
    dueDate: new Date("2024-03-15"),
    dependencies: null,
  },
  {
    title: "Generate Saral codes in bulk",
    description: "Generate internal voucher codes and send custom email invitations to pilot participants",
    status: "not_started",
    priority: "medium",
    assignedTo: "Tech Team",
    dueDate: new Date("2024-03-20"),
    dependencies: null,
  },
  {
    title: "WhatsApp nudge to customers for setting PIN",
    description: "Send WhatsApp notifications to guide customers through PIN setup process",
    status: "not_started",
    priority: "medium",
    assignedTo: "Communication Team",
    dueDate: new Date("2024-03-25"),
    dependencies: null,
  },
  {
    title: "Daily MIS from ICICI",
    description: "Set up daily reporting from ICICI for PIN setup tracking and failed redemption data in CSV format",
    status: "not_started",
    priority: "high",
    assignedTo: "Data Team",
    dueDate: new Date("2024-03-30"),
    dependencies: null,
  },
  {
    title: "Tracking MIS for pilot objectives",
    description: "Monitor Saral code issued, eRupi issued, PIN set, Redemption, Failure, and Expiry metrics",
    status: "not_started",
    priority: "critical",
    assignedTo: "Analytics Team",
    dueDate: new Date("2024-04-05"),
    dependencies: null,
  },
  {
    title: "Extend Expiry Date capability",
    description: "Implement voucher extension process in case pilot needs extended duration for better coverage",
    status: "not_started",
    priority: "low",
    assignedTo: "Tech Team",
    dueDate: new Date("2024-04-10"),
    dependencies: null,
  },
  {
    title: "Additional voucher issuance",
    description: "Capability to issue additional vouchers to same participants or increase participant count",
    status: "not_started",
    priority: "medium",
    assignedTo: "Operations Team",
    dueDate: new Date("2024-04-15"),
    dependencies: null,
  },
  {
    title: "Support Queries management",
    description: "Handle customer support queries and provide assistance throughout the pilot program",
    status: "not_started",
    priority: "high",
    assignedTo: "Support Team",
    dueDate: new Date("2024-04-20"),
    dependencies: null,
  },
];

export async function seedErupiTasks() {
  try {
    console.log("Seeding eRupi Pilot Program tasks...");
    
    for (const taskData of erupiPilotTasks) {
      const task = await storage.createTask(taskData);
      console.log(`Created task: ${task.title}`);
    }
    
    console.log(`Successfully created ${erupiPilotTasks.length} tasks for the eRupi Pilot Program`);
  } catch (error) {
    console.error("Failed to seed tasks:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
  seedErupiTasks()
    .then(() => {
      console.log("Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}