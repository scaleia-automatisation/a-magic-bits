import { useKreatorStore } from '@/store/useKreatorStore';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import StepContainer from './StepContainer';

const tons = [
  'Humoristique / Décontracté', 'Promotionnel / Persuasif', 'Engageant / Participatif',
  'Sérieux / Professionnel', 'Décalé', 'Choc', 'Différent', 'Humour décalé', 'Subtil'
];

const styles = ['Luxe', 'Moderne', 'Impact', 'Lifestyle'];

const CustomizationStep = () => {
  const { type, user_mode, showAdvanced, setShowAdvanced, options, setOptions } = useKreatorStore();
  const isVideo = type === 'video';

  const isVisible = user_mode === 'expert' || showAdvanced;

  if (user_mode === 'beginner' && !showAdvanced) {
    return (
      <div className="flex items-center gap-3 px-2">
        <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
        <span className="text-sm text-muted-foreground">Réglages avancés</span>
      </div>
    );
  }

  return (
    <>
      {user_mode === 'beginner' && (
        <div className="flex items-center gap-3 px-2 mb-4">
          <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
          <span className="text-sm text-muted-foreground">Réglages avancés</span>
        </div>
      )}
      {isVisible && (
        <StepContainer stepNumber={4} title="Personnalisation">
          <Accordion type="multiple" className="space-y-2">
            {/* Text overlay */}
            <AccordionItem value="text" className="border-foreground/10">
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                {isVideo ? 'Texte à l\'écran' : type === 'carousel' ? 'Texte dans les slides' : 'Texte dans le visuel'}
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-muted-foreground">Sans</span>
                  <Switch
                    checked={options.show_text}
                    onCheckedChange={(v) => setOptions({ show_text: v })}
                  />
                  <span className="text-xs text-muted-foreground">Avec</span>
                </div>
                {options.show_text && (
                  <Input
                    value={options.text_content}
                    onChange={(e) => {
                      if (e.target.value.length <= 15) setOptions({ text_content: e.target.value });
                    }}
                    placeholder="Max 15 caractères"
                    className="bg-card border-foreground/10 text-foreground text-sm"
                  />
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Color palette - not for video */}
            {!isVideo && (
              <AccordionItem value="palette" className="border-foreground/10">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                  Palette de couleurs
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-muted-foreground">Désactivé</span>
                    <Switch
                      checked={options.palette_enabled}
                      onCheckedChange={(v) => setOptions({ palette_enabled: v })}
                    />
                    <span className="text-xs text-muted-foreground">Activé</span>
                  </div>
                  {options.palette_enabled && (
                    <div className="flex gap-3">
                      {options.palette_hex.map((color, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newPalette = [...options.palette_hex];
                              newPalette[i] = e.target.value;
                              setOptions({ palette_hex: newPalette });
                            }}
                            className="w-10 h-10 rounded-btn cursor-pointer border-0 bg-transparent"
                          />
                          <span className="text-xs text-muted-foreground font-mono">{color}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Tone */}
            <AccordionItem value="ton" className="border-foreground/10">
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                {isVideo ? 'Ton de la vidéo' : 'Ton d\'écriture'}
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <Select value={options.ton} onValueChange={(v) => setOptions({ ton: v })}>
                  <SelectTrigger className="bg-card border-foreground/10 text-foreground">
                    <SelectValue placeholder="Choisir un ton..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-foreground/10">
                    {tons.map((t) => (
                      <SelectItem key={t} value={t} className="text-foreground focus:bg-secondary/20">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            {/* Visual style */}
            <AccordionItem value="style" className="border-foreground/10">
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                Style visuel
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <Select value={options.visual_style} onValueChange={(v) => setOptions({ visual_style: v })}>
                  <SelectTrigger className="bg-card border-foreground/10 text-foreground">
                    <SelectValue placeholder="Choisir un style..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-foreground/10">
                    {styles.map((s) => (
                      <SelectItem key={s} value={s} className="text-foreground focus:bg-secondary/20">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </StepContainer>
      )}
    </>
  );
};

export default CustomizationStep;
