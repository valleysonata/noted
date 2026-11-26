# noted

Turn reference-guided handwritten page images into a continuous, ruled vector PDF. The agent instructions cover image generation and math review. The local renderer handles ink tracing, pagination and PDF export. It runs offline with Node.js 20 or newer and uses only built-in modules.

## Install and try it

From the repository root run `npm test` and `npm run demo`. Open `example.pdf` to see the included synthetic equations. Commands below use paths relative to the installed `skills/noted` folder. Choose a fresh output filename for each run.

## Render your own notes

1. Follow [SKILL.md](../SKILL.md) to identify the finished content and generate or obtain the handwritten page images. Use black ink on white or gray-ruled paper with a clear right edge. Keep original and generated inputs in a separate private folder.
2. Convert each image to an uncompressed 24-bit BMP. On Windows use `./scripts/prepare-bmp.ps1 input.png output.bmp`. With ImageMagick on another system use `magick input.png -background white -alpha remove -alpha off -type TrueColor BMP3:output.bmp`. Check that source images have white padding on each side. For PDF inputs, rasterize at about 144 dpi and increase the resolution if fine ink drops out. Reduce the manifest scale proportionally when increasing resolution.
3. Create a manifest near the inputs. The source array is in reading order. Enter one center per actual written row in pixels measured from the top. For a stacked fraction, count its numerator and denominator as one written row. Add a blank writing interval before any zero-based row index listed in `gapBefore`.
4. Run `node scripts/render.cjs private/notes.json private/notes.pdf`. Inspect the result at page scale and high zoom.

```json
{
  "metadata": {"title": "Physics homework", "author": "Your name"},
  "profile": {"penWidth": 0.13},
  "sources": [
    {"file": "page-1.bmp", "centers": [30, 72], "gapBefore": [1]}
  ]
}
```

The metadata object is optional and accepts string values for title and author. The renderer records its own producer and export time.

The complete preset is in `assets/profile.json`. Page measurements use PDF points, measured from the top for rule positions. Adjust `scale` when source dimensions change. Raise `threshold` to restrict tracing to darker pixels. Change `penWidth` for a small stroke-weight adjustment. Keep `penVariation` below the base width. Long expressions must fit within the selected page. Files render in source order and flow across page boundaries.

## Verify and publish

With Poppler on your PATH, run `node scripts/check-pdf.cjs private/notes.pdf private/review` to render each page into a fresh directory. For a metadata-only edit, append the previous PDF as a third argument. The command compares all rendered pages with the same settings.

Install Poppler to inspect the final PDF. Run `pdfinfo private/notes.pdf` and `pdftoppm -r 144 -png private/notes.pdf private/check`. Zoom in on small exponents, decimal points, radical ends and the first and last lines. The tests check PDF object offsets, pagination, tracing and invalid inputs. Visual comparison and comparing the transcribed equations against the supplied answers are separate steps.

The repository ships only synthetic marks. Keep your own source pages, output PDFs, local paths, audit notes and access tokens outside the public tree. Choose a distribution license before offering reuse under specific terms.
