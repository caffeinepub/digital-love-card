# Anniversary Love Page — Slide Puzzle Section

## Current State
- The anniversary website has sections: Header, LiveTimer, BouquetSection, FenceDivider, GameSection, BenchScene, MemoryBed, OrnamDivider, PolaroidGallery2, VinylSection, AnniversaryFinal.
- VinylSection ("Our Songs") appears just before AnniversaryFinal.
- Content is managed via `useAnnivContent` hook with image slots 0-30 used. Next free image slot is 31.
- Edit panel (AnnivEditPanel) has tabs: poems, bouquet, treasures, bench, photos, music, songs — displayed in a 2-row grid.
- All customizations persist to backend via `saveToBackend()`.

## Requested Changes (Diff)

### Add
1. **RibbonDivider component** — A decorative rose-gold ribbon SVG divider to separate the VinylSection from the new PuzzleSection.
2. **SlidePuzzle component** — A 4×4 slide puzzle (15 tiles + 1 empty = 16 tiles) encased in a wooden box frame.
   - Default placeholder shows a romantic/floral image or message when no custom image is set.
   - The puzzle image is fully customizable via the edit panel (Puzzle tab).
   - Puzzle image upload is stored in image slot 31 in the backend.
   - Title: "we'll always fix us piece by piece" displayed above/below the wooden box.
   - Puzzle gameplay: tiles are shuffled on load; clicking a tile adjacent to the empty space slides it into place.
   - Win state: show a gentle celebration animation and message when puzzle is solved.
3. **Puzzle tab in AnnivEditPanel** — New tab "puzzle" with an image upload slot for the puzzle image.
4. **puzzleImageUrl** added to `AnnivContent` interface and `useAnnivContent` hook.
   - Image stored in slot 31.
   - `uploadPuzzleImage` function added to hook.
   - Persisted in `saveToBackend` at slot 31.

### Modify
- `App.tsx`: Add `RibbonDivider` and `SlidePuzzle` between `VinylSection` and `AnniversaryFinal`. Wire up `puzzleImageUrl` and `uploadPuzzleImage`.
- `useAnnivContent.ts`: Add `puzzleImageUrl` to `AnnivContent`, `DEFAULT_CONTENT`, load from slot 31, add `uploadPuzzleImage` function, save to slot 31 in `saveToBackend`.
- `AnnivEditPanel.tsx`: Add "puzzle" tab to `TabId` union and `TAB_LABELS`. Add upload UI in the puzzle tab.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/components/RibbonDivider.tsx` — rose gold ribbon SVG, full-width, centered.
2. Create `src/frontend/src/components/SlidePuzzle.tsx` — 4×4 slide puzzle in a wooden box frame, with title, gameplay, win state, and customizable image.
3. Update `src/frontend/src/hooks/useAnnivContent.ts` — add `puzzleImageUrl`, `uploadPuzzleImage`, slot 31 read/write.
4. Update `src/frontend/src/components/AnnivEditPanel.tsx` — add puzzle tab with image upload.
5. Update `src/frontend/src/App.tsx` — insert RibbonDivider + SlidePuzzle between VinylSection and AnniversaryFinal, wire props.
