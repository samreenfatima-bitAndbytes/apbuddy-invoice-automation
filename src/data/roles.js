export const ROLE_GUIDE = {
  admin: {
    title: "You are Admin",
    summary:
      "Own the system: configure company rules, manage users, oversee invoices, and mark payments.",
    actions: [
      "Configure entities, ERP, AI field mapping, GL codes, and approval rules",
      "Invite users (Admin / AP Staff / Approver)",
      "Review any invoice and mark Approved invoices as Paid",
      "Watch the Approvals queue if Approvers need backup",
    ],
    notForYou: [
      "Day-to-day invoice typing is mainly AP Staff work",
      "Routine approve/reject is mainly Approver work",
    ],
  },
  staff: {
    title: "You are AP Staff",
    summary:
      "Run intake: create invoices, run AI validation, keep vendors current. Approvers decide approve/reject.",
    actions: [
      "Create new invoices",
      "Run AI validate on documents",
      "Add / update vendors",
      "Hand off Pending invoices to the Approver queue",
    ],
    notForYou: [
      "You don’t approve or reject (Approver does)",
      "You don’t change company configuration (Admin does)",
    ],
  },
  approver: {
    title: "You are Approver",
    summary:
      "Decide only: open your queue, read AI notes, approve or reject. No setup, no intake.",
    actions: [
      "Open My queue",
      "Read AI score and notes",
      "Approve or Reject each pending invoice",
    ],
    notForYou: [
      "You don’t create invoices",
      "You don’t edit Configuration or Users",
    ],
  },
};
