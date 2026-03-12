import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { EffectType, ShapeType } from "./backend";
import type { CursorConfig } from "./backend";
import { CursorGallery } from "./components/CursorGallery";
import { CustomizerPanel } from "./components/CustomizerPanel";
import type { CursorConfig as LocalCursorConfig } from "./components/CustomizerPanel";
import { Playground } from "./components/Playground";
import {
  useDeleteCursor,
  useListCursors,
  useSaveCursor,
} from "./hooks/useQueries";

const DEFAULT_CONFIG: LocalCursorConfig = {
  imageUrl: null,
  imageBytes: null,
  size: 48,
  opacity: 100,
  shape: ShapeType.circle,
  effect: EffectType.none,
  name: "My Cursor",
};

export default function App() {
  const [config, setConfig] = useState<LocalCursorConfig>(DEFAULT_CONFIG);
  const [activeCursorId, setActiveCursorId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: cursors = [], isLoading: isLoadingCursors } = useListCursors();
  const { mutateAsync: saveCursor, isPending: isSaving } = useSaveCursor();
  const { mutateAsync: deleteCursor } = useDeleteCursor();

  const handleConfigChange = useCallback(
    (partial: Partial<LocalCursorConfig>) => {
      setConfig((prev) => ({ ...prev, ...partial }));
    },
    [],
  );

  const handleSave = async () => {
    if (!config.imageBytes || !config.imageUrl) {
      toast.error("Please upload an image first");
      return;
    }
    const id = `cursor_${Date.now()}`;
    try {
      await saveCursor({
        id,
        name: config.name || "My Cursor",
        imageBytes: config.imageBytes,
        size: config.size,
        opacity: config.opacity,
        effect: config.effect,
        shape: config.shape,
      });
      toast.success("Cursor saved successfully!");
      setActiveCursorId(id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save cursor");
    }
  };

  const handleActivate = useCallback((cursor: CursorConfig) => {
    setConfig({
      imageUrl: cursor.image.getDirectURL(),
      imageBytes: null,
      size: Number(cursor.size),
      opacity: Math.round(cursor.opacity * 100),
      shape: cursor.shape,
      effect: cursor.effect,
      name: cursor.name,
    });
    setActiveCursorId(cursor.id);
    toast.success(`Cursor "${cursor.name}" activated!`);
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCursor(id);
      if (activeCursorId === id) {
        setActiveCursorId(null);
        setConfig(DEFAULT_CONFIG);
      }
      toast.success("Cursor deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete cursor");
    } finally {
      setDeletingId(null);
    }
  };

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="top-right" theme="dark" />

      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src="/assets/generated/cursor-studio-logo-transparent.dim_80x80.png"
              alt="Cursor Studio"
              className="w-8 h-8"
            />
            <div>
              <h1 className="font-display font-bold text-lg leading-none text-foreground">
                Cursor Studio
              </h1>
              <p className="font-mono text-xs text-muted-foreground">
                Custom Mouse Cursor Designer
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              <span>Mouse + Touch Supported</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_280px] gap-6 h-full">
          {/* Left: Customizer Panel */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <div className="mb-4">
              <h2 className="font-display font-semibold text-base text-foreground">
                Customize
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Upload & style your cursor
              </p>
            </div>
            <Separator className="mb-5" />
            <CustomizerPanel
              config={config}
              onChange={handleConfigChange}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </motion.aside>

          {/* Center: Playground */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-4">
              <h2 className="font-display font-semibold text-base text-foreground">
                Playground
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Move your mouse or finger to test
              </p>
            </div>
            <Separator className="mb-5" />
            <div className="flex-1">
              <Playground
                imageUrl={config.imageUrl}
                size={config.size}
                opacity={config.opacity}
                shape={config.shape}
                effect={config.effect}
              />
            </div>
          </motion.section>

          {/* Right: Gallery */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <div className="mb-4">
              <h2 className="font-display font-semibold text-base text-foreground">
                Gallery
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Click to activate
              </p>
            </div>
            <Separator className="mb-5" />
            <CursorGallery
              cursors={cursors}
              activeCursorId={activeCursorId}
              isLoading={isLoadingCursors}
              deletingId={deletingId}
              onActivate={handleActivate}
              onDelete={handleDelete}
            />
          </motion.aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-8">
        <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-xs font-mono text-muted-foreground/50">
            © {year}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/40">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            Cursor Studio v1.0
          </div>
        </div>
      </footer>
    </div>
  );
}
