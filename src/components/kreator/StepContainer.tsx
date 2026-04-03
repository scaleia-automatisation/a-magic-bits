import { ReactNode } from 'react';

interface StepContainerProps {
  stepNumber: number;
  title: string;
  children: ReactNode;
  hidden?: boolean;
}

const StepContainer = ({ stepNumber, title, children, hidden }: StepContainerProps) => {
  if (hidden) return null;

  return (
    <div className="step-border bg-background p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-primary-foreground">
          {stepNumber}
        </div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default StepContainer;
