import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LoveReasonCard {
    title: string;
    description: string;
}
export interface CardContent {
    loveLetter: string;
    photoCaptions: PhotoCaptions;
    reasonCards: Array<LoveReasonCard>;
}
export interface PhotoCaptions {
    graduation: string;
    winterGarden: string;
    daughterPhotos: string;
    berlinMuseum: string;
    hamptonsNight: string;
    romeColosseum: string;
    firstBerlinPhoto: string;
}
export interface backendInterface {
    getAllReasonCards(): Promise<Array<LoveReasonCard>>;
    getCardContent(): Promise<CardContent>;
    getLoveLetter(): Promise<string>;
    getPhotoCaptions(): Promise<PhotoCaptions>;
    getReasonCard(index: bigint): Promise<LoveReasonCard>;
}
