import { useState } from "react";
import { IconGlobe, IconPlus, IconX } from "../components/Icons";
import RoleGuide from "../components/RoleGuide";
import { emptyEntity } from "../data/setup";
import { useData } from "../hooks/useData";

const SECTIONS = [
  { id: "company", label: "1. Company" },
  { id: "files", label: "2. Files & ERP" },
  { id: "mapping", label: "3. AI field map" },
  { id: "gl", label: "4. GL codes" },
  { id: "inv-appr", label: "5. Invoice rules" },
  { id: "pay-appr", label: "6. Payment rules" },
  { id: "vend-pol", label: "7. Vendor policies" },
  { id: "vend-appr", label: "8. Vendor approvals" },
  { id: "email", label: "9. Email templates" },
];

export default function ConfigHub() {
  const [section, setSection] = useState("company");
  const data = useData();
  const { notify, resetDemo } = data;

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>Configuration</h1>
          <p className="page-sub">
            All admin settings in one place. Pick a section on the left — nothing
            is locked; change policy whenever you need.
          </p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={resetDemo}>
          Reset demo data
        </button>
      </div>

      <RoleGuide />

      <div className="config-work">
        <nav className="config-work__nav" aria-label="Configuration sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={section === s.id ? "is-active" : undefined}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="config-work__panel">
          {section === "company" ? <CompanyPanel /> : null}
          {section === "files" ? <FilesPanel /> : null}
          {section === "mapping" ? <MappingPanel /> : null}
          {section === "gl" ? <GlPanel /> : null}
          {section === "inv-appr" ? (
            <RulesPanel
              title="Invoice approval rules"
              keyName="invoiceRules"
              blurb="Who must approve invoices by amount band."
            />
          ) : null}
          {section === "pay-appr" ? (
            <RulesPanel
              title="Payment approval rules"
              keyName="paymentRules"
              blurb="Who can release ACH, wire, or check payments."
            />
          ) : null}
          {section === "vend-pol" ? <VendorPolicyPanel /> : null}
          {section === "vend-appr" ? <VendorApprovalPanel /> : null}
          {section === "email" ? <EmailPanel /> : null}

          <div className="config-work__save">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => notify("Configuration saved")}
            >
              Save this section
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompanyPanel() {
  const {
    entities,
    setEntities,
    loadSampleEntities,
    clearEntities,
  } = useData();

  const update = (id, patch) => {
    setEntities((list) =>
      list.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  return (
    <div className="form-stack">
      <div>
        <h2>Company structure</h2>
        <p className="page-sub">Legal entities used when posting invoices.</p>
      </div>
      <div className="toolbar">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadSampleEntities}
        >
          Load sample
        </button>
        <button type="button" className="btn btn-secondary" onClick={clearEntities}>
          Clear
        </button>
      </div>
      <div className="entity-table-wrap">
        <table className="entity-table">
          <thead>
            <tr>
              <th>Entity</th>
              <th>TID #</th>
              <th>Domain</th>
              <th>Address</th>
              <th>Location</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {entities.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    className="cell-input"
                    value={row.name}
                    placeholder="Name"
                    onChange={(e) => update(row.id, { name: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    value={row.tid}
                    placeholder="Tax ID"
                    onChange={(e) => update(row.id, { tid: e.target.value })}
                  />
                </td>
                <td>
                  <div className="domain-field">
                    <IconGlobe size={14} />
                    <input
                      className="cell-input"
                      value={row.domain}
                      placeholder="domain.com"
                      onChange={(e) =>
                        update(row.id, { domain: e.target.value })
                      }
                    />
                  </div>
                </td>
                <td>
                  <input
                    className="cell-input"
                    value={row.addresses[0] || ""}
                    placeholder="Address"
                    onChange={(e) =>
                      update(row.id, { addresses: [e.target.value] })
                    }
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    value={row.locationCode}
                    placeholder="Code"
                    onChange={(e) =>
                      update(row.id, { locationCode: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="icon-btn icon-btn--tiny"
                    onClick={() =>
                      setEntities((list) =>
                        list.length <= 1
                          ? list
                          : list.filter((r) => r.id !== row.id)
                      )
                    }
                    disabled={entities.length <= 1}
                    aria-label="Remove"
                  >
                    <IconX size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="link-btn"
        onClick={() => setEntities((list) => [...list, emptyEntity()])}
      >
        <IconPlus size={15} /> Add entity
      </button>
    </div>
  );
}

function FilesPanel() {
  const { filesSetup, patch, notify } = useData();
  return (
    <div className="form-stack">
      <div>
        <h2>Files & ERP</h2>
        <p className="page-sub">Where invoices arrive and which ERP they post to.</p>
      </div>
      <div className="field">
        <label htmlFor="erp">ERP</label>
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
        <label htmlFor="storage">Intake channel</label>
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
        className="btn btn-secondary"
        style={{ width: "fit-content" }}
        onClick={() => {
          patch("filesSetup", { ...filesSetup, connected: true });
          notify("ERP connection saved");
        }}
      >
        {filesSetup.connected ? "Connected ✓" : "Connect"}
      </button>
    </div>
  );
}

function MappingPanel() {
  const { fileMappings, patch } = useData();
  return (
    <div className="form-stack">
      <div>
        <h2>AI field mapping</h2>
        <p className="page-sub">
          Map extracted document fields to APBuddy / ERP fields.
        </p>
      </div>
      <div className="simple-table-wrap">
        <table className="simple-table">
          <thead>
            <tr>
              <th>Source (document)</th>
              <th>Target (system)</th>
            </tr>
          </thead>
          <tbody>
            {fileMappings.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    className="cell-input"
                    value={row.source}
                    onChange={(e) =>
                      patch("fileMappings", (list) =>
                        list.map((r) =>
                          r.id === row.id
                            ? { ...r, source: e.target.value }
                            : r
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    value={row.target}
                    onChange={(e) =>
                      patch("fileMappings", (list) =>
                        list.map((r) =>
                          r.id === row.id
                            ? { ...r, target: e.target.value }
                            : r
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
        className="link-btn"
        onClick={() =>
          patch("fileMappings", (list) => [
            ...list,
            { id: `fm-${Date.now()}`, source: "", target: "" },
          ])
        }
      >
        <IconPlus size={15} /> Add mapping
      </button>
    </div>
  );
}

function GlPanel() {
  const { glCodes, patch } = useData();
  return (
    <div className="form-stack">
      <div>
        <h2>GL codes</h2>
        <p className="page-sub">Codes staff pick when creating invoices.</p>
      </div>
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
                        list.map((r) =>
                          r.id === g.id ? { ...r, code: e.target.value } : r
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
                        list.map((r) =>
                          r.id === g.id ? { ...r, name: e.target.value } : r
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
                        list.map((r) =>
                          r.id === g.id
                            ? { ...r, active: e.target.checked }
                            : r
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
    </div>
  );
}

function RulesPanel({ title, keyName, blurb }) {
  const { [keyName]: rules, patch } = useData();
  return (
    <div className="form-stack">
      <div>
        <h2>{title}</h2>
        <p className="page-sub">{blurb}</p>
      </div>
      <div className="simple-table-wrap">
        <table className="simple-table">
          <thead>
            <tr>
              <th>Rule</th>
              <th>Approver role</th>
              <th>On</th>
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
                    <option>Approver</option>
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
    </div>
  );
}

function VendorPolicyPanel() {
  const { vendorPolicies, patch } = useData();
  return (
    <div className="form-stack">
      <div>
        <h2>Vendor policies</h2>
        <p className="page-sub">Required checks before a new vendor is paid.</p>
      </div>
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
    </div>
  );
}

function VendorApprovalPanel() {
  const { vendorApprovals, patch, notify } = useData();
  return (
    <div className="form-stack">
      <div>
        <h2>Vendor onboarding approvals</h2>
        <p className="page-sub">Clear vendors waiting to join the master list.</p>
      </div>
      <div className="simple-table-wrap">
        <table className="simple-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Submitted</th>
              <th>Status</th>
              <th />
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
                  {v.status === "Pending" ? (
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
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmailPanel() {
  const { emailTemplates, patch } = useData();
  return (
    <div className="form-stack">
      <div>
        <h2>Email templates</h2>
        <p className="page-sub">Messages sent during the invoice lifecycle.</p>
      </div>
      {emailTemplates.map((t) => (
        <div key={t.id} className="template-block">
          <div className="field">
            <label>Name</label>
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
                    row.id === t.id ? { ...row, subject: e.target.value } : row
                  )
                )
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
