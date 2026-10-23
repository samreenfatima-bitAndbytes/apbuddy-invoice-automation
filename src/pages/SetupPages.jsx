import { Link } from "react-router-dom";
import { useData } from "../hooks/useData";
import { IconPlus } from "../components/Icons";

function ConfigCrumb({ label }) {
  return (
    <p className="crumb">
      <Link to="/app/config">Configuration</Link> / {label}
    </p>
  );
}

export function FilesTechSetup() {
  const { filesSetup, patch, notify } = useData();

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <ConfigCrumb label="Files & Tech Setup" />
          <h1>Files & Tech Setup</h1>
          <p className="page-sub">Connect ERP and invoice intake. Change anytime.</p>
        </div>
      </div>
      <div className="setup-card form-stack">
        <div className="field">
          <label htmlFor="erp">ERP / accounting system</label>
          <select
            id="erp"
            value={filesSetup.erp}
            onChange={(e) =>
              patch("filesSetup", { ...filesSetup, erp: e.target.value })
            }
          >
            <option>NetSuite</option>
            <option>QuickBooks</option>
            <option>SAP</option>
            <option>Xero</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="storage">File intake</label>
          <select
            id="storage"
            value={filesSetup.storage}
            onChange={(e) =>
              patch("filesSetup", { ...filesSetup, storage: e.target.value })
            }
          >
            <option>SFTP</option>
            <option>Email inbox</option>
            <option>API upload</option>
          </select>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ width: "fit-content" }}
          onClick={() => {
            patch("filesSetup", { ...filesSetup, connected: true });
            notify("Connection saved");
          }}
        >
          {filesSetup.connected ? "Connected ✓" : "Save connection"}
        </button>
      </div>
    </section>
  );
}

export function FileMapping() {
  const { fileMappings, patch, notify } = useData();

  const update = (id, key, value) => {
    patch("fileMappings", (list) =>
      list.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <ConfigCrumb label="File Mapping" />
          <h1>File Mapping</h1>
          <p className="page-sub">Fields AI extraction and posting use.</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            patch("fileMappings", (list) => [
              ...list,
              {
                id: `fm-${Date.now()}`,
                source: "",
                target: "",
              },
            ]);
          }}
        >
          <IconPlus size={15} />
          Add mapping
        </button>
      </div>
      <div className="setup-card">
        <div className="simple-table-wrap">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Source field</th>
                <th>Maps to</th>
              </tr>
            </thead>
            <tbody>
              {fileMappings.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      className="cell-input"
                      value={row.source}
                      onChange={(e) => update(row.id, "source", e.target.value)}
                      placeholder="source_column"
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      value={row.target}
                      onChange={(e) => update(row.id, "target", e.target.value)}
                      placeholder="APBuddy.Field"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
          onClick={() => notify("Mappings saved")}
        >
          Save mappings
        </button>
      </div>
    </section>
  );
}

export function UserManagement() {
  const { users, patch, notify } = useData();

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <h1>User Management</h1>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            const email = `user${users.length + 1}@apbuddy.local`;
            patch("users", (list) => [
              ...list,
              {
                id: `u-${Date.now()}`,
                name: "New user",
                email,
                role: "AP Staff",
              },
            ]);
            notify("User added");
          }}
        >
          <IconPlus size={15} />
          Invite user
        </button>
      </div>
      <div className="setup-card">
        <div className="simple-table-wrap">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <input
                      className="cell-input"
                      value={u.name}
                      onChange={(e) =>
                        patch("users", (list) =>
                          list.map((row) =>
                            row.id === u.id
                              ? { ...row, name: e.target.value }
                              : row
                          )
                        )
                      }
                    />
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="cell-input"
                      value={u.role}
                      onChange={(e) =>
                        patch("users", (list) =>
                          list.map((row) =>
                            row.id === u.id
                              ? { ...row, role: e.target.value }
                              : row
                          )
                        )
                      }
                    >
                      <option>Admin</option>
                      <option>AP Staff</option>
                      <option>Approver</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function GLCodes() {
  const { glCodes, patch, notify } = useData();

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <ConfigCrumb label="GL Codes" />
          <h1>GL Codes</h1>
          <p className="page-sub">Ledger codes for invoice line coding.</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            patch("glCodes", (list) => [
              ...list,
              {
                id: `gl-${Date.now()}`,
                code: "",
                name: "",
                active: true,
              },
            ]);
          }}
        >
          <IconPlus size={15} />
          Add GL code
        </button>
      </div>
      <div className="setup-card">
        <div className="simple-table-wrap">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {glCodes.map((g) => (
                <tr key={g.id}>
                  <td>
                    <input
                      className="cell-input"
                      value={g.code}
                      onChange={(e) =>
                        patch("glCodes", (list) =>
                          list.map((row) =>
                            row.id === g.id
                              ? { ...row, code: e.target.value }
                              : row
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      value={g.name}
                      onChange={(e) =>
                        patch("glCodes", (list) =>
                          list.map((row) =>
                            row.id === g.id
                              ? { ...row, name: e.target.value }
                              : row
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={g.active}
                      onChange={(e) =>
                        patch("glCodes", (list) =>
                          list.map((row) =>
                            row.id === g.id
                              ? { ...row, active: e.target.checked }
                              : row
                          )
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
          onClick={() => notify("GL codes saved")}
        >
          Save GL codes
        </button>
      </div>
    </section>
  );
}

function RulesPage({ title, stepId, keyName }) {
  const { [keyName]: rules, patch, notify } = useData();

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <ConfigCrumb label={title} />
          <h1>{title}</h1>
          <p className="page-sub">Role-based controls — edit whenever policy changes.</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            patch(keyName, (list) => [
              ...list,
              {
                id: `${keyName}-${Date.now()}`,
                label: "New rule",
                approver: "Admin",
                active: true,
              },
            ]);
          }}
        >
          <IconPlus size={15} />
          Add rule
        </button>
      </div>
      <div className="setup-card">
        <div className="simple-table-wrap">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Rule</th>
                <th>Approver</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id}>
                  <td>
                    <input
                      className="cell-input"
                      value={r.label}
                      onChange={(e) =>
                        patch(keyName, (list) =>
                          list.map((row) =>
                            row.id === r.id
                              ? { ...row, label: e.target.value }
                              : row
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="cell-input"
                      value={r.approver}
                      onChange={(e) =>
                        patch(keyName, (list) =>
                          list.map((row) =>
                            row.id === r.id
                              ? { ...row, approver: e.target.value }
                              : row
                          )
                        )
                      }
                    >
                      <option>AP Staff</option>
                      <option>Admin</option>
                      <option>CFO</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={r.active}
                      onChange={(e) =>
                        patch(keyName, (list) =>
                          list.map((row) =>
                            row.id === r.id
                              ? { ...row, active: e.target.checked }
                              : row
                          )
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
          onClick={() => notify("Rules saved")}
        >
          Save rules
        </button>
      </div>
    </section>
  );
}

export function InvoiceApprovals() {
  return (
    <RulesPage
      title="Invoice Approval Controls"
      stepId="inv-appr"
      keyName="invoiceRules"
    />
  );
}

export function PaymentApprovals() {
  return (
    <RulesPage
      title="Payment Approval Controls"
      stepId="pay-appr"
      keyName="paymentRules"
    />
  );
}

export function VendorPolicies() {
  const { vendorPolicies, patch, notify } = useData();

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <ConfigCrumb label="New Vendor Policies" />
          <h1>New Vendor Policies</h1>
          <p className="page-sub">Compliance checks before paying new vendors.</p>
        </div>
      </div>
      <div className="setup-card form-stack">
        {vendorPolicies.map((p) => (
          <label key={p.id} className="check-row">
            <input
              type="checkbox"
              checked={p.required}
              onChange={(e) =>
                patch("vendorPolicies", (list) =>
                  list.map((row) =>
                    row.id === p.id
                      ? { ...row, required: e.target.checked }
                      : row
                  )
                )
              }
            />
            <span>{p.label}</span>
          </label>
        ))}
        <button
          type="button"
          className="btn btn-primary"
          style={{ width: "fit-content" }}
          onClick={() => notify("Vendor policies saved")}
        >
          Save policies
        </button>
      </div>
    </section>
  );
}

export function VendorApprovals() {
  const { vendorApprovals, patch, notify } = useData();

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <ConfigCrumb label="New Vendor Approvals" />
          <h1>New Vendor Approvals</h1>
          <p className="page-sub">Clear the vendor onboarding queue.</p>
        </div>
      </div>
      <div className="setup-card">
        <div className="simple-table-wrap">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vendorApprovals.map((v) => (
                <tr key={v.id}>
                  <td>{v.vendor}</td>
                  <td>{v.submitted}</td>
                  <td>
                    <span className={`badge badge--${v.status}`}>{v.status}</span>
                  </td>
                  <td>
                    <div className="toolbar">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          patch("vendorApprovals", (list) =>
                            list.map((row) =>
                              row.id === v.id
                                ? { ...row, status: "Approved" }
                                : row
                            )
                          );
                          notify(`${v.vendor} approved`);
                        }}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          patch("vendorApprovals", (list) =>
                            list.map((row) =>
                              row.id === v.id
                                ? { ...row, status: "Rejected" }
                                : row
                            )
                          );
                          notify(`${v.vendor} rejected`);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function EmailTemplates() {
  const { emailTemplates, patch, notify, resetDemo } = useData();

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <ConfigCrumb label="Email Templates" />
          <h1>Email Templates</h1>
          <p className="page-sub">Outbound notices for document lifecycle events.</p>
        </div>
      </div>
      <div className="setup-card form-stack">
        {emailTemplates.map((t) => (
          <div key={t.id} className="template-block">
            <div className="field">
              <label>Template name</label>
              <input
                value={t.name}
                onChange={(e) =>
                  patch("emailTemplates", (list) =>
                    list.map((row) =>
                      row.id === t.id ? { ...row, name: e.target.value } : row
                    )
                  )
                }
              />
            </div>
            <div className="field">
              <label>Subject</label>
              <input
                value={t.subject}
                onChange={(e) =>
                  patch("emailTemplates", (list) =>
                    list.map((row) =>
                      row.id === t.id
                        ? { ...row, subject: e.target.value }
                        : row
                    )
                  )
                }
              />
            </div>
          </div>
        ))}
        <div className="toolbar">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => notify("Templates saved")}
          >
            Save templates
          </button>
          <button type="button" className="btn btn-secondary" onClick={resetDemo}>
            Reset demo data
          </button>
        </div>
      </div>
    </section>
  );
}
