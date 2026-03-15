import { motion } from "motion/react";
import type { PopupConfig } from "../types";

interface BatteryRingProps {
  percentage: number;
  label: string;
  accentColor: string;
  size?: number;
}

function BatteryRing({
  percentage,
  label,
  accentColor,
  size = 56,
}: BatteryRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isLow = percentage < 20;
  const color = isLow ? "#ff453a" : accentColor;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="absolute inset-0"
          aria-hidden="true"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={4}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-semibold leading-none"
            style={{ color, fontSize: size < 50 ? "9px" : "11px" }}
          >
            {percentage}%
          </span>
        </div>
      </div>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>
        {label}
      </span>
    </div>
  );
}

interface Props {
  config: PopupConfig;
  inline?: boolean;
}

const FONT_MAP: Record<string, string> = {
  Modern: "'Outfit', sans-serif",
  Rounded: "'Bricolage Grotesque', sans-serif",
  Classic: "Georgia, 'Times New Roman', serif",
};

export default function EarbudsPopup({ config, inline = false }: Props) {
  const fontFamily = FONT_MAP[config.fontStyle] ?? FONT_MAP.Modern;

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="relative overflow-hidden"
      style={{
        width: 280,
        borderRadius: 24,
        background: config.backgroundColor,
        boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), 0 0 40px ${config.accentColor}22`,
        fontFamily,
      }}
    >
      {/* Glass overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)",
          borderRadius: 24,
        }}
      />

      {/* Top accent glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-b-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${config.accentColor}88, transparent)`,
        }}
      />

      {/* Earbuds image */}
      <div className="flex justify-center pt-7 pb-2">
        <div
          style={{
            width: 120,
            height: 90,
            filter: `drop-shadow(0 8px 24px ${config.accentColor}44)`,
          }}
        >
          <img
            src={config.imageUrl}
            alt={`${config.name} earbuds`}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/generated/airpods-default.dim_400x300.png";
            }}
          />
        </div>
      </div>

      {/* Device name */}
      <div className="text-center px-6 pb-1">
        <h2
          className="font-semibold leading-tight"
          style={{ color: "rgba(255,255,255,0.95)", fontSize: 17 }}
        >
          {config.name || "My Earbuds"}
        </h2>
        <div
          className="flex items-center justify-center gap-1 mt-0.5"
          style={{ color: config.accentColor, fontSize: 11 }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: config.accentColor }}
          />
          Connected
        </div>
      </div>

      {/* Battery indicators */}
      <div className="flex justify-around items-end px-5 py-5">
        <BatteryRing
          percentage={config.leftBattery}
          label="Left"
          accentColor={config.accentColor}
          size={56}
        />
        <BatteryRing
          percentage={config.caseBattery}
          label="Case"
          accentColor={config.accentColor}
          size={64}
        />
        <BatteryRing
          percentage={config.rightBattery}
          label="Right"
          accentColor={config.accentColor}
          size={56}
        />
      </div>

      {/* Divider */}
      <div
        className="mx-5 mb-4 rounded-full h-px"
        style={{ background: "rgba(255,255,255,0.07)" }}
      />
      <div
        className="text-center pb-3 text-xs"
        style={{ color: "rgba(255,255,255,0.25)" }}
      >
        Earbuds Popup Studio
      </div>
    </motion.div>
  );

  if (inline) {
    return <div className="flex justify-center">{card}</div>;
  }

  return card;
}
