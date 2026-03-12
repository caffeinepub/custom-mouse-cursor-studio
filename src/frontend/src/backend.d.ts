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
export interface CursorConfig {
    id: string;
    name: string;
    createdAt: bigint;
    size: bigint;
    effect: EffectType;
    shape: ShapeType;
    image: ExternalBlob;
    opacity: number;
}
export enum EffectType {
    trail = "trail",
    glow = "glow",
    none = "none"
}
export enum ShapeType {
    circle = "circle",
    square = "square"
}
export interface backendInterface {
    deleteCursor(id: string): Promise<void>;
    getCursor(id: string): Promise<CursorConfig>;
    listCursors(): Promise<Array<CursorConfig>>;
    saveCursorConfig(id: string, name: string, image: ExternalBlob, size: bigint, opacity: number, effect: EffectType, shape: ShapeType): Promise<void>;
}
