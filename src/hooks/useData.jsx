import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  runAiValidation,
  SEED_ACTIVITY,
  SEED_INVOICES,
  SEED_VENDORS,
} from "../data/demo";
import { emptyEntity, SEED_ENTITIES } from "../data/setup";

const KEY = "apbuddy_data_v5";
const DataContext = createContext(null);

function seed() {
  return {
    entities: SEED_ENTITIES.map((e) => ({ ...e, addresses: [...e.addresses] })),
    users: [
      {
        id: "u1",
        name: "Alex Admin",
        email: "admin@apbuddy.local",
        role: "Admin",
      },
      {
        id: "u2",
        name: "Sam Staff",
        email: "staff@apbuddy.local",
        role: "AP Staff",
      },
      {
        id: "u3",
        name: "Jordan Approver",
        email: "jordan@apbuddy.local",
        role: "Approver",
      },
      {
        id: "u4",
        name: "Casey Finance",
        email: "casey@apbuddy.local",
        role: "AP Staff",
      },
    ],
    glCodes: [
      { id: "gl1", code: "6100", name: "Office Supplies", active: true },
      { id: "gl2", code: "6200", name: "Software & SaaS", active: true },
      { id: "gl3", code: "6300", name: "Shipping & Freight", active: true },
      { id: "gl4", code: "6400", name: "Utilities", active: true },
      { id: "gl5", code: "6500", name: "Facilities", active: true },
    ],
    invoiceRules: [
      {
        id: "ir1",
        label: "Under $1,000 — AP Staff",
        approver: "AP Staff",
        active: true,
      },
      {
        id: "ir2",
        label: "$1,000 – $10,000 — Admin",
        approver: "Admin",
        active: true,
      },
      {
        id: "ir3",
        label: "Over $10,000 — CFO",
        approver: "CFO",
        active: true,
      },
    ],
    paymentRules: [
      { id: "pr1", label: "ACH under $5,000", approver: "Admin", active: true },
      { id: "pr2", label: "Wire any amount", approver: "CFO", active: true },
      { id: "pr3", label: "Check payments", approver: "AP Staff", active: true },
    ],
    vendorPolicies: [
      { id: "vp1", label: "W-9 required before first payment", required: true },
      {
        id: "vp2",
        label: "Bank verification (micro-deposits or Plaid)",
        required: true,
      },
      {
        id: "vp3",
        label: "Certificate of insurance for field vendors",
        required: false,
      },
      {
        id: "vp4",
        label: "Duplicate TIN check against existing vendors",
        required: true,
      },
    ],
    vendorApprovals: [
      {
        id: "va1",
        vendor: "Metro Facilities",
        status: "Pending",
        submitted: "2026-10-20",
      },
      {
        id: "va2",
        vendor: "Orbit Cleaning Co.",
        status: "Pending",
        submitted: "2026-10-21",
      },
      {
        id: "va3",
        vendor: "Summit Legal LLP",
        status: "Approved",
        submitted: "2026-10-12",
      },
    ],
    emailTemplates: [
      {
        id: "et1",
        name: "Invoice received",
        subject: "We received your invoice {{invoice_id}}",
      },
      {
        id: "et2",
        name: "Approval needed",
        subject: "Action required: approve {{invoice_id}}",
      },
      {
        id: "et3",
        name: "Payment remittance",
        subject: "Payment confirmation for {{vendor_name}}",
      },
    ],
    filesSetup: {
      erp: "NetSuite",
      storage: "SFTP",
      connected: true,
    },
    fileMappings: [
      { id: "fm1", source: "vendor_name", target: "Vendor.Name" },
      { id: "fm2", source: "invoice_total", target: "Invoice.Amount" },
      { id: "fm3", source: "invoice_date", target: "Invoice.Date" },
      { id: "fm4", source: "po_number", target: "Invoice.PONumber" },
      { id: "fm5", source: "gl_code", target: "Line.GLCode" },
    ],
    invoices: SEED_INVOICES.map((i) => ({ ...i, aiNotes: [...(i.aiNotes || [])] })),
    vendors: SEED_VENDORS,
    activity: SEED_ACTIVITY,
  };
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return { ...seed(), ...JSON.parse(raw) };
  } catch {
    return seed();
  }
}

export function DataProvider({ children }) {
  const [data, setData] = useState(() => read());
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const notify = useCallback((msg) => setToast(msg), []);

  const setEntities = useCallback((updater) => {
    setData((prev) => ({
      ...prev,
      entities: typeof updater === "function" ? updater(prev.entities) : updater,
    }));
  }, []);

  const loadSampleEntities = useCallback(() => {
    setEntities(
      SEED_ENTITIES.map((e) => ({ ...e, addresses: [...e.addresses] }))
    );
    notify("Sample company loaded");
  }, [notify, setEntities]);

  const clearEntities = useCallback(() => {
    setEntities([emptyEntity()]);
    notify("Entities cleared");
  }, [notify, setEntities]);

  const patch = useCallback((key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: typeof value === "function" ? value(prev[key]) : value,
    }));
  }, []);

  const addInvoice = useCallback(
    ({ vendor, amount, due, gl }, actor) => {
      const nextId =
        Math.max(
          0,
          ...data.invoices.map(
            (i) => Number(String(i.id).replace(/\D/g, "")) || 0
          )
        ) + 1;
      const id = `INV-${nextId}`;
      const row = {
        id,
        vendor,
        amount: amount.startsWith("$") ? amount : `$${amount}`,
        due,
        status: "Pending",
        gl: gl || "6100",
        aiStatus: "unvalidated",
        aiScore: null,
        aiNotes: [],
      };
      setData((prev) => ({
        ...prev,
        invoices: [row, ...prev.invoices],
        activity: [
          { who: actor, what: `Created ${id} for ${vendor}`, when: "Just now" },
          ...prev.activity,
        ].slice(0, 16),
      }));
      notify(`${id} created — run AI validate`);
      return row;
    },
    [data.invoices, notify]
  );

  const setInvoiceStatus = useCallback(
    (id, status, actor) => {
      setData((prev) => ({
        ...prev,
        invoices: prev.invoices.map((inv) =>
          inv.id === id ? { ...inv, status } : inv
        ),
        activity: [
          { who: actor, what: `${status} ${id}`, when: "Just now" },
          ...prev.activity,
        ].slice(0, 16),
      }));
      notify(`${id} → ${status}`);
    },
    [notify]
  );

  const validateInvoice = useCallback(
    (id, actor) => {
      let result = null;
      setData((prev) => {
        const inv = prev.invoices.find((i) => i.id === id);
        if (!inv) return prev;
        result = runAiValidation(inv);
        return {
          ...prev,
          invoices: prev.invoices.map((i) =>
            i.id === id ? { ...i, ...result } : i
          ),
          activity: [
            {
              who: actor || "AI Validator",
              what: `AI validated ${id} — score ${result.aiScore} (${result.aiStatus})`,
              when: "Just now",
            },
            ...prev.activity,
          ].slice(0, 16),
        };
      });
      if (result) {
        notify(`AI score ${result.aiScore} · ${result.aiStatus.replace("_", " ")}`);
      }
      return result;
    },
    [notify]
  );

  const addVendor = useCallback(
    ({ name, category }, actor) => {
      if (data.vendors.some((v) => v.name.toLowerCase() === name.toLowerCase())) {
        notify("Vendor already exists");
        return null;
      }
      const row = {
        name,
        category,
        invoices: 0,
        balance: "$0",
        status: "Pending review",
      };
      setData((prev) => ({
        ...prev,
        vendors: [row, ...prev.vendors],
        activity: [
          { who: actor, what: `Added vendor ${name}`, when: "Just now" },
          ...prev.activity,
        ].slice(0, 16),
      }));
      notify(`${name} added`);
      return row;
    },
    [data.vendors, notify]
  );

  const stats = useMemo(() => {
    const open = data.invoices.filter((i) =>
      ["Pending", "Approved"].includes(i.status)
    ).length;
    const pending = data.invoices.filter((i) => i.status === "Pending").length;
    const aiQueue = data.invoices.filter((i) =>
      ["unvalidated", "needs_review", "failed"].includes(i.aiStatus)
    ).length;
    const paid = data.invoices
      .filter((i) => i.status === "Paid")
      .reduce((sum, i) => {
        const n = Number(String(i.amount).replace(/[^0-9.]/g, "")) || 0;
        return sum + n;
      }, 0);
    return [
      { label: "Open invoices", value: String(open), tone: "mint" },
      { label: "Pending approval", value: String(pending), tone: "amber" },
      { label: "AI review queue", value: String(aiQueue), tone: "blue" },
      {
        label: "Paid this month",
        value: paid >= 1000 ? `$${Math.round(paid / 1000)}k` : `$${paid}`,
        tone: "slate",
      },
    ];
  }, [data.invoices]);

  const value = {
    ...data,
    stats,
    toast,
    notify,
    setEntities,
    loadSampleEntities,
    clearEntities,
    patch,
    addInvoice,
    setInvoiceStatus,
    validateInvoice,
    addVendor,
    addEmptyEntity: () => setEntities((list) => [...list, emptyEntity()]),
    resetDemo: () => {
      localStorage.removeItem(KEY);
      setData(seed());
      notify("Workspace reset to demo data");
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
