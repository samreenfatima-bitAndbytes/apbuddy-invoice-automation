import { useState } from "react";
import Modal from "../components/Modal";
import { IconPlus } from "../components/Icons";
import { useData } from "../hooks/useData";

export default function Users() {
  const { users, patch, notify } = useData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "AP Staff",
  });

  const submit = (e) => {
    e.preventDefault();
    patch("users", (list) => [
      ...list,
      { id: `u-${Date.now()}`, ...form },
    ]);
    notify(`User ${form.name} added`);
    setOpen(false);
    setForm({ name: "", email: "", role: "AP Staff" });
  };

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>Users</h1>
          <p className="page-sub">
            Role-based access: Admin configures policy; AP Staff processes
            invoices; Approvers clear the queue.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setOpen(true)}
        >
          <IconPlus size={15} />
          Invite user
        </button>
      </div>

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

      {open ? (
        <Modal
          title="Invite user"
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
                form="invite-user-form"
                className="btn btn-primary"
              >
                Save user
              </button>
            </>
          }
        >
          <form id="invite-user-form" className="form-stack" onSubmit={submit}>
            <div className="field">
              <label htmlFor="user-name">Name</label>
              <input
                id="user-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="field">
              <label htmlFor="user-email">Email</label>
              <input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </div>
            <div className="field">
              <label htmlFor="user-role">Role</label>
              <select
                id="user-role"
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
              >
                <option>Admin</option>
                <option>AP Staff</option>
                <option>Approver</option>
              </select>
            </div>
          </form>
        </Modal>
      ) : null}
    </section>
  );
}
