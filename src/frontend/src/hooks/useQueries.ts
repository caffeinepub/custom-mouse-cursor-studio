import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { EarbudsProfile } from "../backend";
import type { PopupConfig } from "../types";
import { useActor } from "./useActor";

export type { EarbudsProfile };

export function useGetAllProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<EarbudsProfile[]>({
    queryKey: ["profiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: PopupConfig & { imageFile?: File }) => {
      if (!actor) throw new Error("Actor not ready");

      let blob: ExternalBlob;
      if (config.imageFile) {
        const bytes = new Uint8Array(await config.imageFile.arrayBuffer());
        blob = ExternalBlob.fromBytes(bytes);
      } else {
        blob = ExternalBlob.fromURL(config.imageUrl);
      }

      return actor.addProfile(
        config.name,
        BigInt(config.leftBattery),
        BigInt(config.rightBattery),
        BigInt(config.caseBattery),
        config.backgroundColor,
        config.accentColor,
        config.fontStyle,
        blob,
        BigInt(config.imageSize ?? 120),
        BigInt(config.popupSize ?? 280),
        config.popupShape ?? "Rounded",
        config.popupTheme ?? "Dark",
        config.borderColor ?? "#ffffff",
        BigInt(config.borderWidth ?? 0),
        config.shadowIntensity ?? "Medium",
        config.imagePosition ?? "Top",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("Profile saved!");
    },
    onError: () => {
      toast.error("Failed to save profile");
    },
  });
}

export function useDeleteProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteProfile(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("Profile deleted");
    },
    onError: () => {
      toast.error("Failed to delete profile");
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      config,
    }: {
      id: bigint;
      config: PopupConfig & { imageFile?: File };
    }) => {
      if (!actor) throw new Error("Actor not ready");

      let blob: ExternalBlob;
      if (config.imageFile) {
        const bytes = new Uint8Array(await config.imageFile.arrayBuffer());
        blob = ExternalBlob.fromBytes(bytes);
      } else {
        blob = ExternalBlob.fromURL(config.imageUrl);
      }

      return actor.updateProfile(
        id,
        config.name,
        BigInt(config.leftBattery),
        BigInt(config.rightBattery),
        BigInt(config.caseBattery),
        config.backgroundColor,
        config.accentColor,
        config.fontStyle,
        blob,
        BigInt(config.imageSize ?? 120),
        BigInt(config.popupSize ?? 280),
        config.popupShape ?? "Rounded",
        config.popupTheme ?? "Dark",
        config.borderColor ?? "#ffffff",
        BigInt(config.borderWidth ?? 0),
        config.shadowIntensity ?? "Medium",
        config.imagePosition ?? "Top",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("Profile updated!");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
}
