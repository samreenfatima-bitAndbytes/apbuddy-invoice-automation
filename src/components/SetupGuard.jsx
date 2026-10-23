import { Navigate } from "react-router-dom";
import { SETUP_STEPS } from "../data/setup";
import { useData } from "../hooks/useData";

export default function SetupGuard({ stepId, children }) {
  const { canAccessStep } = useData();

  if (!canAccessStep(stepId)) {
    const idx = SETUP_STEPS.findIndex((s) => s.id === stepId);
    const fallback = SETUP_STEPS[Math.max(0, idx - 1)] || SETUP_STEPS[0];
    return <Navigate to={fallback.to} replace />;
  }

  return children;
}
