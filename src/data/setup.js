/** Admin configuration sections (always editable — not a one-time wizard) */
export const CONFIG_SECTIONS = [
  {
    id: "company",
    to: "/app/config/company",
    label: "Company Structure",
    blurb: "Legal entities, tax IDs, domains, and locations.",
  },
  {
    id: "files",
    to: "/app/config/files-tech",
    label: "Files & Tech Setup",
    blurb: "ERP connection and invoice file intake channel.",
  },
  {
    id: "mapping",
    to: "/app/config/file-mapping",
    label: "File Mapping",
    blurb: "Map document fields for AI extraction & posting.",
  },
  {
    id: "gl",
    to: "/app/config/gl-codes",
    label: "GL Codes",
    blurb: "Ledger codes used when coding invoice lines.",
  },
  {
    id: "inv-appr",
    to: "/app/config/invoice-approvals",
    label: "Invoice Approval Controls",
    blurb: "Role-based routing by amount / policy.",
  },
  {
    id: "pay-appr",
    to: "/app/config/payment-approvals",
    label: "Payment Approval Controls",
    blurb: "Who can release ACH, wire, or check payments.",
  },
  {
    id: "vend-pol",
    to: "/app/config/vendor-policies",
    label: "New Vendor Policies",
    blurb: "W-9, bank verification, and compliance checks.",
  },
  {
    id: "vend-appr",
    to: "/app/config/vendor-approvals",
    label: "New Vendor Approvals",
    blurb: "Review vendors waiting for onboarding.",
  },
  {
    id: "email",
    to: "/app/config/email-templates",
    label: "Email Templates",
    blurb: "Notices for received, approval, and remittance.",
  },
];

// Back-compat alias used by older imports
export const SETUP_STEPS = CONFIG_SECTIONS;

export const emptyEntity = () => ({
  id: `ent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: "",
  tid: "",
  domain: "",
  addresses: [""],
  locationCode: "",
  parentId: "",
});

export const SEED_ENTITIES = [
  {
    id: "ent-holdco",
    name: "APBuddy Holdings",
    tid: "98-7654321",
    domain: "apbuddy.com",
    addresses: ["100 Market Street, Suite 400, San Francisco, CA 94105"],
    locationCode: "HQ-SF",
    parentId: "",
  },
  {
    id: "ent-ops",
    name: "APBuddy Operations LLC",
    tid: "98-1112233",
    domain: "ops.apbuddy.com",
    addresses: [
      "220 Industrial Pkwy, Austin, TX 78701",
      "PO Box 441, Austin, TX 78701",
    ],
    locationCode: "OPS-ATX",
    parentId: "ent-holdco",
  },
  {
    id: "ent-eu",
    name: "APBuddy Europe BV",
    tid: "NL-5522099",
    domain: "eu.apbuddy.com",
    addresses: ["Herengracht 124, 1015 BT Amsterdam"],
    locationCode: "EU-AMS",
    parentId: "ent-holdco",
  },
];
