import { Navigate, Route, Routes } from "react-router-dom";
import { ROLE_HOME } from "./data/demo";
import { useAuth } from "./hooks/useAuth";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Vendors from "./pages/Vendors";
import Approvals from "./pages/Approvals";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import ConfigHub from "./pages/ConfigHub";

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || "/app/dashboard"} replace />;
  }
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={ROLE_HOME[user?.role] || "/app/dashboard"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<HomeRedirect />} />

        {/* Admin overview */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute roles={["admin"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Shared invoice list — behaviour differs by role inside the page */}
        <Route
          path="invoices"
          element={
            <PrivateRoute roles={["admin", "staff"]}>
              <Invoices />
            </PrivateRoute>
          }
        />

        {/* Staff only */}
        <Route
          path="vendors"
          element={
            <PrivateRoute roles={["staff"]}>
              <Vendors />
            </PrivateRoute>
          }
        />

        {/* Admin + Approver */}
        <Route
          path="approvals"
          element={
            <PrivateRoute roles={["admin", "approver"]}>
              <Approvals />
            </PrivateRoute>
          }
        />

        <Route
          path="users"
          element={
            <PrivateRoute roles={["admin"]}>
              <Users />
            </PrivateRoute>
          }
        />

        <Route
          path="config"
          element={
            <PrivateRoute roles={["admin"]}>
              <ConfigHub />
            </PrivateRoute>
          }
        />

        <Route
          path="settings"
          element={
            <PrivateRoute roles={["staff", "approver"]}>
              <Settings />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
