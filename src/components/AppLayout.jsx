import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { navForRole, ROLE_LABEL } from "../data/demo";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { BrandMark } from "./BrandLogo";
import { IconLogout, IconMenu, IconPlus, IconX } from "./Icons";
import Modal from "./Modal";
import Toast from "./Toast";

const MQ = "(max-width: 991px)";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { toast, vendors, addInvoice, glCodes } = useData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MQ).matches : false
  );
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [form, setForm] = useState({
    vendor: "",
    amount: "",
    due: "",
    gl: "6100",
  });

  const role = user?.role || "staff";
  const nav = navForRole(role);
  const canCreate = role === "admin" || role === "staff";

  useEffect(() => {
    const mql = window.matchMedia(MQ);
    const onChange = () => {
      setIsMobile(mql.matches);
      if (!mql.matches) setOpen(false);
    };
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "User";
  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const openNewInvoice = () => {
    setForm({
      vendor: vendors[0]?.name || "",
      amount: "",
      due: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      gl: glCodes.find((g) => g.active)?.code || "6100",
    });
    setInvoiceOpen(true);
  };

  const submitInvoice = (e) => {
    e.preventDefault();
    if (!form.vendor || !form.amount || !form.due) return;
    addInvoice(form, displayName);
    setInvoiceOpen(false);
    navigate("/app/invoices");
  };

  const workspaceHint =
    role === "approver"
      ? "Approver · decide pending invoices"
      : role === "admin"
        ? "Admin · configure, oversee, mark paid"
        : "AP Staff · create invoices & run AI";

  return (
    <div className="admin-shell">
      {open && isMobile ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside className={`admin-side${open && isMobile ? " is-open" : ""}`}>
        <div className="admin-side__brand">
          <BrandMark size={42} className="admin-side__logo" />
          <div className="admin-side__brand-text">
            <strong>APBUDDY</strong>
            <span className="admin-badge">{ROLE_LABEL[role] || role}</span>
          </div>
          {isMobile ? (
            <button
              type="button"
              className="icon-btn"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <IconX size={18} />
            </button>
          ) : null}
        </div>

        <nav className="admin-nav" onClick={() => setOpen(false)}>
          {nav.map((step) => (
            <NavLink
              key={step.id}
              to={step.to}
              end={step.end}
              className={({ isActive }) =>
                `admin-nav__item${isActive ? " is-active" : ""}`
              }
            >
              <span className="admin-nav__dot" aria-hidden />
              {step.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-side__foot">
          <div className="admin-side__user">
            <div className="admin-top__avatar" aria-hidden>
              {initials}
            </div>
            <div className="admin-side__user-meta">
              <strong>{displayName}</strong>
              <small>{user?.email}</small>
            </div>
          </div>
          <button
            type="button"
            className="btn-ghost-ink admin-side__signout"
            onClick={handleLogout}
          >
            <IconLogout size={16} />
            Sign out
          </button>
          <p className="admin-side__copy">
            © {new Date().getFullYear()} APBuddy
          </p>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-top">
          <div className="admin-top__brand">
            {isMobile ? (
              <button
                type="button"
                className="icon-btn icon-btn--solid"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <IconMenu size={18} />
              </button>
            ) : null}
            <span className="admin-top__workspace">{workspaceHint}</span>
          </div>

          <div className="admin-top__user">
            {canCreate ? (
              <button
                type="button"
                className="btn btn-primary topbar-cta"
                onClick={openNewInvoice}
              >
                <IconPlus size={15} />
                <span className="hide-sm">New invoice</span>
              </button>
            ) : null}
          </div>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>

      {invoiceOpen ? (
        <Modal
          title="New invoice"
          onClose={() => setInvoiceOpen(false)}
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setInvoiceOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="new-invoice-form"
                className="btn btn-primary"
              >
                Create invoice
              </button>
            </>
          }
        >
          <form
            id="new-invoice-form"
            className="form-stack"
            onSubmit={submitInvoice}
          >
            <div className="field">
              <label htmlFor="inv-vendor">Vendor</label>
              <select
                id="inv-vendor"
                value={form.vendor}
                onChange={(e) =>
                  setForm((f) => ({ ...f, vendor: e.target.value }))
                }
                required
              >
                {vendors.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="inv-amount">Amount</label>
              <input
                id="inv-amount"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                placeholder="4280.00"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="inv-due">Due date</label>
              <input
                id="inv-due"
                type="date"
                value={form.due}
                onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="inv-gl">GL code</label>
              <select
                id="inv-gl"
                value={form.gl}
                onChange={(e) => setForm((f) => ({ ...f, gl: e.target.value }))}
              >
                {glCodes
                  .filter((g) => g.active)
                  .map((g) => (
                    <option key={g.id} value={g.code}>
                      {g.code} — {g.name}
                    </option>
                  ))}
              </select>
            </div>
          </form>
        </Modal>
      ) : null}

      <Toast message={toast} />
    </div>
  );
}
