import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
    uploadedImages: Array<Uint8Array>;
    audioFileName: string;
    uploadedAudio: Array<Uint8Array>;
    galleryPhotos: Array<GalleryPhoto>;
}
export interface backendInterface {
    addAudio(blob: Uint8Array): Promise<void>;
    addImage(blob: Uint8Array): Promise<void>;
    getAudio(index: bigint): Promise<Uint8Array | null>;
    getContent(): Promise<CardContent>;
    getImage(index: bigint): Promise<Uint8Array | null>;
    listAudio(): Promise<Array<Uint8Array>>;
    listImages(): Promise<Array<Uint8Array>>;
    replaceAudio(index: bigint, blob: Uint8Array): Promise<boolean>;
    replaceImage(index: bigint, blob: Uint8Array): Promise<boolean>;
    saveContent(newContent: CardContent): Promise<void>;
}
