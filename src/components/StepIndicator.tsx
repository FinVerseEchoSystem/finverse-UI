import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-between w-full mb-10">
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum <= currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border ${
                  isActive
                    ? 'bg-banking-indigo-600 border-banking-indigo-500 text-white shadow-lg shadow-banking-indigo-900/30'
                    : 'bg-banking-slate-900 border-banking-slate-800 text-banking-slate-500'
                } ${isCurrent ? 'ring-2 ring-banking-indigo-500/20 scale-105' : ''}`}
              >
                {stepNum}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold mt-2 text-center absolute -bottom-6 w-24 sm:w-28 transition-colors duration-300 ${
                  isCurrent
                    ? 'text-banking-indigo-400 font-bold'
                    : isActive
                    ? 'text-banking-slate-300'
                    : 'text-banking-slate-500'
                }`}
              >
                {step}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-colors duration-500 ${
                  stepNum < currentStep ? 'bg-banking-indigo-600' : 'bg-banking-slate-800'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
