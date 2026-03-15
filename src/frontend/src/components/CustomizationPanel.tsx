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
import { Eye, Loader2, Save, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useAddProfile } from "../hooks/useQueries";
import type { PopupConfig } from "../types";
import PresetGallery from "./PresetGallery";

interface Props {
  config: PopupConfig;
  onChange: (config: PopupConfig) => void;
  onShowPopup: () => void;
}

export default function CustomizationPanel({
  config,
  onChange,
  onShowPopup,
}: Props) {
  const addProfile = useAddProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const update = (partial: Partial<PopupConfig>) => {
    onChange({ ...config, ...partial });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update({ imageUrl: url, imageFile: file });
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

  const openFilePicker = () => fileInputRef.current?.click();

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

      {/* Battery Levels */}
      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Battery Levels
        </Label>

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
      </div>

      {addProfile.isError && (
        <p className="text-xs text-destructive" data-ocid="profile.error_state">
          Failed to save profile. Please try again.
        </p>
      )}
    </motion.div>
  );
}
