import { useKreatorStore, type Format } from '@/store/useKreatorStore';
import StepContainer from './StepContainer';

const formats: { value: Format; label: string; sublabel: string; ratio: string }[] = [
  { value: '9:16', label: '9:16', sublabel: 'Portrait', ratio: 'aspect-[9/16]' },
  { value: '16:9', label: '16:9', sublabel: 'Paysage', ratio: 'aspect-[16/9]' },
  { value: '1:1', label: '1:1', sublabel: 'Carré', ratio: 'aspect-square' },
];

const FormatStep = () => {
  const { type, format, setFormat } = useKreatorStore();

  if (type === 'video') return null;

  return (
    <StepContainer stepNumber={2} title="Format">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {formats.map((f) => (
          <button
            key={f.value}
            onClick={() => setFormat(f.value)}
            className={`flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 rounded-card border-[3px] transition-all duration-200 ${
              format === f.value
                ? 'border-primary bg-card'
                : 'border-foreground/10 bg-card hover:border-secondary hover:bg-secondary/5'
            }`}
          >
            <div className={`w-12 ${f.value === '9:16' ? 'h-20' : f.value === '16:9' ? 'h-7' : 'h-12'} rounded border-2 ${
              format === f.value ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 bg-muted/30'
            }`} />
            <div className="text-center">
              <div className={`font-bold text-sm ${format === f.value ? 'text-foreground' : 'text-muted-foreground'}`}>
                {f.label}
              </div>
              <div className="text-xs text-muted-foreground">{f.sublabel}</div>
            </div>
          </button>
        ))}
      </div>
    </StepContainer>
  );
};

export default FormatStep;
