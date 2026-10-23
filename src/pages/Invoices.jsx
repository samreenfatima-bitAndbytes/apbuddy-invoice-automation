import { useMemo, useState } from "react";
import Modal from "../components/Modal";
import RoleGuide from "../components/RoleGuide";
import { IconSearch } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";

const AI_LABEL = {
  unvalidated: "Needs AI",
  passed: "AI OK",
  needs_review: "Review",
  failed: "AI fail",
};

export default function Invoices() {
  const { user } = useAuth();
  const { invoices, validateInvoice, setInvoiceStatus } = useData();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";

  const filters = isAdmin
    ? [
        { id: "all", label: "All" },
        { id: "Pending", label: "Pending" },
        { id: "Approved", label: "Ready to pay" },
        { id: "Paid", label: "Paid" },
      ]
    : [
        { id: "all", label: "All" },
        { id: "ai", label: "Needs AI" },
        { id: "Pending", label: "With Approver" },
        { id: "Approved", label: "Approved" },
      ];

  const rows = useMemo(() => {
    let list = invoices;
    if (filter === "ai") {
      list = list.filter((r) =>
        ["unvalidated", "needs_review", "failed"].includes(r.aiStatus)
      );
    } else if (filter !== "all") {
      list = list.filter((r) => r.status === filter);
    }
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (r) =>
        r.id.toLowerCase().includes(s) ||
        r.vendor.toLowerCase().includes(s) ||
        r.status.toLowerCase().includes(s)
    );
  }, [q, invoices, filter]);

  const runAi = (row) => {
    const result = validateInvoice(row.id, "AI Validator");
    if (result) setDetail({ ...row, ...result });
  };

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>{isAdmin ? "All invoices" : "My invoices"}</h1>
          <p className="page-sub">
            {isAdmin
              ? "Oversee the pipeline. Mark Approved invoices as Paid when finance releases funds."
              : "Create invoice → AI validate → it waits in Approver’s queue. You don’t approve."}
          </p>
        </div>
        <div className="toolbar search-field">
          <IconSearch size={16} />
          <input
            className="input"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {isStaff ? <RoleGuide /> : null}

      <div className="filter-tabs" role="tablist">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={filter === f.id ? "is-active" : undefined}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="simple-table-wrap">
        <table className="simple-table invoice-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Amount</th>
              <th>Due</th>
              <th>AI</th>
              <th>Status</th>
              <th>Your action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-cell">
                  Nothing in this filter.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                let action = (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setDetail(row)}
                  >
                    View
                  </button>
                );

                if (isStaff) {
                  if (row.aiStatus === "unvalidated" || !row.aiStatus) {
                    action = (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => runAi(row)}
                      >
                        AI validate
                      </button>
                    );
                  } else if (row.status === "Pending") {
                    action = (
                      <span className="action-hint">Waiting on Approver</span>
                    );
                  }
                }

                if (isAdmin && row.status === "Approved") {
                  action = (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        setInvoiceStatus(row.id, "Paid", user?.name || "User")
                      }
                    >
                      Mark paid
                    </button>
                  );
                }

                return (
                  <tr key={row.id}>
                    <td>
                      <div className="cell-stack">
                        <strong>{row.id}</strong>
                        <span>{row.vendor}</span>
                      </div>
                    </td>
                    <td>{row.amount}</td>
                    <td>{row.due}</td>
                    <td>
                      <span
                        className={`ai-pill ai-pill--${row.aiStatus || "unvalidated"}`}
                      >
                        {row.aiScore != null
                          ? `${row.aiScore} · ${AI_LABEL[row.aiStatus]}`
                          : AI_LABEL[row.aiStatus] || "Needs AI"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge--${row.status}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{action}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {detail ? (
        <Modal
          title={detail.id}
          onClose={() => setDetail(null)}
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDetail(null)}
              >
                Close
              </button>
              {isStaff ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => runAi(detail)}
                >
                  Run AI validate
                </button>
              ) : null}
            </>
          }
        >
          <div className="form-stack">
            <p className="topbar__meta">
              {detail.vendor} · {detail.amount} · Due {detail.due} · GL{" "}
              {detail.gl}
            </p>
            <div
              className={`ai-result ai-result--${detail.aiStatus || "unvalidated"}`}
            >
              <strong>
                {detail.aiScore != null
                  ? `AI confidence ${detail.aiScore}/100`
                  : "Not validated yet"}
              </strong>
              <span>{AI_LABEL[detail.aiStatus] || "Needs AI"}</span>
            </div>
            <ul className="ai-notes">
              {(detail.aiNotes || []).length === 0 ? (
                <li>Run AI validate to score this document.</li>
              ) : (
                detail.aiNotes.map((n) => <li key={n}>{n}</li>)
              )}
            </ul>
          </div>
        </Modal>
      ) : null}
    </section>
  );
}
