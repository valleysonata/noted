# Reference-guided generation and tracing

## Proof and revision loop

1. Inspect the whole reference page for margins, rule spacing and density. Select a detail crop with the kind of writing needed for this job, such as compact equations or a short prose explanation. Use the full page for layout and the crop for stroke shape. Record a few visible traits, including ink height relative to ruling, pen weight, repeated digit shapes and baseline variation. Preserve a tidy style when that is what the sample shows.
2. Give the image editor the actual reference and a short fixed passage with a heading, representative equations and a few words of prose. Ask it to replace the sample writing with those exact lines while preserving the observed traits. Use the host's reference-image mechanism. Keep this same passage for every revision.
3. Compare the proof and reference at equivalent rule spacing. Name one or two concrete differences, such as digits twice as tall as the reference or uniform gaps where the reference has cramped joins. Read the proof against the passage separately and check all digits, signs and exponents.
4. If needed, send the reference and the closest proof back with a targeted edit. Specify the visible mismatch and the exact lines to preserve or correct. Try up to two revisions and keep the closest mathematically accurate result, even if it was earlier. Stop early when the proof is close or the edits stop improving. Report what is still off if no accurate proof is close enough.
5. Reuse the chosen reference and settings for the full solution. Keep tall expressions and diagrams together. For two-column sources, use reading-order blocks with white padding before tracing.

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
