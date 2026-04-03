import { Switch } from '@/components/ui/switch';
import { useKreatorStore } from '@/store/useKreatorStore';

const ModeToggle = () => {
  const { user_mode, setUserMode } = useKreatorStore();
  const isExpert = user_mode === 'expert';

  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm font-medium transition-colors ${!isExpert ? 'text-foreground' : 'text-muted-foreground'}`}>
        Simple
      </span>
      <Switch
        checked={isExpert}
        onCheckedChange={(checked) => setUserMode(checked ? 'expert' : 'beginner')}
        className="data-[state=checked]:bg-primary"
      />
      <span className={`text-sm font-medium transition-colors ${isExpert ? 'text-foreground' : 'text-muted-foreground'}`}>
        Expert
      </span>
    </div>
  );
};

export default ModeToggle;
