import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { Circle, Loader2, RefreshCw, Save, Square, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { EffectType, ShapeType } from "../backend";

export interface CursorConfig {
  imageUrl: string | null;
  imageBytes: Uint8Array<ArrayBuffer> | null;
  size: number;
  opacity: number;
  shape: ShapeType;
  effect: EffectType;
  name: string;
}

interface CustomizerPanelProps {
  config: CursorConfig;
  onChange: (config: Partial<CursorConfig>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function CustomizerPanel({
  config,
  onChange,
  onSave,
  isSaving,
}: CustomizerPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploadProgress(0);
    const url = URL.createObjectURL(file);
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
    setUploadProgress(100);
    setTimeout(() => setUploadProgress(null), 600);
    onChange({
      imageUrl: url,
      imageBytes: bytes,
      name: file.name.replace(/\.[^.]+$/, ""),
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const statRow = (label: string, value: string) => (
    <div className="flex justify-between items-center text-xs">
      <span className="text-muted-foreground font-mono">{label}</span>
      <span className="text-primary font-mono">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Upload Zone */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Cursor Image
        </p>
        <label
          data-ocid="upload.upload_button"
          htmlFor="cursor-file-input"
          className={cn(
            "relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer",
            "flex flex-col items-center justify-center gap-2 p-4",
            isDragging
              ? "border-primary bg-primary/10"
              : config.imageUrl
                ? "border-accent/50 bg-accent/5"
                : "border-border hover:border-primary/50 hover:bg-primary/5",
          )}
          style={{ minHeight: 120 }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            id="cursor-file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
          {config.imageUrl ? (
            <>
              <div className="relative">
                <img
                  src={config.imageUrl}
                  alt="cursor preview"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius:
                      config.shape === ShapeType.circle ? "50%" : "6px",
                    objectFit: "cover",
                  }}
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
              </div>
              <span className="text-xs font-mono text-muted-foreground truncate max-w-full">
                {config.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1 text-muted-foreground hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
                asChild
              >
                <label htmlFor="cursor-file-input" className="cursor-pointer">
                  <RefreshCw size={12} /> Change Image
                </label>
              </Button>
            </>
          ) : (
            <>
              <Upload size={28} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground text-center">
                Drop image here
                <br />
                <span className="text-xs opacity-60">or click to browse</span>
              </span>
            </>
          )}

          {uploadProgress !== null && uploadProgress < 100 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-xl">
              <div className="text-primary font-mono text-sm">
                {uploadProgress}%
              </div>
            </div>
          )}
        </label>
      </div>

      {/* Size Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Size
          </Label>
          <span className="font-mono text-xs text-primary">
            {config.size}px
          </span>
        </div>
        <Slider
          data-ocid="cursor.size.input"
          min={16}
          max={256}
          step={4}
          value={[config.size]}
          onValueChange={([val]) => onChange({ size: val })}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs font-mono text-muted-foreground/60">
          <span>16px</span>
          <span>256px</span>
        </div>
      </div>

      {/* Opacity Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Opacity
          </Label>
          <span className="font-mono text-xs text-primary">
            {config.opacity}%
          </span>
        </div>
        <Slider
          data-ocid="cursor.opacity.input"
          min={10}
          max={100}
          step={5}
          value={[config.opacity]}
          onValueChange={([val]) => onChange({ opacity: val })}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs font-mono text-muted-foreground/60">
          <span>10%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Shape Toggle */}
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block">
          Shape
        </Label>
        <ToggleGroup
          data-ocid="cursor.shape.toggle"
          type="single"
          value={config.shape}
          onValueChange={(val) => {
            if (val) onChange({ shape: val as ShapeType });
          }}
          className="w-full"
        >
          <ToggleGroupItem
            value={ShapeType.circle}
            className="flex-1 gap-2 font-mono text-xs"
          >
            <Circle size={14} /> Circle
          </ToggleGroupItem>
          <ToggleGroupItem
            value={ShapeType.square}
            className="flex-1 gap-2 font-mono text-xs"
          >
            <Square size={14} /> Square
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Effect Select */}
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block">
          Effect
        </Label>
        <Select
          value={config.effect}
          onValueChange={(val) => onChange({ effect: val as EffectType })}
        >
          <SelectTrigger
            data-ocid="cursor.effect.select"
            className="font-mono text-sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EffectType.none} className="font-mono text-sm">
              ✕ None
            </SelectItem>
            <SelectItem value={EffectType.trail} className="font-mono text-sm">
              ✦ Trail — Ghost Copies
            </SelectItem>
            <SelectItem value={EffectType.glow} className="font-mono text-sm">
              ◈ Glow — Neon Halo
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Live Stats */}
      {config.imageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/50 rounded-lg p-3 space-y-1.5 border border-border/50"
        >
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
            Config Preview
          </p>
          {statRow("SIZE", `${config.size}px`)}
          {statRow("OPACITY", `${config.opacity}%`)}
          {statRow("SHAPE", config.shape.toUpperCase())}
          {statRow("EFFECT", config.effect.toUpperCase())}
        </motion.div>
      )}

      {/* Save Button */}
      <div className="mt-auto">
        <Button
          data-ocid="cursor.save.button"
          className="w-full gap-2 font-mono font-semibold"
          disabled={!config.imageUrl || isSaving}
          onClick={onSave}
          style={{
            background: config.imageUrl ? "oklch(0.76 0.19 195)" : undefined,
          }}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={16} /> Save Cursor
            </>
          )}
        </Button>
        {!config.imageUrl && (
          <p className="text-center text-xs text-muted-foreground/50 mt-2 font-mono">
            Upload an image first
          </p>
        )}
      </div>
    </div>
  );
}
