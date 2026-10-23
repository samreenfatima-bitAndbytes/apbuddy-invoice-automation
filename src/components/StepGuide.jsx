import { SETUP_STEPS, validateStep } from "../data/setup";
import { useData } from "../hooks/useData";

export default function StepGuide({ stepId }) {
  const data = useData();
  const step = SETUP_STEPS.find((s) => s.id === stepId);
  if (!step) return null;

  const check = validateStep(stepId, data);
  const idx = SETUP_STEPS.findIndex((s) => s.id === stepId);

  return (
    <div className={`step-guide${check.ok ? " is-ready" : ""}`}>
      <div className="step-guide__meta">
        Step {idx + 1} of {SETUP_STEPS.length}
        {check.ok ? " · Ready to continue" : " · Action needed"}
      </div>
      <p className="step-guide__help">{step.help}</p>
      {!check.ok ? (
        <p className="step-guide__require">
          <strong>To unlock Next:</strong> {check.message || step.require}
        </p>
      ) : (
        <p className="step-guide__require is-ok">
          Requirements met — you can go to the next step.
        </p>
      )}
    </div>
  );
}
