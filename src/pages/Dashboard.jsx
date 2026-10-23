import { Link } from "react-router-dom";
import RoleGuide from "../components/RoleGuide";
import { useData } from "../hooks/useData";

export default function Dashboard() {
  const { stats, invoices, activity, users, entities, filesSetup } = useData();
  const pending = invoices.filter((i) => i.status === "Pending").length;
  const approved = invoices.filter((i) => i.status === "Approved").length;

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>Admin overview</h1>
          <p className="page-sub">
            System health and shortcuts. Staff handles intake; Approvers clear
            the queue; you configure policy and mark payments.
          </p>
        </div>
        <div className="toolbar">
          <Link to="/app/approvals" className="btn btn-secondary">
            Approval queue ({pending})
          </Link>
          <Link to="/app/config" className="btn btn-primary">
            Open configuration
          </Link>
        </div>
      </div>

      <RoleGuide />

      <div className="stats">
        {stats.map((s) => (
          <article key={s.label} className={`stat stat--${s.tone}`}>
            <div className="stat__label">{s.label}</div>
            <div className="stat__value">{s.value}</div>
          </article>
        ))}
      </div>

      <div className="grid-2">
        <div className="setup-card">
          <div className="panel-title">Needs your attention</div>
          <ul className="attention-list">
            <li>
              <span>{pending} invoices waiting for Approver</span>
              <Link to="/app/approvals">Open queue</Link>
            </li>
            <li>
              <span>{approved} approved — ready to mark paid</span>
              <Link to="/app/invoices">Open invoices</Link>
            </li>
            <li>
              <span>
                {entities.length} entities · ERP {filesSetup.erp} ·{" "}
                {users.length} users
              </span>
              <Link to="/app/config">Edit config</Link>
            </li>
          </ul>
        </div>

        <div className="setup-card">
          <div className="panel-title">Recent activity</div>
          <ul className="activity">
            {activity.slice(0, 6).map((a) => (
              <li key={`${a.who}-${a.what}-${a.when}`}>
                <strong>
                  {a.who} — {a.what}
                </strong>
                <span>{a.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
