# Anniversary Love Page

## Current State
The anniversary website has these sections in order:
- Header (date)
- LiveTimer
- BouquetSection
- FenceDivider
- GameSection (dice + board game)
- BenchScene
- MemoryBed (Little Treasures)
- OrnamDivider
- PolaroidGallery2
- AnniversaryFinal (finale / HAPPY ONE YEAR ANNIVERSARY)

Edit panel has 6 tabs: Poems, Bouquet, Treasures, Bench, Photos, Music.

Content stored via `useAnnivContent` hook. Images stored in image slots:
- Slot 0: board game
- Slot 1: bench image
- Slot 2: unused
- Slots 3-22: polaroids 0-19
- Slot 23: bouquet
- Slot 24: little treasures

Text content saved as JSON in `letterText` field.

## Requested Changes (Diff)

### Add
- **VinylPlayer section** — new section placed between PolaroidGallery2 and AnniversaryFinal
  - Title: "Our Songs"
  - 6 vinyl players in a 3-column × 2-row grid
  - Each vinyl: spinning disc animation (CSS keyframe), black outer grooves ring, center circle replaced with the song cover image (if uploaded)
  - Click a vinyl to toggle play/pause; audio plays inline via HTML5 `<audio>` tag
  - Only one vinyl plays at a time (clicking another pauses the current one)
  - Vinyl spins while audio is playing, pauses spin when paused
  - Default center circle: dark gradient pattern (no cover)
- **Songs tab** in edit panel (7th tab — add to the existing 6-tab grid, making it a 3+4 or scroll, or expand to 7 total)
  - 6 song slots, each slot has:
    - Audio upload (file) — supports mp3, mp4, m4a, ogg
    - Cover image upload (file)
    - Song title (text input, shown below vinyl)
  - Song data stored per-slot

### Modify
- `useAnnivContent` hook:
  - Add `songs: SongItem[]` to `AnnivContent` (6 items)
  - `SongItem`: `{ audioUrl: string; coverUrl: string; title: string }`
  - Add image slots 25-30 for song cover images (6 songs)
  - Add audio slots: use a separate list (re-use listAudio with index offset, or store audio URLs in `letterText` JSON)
  - Expose `uploadSongAudio`, `uploadSongCover`, `setSongTitle` functions
  - Persist songs in `letterText` JSON (titles + audio data URLs) and image slots 25-30 (covers)
- `AnnivEditPanel`:
  - Add `songs` tab to TAB_LABELS (7 tabs total — make tab grid `repeat(4, 1fr)` for row 1 and `repeat(3, 1fr)` for row 2, or simpler: use `repeat(4, 1fr)` grid with wrap)
  - Add Songs tab content: 6 song slots with audio upload, cover upload, and title input
- `App.tsx`:
  - Import and render `VinylSection` between `PolaroidGallery2` and `AnniversaryFinal`
  - Pass songs content and edit props

### Remove
- Nothing removed

## Implementation Plan
1. Create `VinylSection.tsx` component:
   - CSS spinning animation via inline `<style>` or CSS vars
   - Each vinyl rendered as SVG-inspired CSS circles: outer ring (black/dark grooves), center circle with cover image or gradient
   - Click handler toggles play/pause per vinyl
   - Uses a single `currentlyPlaying` state index (null = none playing)
   - `<audio>` elements for each song (ref array)
   - Song title below each vinyl
2. Update `useAnnivContent`:
   - Add `SongItem` interface
   - Add `songs` array to `AnnivContent` (6 default empty slots)
   - Store song covers in image slots 25-30
   - Store song audio URLs and titles in `letterText` JSON
   - Store song audio as uploaded audio blobs (use multiple audio slots or encode as base64 in letterText for small files — use blob storage for audio, separate audio slot per song)
   - Expose upload and setter functions
3. Update `AnnivEditPanel`:
   - Add `songs` tab (7th tab, adjust grid)
   - Add song editing UI in Songs tab content area
4. Update `App.tsx`:
   - Import VinylSection
   - Pass songs data and handlers
   - Pass songs props to AnnivEditPanel
