# Athulya & Akshay — Wedding Invitation

A single-page wedding invitation for **Sunday, 15 November 2026** at **Sree Bhadra Auditorium, Arayankavu**, Kerala. Muhurtham 10:00–10:30 AM, followed by lunch.

The page is built from the printed invitation in [`PDF.pdf`](PDF.pdf): the blush watercolour wash, lotus border, Ganapathi motif, and sage-and-taupe palette are taken directly from the card. No frameworks or build step are required.

## What is included

- Responsive cover and invitation card
- Desktop and mobile layouts, down to 320 px wide
- Live countdown to the muhurtham
- Google Maps directions and a scannable venue QR code
- Calendar download (`ceremony.ics`) with a one-day reminder
- WhatsApp RSVP, phone links, and a share button with native-share and clipboard fallbacks
- Background music with a visible pause control
- Custom favicon, Apple touch icon, PWA manifest, and 1200 × 630 social preview
- Accessible markup, keyboard focus states, reduced-motion support, and a print stylesheet
- Self-hosted fonts and images; no third-party scripts or CDNs

## Preview locally

From the repository root:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000/>.

A local server is recommended so the web fonts, manifest, calendar file, and sharing links behave as they do in production.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Page content and metadata |
| `styles.css` | All layout, typography, motion, and print styles |
| `script.js` | Countdown, music, scroll reveals, and sharing |
| `assets/` | Watercolour, lotus, and Ganapathi artwork extracted from the PDF |
| `fonts/` | Self-hosted Allura, Montserrat, and Cormorant Garamond files |
| `ceremony.ics` | Calendar event (10:00–10:30 AM IST) |
| `manifest.webmanifest` | Installable web-app metadata |
| `og-image.jpg` | Social sharing card (1200 × 630) |
| `PDF.pdf` | Original printed invitation used as the design reference |

## Deployment

The site is designed for GitHub Pages from the root of the `main` branch:

1. Commit the changes and push to `main`.
2. In the repository settings, keep **Pages → Build and deployment → Source** set to **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The page is published at <https://akshayathulya.github.io/>.

No build command, workflow, or package installation is needed.

## Notes

- The countdown target is `2026-11-15T10:00:00+05:30`.
- The calendar file encodes the same moment in UTC (`04:30–05:00Z`).
- Music starts automatically where the browser allows it; if autoplay is blocked, it starts on the first tap, click, or key press. The floating control pauses it.
- `prefers-reduced-motion` disables the falling petals and reveal transitions.
- The print stylesheet produces a clean one-page invitation.

## Credits

Typefaces: [Allura](https://fonts.google.com/specimen/Allura), [Montserrat](https://fonts.google.com/specimen/Montserrat), and [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond), all under the SIL Open Font License. Artwork is derived from the family’s printed invitation.
