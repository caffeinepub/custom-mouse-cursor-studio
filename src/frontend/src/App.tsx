import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones, Layers, Share2, Sparkles } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import CustomizationPanel from "./components/CustomizationPanel";
import EarbudsPopup from "./components/EarbudsPopup";
import ModelGallery from "./components/ModelGallery";
import { usePopupSound } from "./hooks/usePopupSound";
import type { PopupConfig } from "./types";

const DEFAULT_CONFIG: PopupConfig = {
  name: "AirPods Pro",
  leftBattery: 85,
  rightBattery: 78,
  caseBattery: 62,
  backgroundColor: "#1c1c1e",
  accentColor: "#0a84ff",
  fontStyle: "Modern",
  imageUrl: "/assets/generated/airpods-default.dim_400x300.png",
  imageSize: 120,
  popupSize: 280,
  popupShape: "Rounded",
  popupTheme: "Dark",
  borderColor: "#ffffff",
  borderWidth: 0,
  shadowIntensity: "Medium",
  imagePosition: "Top",
  soundPreset: "Default",
  soundVolume: 50,
};

export default function App() {
  const [config, setConfig] = useState<PopupConfig>(DEFAULT_CONFIG);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("studio");

  const sheetY = useMotionValue(0);
  const sheetOpacity = useTransform(sheetY, [0, 300], [1, 0]);
  const overlayOpacity = useTransform(sheetY, [0, 300], [0.6, 0]);
  const isDraggingRef = useRef(false);

  const { playOpenSound, playCloseSound } = usePopupSound({
    preset: config.soundPreset,
    volume: config.soundVolume,
    openSoundUrl: config.customOpenSoundUrl,
    closeSoundUrl: config.customCloseSoundUrl,
  });

  const handleGallerySelect = (newConfig: PopupConfig) => {
    setConfig(newConfig);
    setActiveTab("studio");
  };

  const openPopup = () => {
    sheetY.set(0);
    setShowPopup(true);
    playOpenSound();
  };

  const closePopup = () => {
    setShowPopup(false);
    sheetY.set(0);
    playCloseSound();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    } catch (_) {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster />

      <header className="relative border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight tracking-tight text-foreground">
              Earbuds Popup Studio
            </h1>
            <p className="text-xs text-muted-foreground">
              Design & preview your device popups
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <Sparkles className="w-4 h-4 text-primary/60" />
          <span className="text-xs text-muted-foreground hidden sm:block">
            Live Preview
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-secondary/50 border border-border/40">
            <TabsTrigger
              value="studio"
              data-ocid="studio.tab"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Studio
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              data-ocid="gallery.tab"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
            >
              <Layers className="w-3.5 h-3.5" />
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="studio" className="mt-0">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CustomizationPanel
                config={config}
                onChange={setConfig}
                onShowPopup={openPopup}
              />
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground font-body">
                  Live Preview
                </p>
                <EarbudsPopup config={config} inline />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-0">
            <ModelGallery onSelect={handleGallerySelect} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border/30 py-3 px-6 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="text-primary/70 hover:text-primary transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Bottom trigger button (when popup closed) */}
      <AnimatePresence>
        {!showPopup && (
          <motion.div
            key="bottom-trigger"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <motion.button
              type="button"
              aria-label="Open popup"
              drag="y"
              dragConstraints={{ top: -100, bottom: 10 }}
              dragElastic={0.2}
              onDragEnd={(_e, info) => {
                if (info.offset.y < -50) {
                  openPopup();
                }
              }}
              onClick={openPopup}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-ocid="popup.open_modal_button"
              className="px-5 py-2.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm text-primary text-sm font-medium flex items-center gap-2 cursor-pointer select-none"
            >
              <Headphones className="w-4 h-4" />
              Show Popup
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-sheet overlay + popup */}
      <AnimatePresence>
        {showPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              style={{ opacity: overlayOpacity }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={closePopup}
              data-ocid="popup.close_button"
            />

            {/* Bottom sheet */}
            <motion.div
              key="bottom-sheet"
              drag="y"
              dragConstraints={{ top: 0, bottom: 400 }}
              dragElastic={0.1}
              style={{ y: sheetY, opacity: sheetOpacity }}
              initial={{ y: 400, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 500, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              onDragStart={() => {
                isDraggingRef.current = true;
              }}
              onDragEnd={(_e, info) => {
                isDraggingRef.current = false;
                if (info.offset.y > 80) {
                  closePopup();
                } else {
                  sheetY.set(0);
                }
              }}
              data-ocid="popup.modal"
              className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-8 pt-4 px-4 touch-none"
            >
              {/* Drag indicator bar */}
              <div className="w-10 h-1 rounded-full bg-white/30 mb-5" />

              {/* Popup card */}
              <EarbudsPopup config={config} inline={false} />

              {/* Share button */}
              <div className="flex items-center gap-6 mt-5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  data-ocid="popup.secondary_button"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
