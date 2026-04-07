import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto, LoveCard } from "../backend.d";
import { useActor } from "./useActor";

export interface LoveCardData {
  title: string;
  description: string;
  photos: Array<{ src: string; rotation: number }>;
}

export interface GalleryPhotoData {
  src: string;
  caption: string;
  rotation: number;
  size: number;
  top: number;
  left: number;
  zIndex: number;
}

export interface LoveCardContent {
  letterText: string;
  loveCards: LoveCardData[];
  galleryPhotos: GalleryPhotoData[];
  spotifyUrl: string;
  audioDataUrl: string;
  audioFileName: string;
}

const DEFAULT_CONTENT: LoveCardContent = {
  letterText: [
    "From the very first moment I saw you, I knew something in my world had shifted. There was nothing dramatic about it — no thunderclap, no fireworks — just the quiet, unmistakable feeling that I was exactly where I was supposed to be. Like a compass needle finding north after years of drifting. You walked into my life and everything rearranged itself, gently, irreversibly.",
    "You have this incredible way of making ordinary moments feel extraordinary. A Tuesday evening suddenly becomes something I'll remember forever. A walk to nowhere in particular becomes an adventure. Watching you do the simplest things — sipping coffee, laughing at something ridiculous, getting lost in thought — I find myself thinking: this is it. This is what people write songs about.",
    "I love how you laugh at your own jokes even before you finish telling them, how you get completely absorbed in the things you love, how your eyes light up when you're excited about something. I love the way you notice the world — the way you point out things I would have walked right past. You've made me see everything more clearly, more tenderly.",
    "In a world that moves so fast, you are my stillness. You are the place I come back to. When everything feels uncertain and loud, there is something in your presence that settles me — like the first breath after a long run, like sunlight after a grey, grey week. You don't fix things, but somehow, being near you makes everything feel more manageable, more okay.",
    "I want you to know that every single day, I choose you. Not out of habit, not out of convenience — but because loving you is the best and most deliberate thing I have ever done. You are my favourite story, my most treasured chapter. And I hope that in some small way, you feel that every time I look at you.",
  ].join("\n\n"),

  loveCards: [
    {
      title: "The Way You Care",
      description:
        "You notice the smallest things — the way I go quiet when something's wrong, the songs I play when I'm tired, the moments I need someone near. You show up, always, without me having to ask.",
      photos: [
        { src: "/assets/generated/photo2.dim_600x600.jpg", rotation: -3 },
        { src: "/assets/generated/photo5.dim_600x600.jpg", rotation: 4 },
      ],
    },
    {
      title: "Your Smile",
      description:
        "Your smile is the kind that doesn't just reach your eyes — it reaches mine too. It's disarming and warm and feels like sunlight after a long grey week.",
      photos: [
        { src: "/assets/generated/photo4.dim_600x600.jpg", rotation: 3 },
        { src: "/assets/generated/photo1.dim_600x600.jpg", rotation: -4 },
      ],
    },
    {
      title: "How You Hold Me",
      description:
        "There is no safer place in the world than your arms. When you hold me, everything quiets down. The world makes sense again.",
      photos: [
        { src: "/assets/generated/photo8.dim_600x600.jpg", rotation: -2 },
        { src: "/assets/generated/photo3.dim_600x600.jpg", rotation: 3 },
      ],
    },
  ],

  galleryPhotos: [
    {
      src: "/assets/generated/photo1.dim_600x600.jpg",
      caption: "golden hour",
      rotation: -8,
      size: 190,
      top: 28,
      left: 18,
      zIndex: 4,
    },
    {
      src: "/assets/generated/photo2.dim_600x600.jpg",
      caption: "hand in hand",
      rotation: 5,
      size: 172,
      top: 14,
      left: 155,
      zIndex: 6,
    },
    {
      src: "/assets/generated/photo3.dim_600x600.jpg",
      caption: "autumn walks",
      rotation: -4,
      size: 200,
      top: 8,
      left: 310,
      zIndex: 2,
    },
    {
      src: "/assets/generated/photo4.dim_600x600.jpg",
      caption: "that smile",
      rotation: 9,
      size: 165,
      top: 22,
      left: 510,
      zIndex: 5,
    },
    {
      src: "/assets/generated/photo5.dim_600x600.jpg",
      caption: "morning coffee",
      rotation: -6,
      size: 178,
      top: 18,
      left: 680,
      zIndex: 3,
    },
    {
      src: "/assets/generated/photo6.dim_600x600.jpg",
      caption: "counting stars",
      rotation: 4,
      size: 185,
      top: 270,
      left: 50,
      zIndex: 5,
    },
    {
      src: "/assets/generated/photo7.dim_600x600.jpg",
      caption: "dinner for two",
      rotation: -10,
      size: 170,
      top: 255,
      left: 215,
      zIndex: 3,
    },
    {
      src: "/assets/generated/photo8.dim_600x600.jpg",
      caption: "wildflower field",
      rotation: 7,
      size: 193,
      top: 265,
      left: 420,
      zIndex: 6,
    },
    {
      src: "/assets/generated/photo9.dim_600x600.jpg",
      caption: "quiet afternoons",
      rotation: -3,
      size: 182,
      top: 460,
      left: 310,
      zIndex: 4,
    },
  ],

  spotifyUrl: "",
  audioDataUrl: "",
  audioFileName: "",
};

/** Convert raw Uint8Array bytes from backend to a browser object URL. */
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

// Convert backend CardContent → frontend LoveCardContent
function fromBackend(
  backend: {
    letterText: string;
    loveCards: Array<LoveCard>;
    galleryPhotos: Array<GalleryPhoto>;
    audioFileName: string;
    uploadedImages: Array<Uint8Array>;
    uploadedAudio: Array<Uint8Array>;
  },
  resolvedAudioUrl: string,
): LoveCardContent {
  return {
    letterText: backend.letterText || DEFAULT_CONTENT.letterText,
    loveCards:
      backend.loveCards.length > 0
        ? backend.loveCards.map((card: LoveCard) => ({
            title: card.title,
            description: card.description,
            photos: card.photos.map((p) => ({
              src: p.src,
              rotation: Number(p.rotation),
            })),
          }))
        : DEFAULT_CONTENT.loveCards,
    galleryPhotos:
      backend.galleryPhotos.length > 0
        ? backend.galleryPhotos.map((p: GalleryPhoto) => ({
            src: p.src,
            caption: p.caption,
            rotation: Number(p.rotation),
            size: Number(p.size),
            top: Number(p.top),
            left: Number(p.left),
            zIndex: Number(p.zIndex),
          }))
        : DEFAULT_CONTENT.galleryPhotos,
    spotifyUrl: "",
    audioDataUrl: resolvedAudioUrl,
    audioFileName: backend.audioFileName || "",
  };
}

export function useEditableContent() {
  const { actor, isFetching } = useActor();
  const [content, setContent] = useState<LoveCardContent>(DEFAULT_CONTENT);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  const pendingAudioBytesRef = useRef<Uint8Array | null>(null);
  const hasAudioUploadedRef = useRef(false);

  const pendingCardImagesRef = useRef<
    Map<string, { bytes: Uint8Array; fileName: string }>
  >(new Map());

  useEffect(() => {
    if (!actor || isFetching) return;

    let cancelled = false;
    setIsLoadingContent(true);

    async function load() {
      if (!actor) return;
      try {
        const [backendContent, audioList] = await Promise.all([
          actor.getContent(),
          actor.listAudio(),
        ]);

        // Resolve audio URL from blob storage (slot 0)
        const resolvedAudioUrl = bytesToObjectUrl(audioList[0], "audio/*");

        if (!cancelled) {
          setContent(fromBackend(backendContent, resolvedAudioUrl));
        }
      } catch {
        // Backend unavailable — keep defaults
      } finally {
        if (!cancelled) setIsLoadingContent(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);

  const setLetterText = (text: string) =>
    setContent((prev) => ({ ...prev, letterText: text }));

  const setLoveCards = (cards: LoveCardData[]) =>
    setContent((prev) => ({ ...prev, loveCards: cards }));

  const setGalleryPhotos = (photos: GalleryPhotoData[]) =>
    setContent((prev) => ({ ...prev, galleryPhotos: photos }));

  const setSpotifyUrl = (url: string) =>
    setContent((prev) => ({ ...prev, spotifyUrl: url }));

  const setAudio = (
    bytes: Uint8Array,
    fileName: string,
    previewUrl: string,
  ) => {
    pendingAudioBytesRef.current = bytes;
    hasAudioUploadedRef.current = true;
    setContent((prev) => ({
      ...prev,
      audioDataUrl: previewUrl,
      audioFileName: fileName,
    }));
  };

  const clearAudio = () => {
    pendingAudioBytesRef.current = null;
    hasAudioUploadedRef.current = false;
    setContent((prev) => ({ ...prev, audioDataUrl: "", audioFileName: "" }));
  };

  const setCardPhoto = (
    cardIndex: number,
    photoIndex: number,
    bytes: Uint8Array,
    fileName: string,
    previewUrl: string,
  ) => {
    const key = `${cardIndex}-${photoIndex}`;
    pendingCardImagesRef.current.set(key, { bytes, fileName });
    setContent((prev) => {
      const updatedCards = prev.loveCards.map((card, ci) => {
        if (ci !== cardIndex) return card;
        const updatedPhotos = card.photos.map((p, pi) =>
          pi === photoIndex ? { ...p, src: previewUrl } : p,
        );
        return { ...card, photos: updatedPhotos };
      });
      return { ...prev, loveCards: updatedCards };
    });
  };

  async function saveToBackend(): Promise<void> {
    if (!actor)
      throw new Error("Actor not ready — please try again in a moment");
    setSaveError(null);

    try {
      // Handle audio upload/replace
      let audioList = await actor.listAudio();

      if (hasAudioUploadedRef.current && pendingAudioBytesRef.current) {
        const bytes = pendingAudioBytesRef.current;
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
        pendingAudioBytesRef.current = null;
        hasAudioUploadedRef.current = false;
      }

      // Handle card photo uploads
      let imgList = await actor.listImages();
      const pendingCardImages = pendingCardImagesRef.current;
      // patchMap is hoisted so latestLoveCards can use it after the upload block
      const patchMap = new Map<string, string>();

      if (pendingCardImages.size > 0) {
        // Upload serially to avoid concurrent list-length races
        for (const [key, { bytes }] of pendingCardImages.entries()) {
          const keyParts = key.split("-");
          const cardIndex = Number(keyParts[0]);
          const photoIndex = Number(keyParts[1]);
          const slotIndex = cardIndex * 2 + photoIndex;

          if (slotIndex < imgList.length) {
            await actor.replaceImage(BigInt(slotIndex), bytes);
          } else {
            // Fill gaps with empty placeholders
            while (imgList.length < slotIndex) {
              await actor.addImage(new Uint8Array(0));
              imgList = await actor.listImages();
            }
            await actor.addImage(bytes);
          }

          imgList = await actor.listImages();
          const actualSlot = Math.min(slotIndex, imgList.length - 1);
          if (imgList[actualSlot]) {
            patchMap.set(key, bytesToObjectUrl(imgList[actualSlot], "image/*"));
          }
        }

        if (patchMap.size > 0) {
          setContent((prev) => {
            const updatedCards = prev.loveCards.map((card, ci) => {
              const updatedPhotos = card.photos.map((p, pi) => {
                const realUrl = patchMap.get(`${ci}-${pi}`);
                return realUrl ? { ...p, src: realUrl } : p;
              });
              return { ...card, photos: updatedPhotos };
            });
            return { ...prev, loveCards: updatedCards };
          });
        }

        pendingCardImagesRef.current = new Map();
      }

      // Build latest love cards — use patchMap URLs for any photos uploaded this save
      const latestLoveCards = content.loveCards.map((card, ci) => ({
        ...card,
        photos: card.photos.map((p, pi) => {
          const realUrl = patchMap.get(`${ci}-${pi}`);
          return realUrl ? { ...p, src: realUrl } : p;
        }),
      }));

      // IMPORTANT: uploadedImages and uploadedAudio are intentionally empty here.
      // All binary files are already persisted via the individual
      // addImage/replaceImage/addAudio/replaceAudio calls above.
      // Including blobs here would push the message over the IC's ~2MB limit.
      await actor.saveContent({
        letterText: content.letterText,
        loveCards: latestLoveCards.map((card) => ({
          title: card.title,
          description: card.description,
          photos: card.photos.map((p) => ({
            src: p.src,
            rotation: BigInt(Math.round(p.rotation)),
          })),
        })),
        galleryPhotos: content.galleryPhotos.map((p) => ({
          src: p.src,
          caption: p.caption,
          rotation: BigInt(Math.round(p.rotation)),
          size: BigInt(Math.round(p.size)),
          top: BigInt(Math.round(p.top)),
          left: BigInt(Math.round(p.left)),
          zIndex: BigInt(Math.round(p.zIndex)),
        })),
        uploadedImages: [],
        audioFileName: content.audioFileName,
        uploadedAudio: [],
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
    isLoadingContent,
    saveError,
    setLetterText,
    setLoveCards,
    setGalleryPhotos,
    setSpotifyUrl,
    setAudio,
    clearAudio,
    setCardPhoto,
    saveToBackend,
  };
}
