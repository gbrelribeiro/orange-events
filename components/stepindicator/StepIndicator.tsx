/* components/stepindicator/StepIndicator.tsx */

import "./StepIndicator.css";

type StepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

export default function StepIndicator({ currentStep, totalSteps = 3 }: StepIndicatorProps) {
  return (
    <div className="step-indicator-wrapper">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} className="step-item">
            <div className={`step-number ${
              isActive 
                ? "step-selected" 
                : isCompleted 
                  ? "step-completed" 
                  : "step-incompleted"
            }`}>
              {isCompleted ? "✓" : stepNumber}
            </div>

            {stepNumber < totalSteps && (
              <div className={`step-line ${isCompleted ? "completed" : ""}`}/>
            )}
          </div>
        );
      })}
    </div>
  );
};