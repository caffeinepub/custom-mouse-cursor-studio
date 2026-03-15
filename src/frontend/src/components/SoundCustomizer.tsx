import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";
import { useRef } from "react";
import { usePopupSound } from "../hooks/usePopupSound";
import type { PopupConfig } from "../types";

const PRESETS: Array<{
  value: NonNullable<PopupConfig["soundPreset"]>;
  label: string;
  emoji: string;
}> = [
  { value: "Default", label: "Default", emoji: "🎵" },
  { value: "Chime", label: "Chime", emoji: "🔔" },
  { value: "Click", label: "Click", emoji: "👆" },
  { value: "Whoosh", label: "Whoosh", emoji: "💨" },
  { value: "Pop", label: "Pop", emoji: "🫧" },
  { value: "None", label: "None", emoji: "🔇" },
];

interface Props {
  config: PopupConfig;
  onChange: (config: PopupConfig) => void;
}

export default function SoundCustomizer({ config, onChange }: Props) {
  const openInputRef = useRef<HTMLInputElement>(null);
  const closeInputRef = useRef<HTMLInputElement>(null);

  const soundPreset = config.soundPreset ?? "Default";
  const soundVolume = config.soundVolume ?? 50;

  const update = (partial: Partial<PopupConfig>) =>
    onChange({ ...config, ...partial });

  const { playOpenSound } = usePopupSound({
    preset: soundPreset,
    volume: soundVolume,
    openSoundUrl: config.customOpenSoundUrl,
    closeSoundUrl: config.customCloseSoundUrl,
  });

  const handleOpenUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update({ customOpenSoundUrl: url });
  };

  const handleCloseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update({ customCloseSoundUrl: url });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Volume2 className="w-3.5 h-3.5 text-primary" />
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Popup Sound
        </Label>
      </div>

      {/* Preset Grid */}
      <div className="space-y-2">
        <span className="text-xs text-foreground/60">Sound Preset</span>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map(({ value, label, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => update({ soundPreset: value })}
              data-ocid="sound.preset.toggle"
              className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs transition-all ${
                soundPreset === value
                  ? "border-primary/60 bg-primary/15 text-primary font-medium"
                  : "border-border/40 bg-secondary/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <span className="text-lg leading-none">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Volume */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-foreground/60">Volume</span>
          <span className="text-xs font-mono text-primary">{soundVolume}%</span>
        </div>
        <Slider
          value={[soundVolume]}
          onValueChange={([v]) => update({ soundVolume: v })}
          min={0}
          max={100}
          step={1}
          className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
          data-ocid="sound.volume.toggle"
        />
      </div>

      {/* Upload Sounds */}
      <div className="space-y-2">
        <span className="text-xs text-foreground/60">Custom Sounds</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => openInputRef.current?.click()}
            data-ocid="sound.open.upload_button"
            className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-border/40 px-2 py-2.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
          >
            <span className="text-base">📂</span>
            <span>Open Sound</span>
            {config.customOpenSoundUrl && (
              <span className="text-[10px] text-primary/70 truncate w-full text-center">
                Custom set
              </span>
            )}
          </button>
          <input
            ref={openInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleOpenUpload}
          />

          <button
            type="button"
            onClick={() => closeInputRef.current?.click()}
            data-ocid="sound.close.upload_button"
            className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-border/40 px-2 py-2.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
          >
            <span className="text-base">📂</span>
            <span>Close Sound</span>
            {config.customCloseSoundUrl && (
              <span className="text-[10px] text-primary/70 truncate w-full text-center">
                Custom set
              </span>
            )}
          </button>
          <input
            ref={closeInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleCloseUpload}
          />
        </div>
      </div>

      {/* Test Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={playOpenSound}
        className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10"
        data-ocid="sound.test.primary_button"
      >
        <Volume2 className="w-3.5 h-3.5" />
        Test Sound
      </Button>
    </div>
  );
}
