import { motion } from "motion/react";
import type { PopupConfig } from "../types";

interface BatteryRingProps {
  percentage: number;
  label: string;
  accentColor: string;
  size?: number;
  isLight?: boolean;
}

function BatteryRing({
  percentage,
  label,
  accentColor,
  size = 56,
  isLight = false,
}: BatteryRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isLow = percentage < 20;
  const color = isLow ? "#ff453a" : accentColor;
  const trackColor = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.12)";
  const textColor = isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";

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
            stroke={trackColor}
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
      <span style={{ color: textColor, fontSize: "10px" }}>{label}</span>
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

function getShapeRadius(shape: PopupConfig["popupShape"]): number {
  switch (shape) {
    case "Square":
      return 8;
    case "Pill":
      return 40;
    default:
      return 24;
  }
}

function getBoxShadow(
  intensity: PopupConfig["shadowIntensity"],
  accentColor: string,
  borderWidth: number,
): string {
  const borderShadow =
    borderWidth > 0 ? "" : "0 0 0 1px rgba(255,255,255,0.08)";
  const accent22 = `${accentColor}22`;
  const accent88 = `${accentColor}88`;
  const accent44 = `${accentColor}44`;

  switch (intensity) {
    case "None":
      return borderShadow;
    case "Soft":
      return `0 8px 24px rgba(0,0,0,0.2), ${borderShadow}, 0 0 20px ${accent22}`;
    case "Strong":
      return `0 32px 100px rgba(0,0,0,0.85), ${borderShadow}, 0 0 40px ${accent22}`;
    case "Glow":
      return `0 0 60px ${accent88}, 0 24px 80px rgba(0,0,0,0.6), 0 0 120px ${accent44}`;
    default: // Medium
      return `0 24px 80px rgba(0,0,0,0.6), ${borderShadow}, 0 0 40px ${accent22}`;
  }
}

function getThemeStyles(
  theme: PopupConfig["popupTheme"],
  backgroundColor: string,
  accentColor: string,
): {
  background: string;
  backdropFilter?: string;
  extraBorder?: string;
  isLight: boolean;
} {
  switch (theme) {
    case "Light":
      return {
        background: "#f5f5f7",
        isLight: true,
      };
    case "Glassmorphism":
      return {
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px)",
        extraBorder: "1px solid rgba(255,255,255,0.25)",
        isLight: false,
      };
    case "Neon":
      return {
        background: "#050508",
        extraBorder: `1px solid ${accentColor}`,
        isLight: false,
      };
    default: // Dark
      return {
        background: backgroundColor,
        isLight: false,
      };
  }
}

export default function EarbudsPopup({ config, inline = false }: Props) {
  const fontFamily = FONT_MAP[config.fontStyle] ?? FONT_MAP.Modern;
  const imageSize = config.imageSize ?? 120;
  const popupSize = config.popupSize ?? 280;
  const imageHeight = Math.round(imageSize * 0.75);
  const borderRadius = getShapeRadius(config.popupShape);
  const borderWidth = config.borderWidth ?? 0;
  const borderColor = config.borderColor ?? "#ffffff";

  const themeStyles = getThemeStyles(
    config.popupTheme,
    config.backgroundColor,
    config.accentColor,
  );
  const boxShadow = getBoxShadow(
    config.shadowIntensity,
    config.accentColor,
    borderWidth,
  );

  const isLight = themeStyles.isLight;
  const nameColor = isLight ? "#1c1c1e" : "rgba(255,255,255,0.95)";
  const labelColor = isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.25)";
  const dividerColor = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.07)";
  const glassOverlay = isLight
    ? "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 60%)"
    : "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)";

  const isNeon = config.popupTheme === "Neon";

  const imagePosition = config.imagePosition ?? "Top";
  const isHorizontal = imagePosition === "Left" || imagePosition === "Right";

  const earbudsImage = (
    <div
      style={{
        width: imageSize,
        height: isHorizontal ? imageSize : imageHeight,
        flexShrink: 0,
        filter: `drop-shadow(0 8px 24px ${config.accentColor}44)${
          isNeon ? ` drop-shadow(0 0 12px ${config.accentColor}88)` : ""
        }`,
        transition: "width 0.2s ease, height 0.2s ease",
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
  );

  const batterySection = (
    <div
      className={`flex ${
        isHorizontal
          ? "flex-col justify-center gap-3"
          : "justify-around items-end"
      } px-5 ${isHorizontal ? "py-4" : "py-5"}`}
    >
      <BatteryRing
        percentage={config.leftBattery}
        label="Left"
        accentColor={config.accentColor}
        size={isHorizontal ? 48 : 56}
        isLight={isLight}
      />
      <BatteryRing
        percentage={config.caseBattery}
        label="Case"
        accentColor={config.accentColor}
        size={isHorizontal ? 52 : 64}
        isLight={isLight}
      />
      <BatteryRing
        percentage={config.rightBattery}
        label="Right"
        accentColor={config.accentColor}
        size={isHorizontal ? 48 : 56}
        isLight={isLight}
      />
    </div>
  );

  const card = (
    <motion.div
      initial={{ opacity: 0, y: -60, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="relative overflow-hidden"
      style={{
        width: popupSize,
        borderRadius,
        background: themeStyles.background,
        backdropFilter: themeStyles.backdropFilter,
        boxShadow: isNeon
          ? `0 0 60px ${config.accentColor}88, 0 24px 80px rgba(0,0,0,0.8), 0 0 120px ${config.accentColor}44`
          : boxShadow,
        border:
          themeStyles.extraBorder ??
          (borderWidth > 0
            ? `${borderWidth}px solid ${borderColor}`
            : undefined),
        fontFamily,
      }}
    >
      {/* Glass overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: glassOverlay,
          borderRadius,
        }}
      />

      {/* Top accent glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-b-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${config.accentColor}88, transparent)`,
        }}
      />

      {isHorizontal ? (
        /* Horizontal layout (Left or Right) */
        <div className="flex items-center">
          {imagePosition === "Left" && (
            <div className="flex justify-center pl-5 pr-2 py-5">
              {earbudsImage}
            </div>
          )}
          <div className="flex-1">
            {/* Device name */}
            <div className="text-center px-4 pt-5 pb-1">
              <h2
                className="font-semibold leading-tight"
                style={{ color: nameColor, fontSize: 15 }}
              >
                {config.name || "My Earbuds"}
              </h2>
              <div
                className="flex items-center justify-center gap-1 mt-0.5"
                style={{ color: config.accentColor, fontSize: 10 }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: config.accentColor }}
                />
                Connected
              </div>
            </div>
            {batterySection}
          </div>
          {imagePosition === "Right" && (
            <div className="flex justify-center pr-5 pl-2 py-5">
              {earbudsImage}
            </div>
          )}
        </div>
      ) : (
        /* Top layout (default) */
        <>
          <div className="flex justify-center pt-7 pb-2">{earbudsImage}</div>

          {/* Device name */}
          <div className="text-center px-6 pb-1">
            <h2
              className="font-semibold leading-tight"
              style={{ color: nameColor, fontSize: 17 }}
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

          {batterySection}
        </>
      )}

      {/* Divider */}
      <div
        className="mx-5 mb-4 rounded-full h-px"
        style={{ background: dividerColor }}
      />
      <div className="text-center pb-3 text-xs" style={{ color: labelColor }}>
        Earbuds Popup Studio
      </div>
    </motion.div>
  );

  if (inline) {
    return <div className="flex justify-center">{card}</div>;
  }

  return card;
}
