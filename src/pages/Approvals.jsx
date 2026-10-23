import RoleGuide from "../components/RoleGuide";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";

const AI_HINT = {
  passed: "AI looks good",
  needs_review: "AI wants a human check",
  failed: "AI found issues",
  unvalidated: "Not AI-validated yet",
};

export default function Approvals() {
  const { user } = useAuth();
  const { invoices, setInvoiceStatus, validateInvoice } = useData();
  const pending = invoices.filter((i) => i.status === "Pending");
  const isApprover = user?.role === "approver";
  const isAdmin = user?.role === "admin";

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>{isApprover ? "My approval queue" : "Approval queue"}</h1>
          <p className="page-sub">
            {isApprover
              ? "This is your home screen. Approve or reject each card."
              : "Backup view of what Approvers see. Prefer letting Approvers decide; intervene if needed."}
          </p>
        </div>
        <span className="count-pill">{pending.length} waiting</span>
      </div>

      {isApprover ? <RoleGuide /> : null}

      {pending.length === 0 ? (
        <div className="empty-panel">
          <strong>Queue clear</strong>
          <p>
            {isAdmin
              ? "No pending invoices. Staff will create more as they work."
              : "Nothing to decide right now."}
          </p>
        </div>
      ) : (
        <div className="approve-list">
          {pending.map((row) => (
            <article key={row.id} className="approve-card">
              <div className="approve-card__top">
                <div>
                  <div className="approve-card__id">{row.id}</div>
                  <h2>{row.vendor}</h2>
                  <p>
                    Due {row.due} · GL {row.gl}
                  </p>
                </div>
                <div className="approve-card__amount">{row.amount}</div>
              </div>

              <div className="approve-card__ai">
                <span
                  className={`ai-pill ai-pill--${row.aiStatus || "unvalidated"}`}
                >
                  {row.aiScore != null ? `AI ${row.aiScore}` : "No AI score"}
                </span>
                <span className="topbar__meta">
                  {AI_HINT[row.aiStatus] || AI_HINT.unvalidated}
                </span>
              </div>

              {(row.aiNotes || []).length > 0 ? (
                <ul className="approve-card__notes">
                  {row.aiNotes.slice(0, 3).map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              ) : null}

              <div className="approve-card__actions">
                {(row.aiStatus === "unvalidated" || !row.aiStatus) &&
                isAdmin ? (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => validateInvoice(row.id, "AI Validator")}
                  >
                    Run AI
                  </button>
                ) : null}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setInvoiceStatus(row.id, "Rejected", user?.name || "User")
                  }
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    setInvoiceStatus(row.id, "Approved", user?.name || "User")
                  }
                >
                  Approve
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
