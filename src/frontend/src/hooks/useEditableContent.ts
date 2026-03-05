import { useEffect, useState } from "react";

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
};

const STORAGE_KEY = "love-card-content";

function loadFromStorage(): LoveCardContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONTENT;
    const parsed = JSON.parse(raw) as Partial<LoveCardContent>;
    return {
      letterText: parsed.letterText ?? DEFAULT_CONTENT.letterText,
      loveCards: parsed.loveCards ?? DEFAULT_CONTENT.loveCards,
      galleryPhotos: parsed.galleryPhotos ?? DEFAULT_CONTENT.galleryPhotos,
      spotifyUrl: parsed.spotifyUrl ?? DEFAULT_CONTENT.spotifyUrl,
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function useEditableContent() {
  const [content, setContent] = useState<LoveCardContent>(loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // ignore storage errors
    }
  }, [content]);

  const setLetterText = (text: string) =>
    setContent((prev) => ({ ...prev, letterText: text }));

  const setLoveCards = (cards: LoveCardData[]) =>
    setContent((prev) => ({ ...prev, loveCards: cards }));

  const setGalleryPhotos = (photos: GalleryPhotoData[]) =>
    setContent((prev) => ({ ...prev, galleryPhotos: photos }));

  const setSpotifyUrl = (url: string) =>
    setContent((prev) => ({ ...prev, spotifyUrl: url }));

  return {
    content,
    setLetterText,
    setLoveCards,
    setGalleryPhotos,
    setSpotifyUrl,
  };
}
