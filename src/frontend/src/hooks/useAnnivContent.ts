import { useEffect, useRef, useState } from "react";
import { DEFAULT_POEMS } from "../components/GameSection";
import { useActor } from "./useActor";

export interface PolaroidItem {
  src: string;
  caption: string;
  rotation: number;
}

export interface SongItem {
  audioUrl: string;
  coverUrl: string;
  title: string;
}

export interface SubtextContent {
  bouquetHeading: string;
  bouquetSubtext: string;
  benchCaption: string;
  treasuresHeading: string;
  treasuresSubtext: string;
  gameHeading: string;
  timerSubtext: string;
}

export const DEFAULT_SUBTEXTS: SubtextContent = {
  bouquetHeading: "a bouquet, just for you",
  bouquetSubtext: "tap to discover what each flower means",
  benchCaption: "us, always",
  treasuresHeading: "little treasures",
  treasuresSubtext: "every small thing I keep because of you 🧶",
  gameHeading: "roll the dice of love",
  timerSubtext: "we've been us for...",
};

export interface AnnivContent {
  poems: string[];
  boardGameImageUrl: string;
  polaroids: PolaroidItem[];
  audioDataUrl: string;
  audioFileName: string;
  benchImageUrl: string;
  bouquetImageUrl: string;
  treasuresImageUrl: string;
  subtexts: SubtextContent;
  songs: SongItem[];
  puzzleImageUrl: string;
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
  subtexts: { ...DEFAULT_SUBTEXTS },
  songs: Array.from({ length: 6 }, () => ({
    audioUrl: "",
    coverUrl: "",
    title: "",
  })),
  puzzleImageUrl: "",
};

/**
 * Convert a Uint8Array blob to a browser object URL.
 * Returns empty string if bytes are empty/null.
 */
function bytesToObjectUrl(
  bytes: Uint8Array | null | undefined,
  mimeType = "application/octet-stream",
): string {
  if (!bytes || bytes.length === 0) return "";
  // new Uint8Array(bytes) normalises ArrayBufferLike to ArrayBuffer for Blob
  return URL.createObjectURL(
    new Blob([new Uint8Array(bytes)], { type: mimeType }),
  );
}

/**
 * Image slot mapping:
 * uploadedImages[0]       = board game image
 * uploadedImages[1]       = bench image (single photo of both characters)
 * uploadedImages[2]       = (unused — kept for slot alignment)
 * uploadedImages[3..22]   = polaroids 0-19
 * uploadedImages[23]      = bouquet image
 * uploadedImages[24]      = little treasures image
 * uploadedImages[25..30]  = song cover images 0-5
 * uploadedImages[31]      = puzzle image
 *
 * Audio slot mapping:
 * uploadedAudio[0]        = background music
 * uploadedAudio[1..6]     = song audio files 0-5
 */
export function useAnnivContent() {
  const { actor, isFetching } = useActor();
  const [content, setContent] = useState<AnnivContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  const pendingAudioRef = useRef<{
    bytes: Uint8Array;
    fileName: string;
  } | null>(null);
  const pendingBoardGameRef = useRef<{
    bytes: Uint8Array;
    fileName: string;
  } | null>(null);
  const pendingBenchImageRef = useRef<{
    bytes: Uint8Array;
    fileName: string;
  } | null>(null);
  const pendingPolaroidsRef = useRef<
    Map<number, { bytes: Uint8Array; fileName: string }>
  >(new Map());
  const pendingBouquetRef = useRef<{
    bytes: Uint8Array;
    fileName: string;
  } | null>(null);
  const pendingTreasuresRef = useRef<{
    bytes: Uint8Array;
    fileName: string;
  } | null>(null);
  const pendingSongCoverRef = useRef<
    Map<number, { bytes: Uint8Array; fileName: string }>
  >(new Map());
  const pendingSongAudioRef = useRef<
    Map<number, { bytes: Uint8Array; fileName: string }>
  >(new Map());
  const pendingPuzzleImageRef = useRef<{
    bytes: Uint8Array;
    fileName: string;
  } | null>(null);

  useEffect(() => {
    if (!actor || isFetching) return;
    let cancelled = false;

    async function load() {
      if (!actor) return;
      try {
        const [backendContent, imgs, audioSlots] = await Promise.all([
          actor.getContent(),
          actor.listImages(),
          actor.listAudio(),
        ]);

        let poems = [...DEFAULT_POEMS];
        let subtexts = { ...DEFAULT_SUBTEXTS };
        let songs: SongItem[] = Array.from({ length: 6 }, () => ({
          audioUrl: "",
          coverUrl: "",
          title: "",
        }));

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
            if (parsed.subtexts) {
              subtexts = { ...DEFAULT_SUBTEXTS, ...parsed.subtexts };
            }
            if (parsed.songs && Array.isArray(parsed.songs)) {
              parsed.songs.forEach((s: Partial<SongItem>, i: number) => {
                if (i < 6) songs[i].title = s.title || "";
              });
            }
          } catch {
            /* ignore malformed JSON */
          }
        }

        const boardGameImageUrl = bytesToObjectUrl(imgs[0], "image/*");
        const benchImageUrl = bytesToObjectUrl(imgs[1], "image/*");

        // polaroids: slots 3..22
        const polaroids: PolaroidItem[] = Array.from(
          { length: TOTAL_POLAROIDS },
          (_, i) => ({
            src: bytesToObjectUrl(imgs[3 + i], "image/*"),
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

        // Background audio slot 0
        const audioDataUrl = bytesToObjectUrl(audioSlots[0], "audio/*");
        const audioFileName = backendContent.audioFileName || "";

        // bouquet: slot 23, treasures: slot 24
        const bouquetImageUrl = bytesToObjectUrl(imgs[23], "image/*");
        const treasuresImageUrl = bytesToObjectUrl(imgs[24], "image/*");

        // song cover images: slots 25-30
        for (let i = 0; i < 6; i++) {
          songs[i].coverUrl = bytesToObjectUrl(imgs[25 + i], "image/*");
        }

        // song audio: audio slots 1-6
        for (let i = 0; i < 6; i++) {
          songs[i].audioUrl = bytesToObjectUrl(audioSlots[1 + i], "audio/*");
        }

        // puzzle image: slot 31
        const puzzleImageUrl = bytesToObjectUrl(imgs[31], "image/*");

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
            subtexts,
            songs,
            puzzleImageUrl,
          });
        }
      } catch {
        /* keep defaults on error */
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

  function setSubtext(key: keyof SubtextContent, value: string) {
    setContent((prev) => ({
      ...prev,
      subtexts: { ...prev.subtexts, [key]: value },
    }));
  }

  function uploadBoardGame(
    bytes: Uint8Array,
    _fileName: string,
    previewUrl: string,
  ) {
    pendingBoardGameRef.current = { bytes, fileName: _fileName };
    setContent((prev) => ({ ...prev, boardGameImageUrl: previewUrl }));
  }

  function uploadBenchImage(
    bytes: Uint8Array,
    _fileName: string,
    previewUrl: string,
  ) {
    pendingBenchImageRef.current = { bytes, fileName: _fileName };
    setContent((prev) => ({ ...prev, benchImageUrl: previewUrl }));
  }

  function uploadPolaroid(
    index: number,
    bytes: Uint8Array,
    _fileName: string,
    previewUrl: string,
  ) {
    pendingPolaroidsRef.current.set(index, { bytes, fileName: _fileName });
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
    bytes: Uint8Array,
    _fileName: string,
    previewUrl: string,
  ) {
    pendingBouquetRef.current = { bytes, fileName: _fileName };
    setContent((prev) => ({ ...prev, bouquetImageUrl: previewUrl }));
  }

  function uploadTreasures(
    bytes: Uint8Array,
    _fileName: string,
    previewUrl: string,
  ) {
    pendingTreasuresRef.current = { bytes, fileName: _fileName };
    setContent((prev) => ({ ...prev, treasuresImageUrl: previewUrl }));
  }

  function setAudio(bytes: Uint8Array, _fileName: string, previewUrl: string) {
    pendingAudioRef.current = { bytes, fileName: _fileName };
    setContent((prev) => ({
      ...prev,
      audioDataUrl: previewUrl,
      audioFileName: _fileName,
    }));
  }

  function clearAudio() {
    pendingAudioRef.current = null;
    setContent((prev) => ({ ...prev, audioDataUrl: "", audioFileName: "" }));
  }

  function uploadSongCover(
    index: number,
    bytes: Uint8Array,
    _fileName: string,
    previewUrl: string,
  ) {
    pendingSongCoverRef.current.set(index, { bytes, fileName: _fileName });
    setContent((prev) => {
      const updated = [...prev.songs];
      updated[index] = { ...updated[index], coverUrl: previewUrl };
      return { ...prev, songs: updated };
    });
  }

  function uploadSongAudio(
    index: number,
    bytes: Uint8Array,
    _fileName: string,
    previewUrl: string,
  ) {
    pendingSongAudioRef.current.set(index, { bytes, fileName: _fileName });
    setContent((prev) => {
      const updated = [...prev.songs];
      updated[index] = { ...updated[index], audioUrl: previewUrl };
      return { ...prev, songs: updated };
    });
  }

  function setSongTitle(index: number, title: string) {
    setContent((prev) => {
      const updated = [...prev.songs];
      updated[index] = { ...updated[index], title };
      return { ...prev, songs: updated };
    });
  }

  function uploadPuzzleImage(
    bytes: Uint8Array,
    _fileName: string,
    previewUrl: string,
  ) {
    pendingPuzzleImageRef.current = { bytes, fileName: _fileName };
    setContent((prev) => ({ ...prev, puzzleImageUrl: previewUrl }));
  }

  async function saveToBackend(): Promise<void> {
    if (!actor)
      throw new Error("Actor not ready — please try again in a moment");
    setSaveError(null);

    try {
      // ---- Background audio (slot 0) ----
      let audioList = await actor.listAudio();
      if (pendingAudioRef.current) {
        const bytes = pendingAudioRef.current.bytes;
        if (audioList.length > 0) {
          await actor.replaceAudio(0n, bytes);
        } else {
          await actor.addAudio(bytes);
        }
        audioList = await actor.listAudio();
        if (audioList[0]) {
          setContent((prev) => ({
            ...prev,
            audioDataUrl: bytesToObjectUrl(audioList[0], "audio/*"),
          }));
        }
        pendingAudioRef.current = null;
      }

      // ---- Song audio files (slots 1-6) ----
      audioList = await actor.listAudio();

      async function ensureAudioSlot(slotIndex: number, bytes: Uint8Array) {
        // Fill any missing slots before slotIndex with empty placeholders
        while (audioList.length <= slotIndex) {
          await actor!.addAudio(new Uint8Array(0));
          audioList = await actor!.listAudio();
        }
        await actor!.replaceAudio(BigInt(slotIndex), bytes);
        audioList = await actor!.listAudio();
      }

      if (pendingSongAudioRef.current.size > 0) {
        for (const [index, { bytes }] of pendingSongAudioRef.current) {
          const slotIndex = 1 + index;
          await ensureAudioSlot(slotIndex, bytes);
          if (audioList[slotIndex]) {
            const audioUrl = bytesToObjectUrl(audioList[slotIndex], "audio/*");
            setContent((prev) => {
              const updated = [...prev.songs];
              updated[index] = { ...updated[index], audioUrl };
              return { ...prev, songs: updated };
            });
          }
        }
        pendingSongAudioRef.current = new Map();
      }

      // ---- Images ----
      let imgList = await actor.listImages();

      async function ensureImageSlot(slotIndex: number, bytes: Uint8Array) {
        if (slotIndex < imgList.length) {
          await actor!.replaceImage(BigInt(slotIndex), bytes);
        } else {
          while (imgList.length < slotIndex) {
            await actor!.addImage(new Uint8Array(0));
            imgList = await actor!.listImages();
          }
          await actor!.addImage(bytes);
        }
        imgList = await actor!.listImages();
      }

      // Slot 0: board game
      if (pendingBoardGameRef.current) {
        await ensureImageSlot(0, pendingBoardGameRef.current.bytes);
        if (imgList[0])
          setContent((prev) => ({
            ...prev,
            boardGameImageUrl: bytesToObjectUrl(imgList[0], "image/*"),
          }));
        pendingBoardGameRef.current = null;
      }

      // Slot 1: bench image
      if (pendingBenchImageRef.current) {
        await ensureImageSlot(1, pendingBenchImageRef.current.bytes);
        if (imgList[1])
          setContent((prev) => ({
            ...prev,
            benchImageUrl: bytesToObjectUrl(imgList[1], "image/*"),
          }));
        pendingBenchImageRef.current = null;
      }

      // Slots 3-22: polaroids 0-19
      if (pendingPolaroidsRef.current.size > 0) {
        for (const [index, { bytes }] of pendingPolaroidsRef.current) {
          const slotIndex = index + 3;
          await ensureImageSlot(slotIndex, bytes);
          if (imgList[slotIndex]) {
            const src = bytesToObjectUrl(imgList[slotIndex], "image/*");
            setContent((prev) => {
              const updated = [...prev.polaroids];
              updated[index] = { ...updated[index], src };
              return { ...prev, polaroids: updated };
            });
          }
        }
        pendingPolaroidsRef.current = new Map();
      }

      // Slot 23: bouquet
      if (pendingBouquetRef.current) {
        await ensureImageSlot(23, pendingBouquetRef.current.bytes);
        if (imgList[23])
          setContent((prev) => ({
            ...prev,
            bouquetImageUrl: bytesToObjectUrl(imgList[23], "image/*"),
          }));
        pendingBouquetRef.current = null;
      }

      // Slot 24: little treasures
      if (pendingTreasuresRef.current) {
        await ensureImageSlot(24, pendingTreasuresRef.current.bytes);
        if (imgList[24])
          setContent((prev) => ({
            ...prev,
            treasuresImageUrl: bytesToObjectUrl(imgList[24], "image/*"),
          }));
        pendingTreasuresRef.current = null;
      }

      // Slots 25-30: song cover images
      if (pendingSongCoverRef.current.size > 0) {
        for (const [index, { bytes }] of pendingSongCoverRef.current) {
          const slotIndex = 25 + index;
          await ensureImageSlot(slotIndex, bytes);
          if (imgList[slotIndex]) {
            const coverUrl = bytesToObjectUrl(imgList[slotIndex], "image/*");
            setContent((prev) => {
              const updated = [...prev.songs];
              updated[index] = { ...updated[index], coverUrl };
              return { ...prev, songs: updated };
            });
          }
        }
        pendingSongCoverRef.current = new Map();
      }

      // Slot 31: puzzle image
      if (pendingPuzzleImageRef.current) {
        await ensureImageSlot(31, pendingPuzzleImageRef.current.bytes);
        if (imgList[31])
          setContent((prev) => ({
            ...prev,
            puzzleImageUrl: bytesToObjectUrl(imgList[31], "image/*"),
          }));
        pendingPuzzleImageRef.current = null;
      }

      // Re-fetch final lists for saveContent payload
      const [finalImgs, finalAudio] = await Promise.all([
        actor.listImages(),
        actor.listAudio(),
      ]);

      // Save metadata JSON — only titles, no binary data in JSON
      const poemsJson = JSON.stringify({
        poems: content.poems,
        subtexts: content.subtexts,
        songs: content.songs.map((s) => ({ title: s.title })),
      });

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
        uploadedImages: finalImgs,
        audioFileName: content.audioFileName,
        uploadedAudio: finalAudio,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Save failed. Please try again.";
      setSaveError(message);
      throw err;
    }
  }

  return {
    content,
    isLoading,
    saveError,
    setPoems,
    setPoemAt,
    setSubtext,
    uploadBoardGame,
    uploadBenchImage,
    uploadPolaroid,
    updatePolaroidCaption,
    uploadBouquet,
    uploadTreasures,
    setAudio,
    clearAudio,
    uploadSongAudio,
    uploadSongCover,
    setSongTitle,
    uploadPuzzleImage,
    saveToBackend,
  };
}
