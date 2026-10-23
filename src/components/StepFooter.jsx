import { useNavigate } from "react-router-dom";
import { SETUP_STEPS, validateStep } from "../data/setup";
import { useData } from "../hooks/useData";

export default function StepFooter({ stepId }) {
  const navigate = useNavigate();
  const data = useData();
  const { completeStep, notify, setupComplete } = data;
  const idx = SETUP_STEPS.findIndex((s) => s.id === stepId);
  const next = SETUP_STEPS[idx + 1];
  const prev = SETUP_STEPS[idx - 1];
  const check = validateStep(stepId, data);

  const goNext = () => {
    if (!check.ok) {
      notify(check.message || "Complete this step before continuing");
      return;
    }
    completeStep(stepId);
    if (next) {
      navigate(next.to);
      return;
    }
    notify("Admin setup complete — staff can process invoices");
  };

  return (
    <div className="setup-page__foot">
      {prev ? (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(prev.to)}
        >
          ← Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        className={`btn btn-primary${check.ok ? "" : " is-disabled"}`}
        disabled={!check.ok}
        onClick={goNext}
      >
        {next
          ? "Save & next step →"
          : setupComplete
            ? "Setup complete ✓"
            : "Finish setup"}
      </button>
    </div>
  );
}
