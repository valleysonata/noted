---
name: notebook-ink
description: Generate reference-guided handwritten math pages and assemble them into a ruled vector PDF. Use for notebook-style worked solutions, continuous pagination and repairs to faint or clipped equation strokes.
---

# Notebook Ink

1. Read the question sheet visually, including diagrams. Make a checklist of every subpart. Solve in the order givens, equation, substitution, result. Verify values by an independent calculation. Keep guard digits until the final line.
2. Inspect every reference page. Use the most representative one as primary. Measure page dimensions in points and count both the rules and the gaps between them. Compare ink height with line spacing. Inspect numerals, Greek letters, headings and short English explanations. Keep the source material private.
3. Generate a small test with the actual reference image supplied to the host's image editor. Use the prompt and settings in [the workflow](references/workflow.md). Check the output at equal page scale with the reference. Continue only once the reference is visibly influencing the result.
4. Generate successive sections with the approved reference and exact checked text. Read each formula directly from the image. Regenerate a faulty section before tracing it. Keep the approved image if the revision concerns only pen weight or layout.
5. Convert generated pages to BMP, mark each written row's center in input pixels and set the optional gaps between problems. See [the usage guide](references/usage.md) for commands and the manifest. Trace complete contours and let rows continue across pages.
6. Render the finished PDF and compare every printed value, sign, unit and exponent against the solution ledger. Inspect fraction bars, radical scope, matched delimiters, short subscripts and the last row before every page break. Report remaining discrepancies and model assumptions.
7. For a presentation-only edit, change the smallest relevant setting. For metadata-only edits, compare raster hashes before and after. Report the producer actually used and the actual modification time.
