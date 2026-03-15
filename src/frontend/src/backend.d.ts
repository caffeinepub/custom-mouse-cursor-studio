import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface EarbudsProfile {
    id: bigint;
    backgroundColor: string;
    fontStyle: string;
    name: string;
    accentColor: string;
    caseBattery: bigint;
    rightBattery: bigint;
    image: ExternalBlob;
    leftBattery: bigint;
}
export interface backendInterface {
    addProfile(name: string, leftBattery: bigint, rightBattery: bigint, caseBattery: bigint, backgroundColor: string, accentColor: string, fontStyle: string, image: ExternalBlob): Promise<bigint>;
    deleteProfile(id: bigint): Promise<void>;
    getAllProfiles(): Promise<Array<EarbudsProfile>>;
    getProfile(id: bigint): Promise<EarbudsProfile | null>;
    updateProfile(id: bigint, name: string, leftBattery: bigint, rightBattery: bigint, caseBattery: bigint, backgroundColor: string, accentColor: string, fontStyle: string, image: ExternalBlob): Promise<void>;
}
