export interface PopupConfig {
  name: string;
  leftBattery: number;
  rightBattery: number;
  caseBattery: number;
  backgroundColor: string;
  accentColor: string;
  fontStyle: string;
  imageUrl: string;
  imageFile?: File;
  imageSize?: number;
  popupSize?: number;
  popupShape?: "Rounded" | "Square" | "Pill";
  popupTheme?: "Dark" | "Light" | "Glassmorphism" | "Neon";
  borderColor?: string;
  borderWidth?: number;
  shadowIntensity?: "None" | "Soft" | "Medium" | "Strong" | "Glow";
  imagePosition?: "Top" | "Left" | "Right";
  soundPreset?: "Default" | "Chime" | "Click" | "Whoosh" | "Pop" | "None";
  soundVolume?: number;
  customOpenSoundUrl?: string;
  customCloseSoundUrl?: string;
}
