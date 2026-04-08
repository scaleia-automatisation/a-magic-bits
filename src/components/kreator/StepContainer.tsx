import { ReactNode } from 'react';

interface StepContainerProps {
  stepNumber: number;
  title: string;
  children: ReactNode;
  hidden?: boolean;
  rightAction?: ReactNode;
}

const StepContainer = ({ stepNumber, title, children, hidden, rightAction }: StepContainerProps) => {
  if (hidden) return null;

  return (
    <div className="step-border bg-background p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-booster-accent flex items-center justify-center text-sm font-bold text-white">
            {stepNumber}
          </div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
        </div>
        {rightAction && <div className="flex-shrink-0">{rightAction}</div>}
      </div>
      {children}
    </div>
  );
};

export default StepContainer;
