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
export interface GalleryPhoto {
    src: string;
    top: bigint;
    rotation: bigint;
    zIndex: bigint;
    left: bigint;
    size: bigint;
    caption: string;
}
export interface LoveCard {
    title: string;
    description: string;
    photos: Array<{
        src: string;
        rotation: bigint;
    }>;
}
export interface CardContent {
    loveCards: Array<LoveCard>;
    letterText: string;
    uploadedImages: Array<ExternalBlob>;
    audioFileName: string;
    uploadedAudio: Array<ExternalBlob>;
    galleryPhotos: Array<GalleryPhoto>;
}
export interface backendInterface {
    addAudio(blob: ExternalBlob): Promise<void>;
    addImage(blob: ExternalBlob): Promise<void>;
    getAudio(index: bigint): Promise<ExternalBlob | null>;
    getContent(): Promise<CardContent>;
    getImage(index: bigint): Promise<ExternalBlob | null>;
    listAudio(): Promise<Array<ExternalBlob>>;
    listImages(): Promise<Array<ExternalBlob>>;
    replaceAudio(index: bigint, blob: ExternalBlob): Promise<boolean>;
    replaceImage(index: bigint, blob: ExternalBlob): Promise<boolean>;
    saveContent(newContent: CardContent): Promise<void>;
}
