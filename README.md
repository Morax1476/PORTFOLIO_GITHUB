# Fernandez Portfolio

A clean, editable static portfolio built with **plain HTML, CSS and JavaScript**. Everything needed to publish is in this **one project folder**, with images, font, and music organized into a single `assets/` subfolder. No React, Vite, dependencies, installation, build tools, or terminal.

## Open the website

Double-click **`index.html`**. It opens directly in a modern browser. The design, icon graphics, banners, project dialogs and theme switch work offline.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Readable portfolio content and accessible markup |
| `styles.css` | Responsive styling, layouts, colors and themes |
| `app.js` | Carousel, theme switch, navigation, project popups, quiz and player |
| `assets/header-meadow.webp`, `assets/header-toothless.webp` | Alternating header images |
| `assets/fernandez-portrait.webp` | Profile photograph |
| `assets/geist.woff2` | Offline font |
| `assets/sparkle-your-name-amv.mp3` | Sparkle / Your Name AMV background music |
| `THIRD_PARTY_NOTICES.md` | Required notices for bundled open-source fonts/icons |
| `.nojekyll`, `.gitignore` | GitHub Pages / housekeeping |

Keep `index.html` in the repository root and the five media/font files in `assets/`. When publishing, upload the `assets` folder **with its contents**, not just the HTML files.

## Publish on GitHub Pages

1. Create a GitHub repository, for example `FernandezPortfolio`.
2. Upload or push these files to the `main` branch, with `index.html` at the top level.
3. Open **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch**, select `main` and `/(root)`, then Save.
5. GitHub Pages will display the live URL when deployment completes.

No build action is necessary.

## How to edit

- Edit text, job experience, links, skills and static content in `index.html`.
- Adjust visuals, responsive styles and theme colors in `styles.css`.
- Customize filters, carousel timing, interactive dialogs and audio in `app.js`.
- Replace images or sound files inside `assets/`, keeping their filenames and references up to date.

The ReadyPH phone mockup and Mobile Portfolio Website code-editor mockup are
restored as colorful CSS/HTML illustrations. Both are embedded directly in
`index.html`; no extra screenshots or image folders are required.

The music player automatically matches light/dark theme. Select the small
**X** on the player to hide it. Use the small **Music** button to reopen it.
Hiding the player does not pause playback, and your choice is remembered.
The old Kiroro MP3 was removed; only the renamed Sparkle track remains.

## What was the license text?

The previous site embedded a compressed React and Lucide JavaScript bundle. Its `@license` comments were legal attribution notices for open-source code, not a license on your personal portfolio. That bundle has been removed. The remaining Geist font, Devicon graphics and some Lucide SVG symbols have open-source license and attribution requirements, collected in `THIRD_PARTY_NOTICES.md`.

The Toothless artwork and Sparkle / Your Name AMV soundtrack are separate
creative works with their own copyright considerations. **Ensure you have
permission to publish them publicly.**

## Music autoplay

The player attempts to play automatically, but browsers generally restrict unmuted autoplay. Visitors may need to press Play or interact with the page before the music can start. Loop, seek, mute and volume are supported.

A previous editable-source archive is retained outside the publishing directory at `C:\Users\Yue\Desktop\Fernandez\FernandezPortfolio-editable-source-backup.zip`.
