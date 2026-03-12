import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type EffectType, ExternalBlob, type ShapeType } from "../backend";
import { useActor } from "./useActor";

export function useListCursors() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["cursors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCursors();
    },
    enabled: !!actor && !isFetching,
  });
}

export interface SaveCursorParams {
  id: string;
  name: string;
  imageBytes: Uint8Array<ArrayBuffer>;
  size: number;
  opacity: number;
  effect: EffectType;
  shape: ShapeType;
}

export function useSaveCursor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: SaveCursorParams) => {
      if (!actor) throw new Error("Actor not ready");
      const blob = ExternalBlob.fromBytes(params.imageBytes);
      await actor.saveCursorConfig(
        params.id,
        params.name,
        blob,
        BigInt(params.size),
        params.opacity / 100,
        params.effect,
        params.shape,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cursors"] }),
  });
}

export function useDeleteCursor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteCursor(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cursors"] }),
  });
}
