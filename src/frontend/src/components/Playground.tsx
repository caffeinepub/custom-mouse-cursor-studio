import { MousePointer2, Smartphone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EffectType, ShapeType } from "../backend";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  time: number;
}

interface PlaygroundProps {
  imageUrl: string | null;
  size: number;
  opacity: number;
  shape: ShapeType;
  effect: EffectType;
}

export function Playground({
  imageUrl,
  size,
  opacity,
  shape,
  effect,
}: PlaygroundProps) {
  const playgroundRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const idRef = useRef(0);
  const isInsideRef = useRef(false);

  const updateTrail = useCallback(
    (x: number, y: number) => {
      if (effect !== EffectType.trail) {
        setTrail([]);
        trailRef.current = [];
        return;
      }
      const point: TrailPoint = {
        x,
        y,
        id: idRef.current++,
        time: performance.now(),
      };
      trailRef.current = [...trailRef.current.slice(-7), point];
      setTrail([...trailRef.current]);
    },
    [effect],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = playgroundRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursorPos({ x, y });
      updateTrail(x, y);
    },
    [updateTrail],
  );

  const handlePointerLeave = useCallback(() => {
    setCursorPos(null);
    setTrail([]);
    trailRef.current = [];
    isInsideRef.current = false;
  }, []);

  const handlePointerEnter = useCallback(() => {
    isInsideRef.current = true;
  }, []);

  // Prevent default scroll on touch inside playground
  useEffect(() => {
    const el = playgroundRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => {
      if (isInsideRef.current) e.preventDefault();
    };
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  // Clean up old trail points
  useEffect(() => {
    if (effect !== EffectType.trail) {
      setTrail([]);
      trailRef.current = [];
    }
  }, [effect]);

  const borderRadius = shape === ShapeType.circle ? "50%" : "6px";

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Live Playground
          </span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1 text-xs">
            <MousePointer2 size={12} />
            <span className="font-mono">Mouse</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Smartphone size={12} />
            <span className="font-mono">Touch</span>
          </div>
        </div>
      </div>

      <div
        ref={playgroundRef}
        data-ocid="playground.canvas_target"
        className="playground-bg relative flex-1 rounded-xl overflow-hidden border border-border"
        style={{ cursor: imageUrl ? "none" : "crosshair", minHeight: "55vh" }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerEnter={handlePointerEnter}
      >
        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-primary/50 rounded-tl" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-primary/50 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-primary/50 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-primary/50 rounded-br" />

        {/* Center guide text when no cursor */}
        {!cursorPos && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <div className="text-muted-foreground/40 text-center">
              <MousePointer2 size={32} className="mx-auto mb-2 opacity-40" />
              <p className="font-mono text-sm">
                {imageUrl
                  ? "Move cursor / finger here"
                  : "Upload an image to preview"}
              </p>
              <p className="text-xs mt-1 opacity-60">
                Mouse · Touch · Finger — all supported
              </p>
            </div>
          </div>
        )}

        {/* Trail ghost copies */}
        <AnimatePresence>
          {imageUrl &&
            effect === EffectType.trail &&
            trail.map((point, i) => {
              const trailOpacity =
                ((i + 1) / trail.length) * (opacity / 100) * 0.6;
              const trailSize = size * (0.5 + (i / trail.length) * 0.5);
              return (
                <motion.div
                  key={point.id}
                  initial={{ opacity: trailOpacity, scale: 0.8 }}
                  animate={{ opacity: trailOpacity * 0.8 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "absolute",
                    left: point.x - trailSize / 2,
                    top: point.y - trailSize / 2,
                    width: trailSize,
                    height: trailSize,
                    pointerEvents: "none",
                    zIndex: i,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </motion.div>
              );
            })}
        </AnimatePresence>

        {/* Main cursor follower */}
        {imageUrl && cursorPos && (
          <div
            style={{
              position: "absolute",
              left: cursorPos.x - size / 2,
              top: cursorPos.y - size / 2,
              width: size,
              height: size,
              pointerEvents: "none",
              zIndex: 50,
              transition: "left 0.02s, top 0.02s",
            }}
          >
            <img
              src={imageUrl}
              alt="cursor"
              style={{
                width: "100%",
                height: "100%",
                borderRadius,
                objectFit: "cover",
                opacity: opacity / 100,
                display: "block",
                filter:
                  effect === EffectType.glow
                    ? "drop-shadow(0 0 8px oklch(0.76 0.19 195 / 0.9)) drop-shadow(0 0 20px oklch(0.65 0.22 290 / 0.6))"
                    : "none",
              }}
            />
          </div>
        )}

        {/* Cursor coordinates HUD */}
        {cursorPos && (
          <div className="absolute bottom-3 left-3 font-mono text-xs text-primary/60 bg-card/70 backdrop-blur-sm px-2 py-1 rounded">
            X: {Math.round(cursorPos.x)} Y: {Math.round(cursorPos.y)}
          </div>
        )}

        {/* Effect badge */}
        {effect !== EffectType.none && (
          <div className="absolute top-3 right-3 font-mono text-xs text-accent bg-card/70 backdrop-blur-sm px-2 py-1 rounded border border-accent/30">
            {effect === EffectType.trail ? "✦ TRAIL" : "◈ GLOW"}
          </div>
        )}
      </div>
    </div>
  );
}
