import { useEffect, useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { DEFAULT_POEMS } from "../components/GameSection";
import { useActor } from "./useActor";

export interface PolaroidItem {
  src: string;
  caption: string;
  rotation: number;
}

export interface AnnivContent {
  poems: string[]; // 6 poems for dice rolls
  boardGameImageUrl: string;
  polaroids: PolaroidItem[]; // 20 slots (2 strings × 10)
  audioDataUrl: string;
  audioFileName: string;
  benchImageUrl: string;
  bouquetImageUrl: string;
  treasuresImageUrl: string;
}

const TOTAL_POLAROIDS = 20;
const DEFAULT_ROTATIONS = [
  -4, 3, -2, 5, -3, 3, -5, 2, -3, 4, -3, 5, -4, 2, -3, 4, -2, 3, -5, 2,
];

const DEFAULT_CONTENT: AnnivContent = {
  poems: [...DEFAULT_POEMS],
  boardGameImageUrl: "",
  polaroids: Array.from({ length: TOTAL_POLAROIDS }, (_, i) => ({
    src: "",
    caption: "",
    rotation: DEFAULT_ROTATIONS[i],
  })),
  audioDataUrl: "",
  audioFileName: "",
  benchImageUrl: "",
  bouquetImageUrl: "",
  treasuresImageUrl: "",
};

/**
 * Image slot mapping:
 * uploadedImages[0]       = board game image
 * uploadedImages[1]       = bench image (single photo of both characters)
 * uploadedImages[2]       = (unused — kept for slot alignment)
 * uploadedImages[3..22]   = polaroids 0-19
 * uploadedImages[23]      = bouquet image
 * uploadedImages[24]      = little treasures image
 */
export function useAnnivContent() {
  const { actor, isFetching } = useActor();
  const [content, setContent] = useState<AnnivContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  const pendingAudioRef = useRef<{
    bytes: Uint8Array<ArrayBuffer>;
    fileName: string;
  } | null>(null);
  const pendingBoardGameRef = useRef<{
    bytes: Uint8Array<ArrayBuffer>;
    fileName: string;
  } | null>(null);
  const pendingBenchImageRef = useRef<{
    bytes: Uint8Array<ArrayBuffer>;
    fileName: string;
  } | null>(null);
  const pendingPolaroidsRef = useRef<
    Map<number, { bytes: Uint8Array<ArrayBuffer>; fileName: string }>
  >(new Map());
  const pendingBouquetRef = useRef<{
    bytes: Uint8Array<ArrayBuffer>;
    fileName: string;
  } | null>(null);
  const pendingTreasuresRef = useRef<{
    bytes: Uint8Array<ArrayBuffer>;
    fileName: string;
  } | null>(null);

  useEffect(() => {
    if (!actor || isFetching) return;
    let cancelled = false;

    async function load() {
      if (!actor) return;
      try {
        const backendContent = await actor.getContent();

        let poems = [...DEFAULT_POEMS];
        if (backendContent.letterText) {
          try {
            const parsed = JSON.parse(backendContent.letterText);
            if (
              parsed.poems &&
              Array.isArray(parsed.poems) &&
              parsed.poems.length === 6
            ) {
              poems = parsed.poems;
            }
          } catch {
            /* ignore */
          }
        }

        const imgs = backendContent.uploadedImages ?? [];

        const boardGameImageUrl = imgs[0] ? imgs[0].getDirectURL() : "";
        const benchImageUrl = imgs[1] ? imgs[1].getDirectURL() : "";

        // polaroids: slots 3..22
        const polaroids: PolaroidItem[] = Array.from(
          { length: TOTAL_POLAROIDS },
          (_, i) => ({
            src: imgs[3 + i] ? imgs[3 + i].getDirectURL() : "",
            caption: "",
            rotation: DEFAULT_ROTATIONS[i],
          }),
        );

        if (backendContent.galleryPhotos?.length) {
          backendContent.galleryPhotos
            .slice(0, TOTAL_POLAROIDS)
            .forEach((gp, i) => {
              polaroids[i].caption = gp.caption || "";
              polaroids[i].rotation =
                Number(gp.rotation) || DEFAULT_ROTATIONS[i];
            });
        }

        let audioDataUrl = "";
        const audioFileName = backendContent.audioFileName || "";
        if (backendContent.uploadedAudio?.length) {
          audioDataUrl = backendContent.uploadedAudio[0].getDirectURL();
        }

        // bouquet: slot 23, treasures: slot 24
        const bouquetImageUrl = imgs[23] ? imgs[23].getDirectURL() : "";
        const treasuresImageUrl = imgs[24] ? imgs[24].getDirectURL() : "";

        if (!cancelled) {
          setContent({
            poems,
            boardGameImageUrl,
            polaroids,
            audioDataUrl,
            audioFileName,
            benchImageUrl,
            bouquetImageUrl,
            treasuresImageUrl,
          });
        }
      } catch {
        /* keep defaults */
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);

  function setPoems(poems: string[]) {
    setContent((prev) => ({ ...prev, poems }));
  }

  function setPoemAt(index: number, value: string) {
    setContent((prev) => {
      const updated = [...prev.poems];
      updated[index] = value;
      return { ...prev, poems: updated };
    });
  }

  function uploadBoardGame(
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) {
    pendingBoardGameRef.current = { bytes, fileName };
    setContent((prev) => ({ ...prev, boardGameImageUrl: previewUrl }));
  }

  function uploadBenchImage(
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) {
    pendingBenchImageRef.current = { bytes, fileName };
    setContent((prev) => ({ ...prev, benchImageUrl: previewUrl }));
  }

  function uploadPolaroid(
    index: number,
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) {
    pendingPolaroidsRef.current.set(index, { bytes, fileName });
    setContent((prev) => {
      const updated = [...prev.polaroids];
      updated[index] = { ...updated[index], src: previewUrl };
      return { ...prev, polaroids: updated };
    });
  }

  function updatePolaroidCaption(index: number, caption: string) {
    setContent((prev) => {
      const updated = [...prev.polaroids];
      updated[index] = { ...updated[index], caption };
      return { ...prev, polaroids: updated };
    });
  }

  function uploadBouquet(
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) {
    pendingBouquetRef.current = { bytes, fileName };
    setContent((prev) => ({ ...prev, bouquetImageUrl: previewUrl }));
  }

  function uploadTreasures(
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) {
    pendingTreasuresRef.current = { bytes, fileName };
    setContent((prev) => ({ ...prev, treasuresImageUrl: previewUrl }));
  }

  function setAudio(
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) {
    pendingAudioRef.current = { bytes, fileName };
    setContent((prev) => ({
      ...prev,
      audioDataUrl: previewUrl,
      audioFileName: fileName,
    }));
  }

  function clearAudio() {
    pendingAudioRef.current = null;
    setContent((prev) => ({ ...prev, audioDataUrl: "", audioFileName: "" }));
  }

  async function saveToBackend(): Promise<void> {
    if (!actor) throw new Error("Actor not ready");

    // Audio
    let uploadedAudio: ExternalBlob[] = [];
    if (pendingAudioRef.current) {
      const blob = ExternalBlob.fromBytes(pendingAudioRef.current.bytes);
      const existingAudio = await actor.listAudio();
      if (existingAudio.length > 0) {
        await actor.replaceAudio(0n, blob);
      } else {
        await actor.addAudio(blob);
      }
      uploadedAudio = await actor.listAudio();
      if (uploadedAudio.length > 0) {
        setContent((prev) => ({
          ...prev,
          audioDataUrl: uploadedAudio[0].getDirectURL(),
        }));
      }
      pendingAudioRef.current = null;
    } else {
      uploadedAudio = await actor.listAudio();
    }

    let uploadedImages = await actor.listImages();

    async function ensureSlotAndUpload(
      slotIndex: number,
      bytes: Uint8Array<ArrayBuffer>,
    ) {
      const blob = ExternalBlob.fromBytes(bytes);
      if (slotIndex < uploadedImages.length) {
        await actor!.replaceImage(BigInt(slotIndex), blob);
      } else {
        while (uploadedImages.length < slotIndex) {
          await actor!.addImage(ExternalBlob.fromBytes(new Uint8Array(0)));
          uploadedImages = await actor!.listImages();
        }
        await actor!.addImage(blob);
      }
      uploadedImages = await actor!.listImages();
    }

    // Slot 0: board game
    if (pendingBoardGameRef.current) {
      await ensureSlotAndUpload(0, pendingBoardGameRef.current.bytes);
      if (uploadedImages[0])
        setContent((prev) => ({
          ...prev,
          boardGameImageUrl: uploadedImages[0].getDirectURL(),
        }));
      pendingBoardGameRef.current = null;
    }

    // Slot 1: bench image
    if (pendingBenchImageRef.current) {
      await ensureSlotAndUpload(1, pendingBenchImageRef.current.bytes);
      if (uploadedImages[1])
        setContent((prev) => ({
          ...prev,
          benchImageUrl: uploadedImages[1].getDirectURL(),
        }));
      pendingBenchImageRef.current = null;
    }

    // Slots 3-22: polaroids 0-19
    if (pendingPolaroidsRef.current.size > 0) {
      for (const [index, { bytes }] of pendingPolaroidsRef.current) {
        const slotIndex = index + 3;
        await ensureSlotAndUpload(slotIndex, bytes);
        if (uploadedImages[slotIndex]) {
          setContent((prev) => {
            const updated = [...prev.polaroids];
            updated[index] = {
              ...updated[index],
              src: uploadedImages[slotIndex].getDirectURL(),
            };
            return { ...prev, polaroids: updated };
          });
        }
      }
      pendingPolaroidsRef.current = new Map();
    }

    // Slot 23: bouquet
    if (pendingBouquetRef.current) {
      await ensureSlotAndUpload(23, pendingBouquetRef.current.bytes);
      if (uploadedImages[23])
        setContent((prev) => ({
          ...prev,
          bouquetImageUrl: uploadedImages[23].getDirectURL(),
        }));
      pendingBouquetRef.current = null;
    }

    // Slot 24: little treasures
    if (pendingTreasuresRef.current) {
      await ensureSlotAndUpload(24, pendingTreasuresRef.current.bytes);
      if (uploadedImages[24])
        setContent((prev) => ({
          ...prev,
          treasuresImageUrl: uploadedImages[24].getDirectURL(),
        }));
      pendingTreasuresRef.current = null;
    }

    const poemsJson = JSON.stringify({ poems: content.poems });

    await actor.saveContent({
      letterText: poemsJson,
      loveCards: [],
      galleryPhotos: content.polaroids.map((p, i) => ({
        src: p.src,
        caption: p.caption,
        rotation: BigInt(Math.round(p.rotation)),
        size: BigInt(130),
        top: BigInt(0),
        left: BigInt(0),
        zIndex: BigInt(i),
      })),
      uploadedImages,
      audioFileName: content.audioFileName,
      uploadedAudio,
    });
  }

  return {
    content,
    isLoading,
    setPoems,
    setPoemAt,
    uploadBoardGame,
    uploadBenchImage,
    uploadPolaroid,
    updatePolaroidCaption,
    uploadBouquet,
    uploadTreasures,
    setAudio,
    clearAudio,
    saveToBackend,
  };
}
