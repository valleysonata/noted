# Notebook Ink

Turn reference-guided handwritten page images into a continuous, ruled vector PDF. The agent instructions cover image generation and math review. The local renderer handles ink tracing, pagination and PDF export. It runs offline with Node.js 20 or newer and uses only built-in modules.

## Install and try it

Extract the repository, open a terminal in its root and run:

```sh
node --version
npm test
npm run demo
```

Open `example.pdf`. The included synthetic card contains two short equations. To rebuild the card, run `node scripts/fixture.cjs`. Choose a fresh output filename for each run. No package download or API key is required for the demo.

For agent use, copy this complete repository folder into your agent's supported skills directory as `notebook-ink`, or point the agent directly at `SKILL.md`. Keep the scripts and assets beside that file. The reference-guided image step requires an image-editing host that can see the supplied reference. The repository includes its input instructions and the local renderer.

## Render your own notes

1. Follow [SKILL.md](../SKILL.md) to verify the content and generate or obtain the handwritten page images. Use black ink on white or gray-ruled paper with a clear right edge. Keep original and generated inputs in a separate private folder.
2. Convert each image to an uncompressed 24-bit BMP. On Windows use `./scripts/prepare-bmp.ps1 input.png output.bmp`. With ImageMagick on another system use `magick input.png -background white -alpha remove -alpha off -type TrueColor BMP3:output.bmp`. Check that source images have white padding on each side.
3. Create a manifest near the inputs. The source array is in reading order. Enter one center per actual written row in pixels measured from the top. For a stacked fraction, count its numerator and denominator as one written row. Add a blank writing interval before any zero-based row index listed in `gapBefore`.
4. Run `node scripts/render.cjs private/notes.json private/notes.pdf`. Inspect the result at page scale and high zoom.

```json
{
  "profile": {"penWidth": 0.13},
  "sources": [
    {"file": "page-1.bmp", "centers": [30, 72], "gapBefore": [1]}
  ]
}
```

The complete preset is in `assets/profile.json`. Page measurements use PDF points, measured from the top for rule positions. Adjust `scale` when source dimensions change. Raise `threshold` to restrict tracing to darker pixels. Change `penWidth` for a small stroke-weight adjustment. Keep `penVariation` below the base width. Long expressions must fit within the selected page. Files render in source order and flow across page boundaries.

## Verify and publish

With Poppler on your PATH, run `node scripts/check-pdf.cjs private/notes.pdf private/review` to render each page into a fresh directory. For a metadata-only edit, append the previous PDF as a third argument. The command compares all rendered pages with the same settings.

Install Poppler to inspect the final PDF. Run `pdfinfo private/notes.pdf` and `pdftoppm -r 144 -png private/notes.pdf private/check`. Zoom in on small exponents, decimal points, radical ends and the first and last lines. The tests check PDF object offsets, pagination, tracing and invalid inputs. Visual comparison and independently checking the equations are separate steps.

The source ZIP contains the tracked working tree. To publish that ZIP as a new GitHub repository, extract it, run `git init -b main`, review `git status`, stage the public files and commit. Create an empty repository on GitHub, add its URL as the origin and push main. The separate Git bundle, when supplied, can instead be cloned with `git clone notebook-ink.bundle notebook-ink`. See [the workflow](workflow.md) for the original design decisions and the limits of the renderer.

The repository ships only synthetic marks. Keep your own source pages, output PDFs, local paths, audit notes and access tokens outside the public tree. Choose a distribution license before offering reuse under specific terms.
