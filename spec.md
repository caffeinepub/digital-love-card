# Digital Love Card

## Current State
- Single-page love card with three sections: LoveLetterSection, ThingsILoveSection, PolaroidGallery.
- LoveLetterSection: hardcoded letter paragraphs and closing signature in `LETTER_PARAGRAPHS` array.
- ThingsILoveSection: hardcoded card titles, descriptions, and photo sources in `LOVE_CARDS` array.
- MusicPlayer: plays a hardcoded MP3 URL from SoundHelix; no way for the user to change the music.
- PolaroidGallery: 9 polaroids scattered across a fixed 960×940px canvas with wide spacing; photos and captions are hardcoded.
- No in-app editing capability — all content is compile-time constants.

## Requested Changes (Diff)

### Add
- **Edit Mode Panel**: A floating "Edit" button (pencil icon, bottom-left corner) toggles a slide-in settings drawer/panel.
- **Letter editor**: Inside the panel, a textarea for the full love letter message (paragraphs separated by blank lines). Changes reflect live in LoveLetterSection.
- **Love cards editor**: Inside the panel, fields to edit the title, description, and photo URL for each of the 3 love cards in ThingsILoveSection.
- **Spotify embed editor**: Inside the panel, a text input for a Spotify track/playlist link. The app converts a standard Spotify URL (`https://open.spotify.com/track/ID` or `/playlist/ID`) into the Spotify embed iframe URL and renders it in a fixed bottom-right panel (replacing the current audio player button). Still include mute/unmute or show/hide toggle for the embed.
- **Gallery photo editor**: Inside the panel, inputs to edit the photo URL and caption for each of the 9 polaroid gallery photos.
- **Persist edits in localStorage**: All edited content is saved to localStorage so it survives page refresh.

### Modify
- **PolaroidGallery layout**: Reduce spacing between polaroids so they cluster more tightly — decrease `left` offsets so photos overlap more (by ~30–50px more than current), and bring the middle/bottom rows closer to the top row. Target a canvas height of ~700px instead of 900px.
- **MusicPlayer**: Replace the current `<audio>` element approach with a Spotify embed iframe. The iframe renders in a small fixed panel (bottom-right). Include a toggle button to show/hide the Spotify player panel. If no Spotify URL is set, show a placeholder prompt.

### Remove
- Hardcoded `MUSIC_URL` constant and `<audio>` element from MusicPlayer.
- Hardcoded `LETTER_PARAGRAPHS` (move to editable state with localStorage default).
- Hardcoded `LOVE_CARDS` data (move to editable state with localStorage default).
- Hardcoded `GALLERY_PHOTOS` data (move to editable state with localStorage default).

## Implementation Plan
1. Create a `useEditableContent` custom hook that manages all editable state (letter text, love cards, gallery photos, Spotify URL) with localStorage persistence.
2. Create an `EditPanel` component — a slide-in drawer triggered by a floating pencil button (bottom-left). Contains tabbed or scrollable sections for: Letter, Cards, Music, Gallery.
3. Update `LoveLetterSection` to accept letter paragraphs as a prop (array of strings split from the textarea value).
4. Update `ThingsILoveSection` to accept love cards as a prop.
5. Update `PolaroidGallery` to accept gallery photos as a prop. Tighten the `left` pixel offsets so photos are ~40px closer to each other; reduce canvas height to ~700px.
6. Replace `MusicPlayer` with a `SpotifyPlayer` component that renders a Spotify embed iframe in a small fixed panel, with a toggle button. Accepts a Spotify URL prop; converts it to the embed format.
7. Wire everything together in `App.tsx` using the shared `useEditableContent` hook.
