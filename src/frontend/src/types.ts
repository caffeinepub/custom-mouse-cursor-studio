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
}
