import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BrandLogoFull, BrandMark } from "../components/BrandLogo";
import { DEMO_USERS } from "../data/demo";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeDemo, setActiveDemo] = useState("");

  if (user) {
    const home =
      user.role === "approver"
        ? "/app/approvals"
        : user.role === "staff"
          ? "/app/invoices"
          : "/app/dashboard";
    return <Navigate to={home} replace />;
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    const home =
      res.user.role === "approver"
        ? "/app/approvals"
        : res.user.role === "staff"
          ? "/app/invoices"
          : "/app/dashboard";
    navigate(home);
  };

  const fillDemo = (acct) => {
    setEmail(acct.email);
    setPassword(acct.password);
    setActiveDemo(acct.role);
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-page__bg" aria-hidden="true">
        <span className="login-page__orb login-page__orb--a" />
        <span className="login-page__orb login-page__orb--b" />
        <span className="login-page__orb login-page__orb--c" />
        <span className="login-page__grid" />
        <span className="login-page__noise" />
      </div>

      <div className="login-shell">
        <section className="login-hero">
          <div className="login-hero__brand">
            <BrandLogoFull width={112} className="login-hero__logo login-hero__logo--full" />
            <BrandMark size={64} className="login-hero__mark-mobile" />
            <span className="login-hero__name-mobile">APBUDDY</span>
            <span className="login-hero__tag">Payables workspace</span>
          </div>

          <div className="login-hero__copy">
            <h1>Invoice automation with AI validation</h1>
            <p>
              Secure document processing, OpenAI-style checks, and role-based
              approvals for finance teams.
            </p>
          </div>

          <ul className="login-hero__points">
            <li>AI validation on financial documents</li>
            <li>Roles: Admin, AP Staff, Approver</li>
            <li>Approvals, vendors, and configuration</li>
          </ul>
        </section>

        <form className="login-card" onSubmit={onSubmit}>
          <div className="login-card__head">
            <h2>Sign in</h2>
            <p>Pick a role to try the workflow.</p>
          </div>

          <div className="demo-chips demo-chips--3" role="group" aria-label="Demo accounts">
            {DEMO_USERS.map((acct) => (
              <button
                key={acct.email}
                type="button"
                className={
                  activeDemo === acct.role ? "is-active" : undefined
                }
                onClick={() => fillDemo(acct)}
              >
                {acct.role === "admin"
                  ? "Admin"
                  : acct.role === "approver"
                    ? "Approver"
                    : "AP Staff"}
              </button>
            ))}
          </div>

          {error ? <div className="error">{error}</div> : null}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary login-card__submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
