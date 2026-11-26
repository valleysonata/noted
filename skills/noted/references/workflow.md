# Reference-guided generation and tracing

## Sequence that worked

The early per-character approach sampled glyph variants and drew missing characters. It produced readable text, but the uneven joins and repeated shapes did not match the requested hand. A text-only image prompt then produced oversized, tidy lettering. The successful generation supplied actual visible reference pages to the image editor. If a host rejects a local image path, use its supported recent-image mechanism with only the intended reference images in scope. A prose description alone lost the character shapes.

Use a short reference-guided edit instruction such as:

> Replace the writing with the checked lines below. Keep the hand in the attached page. Carry over its irregular letter heights, cramped joins, uneven gaps, and small baseline changes wherever they appear in the sample. Keep the ink as dark and thick as the reference at the same scale. Preserve the rough letter shapes even when the result looks less tidy. Keep each number, sign, and exponent exact.

Compare the proof and reference side by side using the same rule spacing. Look at repeated digits, narrow letter shapes, and the darkest downstrokes. If the proof looks tidier or thinner, feed the original page back into the editor, name the visible mismatch, and redo just the proof. Keep irregularity in the writing and preserve legible fraction and radical bars. Preserve room between problems while allowing the next section to start on the same page. Two columns work for short related parts. For two-column source images, crop into reading-order blocks with white padding before tracing.

## Actual rendering path

1. Save the accepted generated images privately. Flatten the alpha channel onto white and convert to uncompressed BMP. Sample the clear right edge per scanline to remove the ruled background. The original used 120 source pixels for this estimate.
2. Supply approximate row centers. Between adjacent centers, look for the least ink in the middle half of the gap. Trace each closed outline using interpolated marching squares and resolve ambiguous cells by their mean level. Assign its complete outline to a writing row. Cutting a strip at each nominal row boundary had separated fraction bars and the tops of radicals.
3. Apply repeatable local variations in horizontal spacing, tilt, baseline and height. The final phase is based on source and row index. The original expressions and coefficients live in scripts/trace.cjs. Do not apply the variation to the notebook rules.
4. Detect long thin horizontal spans within an outline. The detector accepts a span at least seven input pixels wide with a section at most 3.1 pixels thick, slope at most 0.19 and deviation within 2.4 pixels. For radical bars, try the right-hand portion as well. Remove 85% of its bend. Check bars visually because a short isolated dash can meet the same conditions.
5. Draw closed cubic paths, using even-odd fill for holes in letters, plus a narrow rounded outline. The final curve blends 26% midpoint and 74% original point. The accepted pen adjustment reduced the outline from 0.23 to 0.13 pt, with 0.038 pt line-to-line variation. The threshold remained 115. These values refer to added outline thickness; total stroke thickness also depends on the input.
6. Emit compressed vector page streams. The notebook preset uses 595 by 838.735 pt, 34 gray rules, 33 writing intervals, first rule at 4.46 pt and pitch 25.18 pt. Rule width is 0.78 pt, gray is 0.8, ink gray is 0.025, scale is 0.61 pt per input pixel. End a page only once its writing intervals are used. Recheck the page after changing scale or input resolution.
7. Use PDF 1.3 and real export timestamps. A historical metadata edit copied a producer label from a reference; that label did not establish which software generated the PDF. This distribution records noted as producer and uses UTC. The visual result is independent of that metadata.

## Limits and review

Tracing preserves the shapes generated in the source image, including its errors. It cannot recover a missing digit. If the host lacks image editing, accept an existing ink image or ask for one. The command-line renderer takes bitmap inputs, not a physics prompt. A PDF written this way contains vector outlines with no searchable math text layer. At full-page viewing size, small exponents may still need zoom. Keep clear margins around all ink. Inspect long expressions near the right edge and tall fractions near page borders.
