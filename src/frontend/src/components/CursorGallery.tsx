import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Check, Loader2, Trash2, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type CursorConfig, EffectType, ShapeType } from "../backend";

interface CursorGalleryProps {
  cursors: CursorConfig[];
  activeCursorId: string | null;
  isLoading: boolean;
  deletingId: string | null;
  onActivate: (cursor: CursorConfig) => void;
  onDelete: (id: string) => void;
}

export function CursorGallery({
  cursors,
  activeCursorId,
  isLoading,
  deletingId,
  onActivate,
  onDelete,
}: CursorGalleryProps) {
  const effectLabel = (effect: EffectType) => {
    if (effect === EffectType.trail) return "✦";
    if (effect === EffectType.glow) return "◈";
    return "";
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          My Cursors
        </span>
        <span className="font-mono text-xs text-primary/60">
          {cursors.length} saved
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : cursors.length === 0 ? (
          <div
            data-ocid="gallery.empty_state"
            className="flex flex-col items-center justify-center h-40 gap-3 text-center"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center">
              <Zap size={20} className="text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              No cursors saved yet
            </p>
            <p className="text-xs text-muted-foreground/50">
              Create one above ↑
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence>
              {cursors.map((cursor, i) => {
                const isActive = cursor.id === activeCursorId;
                const isDeleting = cursor.id === deletingId;
                const markerIndex = i + 1;
                return (
                  <motion.div
                    key={cursor.id}
                    data-ocid={`gallery.item.${markerIndex}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "relative group rounded-xl border p-3 cursor-pointer transition-all duration-200",
                      isActive
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40 hover:bg-card/80",
                    )}
                    onClick={() => onActivate(cursor)}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check size={10} className="text-primary-foreground" />
                      </div>
                    )}

                    {/* Cursor thumbnail */}
                    <div className="flex justify-center mb-2">
                      <img
                        src={cursor.image.getDirectURL()}
                        alt={cursor.name}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius:
                            cursor.shape === ShapeType.circle ? "50%" : "6px",
                          objectFit: "cover",
                          opacity: cursor.opacity,
                          filter:
                            cursor.effect === EffectType.glow
                              ? "drop-shadow(0 0 6px oklch(0.76 0.19 195 / 0.8))"
                              : "none",
                        }}
                      />
                    </div>

                    {/* Info */}
                    <p className="text-xs font-mono text-center truncate text-foreground/80">
                      {cursor.name}
                    </p>
                    <p className="text-xs font-mono text-center text-muted-foreground">
                      {Number(cursor.size)}px {effectLabel(cursor.effect)}
                    </p>

                    {/* Delete button */}
                    <button
                      type="button"
                      data-ocid={`gallery.delete_button.${markerIndex}`}
                      className={cn(
                        "absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
                        "p-1 rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive",
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(cursor.id);
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
