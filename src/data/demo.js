export const DEMO_USERS = [
  {
    email: "admin@apbuddy.local",
    password: "Admin@123",
    role: "admin",
    name: "Alex Admin",
  },
  {
    email: "staff@apbuddy.local",
    password: "Staff@123",
    role: "staff",
    name: "Sam Staff",
  },
  {
    email: "approver@apbuddy.local",
    password: "Approve@123",
    role: "approver",
    name: "Jordan Approver",
  },
];

export const ROLE_LABEL = {
  admin: "ADMIN",
  staff: "AP STAFF",
  approver: "APPROVER",
};

export const ROLE_HOME = {
  admin: "/app/dashboard",
  staff: "/app/invoices",
  approver: "/app/approvals",
};

/** Distinct menus — Admin ≠ Staff ≠ Approver */
export function navForRole(role) {
  if (role === "admin") {
    return [
      { to: "/app/dashboard", end: true, label: "Overview", id: "dash" },
      { to: "/app/invoices", label: "All invoices", id: "invoices" },
      { to: "/app/approvals", label: "Approval queue", id: "approvals" },
      { to: "/app/users", label: "Users & roles", id: "users" },
      { to: "/app/config", label: "Configuration", id: "config" },
    ];
  }
  if (role === "approver") {
    return [
      { to: "/app/approvals", end: true, label: "My queue", id: "approvals" },
      { to: "/app/settings", label: "Help & settings", id: "settings" },
    ];
  }
  // staff — intake focused, no approvals / no config
  return [
    { to: "/app/invoices", end: true, label: "My invoices", id: "invoices" },
    { to: "/app/vendors", label: "Vendors", id: "vendors" },
    { to: "/app/settings", label: "Help & settings", id: "settings" },
  ];
}

export const SEED_INVOICES = [
  {
    id: "INV-1042",
    vendor: "Northwind Supplies",
    amount: "$4,280.00",
    due: "2026-10-28",
    status: "Pending",
    gl: "6100",
    aiStatus: "needs_review",
    aiScore: 72,
    aiNotes: ["PO number missing on document", "Amount matches vendor history"],
  },
  {
    id: "INV-1041",
    vendor: "Apex Logistics",
    amount: "$1,950.00",
    due: "2026-10-25",
    status: "Approved",
    gl: "6300",
    aiStatus: "passed",
    aiScore: 96,
    aiNotes: ["Vendor match confirmed", "Line totals validated"],
  },
  {
    id: "INV-1040",
    vendor: "Bright Office Co.",
    amount: "$620.40",
    due: "2026-10-22",
    status: "Paid",
    gl: "6100",
    aiStatus: "passed",
    aiScore: 98,
    aiNotes: ["Duplicate check clear", "Tax ID matched"],
  },
  {
    id: "INV-1039",
    vendor: "CloudHost Ltd",
    amount: "$3,100.00",
    due: "2026-10-30",
    status: "Rejected",
    gl: "6200",
    aiStatus: "failed",
    aiScore: 41,
    aiNotes: ["Suspicious bank change on remittance", "GL code mismatch"],
  },
  {
    id: "INV-1038",
    vendor: "Greenfield Energy",
    amount: "$890.00",
    due: "2026-11-02",
    status: "Pending",
    gl: "6400",
    aiStatus: "unvalidated",
    aiScore: null,
    aiNotes: [],
  },
  {
    id: "INV-1037",
    vendor: "PaperTrail Inc.",
    amount: "$245.00",
    due: "2026-11-05",
    status: "Pending",
    gl: "6100",
    aiStatus: "unvalidated",
    aiScore: null,
    aiNotes: [],
  },
  {
    id: "INV-1036",
    vendor: "Metro Facilities",
    amount: "$7,420.00",
    due: "2026-11-08",
    status: "Approved",
    gl: "6500",
    aiStatus: "passed",
    aiScore: 91,
    aiNotes: ["High-value invoice — routed for Approver"],
  },
];

export const SEED_VENDORS = [
  {
    name: "Northwind Supplies",
    category: "Office",
    invoices: 18,
    balance: "$12,400",
    status: "Active",
  },
  {
    name: "Apex Logistics",
    category: "Shipping",
    invoices: 9,
    balance: "$5,220",
    status: "Active",
  },
  {
    name: "Bright Office Co.",
    category: "Facilities",
    invoices: 14,
    balance: "$2,110",
    status: "Active",
  },
  {
    name: "CloudHost Ltd",
    category: "SaaS",
    invoices: 6,
    balance: "$9,300",
    status: "Active",
  },
  {
    name: "Greenfield Energy",
    category: "Utilities",
    invoices: 4,
    balance: "$1,780",
    status: "Active",
  },
  {
    name: "PaperTrail Inc.",
    category: "Office",
    invoices: 11,
    balance: "$640",
    status: "On hold",
  },
  {
    name: "Metro Facilities",
    category: "Facilities",
    invoices: 3,
    balance: "$7,420",
    status: "Pending review",
  },
];

export const SEED_ACTIVITY = [
  {
    who: "AI Validator",
    what: "Flagged INV-1042 — PO missing (score 72)",
    when: "8 min ago",
  },
  {
    who: "Sam Staff",
    what: "Submitted INV-1042 for approval",
    when: "12 min ago",
  },
  { who: "Jordan Approver", what: "Approved INV-1041", when: "1 hr ago" },
  {
    who: "Sam Staff",
    what: "Added vendor context for Bright Office Co.",
    when: "Yesterday",
  },
  { who: "Alex Admin", what: "Marked INV-1040 as paid", when: "Yesterday" },
];

export function runAiValidation(invoice) {
  const amount = Number(String(invoice.amount).replace(/[^0-9.]/g, "")) || 0;
  const notes = [];
  let score = 88;

  if (!invoice.vendor?.trim()) {
    notes.push("Vendor name could not be extracted");
    score -= 25;
  } else {
    notes.push(`Vendor matched: ${invoice.vendor}`);
  }

  if (amount <= 0) {
    notes.push("Invoice total unreadable");
    score -= 30;
  } else if (amount > 5000) {
    notes.push("High-value document — dual approval recommended");
    score -= 8;
  } else {
    notes.push("Line totals reconciled");
  }

  if (!invoice.gl) {
    notes.push("Suggested GL code missing — map manually");
    score -= 12;
  } else {
    notes.push(`GL ${invoice.gl} looks consistent with vendor category`);
  }

  const n = Number(String(invoice.id).replace(/\D/g, "")) || 0;
  if (n % 3 === 0) {
    notes.push("PO / invoice cross-check incomplete");
    score -= 15;
  }
  if (n % 5 === 0) {
    notes.push("Possible duplicate of a prior remittance");
    score -= 20;
  }

  score = Math.max(20, Math.min(99, score));
  let aiStatus = "passed";
  if (score < 55) aiStatus = "failed";
  else if (score < 85) aiStatus = "needs_review";

  return { aiStatus, aiScore: score, aiNotes: notes };
}
