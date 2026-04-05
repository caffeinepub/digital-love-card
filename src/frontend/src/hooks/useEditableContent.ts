import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto, LoveCard } from "../backend.d";
// Use Awaited<ReturnType> pattern to get the CardContent type that matches the runtime actor
type BackendCardContent = Awaited<
  ReturnType<import("../backend.d").backendInterface["getContent"]>
>;
import { ExternalBlob } from "../backend";
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

// Convert backend CardContent → frontend LoveCardContent
function fromBackend(
  backend: BackendCardContent,
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

// Convert frontend LoveCardContent → backend CardContent (compatible with saveContent parameter)
function toBackend(
  content: LoveCardContent,
  uploadedImages: ExternalBlob[],
  uploadedAudio: ExternalBlob[],
) {
  return {
    letterText: content.letterText,
    loveCards: content.loveCards.map((card) => ({
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
    uploadedImages,
    audioFileName: content.audioFileName,
    uploadedAudio,
  };
}

export function useEditableContent() {
  const { actor, isFetching } = useActor();
  const [content, setContent] = useState<LoveCardContent>(DEFAULT_CONTENT);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  // Track raw audio bytes when user uploads a new file (before save)
  const pendingAudioBytesRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const hasAudioUploadedRef = useRef(false);

  // Track raw card image bytes keyed by "cardIndex-photoIndex" before save
  const pendingCardImagesRef = useRef<
    Map<string, { bytes: Uint8Array<ArrayBuffer>; fileName: string }>
  >(new Map());

  // Load from backend once actor is available
  useEffect(() => {
    if (!actor || isFetching) return;

    let cancelled = false;
    setIsLoadingContent(true);

    async function load() {
      if (!actor) return;
      try {
        const backendContent = await actor.getContent();

        // Resolve audio URL if available
        let resolvedAudioUrl = "";
        if (
          backendContent.uploadedAudio &&
          backendContent.uploadedAudio.length > 0
        ) {
          resolvedAudioUrl = backendContent.uploadedAudio[0].getDirectURL();
        }

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

  // Store audio bytes in ref for upload on save; update display immediately
  const setAudio = (
    bytes: Uint8Array<ArrayBuffer>,
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

  // Store card photo bytes in ref; update preview src immediately via blob URL
  const setCardPhoto = (
    cardIndex: number,
    photoIndex: number,
    bytes: Uint8Array<ArrayBuffer>,
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

  // Save everything to the backend canister
  async function saveToBackend(): Promise<void> {
    if (!actor) throw new Error("Actor not ready");

    // Handle audio upload/replace first
    let uploadedAudio: ExternalBlob[] = [];
    if (hasAudioUploadedRef.current && pendingAudioBytesRef.current) {
      const blob = ExternalBlob.fromBytes(pendingAudioBytesRef.current);

      // Check if audio already exists
      const existingAudio = await actor.listAudio();
      if (existingAudio.length > 0) {
        await actor.replaceAudio(0n, blob);
      } else {
        await actor.addAudio(blob);
      }

      // Refresh audio URL
      const freshAudio = await actor.listAudio();
      if (freshAudio.length > 0) {
        const freshUrl = freshAudio[0].getDirectURL();
        setContent((prev) => ({ ...prev, audioDataUrl: freshUrl }));
        uploadedAudio = freshAudio;
      }

      // Clear pending bytes after successful upload
      pendingAudioBytesRef.current = null;
      hasAudioUploadedRef.current = false;
    } else {
      // Preserve existing audio blobs from backend
      uploadedAudio = await actor.listAudio();
    }

    // Handle pending card photo uploads
    let uploadedImages = await actor.listImages();
    const pendingCardImages = pendingCardImagesRef.current;

    if (pendingCardImages.size > 0) {
      // Upload each pending card image and collect real URLs to patch into content
      const patchMap = new Map<string, string>();

      // Process all pending uploads in parallel
      await Promise.all(
        Array.from(pendingCardImages.entries()).map(
          async ([key, { bytes }]) => {
            const blob = ExternalBlob.fromBytes(bytes);
            const keyParts = key.split("-");
            const cardIndex = Number(keyParts[0]);
            const photoIndex = Number(keyParts[1]);

            // Determine the slot index in the global image list for this card/photo
            // We use a deterministic slot: card 0 photo 0 = slot 0, card 0 photo 1 = slot 1, etc.
            const slotIndex = cardIndex * 2 + photoIndex;

            if (slotIndex < uploadedImages.length) {
              await actor.replaceImage(BigInt(slotIndex), blob);
            } else {
              await actor.addImage(blob);
            }

            // Re-fetch images to get updated URLs
            const freshImages = await actor.listImages();
            const actualSlot = Math.min(slotIndex, freshImages.length - 1);
            if (freshImages[actualSlot]) {
              patchMap.set(key, freshImages[actualSlot].getDirectURL());
            }
          },
        ),
      );

      // Refresh full image list after uploads
      uploadedImages = await actor.listImages();

      // Patch content src values with real URLs
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

    // Save content to backend (use latest content snapshot after state patches)
    // We read content from closure; patched URLs are in the state update queue.
    // Build backend payload using the latest loveCards (with real URLs where patched).
    const latestLoveCards = content.loveCards.map((card, ci) => {
      return {
        ...card,
        photos: card.photos.map((p, pi) => {
          // If we just patched this slot, grab the real URL from uploadedImages
          const slotIndex = ci * 2 + pi;
          if (
            pendingCardImages.has(`${ci}-${pi}`) &&
            uploadedImages[slotIndex]
          ) {
            return { ...p, src: uploadedImages[slotIndex].getDirectURL() };
          }
          return p;
        }),
      };
    });

    const contentForSave = { ...content, loveCards: latestLoveCards };
    const backendContent = toBackend(
      contentForSave,
      uploadedImages,
      uploadedAudio,
    );
    await actor.saveContent(backendContent);
  }

  return {
    content,
    isLoadingContent,
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
