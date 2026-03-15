import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Headphones, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useDeleteProfile, useGetAllProfiles } from "../hooks/useQueries";
import type { EarbudsProfile } from "../hooks/useQueries";
import type { PopupConfig } from "../types";
import EarbudsPopup from "./EarbudsPopup";

interface Props {
  onSelect: (config: PopupConfig) => void;
}

function profileToConfig(profile: EarbudsProfile): PopupConfig {
  return {
    name: profile.name,
    leftBattery: Number(profile.leftBattery),
    rightBattery: Number(profile.rightBattery),
    caseBattery: Number(profile.caseBattery),
    backgroundColor: profile.backgroundColor,
    accentColor: profile.accentColor,
    fontStyle: profile.fontStyle,
    imageUrl: profile.image.getDirectURL(),
  };
}

export default function ModelGallery({ onSelect }: Props) {
  const { data: profiles, isLoading } = useGetAllProfiles();
  const deleteProfile = useDeleteProfile();
  const [previewProfile, setPreviewProfile] = useState<EarbudsProfile | null>(
    null,
  );

  const handleDelete = (e: React.MouseEvent, id: bigint) => {
    e.stopPropagation();
    deleteProfile.mutate(id);
  };

  const closePreview = () => setPreviewProfile(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-48 rounded-2xl"
            data-ocid="gallery.loading_state"
          />
        ))}
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 text-center"
        data-ocid="gallery.empty_state"
      >
        <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/40 flex items-center justify-center mb-4">
          <Headphones className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-display font-semibold text-lg mb-1">
          No profiles yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Go to Studio tab to customize and save your first earbuds profile.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {profiles.map((profile, index) => {
            const config = profileToConfig(profile);
            const ocidIndex = index + 1;
            return (
              <motion.article
                key={profile.id.toString()}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
                data-ocid={`gallery.item.${ocidIndex}`}
                className="group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
              >
                <div
                  className="h-1 w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${config.accentColor}, transparent)`,
                  }}
                />

                <div className="p-4">
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => onSelect(config)}
                    aria-label={`Select ${config.name} profile`}
                  >
                    <div
                      className="flex justify-center mb-3 rounded-xl py-3"
                      style={{ background: config.backgroundColor }}
                    >
                      <img
                        src={config.imageUrl}
                        alt={config.name}
                        className="w-20 h-16 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/assets/generated/airpods-default.dim_400x300.png";
                        }}
                      />
                    </div>

                    <h3 className="font-display font-semibold text-sm mb-2">
                      {config.name}
                    </h3>

                    <div className="flex gap-2 mb-3">
                      {[
                        { label: "L", value: config.leftBattery },
                        { label: "C", value: config.caseBattery },
                        { label: "R", value: config.rightBattery },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex-1 text-center">
                          <div
                            className="text-xs font-mono font-semibold"
                            style={{
                              color:
                                value < 20 ? "#ff453a" : config.accentColor,
                            }}
                          >
                            {value}%
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-xs gap-1 border-border/40 hover:border-primary/40 hover:text-primary"
                      onClick={() => setPreviewProfile(profile)}
                      data-ocid={`gallery.item.${ocidIndex}.button`}
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 border-border/40 hover:border-destructive/50 hover:text-destructive"
                      onClick={(e) => handleDelete(e, profile.id)}
                      disabled={deleteProfile.isPending}
                      data-ocid={`gallery.item.${ocidIndex}.delete_button`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {previewProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
            }}
            data-ocid="gallery.preview.modal"
          >
            <button
              type="button"
              aria-label="Close preview"
              className="absolute inset-0 w-full h-full cursor-default"
              onClick={closePreview}
            />
            <div className="relative z-10">
              <EarbudsPopup
                config={profileToConfig(previewProfile)}
                inline={false}
              />
            </div>
            <button
              type="button"
              className="absolute top-4 right-4 text-white/50 hover:text-white text-sm z-10"
              onClick={closePreview}
              data-ocid="gallery.preview.close_button"
            >
              Tap anywhere to close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
