import RoleGuide from "../components/RoleGuide";
import { ROLE_LABEL } from "../data/demo";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";

export default function Settings() {
  const { user } = useAuth();
  const { resetDemo } = useData();

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>Help & settings</h1>
          <p className="page-sub">Who you are and what you’re supposed to do.</p>
        </div>
      </div>

      <RoleGuide />

      <div className="setup-card form-stack">
        <div>
          <strong>Signed in as</strong>
          <p className="topbar__meta">
            {user?.name} · {user?.email} ·{" "}
            {ROLE_LABEL[user?.role] || user?.role}
          </p>
        </div>
        <div>
          <strong>How the three roles connect</strong>
          <p className="topbar__meta">
            Staff creates &amp; AI-validates → Approver decides → Admin pays /
            configures. Sign out and try another role from the login chips.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ width: "fit-content" }}
          onClick={resetDemo}
        >
          Reset demo data
        </button>
      </div>
    </section>
  );
}
