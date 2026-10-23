import { Link } from "react-router-dom";
import { emptyEntity } from "../data/setup";
import { useData } from "../hooks/useData";
import { IconGlobe, IconPlus, IconX } from "../components/Icons";

export default function CompanyStructure() {
  const {
    entities,
    setEntities,
    loadSampleEntities,
    clearEntities,
    notify,
  } = useData();

  const update = (id, patch) => {
    setEntities((list) =>
      list.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  const updateAddress = (id, index, value) => {
    setEntities((list) =>
      list.map((row) => {
        if (row.id !== id) return row;
        const addresses = [...row.addresses];
        addresses[index] = value;
        return { ...row, addresses };
      })
    );
  };

  const addAddress = (id) => {
    setEntities((list) =>
      list.map((row) =>
        row.id === id ? { ...row, addresses: [...row.addresses, ""] } : row
      )
    );
  };

  const removeAddress = (id, index) => {
    setEntities((list) =>
      list.map((row) => {
        if (row.id !== id) return row;
        if (row.addresses.length <= 1) return { ...row, addresses: [""] };
        return {
          ...row,
          addresses: row.addresses.filter((_, i) => i !== index),
        };
      })
    );
  };

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <p className="crumb">
            <Link to="/app/config">Configuration</Link> / Company Structure
          </p>
          <h1>Company Structure</h1>
          <p className="page-sub">
            Manage legal entities used when posting and validating invoices.
            Editable anytime.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => notify("Company structure saved")}
        >
          Save changes
        </button>
      </div>

      <div className="toolbar">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadSampleEntities}
        >
          Load sample company
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={clearEntities}
        >
          Clear
        </button>
      </div>

      <div className="entity-table-wrap">
        <table className="entity-table">
          <thead>
            <tr>
              <th className="col-drag" aria-label="Reorder" />
              <th>Entity Name</th>
              <th>TID #</th>
              <th>Domain</th>
              <th>Addresses</th>
              <th>Location Code</th>
              <th>Parent Entity</th>
              <th className="col-act" aria-label="Remove" />
            </tr>
          </thead>
          <tbody>
            {entities.map((row) => (
              <tr key={row.id}>
                <td className="col-drag">
                  <span className="drag-handle">⋮⋮</span>
                </td>
                <td>
                  <input
                    className="cell-input"
                    placeholder="Type name here"
                    value={row.name}
                    onChange={(e) => update(row.id, { name: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    placeholder="Type # here"
                    value={row.tid}
                    onChange={(e) => update(row.id, { tid: e.target.value })}
                  />
                </td>
                <td>
                  <div className="domain-field">
                    <span className="domain-field__icon" aria-hidden>
                      <IconGlobe size={15} />
                    </span>
                    <input
                      className="cell-input"
                      placeholder="company.com"
                      value={row.domain}
                      onChange={(e) =>
                        update(row.id, { domain: e.target.value })
                      }
                    />
                  </div>
                </td>
                <td>
                  <div className="addr-stack">
                    {row.addresses.map((addr, i) => (
                      <div key={`${row.id}-a-${i}`} className="addr-row">
                        <input
                          className="cell-input"
                          placeholder="Type address here"
                          value={addr}
                          onChange={(e) =>
                            updateAddress(row.id, i, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="icon-btn icon-btn--tiny"
                          aria-label="Clear address"
                          onClick={() => removeAddress(row.id, i)}
                        >
                          <IconX size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => addAddress(row.id)}
                    >
                      + New address
                    </button>
                  </div>
                </td>
                <td>
                  <input
                    className="cell-input"
                    placeholder="Location code"
                    value={row.locationCode}
                    onChange={(e) =>
                      update(row.id, { locationCode: e.target.value })
                    }
                  />
                </td>
                <td>
                  <select
                    className="cell-input"
                    value={row.parentId}
                    onChange={(e) =>
                      update(row.id, { parentId: e.target.value })
                    }
                  >
                    <option value="">Select entity</option>
                    {entities
                      .filter((e) => e.id !== row.id && e.name.trim())
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="col-act">
                  <button
                    type="button"
                    className="icon-btn icon-btn--tiny"
                    aria-label="Remove entity"
                    onClick={() =>
                      setEntities((list) =>
                        list.length <= 1
                          ? list
                          : list.filter((r) => r.id !== row.id)
                      )
                    }
                    disabled={entities.length <= 1}
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
        className="link-btn link-btn--lg"
        onClick={() => setEntities((list) => [...list, emptyEntity()])}
      >
        <IconPlus size={16} />
        Add new entity
      </button>
    </section>
  );
}
