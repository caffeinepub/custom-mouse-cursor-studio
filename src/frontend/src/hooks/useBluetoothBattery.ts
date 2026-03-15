import { useCallback, useEffect, useRef, useState } from "react";

const LAST_DEVICE_KEY = "btLastDeviceName";

export interface BluetoothBatteryState {
  isSupported: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  deviceName: string | null;
  lastDeviceName: string | null;
  batteryLevel: number | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export function useBluetoothBattery(): BluetoothBatteryState {
  const isSupported =
    typeof navigator !== "undefined" && "bluetooth" in navigator;

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [lastDeviceName, setLastDeviceName] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LAST_DEVICE_KEY);
    } catch {
      return null;
    }
  });
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deviceRef = useRef<any>(null);
  const characteristicRef = useRef<any>(null);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    setDeviceName(null);
    setBatteryLevel(null);
    deviceRef.current = null;
    characteristicRef.current = null;
  }, []);

  const disconnect = useCallback(() => {
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    handleDisconnect();
    try {
      localStorage.removeItem(LAST_DEVICE_KEY);
    } catch {
      // ignore
    }
    setLastDeviceName(null);
  }, [handleDisconnect]);

  const connect = useCallback(async () => {
    if (!isSupported) {
      setError(
        "Web Bluetooth is not supported in this browser. Please use Chrome or Edge.",
      );
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const nav = navigator as any;
      let device: any;
      try {
        device = await nav.bluetooth.requestDevice({
          filters: [{ services: ["battery_service"] }],
          optionalServices: ["battery_service"],
        });
      } catch {
        device = await nav.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ["battery_service"],
        });
      }

      deviceRef.current = device;
      device.addEventListener("gattserverdisconnected", handleDisconnect);

      const server = await device.gatt.connect();
      const name = device.name ?? "Unknown Device";
      setDeviceName(name);

      // Persist last device name
      try {
        localStorage.setItem(LAST_DEVICE_KEY, name);
      } catch {
        // ignore
      }
      setLastDeviceName(name);

      try {
        const batteryService =
          await server.getPrimaryService("battery_service");
        const characteristic = await batteryService.getCharacteristic(0x2a19);
        characteristicRef.current = characteristic;

        const value = await characteristic.readValue();
        const level = value.getUint8(0);
        setBatteryLevel(level);

        // Subscribe to notifications if supported
        try {
          await characteristic.startNotifications();
          characteristic.addEventListener(
            "characteristicvaluechanged",
            (event: any) => {
              if (event.target?.value) {
                setBatteryLevel(event.target.value.getUint8(0));
              }
            },
          );
        } catch {
          // Notifications not supported, that's ok
        }
      } catch {
        setError(
          "Connected! But this device doesn't expose battery info via Bluetooth.",
        );
      }

      setIsConnected(true);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "NotFoundError") {
          setError("no_device_selected");
        } else if (
          err.name === "SecurityError" ||
          err.name === "NotAllowedError"
        ) {
          setError("permission_denied");
        } else {
          setError(err.message || "Failed to connect to Bluetooth device.");
        }
      } else {
        setError("Failed to connect to Bluetooth device.");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isSupported, handleDisconnect]);

  // Auto-disconnect on unmount
  useEffect(() => {
    return () => {
      if (deviceRef.current?.gatt?.connected) {
        deviceRef.current.gatt.disconnect();
      }
    };
  }, []);

  return {
    isSupported,
    isConnecting,
    isConnected,
    deviceName,
    lastDeviceName,
    batteryLevel,
    error,
    connect,
    disconnect,
  };
}
