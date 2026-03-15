import { motion } from "motion/react";
import presets from "../data/presetEarbuds";

interface Props {
  selectedUrl: string;
  onSelect: (url: string) => void;
}

export default function PresetGallery({ selectedUrl, onSelect }: Props) {
  return (
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
  );
}
