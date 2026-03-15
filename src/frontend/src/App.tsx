import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones, Layers, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import CustomizationPanel from "./components/CustomizationPanel";
import EarbudsPopup from "./components/EarbudsPopup";
import ModelGallery from "./components/ModelGallery";
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
};

export default function App() {
  const [config, setConfig] = useState<PopupConfig>(DEFAULT_CONFIG);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("studio");

  const handleGallerySelect = (newConfig: PopupConfig) => {
    setConfig(newConfig);
    setActiveTab("studio");
  };

  const closePopup = () => setShowPopup(false);

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
                onShowPopup={() => setShowPopup(true)}
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

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
            }}
            data-ocid="popup.modal"
          >
            {/* Invisible backdrop button */}
            <button
              type="button"
              aria-label="Close popup"
              className="absolute inset-0 w-full h-full cursor-default"
              onClick={closePopup}
            />
            <div className="relative z-10">
              <EarbudsPopup config={config} inline={false} />
            </div>
            <button
              type="button"
              className="absolute top-4 right-4 text-white/60 hover:text-white text-sm z-10"
              onClick={closePopup}
              data-ocid="popup.close_button"
            >
              Tap anywhere to dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
