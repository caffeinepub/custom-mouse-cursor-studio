import { X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import presets from "../data/presetEarbuds";

interface CustomPreset {
  id: string;
  label: string;
  url: string;
}

interface Props {
  selectedUrl: string;
  onSelect: (url: string) => void;
}

function loadCustomPresets(): CustomPreset[] {
  try {
    const stored = localStorage.getItem("customEarbudsPresets");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function PresetGallery({ selectedUrl, onSelect }: Props) {
  const [customPresets, setCustomPresets] =
    useState<CustomPreset[]>(loadCustomPresets);

  useEffect(() => {
    const handleUpdate = () => setCustomPresets(loadCustomPresets());
    window.addEventListener("customPresetsUpdated", handleUpdate);
    return () =>
      window.removeEventListener("customPresetsUpdated", handleUpdate);
  }, []);

  const deleteCustomPreset = (id: string) => {
    const updated = customPresets.filter((p) => p.id !== id);
    setCustomPresets(updated);
    localStorage.setItem("customEarbudsPresets", JSON.stringify(updated));
  };

  return (
    <div className="space-y-3">
      {/* My Presets section */}
      {customPresets.length > 0 && (
        <div className="space-y-2" data-ocid="gallery.custom.panel">
          <span className="text-[10px] text-primary/70 uppercase tracking-widest font-medium">
            My Presets
          </span>
          <div className="grid grid-cols-5 gap-2">
            {customPresets.map((preset, i) => {
              const isSelected = selectedUrl === preset.url;
              return (
                <div key={preset.id} className="relative group">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onSelect(preset.url)}
                    title={preset.label}
                    aria-label={`Select ${preset.label}`}
                    aria-pressed={isSelected}
                    data-ocid={`gallery.custom.item.${i + 1}.button`}
                    className="relative w-full flex flex-col items-center gap-1 p-1 rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    style={{
                      borderColor: isSelected
                        ? "oklch(var(--primary))"
                        : "oklch(var(--border))",
                      background: isSelected
                        ? "oklch(var(--primary) / 0.12)"
                        : "oklch(var(--secondary) / 0.4)",
                      boxShadow: isSelected
                        ? "0 0 12px oklch(var(--primary) / 0.4)"
                        : "none",
                    }}
                  >
                    <div
                      className="w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-contain p-1"
                        draggable={false}
                      />
                    </div>
                    <span
                      className="text-center leading-tight"
                      style={{
                        fontSize: "9px",
                        color: isSelected
                          ? "oklch(var(--primary))"
                          : "oklch(var(--muted-foreground))",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                        width: "100%",
                      }}
                    >
                      {preset.label}
                    </span>
                    {isSelected && (
                      <motion.div
                        layoutId="custom-preset-selection-ring"
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                          boxShadow: "inset 0 0 0 2px oklch(var(--primary))",
                        }}
                      />
                    )}
                  </motion.button>
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => deleteCustomPreset(preset.id)}
                    aria-label={`Delete ${preset.label}`}
                    data-ocid={`gallery.custom.delete_button.${i + 1}`}
                    className="absolute -top-1.5 -right-1.5 z-10 w-4 h-4 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Built-in presets */}
      <div className="space-y-2">
        {customPresets.length > 0 && (
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
            Presets
          </span>
        )}
        <div className="grid grid-cols-5 gap-2" data-ocid="gallery.panel">
          {presets.map((preset, i) => {
            const isSelected = selectedUrl === preset.svg;
            return (
              <motion.button
                key={preset.id}
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelect(preset.svg)}
                title={preset.label}
                aria-label={`Select ${preset.label}`}
                aria-pressed={isSelected}
                data-ocid={`gallery.item.${i + 1}.button`}
                className="relative flex flex-col items-center gap-1 p-1 rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{
                  borderColor: isSelected
                    ? "oklch(var(--primary))"
                    : "oklch(var(--border))",
                  background: isSelected
                    ? "oklch(var(--primary) / 0.12)"
                    : "oklch(var(--secondary) / 0.4)",
                  boxShadow: isSelected
                    ? "0 0 12px oklch(var(--primary) / 0.4)"
                    : "none",
                }}
              >
                <div
                  className="w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <img
                    src={preset.svg}
                    alt={preset.label}
                    className="w-full h-full object-contain p-1"
                    draggable={false}
                  />
                </div>
                <span
                  className="text-center leading-tight"
                  style={{
                    fontSize: "9px",
                    color: isSelected
                      ? "oklch(var(--primary))"
                      : "oklch(var(--muted-foreground))",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                    width: "100%",
                  }}
                >
                  {preset.label}
                </span>

                {isSelected && (
                  <motion.div
                    layoutId="preset-selection-ring"
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      boxShadow: "inset 0 0 0 2px oklch(var(--primary))",
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
