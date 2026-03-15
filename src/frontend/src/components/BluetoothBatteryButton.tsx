import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Wifi,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useBluetoothBattery } from "../hooks/useBluetoothBattery";
import type { PopupConfig } from "../types";

interface Props {
  config: PopupConfig;
  onChange: (config: PopupConfig) => void;
}

function BatteryBar({ level }: { level: number }) {
  const color =
    level >= 50
      ? "bg-emerald-400"
      : level >= 20
        ? "bg-amber-400"
        : "bg-red-400";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 rounded-full bg-border/30 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${level}%` }}
        />
      </div>
      <span className="text-xs font-mono text-foreground/70">{level}%</span>
    </div>
  );
}

const HELP_STEPS = [
  "Turn on Bluetooth on your phone",
  "Pair your earbuds with your phone first",
  'Click "Connect Earbuds" button',
  "Select your earbuds from the browser popup",
  "Allow Bluetooth permission if asked",
];

function ErrorCard({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  const isPermissionDenied = error === "permission_denied";
  const isNotFound = error === "no_device_selected";

  const message = isPermissionDenied
    ? "Bluetooth permission was denied."
    : isNotFound
      ? "No device was selected."
      : error;

  const tip = isPermissionDenied
    ? "Go to Chrome Settings → Site Settings → Bluetooth → Allow this site."
    : isNotFound
      ? "Make sure your earbuds are paired with your phone first, then try again."
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
      data-ocid="bluetooth.error_state"
    >
      <div className="rounded-xl border border-red-500/25 bg-red-500/8 p-3 space-y-2.5">
        <div className="flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-red-300">{message}</p>
            {tip && (
              <p className="text-[11px] text-red-300/70 mt-1 leading-relaxed">
                {tip}
              </p>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="w-full gap-1.5 h-7 text-xs border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200"
          data-ocid="bluetooth.retry_button"
        >
          <RefreshCw className="w-3 h-3" />
          Try Again
        </Button>
      </div>
    </motion.div>
  );
}

export default function BluetoothBatteryButton({ config, onChange }: Props) {
  const bt = useBluetoothBattery();
  const configRef = useRef(config);
  const onChangeRef = useRef(onChange);
  configRef.current = config;
  onChangeRef.current = onChange;

  const [helpOpen, setHelpOpen] = useState(false);

  // When battery level changes, update the popup config
  useEffect(() => {
    if (bt.batteryLevel !== null) {
      const level = bt.batteryLevel;
      const caseLevel = Math.min(100, level + 10);
      onChangeRef.current({
        ...configRef.current,
        leftBattery: level,
        rightBattery: level,
        caseBattery: caseLevel,
      });
    }
  }, [bt.batteryLevel]);

  if (!bt.isSupported) {
    return (
      <div
        className="flex items-center gap-2 rounded-xl border border-border/30 bg-secondary/20 px-3 py-2.5"
        data-ocid="bluetooth.error_state"
      >
        <BluetoothOff className="w-4 h-4 text-muted-foreground/60 shrink-0" />
        <span className="text-xs text-muted-foreground/70">
          Bluetooth not supported in this browser. Use Chrome or Edge.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {bt.isConnected ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-2"
            data-ocid="bluetooth.success_state"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <BluetoothConnected className="w-4 h-4 text-emerald-400" />
                  {/* Pulsing green dot — layered ring + inner dot for visibility */}
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                </div>
                <span className="text-xs font-medium text-emerald-400 truncate max-w-[120px]">
                  {bt.deviceName}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={bt.disconnect}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                data-ocid="bluetooth.secondary_button"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {bt.batteryLevel !== null ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <div className="flex items-center gap-1">
                    <Wifi className="w-3 h-3" />
                    <span>Live Battery</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] h-4 border-emerald-500/40 text-emerald-400 px-1.5"
                  >
                    LIVE
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] text-muted-foreground">
                      Left
                    </span>
                    <BatteryBar level={bt.batteryLevel} />
                  </div>
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] text-muted-foreground">
                      Right
                    </span>
                    <BatteryBar level={bt.batteryLevel} />
                  </div>
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] text-muted-foreground">
                      Case
                    </span>
                    <BatteryBar level={Math.min(100, bt.batteryLevel + 10)} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-amber-400/80">
                Connected but battery info unavailable for this device.
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="space-y-2"
          >
            {/* Connect button */}
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50"
              onClick={bt.connect}
              disabled={bt.isConnecting}
              data-ocid="bluetooth.primary_button"
            >
              {bt.isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span data-ocid="bluetooth.loading_state">Connecting...</span>
                </>
              ) : (
                <>
                  <Bluetooth className="w-4 h-4" />
                  Connect Earbuds
                </>
              )}
            </Button>

            {/* Last used device hint */}
            {bt.lastDeviceName && !bt.isConnecting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5 px-1"
              >
                <Clock className="w-3 h-3 text-muted-foreground/50" />
                <span className="text-[11px] text-muted-foreground/60">
                  Last used:{" "}
                  <span className="font-medium text-muted-foreground/80">
                    {bt.lastDeviceName}
                  </span>
                </span>
              </motion.div>
            )}

            {/* Help toggle */}
            <button
              type="button"
              onClick={() => setHelpOpen((v) => !v)}
              className="flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors px-1"
              data-ocid="bluetooth.help.toggle"
            >
              {helpOpen ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              How to connect?
            </button>

            <AnimatePresence>
              {helpOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl border border-border/25 bg-secondary/15 p-3 space-y-2">
                    <ol className="space-y-1.5">
                      {HELP_STEPS.map((step, i) => (
                        <li key={step} className="flex items-start gap-2">
                          <span className="shrink-0 w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-[11px] text-muted-foreground/80 leading-relaxed">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                    <p className="text-[10px] text-muted-foreground/50 pt-1 border-t border-border/20">
                      ⚠️ Works on Chrome/Edge only. Not supported on Safari or
                      Firefox.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error card */}
      <AnimatePresence>
        {bt.error && <ErrorCard error={bt.error} onRetry={bt.connect} />}
      </AnimatePresence>
    </div>
  );
}
