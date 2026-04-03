/* _components/stepindicator/StepIndicator.tsx */

import "./StepIndicator.css";

type StepIndicatorProps = {
  currentStep: number;
};

const TOTAL_STEPS = 3;

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="step-indicator-wrapper">
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} className="step-item">
            <div className={`step-number ${isActive ? "step-selected" : isCompleted ? "step-completed" : "step-incompleted"}`}>
              {isCompleted ? "✓" : stepNumber}
            </div>

            {stepNumber < TOTAL_STEPS && (
              <div className={`step-line ${isCompleted ? "completed" : ""}`}/>
            )}
          </div>
        );
      })}
    </div>
  );
};