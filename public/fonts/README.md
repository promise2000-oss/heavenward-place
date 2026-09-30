# Brand fonts

Heavenward Place uses two licensed brand typefaces. Both are loaded through
`next/font/local` from this directory and are **optional** — the site is fully
functional without them.

| Font | Role | Expected file name |
|---|---|---|
| **Pricedown BL** | Main brand display face — hero words, section labels, big numerals, page numbers | `Pricedown BL Regular.woff2` |
| **Identification Five** | Secondary label face — wide, spaced caps for "PLACE", eyebrows and tags | `Identification Five.woff2` |

## Adding the licensed files

1. Copy the licensed web files into this directory using the exact names above
   (`.woff`, `.ttf` and `.otf` are also detected).
2. Restart the dev server. `src/lib/fonts.ts` detects the files at module load
   and switches the CSS variable automatically — no other change is needed.

## Fallback behaviour

Until the files are added, the following fallback stacks are used:

- Display / Pricedown BL → `Impact, "Arial Black", "Haettenschweiler", sans-serif`
- Identification Five → `Montserrat, "Helvetica Neue", Arial, sans-serif`
  (uppercase, `letter-spacing: 0.4em`)

`GET /api/admin/system` reports which brand fonts are currently loaded, and the
Heavenward Console shows a reminder in **Settings** while either is missing.

## Licensing note

Pricedown and Identification Five are licensed/personal-use fonts. Distribute
them only in accordance with the licence you hold. They are deliberately **not**
committed to this repository.
