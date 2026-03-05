# Digital Love Card

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- One-page romantic website designed as a digital love card / memory book
- Section 1: "For You" love letter with handwritten font, fade-in animated paragraphs, floating heart background animations
- Section 2: "3 Things I Love About You" — three cards with titles, descriptions, and polaroid-style photo collages (placeholder images), hover lift/glow effects
- Section 3: Polaroid Gallery — scattered overlapping polaroid photos with captions
- Background music with autoplay (linked via URL) and mute/unmute toggle button
- Smooth scrolling, mobile-first responsive layout
- Warm pastel color palette: blush pink, cream, soft beige, muted lavender
- Subtle glow effects, gentle fade-in animations throughout

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Backend: minimal Motoko canister (static data storage for love letter text, card content, gallery captions)
2. Frontend:
   - Set up Google Fonts: "Dancing Script" (handwritten) + "Lora" (body)
   - Global styles: pastel CSS variables, smooth scroll, base layout
   - FloatingHearts component: SVG hearts animating upward with randomized positions/delays
   - Section1 (LoveLetter): full-width gradient bg, "For You 🤍" heading, 5 paragraphs with staggered fade-in
   - Section2 (ThingsILoveAboutYou): 3 cards each with title, description, 2-3 polaroid photo slots, hover animations
   - Section3 (PolaroidGallery): scattered polaroid layout with slight rotations and overlaps
   - MusicPlayer: fixed floating button (bottom-right), autoplay on first interaction, mute toggle
   - Deterministic data-ocid markers on all interactive elements
