import { useState } from "react";
import Modal from "../components/Modal";
import RoleGuide from "../components/RoleGuide";
import { IconPlus } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";

export default function Vendors() {
  const { user } = useAuth();
  const { vendors, addVendor } = useData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Office" });

  const submit = (e) => {
    e.preventDefault();
    const row = addVendor(form, user?.name || "User");
    if (row) {
      setOpen(false);
      setForm({ name: "", category: "Office" });
    }
  };

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>Vendors</h1>
          <p className="page-sub">
            Staff-owned list. Keep vendors accurate so AI can match invoices.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setOpen(true)}
        >
          <IconPlus size={15} />
          Add vendor
        </button>
      </div>

      <RoleGuide />

      <div className="simple-table-wrap">
        <table className="simple-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Invoices</th>
              <th>Open balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.name}>
                <td>{v.name}</td>
                <td>{v.category}</td>
                <td>{v.invoices}</td>
                <td>{v.balance}</td>
                <td>{v.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open ? (
        <Modal
          title="Add vendor"
          onClose={() => setOpen(false)}
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-vendor-form"
                className="btn btn-primary"
              >
                Save vendor
              </button>
            </>
          }
        >
          <form id="add-vendor-form" className="form-stack" onSubmit={submit}>
            <div className="field">
              <label htmlFor="vendor-name">Name</label>
              <input
                id="vendor-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="field">
              <label htmlFor="vendor-category">Category</label>
              <select
                id="vendor-category"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                <option>Office</option>
                <option>Shipping</option>
                <option>Facilities</option>
                <option>SaaS</option>
                <option>Utilities</option>
                <option>Other</option>
              </select>
            </div>
          </form>
        </Modal>
      ) : null}
    </section>
  );
}
