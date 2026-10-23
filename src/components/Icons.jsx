const sizeProps = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export function IconDashboard(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

export function IconInvoices(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <path d="M8 3h7l4 4v14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M15 3v4h4" />
      <path d="M9 12h6M9 16h6M9 8h2" />
    </svg>
  );
}

export function IconVendors(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <path d="M3 21h18" />
      <path d="M5 21V8l7-4 7 4v13" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 10h.01M15 10h.01" />
    </svg>
  );
}

export function IconApprovals(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.2 2.2 4.8-5" />
    </svg>
  );
}

export function IconUsers(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3.5" />
      <path d="M22 21v-2a3.5 3.5 0 0 0-2.5-3.35" />
      <path d="M16.5 3.7a3.5 3.5 0 0 1 0 6.6" />
    </svg>
  );
}

export function IconSettings(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.86-.34 1.7 1.7 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.51 1.7 1.7 0 0 0-1.86.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.86 1.7 1.7 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.51-1 1.7 1.7 0 0 0-.34-1.86l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.86.34H9a1.7 1.7 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.51 1.7 1.7 0 0 0 1.86-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.86V9c.26.6.9 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" />
    </svg>
  );
}

export function IconMenu(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconPlus(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconCheck(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

export function IconX(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function IconLogout(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function IconSearch(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconGlobe(props) {
  return (
    <svg {...sizeProps(props.size)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" />
    </svg>
  );
}

export const NAV_ICONS = {
  dashboard: IconDashboard,
  invoices: IconInvoices,
  vendors: IconVendors,
  approvals: IconApprovals,
  users: IconUsers,
  settings: IconSettings,
};
