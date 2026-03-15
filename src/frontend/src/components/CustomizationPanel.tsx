import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bluetooth,
  BookmarkPlus,
  Eye,
  Loader2,
  Save,
  Square,
  Upload,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAddProfile } from "../hooks/useQueries";
import type { PopupConfig } from "../types";
import BluetoothBatteryButton from "./BluetoothBatteryButton";
import PresetGallery from "./PresetGallery";
import SoundCustomizer from "./SoundCustomizer";

interface Props {
  config: PopupConfig;
  onChange: (config: PopupConfig) => void;
  onShowPopup: () => void;
}

const THEMES = [
  { value: "Dark", label: "Dark", icon: "🌑" },
  { value: "Light", label: "Light", icon: "☀️" },
  { value: "Glassmorphism", label: "Glass", icon: "🔮" },
  { value: "Neon", label: "Neon", icon: "⚡" },
] as const;

const SHAPES = [
  { value: "Rounded", label: "Rounded" },
  { value: "Square", label: "Square" },
  { value: "Pill", label: "Pill" },
] as const;

const LAYOUTS = [
  { value: "Top", label: "Top", Icon: AlignCenter },
  { value: "Left", label: "Left", Icon: AlignLeft },
  { value: "Right", label: "Right", Icon: AlignRight },
] as const;

export default function CustomizationPanel({
  config,
  onChange,
  onShowPopup,
}: Props) {
  const addProfile = useAddProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [btConnected, setBtConnected] = useState(false);
  const [isSavingPreset, setIsSavingPreset] = useState(false);

  const update = (partial: Partial<PopupConfig>) => {
    onChange({ ...config, ...partial });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      update({ imageUrl: dataUrl, imageFile: file });
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (url: string) => {
    update({ imageUrl: url, imageFile: undefined });
  };

  const handleSave = async () => {
    setIsUploading(true);
    try {
      await addProfile.mutateAsync(config);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveCustomPreset = () => {
    if (!config.imageUrl) {
      toast.error("Pehle ek image select ya upload karein");
      return;
    }
    if (!config.name.trim()) {
      toast.error("Earbuds ka naam enter karein");
      return;
    }
    setIsSavingPreset(true);
    try {
      const stored = localStorage.getItem("customEarbudsPresets");
      const existing: { id: string; label: string; url: string }[] = stored
        ? JSON.parse(stored)
        : [];
      const newPreset = {
        id: `custom_${Date.now()}`,
        label: config.name.trim(),
        url: config.imageUrl,
      };
      const updated = [...existing, newPreset];
      localStorage.setItem("customEarbudsPresets", JSON.stringify(updated));
      // Dispatch storage event so PresetGallery re-renders
      window.dispatchEvent(new Event("customPresetsUpdated"));
      toast.success(`"${config.name}" My Presets mein save ho gaya! ✨`);
    } catch {
      toast.error("Preset save nahi hua. Dobara try karein.");
    } finally {
      setIsSavingPreset(false);
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleBluetoothChange = (newConfig: PopupConfig) => {
    setBtConnected(true);
    onChange(newConfig);
  };

  const imageSize = config.imageSize ?? 120;
  const popupSize = config.popupSize ?? 280;
  const popupTheme = config.popupTheme ?? "Dark";
  const popupShape = config.popupShape ?? "Rounded";
  const imagePosition = config.imagePosition ?? "Top";
  const shadowIntensity = config.shadowIntensity ?? "Medium";
  const borderWidth = config.borderWidth ?? 0;
  const borderColor = config.borderColor ?? "#ffffff";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-base text-foreground">
          Customize Popup
        </h2>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onShowPopup}
            className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            data-ocid="popup.primary_button"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={addProfile.isPending || isUploading}
            className="gap-1.5 bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30"
            data-ocid="profile.save_button"
          >
            {addProfile.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save
          </Button>
        </div>
      </div>

      <Separator className="bg-border/40" />

      {/* Device Name */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Device Name
        </Label>
        <Input
          value={config.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="AirPods Pro"
          className="bg-secondary/40 border-border/40 focus:border-primary/60"
          data-ocid="profile.input"
        />
      </div>

      {/* ── Live Battery (Bluetooth) ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Bluetooth className="w-3.5 h-3.5 text-primary" />
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Live Battery
          </Label>
        </div>
        <BluetoothBatteryButton
          config={config}
          onChange={handleBluetoothChange}
        />
      </div>

      <Separator className="bg-border/40" />

      {/* Battery Levels */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Battery Levels
          </Label>
          {btConnected && (
            <Badge
              variant="outline"
              className="text-[10px] h-4 border-emerald-500/40 text-emerald-400 px-1.5 animate-pulse"
            >
              LIVE
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/80">Left</span>
            <span className="text-xs font-mono text-primary">
              {config.leftBattery}%
            </span>
          </div>
          <Slider
            value={[config.leftBattery]}
            onValueChange={([v]) => update({ leftBattery: v })}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            data-ocid="profile.left_battery.toggle"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/80">Right</span>
            <span className="text-xs font-mono text-primary">
              {config.rightBattery}%
            </span>
          </div>
          <Slider
            value={[config.rightBattery]}
            onValueChange={([v]) => update({ rightBattery: v })}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            data-ocid="profile.right_battery.toggle"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/80">Case</span>
            <span className="text-xs font-mono text-primary">
              {config.caseBattery}%
            </span>
          </div>
          <Slider
            value={[config.caseBattery]}
            onValueChange={([v]) => update({ caseBattery: v })}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            data-ocid="profile.case_battery.toggle"
          />
        </div>
      </div>

      <Separator className="bg-border/40" />

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Background
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => update({ backgroundColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border border-border/40 bg-transparent p-0.5"
              data-ocid="profile.background.input"
            />
            <span className="text-xs font-mono text-muted-foreground">
              {config.backgroundColor}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Accent
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.accentColor}
              onChange={(e) => update({ accentColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border border-border/40 bg-transparent p-0.5"
              data-ocid="profile.accent.input"
            />
            <span className="text-xs font-mono text-muted-foreground">
              {config.accentColor}
            </span>
          </div>
        </div>
      </div>

      {/* Font Style */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Font Style
        </Label>
        <Select
          value={config.fontStyle}
          onValueChange={(v) => update({ fontStyle: v })}
        >
          <SelectTrigger
            className="bg-secondary/40 border-border/40"
            data-ocid="profile.font.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Modern">Modern (Outfit)</SelectItem>
            <SelectItem value="Rounded">Rounded (Bricolage)</SelectItem>
            <SelectItem value="Classic">Classic (Serif)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-border/40" />

      {/* Size Controls */}
      <div className="space-y-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Size Controls
        </Label>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/80">Image Size</span>
            <span className="text-xs font-mono text-primary">
              {imageSize}px
            </span>
          </div>
          <Slider
            value={[imageSize]}
            onValueChange={([v]) => update({ imageSize: v })}
            min={60}
            max={200}
            step={5}
            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            data-ocid="profile.image_size.toggle"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/80">Popup Size</span>
            <span className="text-xs font-mono text-primary">
              {popupSize}px
            </span>
          </div>
          <Slider
            value={[popupSize]}
            onValueChange={([v]) => update({ popupSize: v })}
            min={200}
            max={420}
            step={10}
            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
            data-ocid="profile.popup_size.toggle"
          />
        </div>
      </div>

      <Separator className="bg-border/40" />

      {/* ── Popup Style ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Popup Style
          </Label>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <span className="text-xs text-foreground/60">Theme</span>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => update({ popupTheme: value })}
                data-ocid="style.theme.toggle"
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-all ${
                  popupTheme === value
                    ? "border-primary/60 bg-primary/15 text-primary font-medium"
                    : "border-border/40 bg-secondary/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <span className="text-base leading-none">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Shape */}
        <div className="space-y-2">
          <span className="text-xs text-foreground/60">Shape</span>
          <div className="flex gap-2">
            {SHAPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => update({ popupShape: value })}
                data-ocid="style.shape.toggle"
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ${
                  popupShape === value
                    ? "border-primary/60 bg-primary/15 text-primary font-medium"
                    : "border-border/40 bg-secondary/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Square className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Image Layout */}
        <div className="space-y-2">
          <span className="text-xs text-foreground/60">Image Layout</span>
          <div className="flex gap-2">
            {LAYOUTS.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => update({ imagePosition: value })}
                data-ocid="style.layout.toggle"
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition-all ${
                  imagePosition === value
                    ? "border-primary/60 bg-primary/15 text-primary font-medium"
                    : "border-border/40 bg-secondary/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Shadow */}
        <div className="space-y-2">
          <span className="text-xs text-foreground/60">Shadow Intensity</span>
          <Select
            value={shadowIntensity}
            onValueChange={(v) =>
              update({ shadowIntensity: v as PopupConfig["shadowIntensity"] })
            }
          >
            <SelectTrigger
              className="bg-secondary/40 border-border/40"
              data-ocid="style.shadow.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="Soft">Soft</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Strong">Strong</SelectItem>
              <SelectItem value="Glow">Glow</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Border */}
        <div className="space-y-2">
          <span className="text-xs text-foreground/60">Border</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={borderColor}
                onChange={(e) => update({ borderColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-border/40 bg-transparent p-0.5"
                data-ocid="style.border_color.input"
              />
              <span className="text-xs font-mono text-muted-foreground">
                {borderColor}
              </span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/60">Width</span>
                <span className="text-xs font-mono text-primary">
                  {borderWidth}px
                </span>
              </div>
              <Slider
                value={[borderWidth]}
                onValueChange={([v]) => update({ borderWidth: v })}
                min={0}
                max={8}
                step={1}
                className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
                data-ocid="style.border_width.toggle"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-border/40" />

      {/* ── Sound ── */}
      <SoundCustomizer config={config} onChange={onChange} />

      <Separator className="bg-border/40" />

      {/* Earbuds Image section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Earbuds Image
          </Label>
          {config.imageFile && (
            <span className="text-xs text-primary truncate max-w-[120px]">
              {config.imageFile.name}
            </span>
          )}
        </div>

        {/* Preset grid */}
        <PresetGallery
          selectedUrl={config.imageUrl}
          onSelect={handlePresetSelect}
        />

        {/* Upload custom */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/40 py-2.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
          onClick={openFilePicker}
          data-ocid="profile.upload_button"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Upload className="w-3.5 h-3.5" />
          Upload your own image
        </button>

        {/* Save as custom preset */}
        <button
          type="button"
          disabled={isSavingPreset || !config.imageUrl || !config.name.trim()}
          onClick={handleSaveCustomPreset}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/30 py-2.5 text-xs text-primary bg-primary/5 hover:bg-primary/15 hover:border-primary/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          data-ocid="preset.save_button"
        >
          <BookmarkPlus className="w-3.5 h-3.5" />
          Save as Custom Preset
        </button>
      </div>

      {addProfile.isError && (
        <p className="text-xs text-destructive" data-ocid="profile.error_state">
          Failed to save profile. Please try again.
        </p>
      )}
    </motion.div>
  );
}
