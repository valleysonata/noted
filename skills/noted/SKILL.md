---
name: noted
description: Generate realistic handwritten pages from supplied text, equations, or notes, using a handwriting sample as the visual reference. Export the result as a downloadable PDF.
---

# noted

Generate the ink with a reference-capable image editor. Use the text, equations, or notes the user points to in the current chat or an attachment as the content. Reproduce that content as written and focus on the visual match.

1. **Prepare the source.** Identify the headings, answer lines, figures, and order to transcribe. Keep the equations, numbers, units, and wording from the finished answers. Create fresh handwriting unless the user explicitly asks to reuse or edit existing ink.
2. **Match the hand.** Render PDF references to images when needed. If visual access fails, ask for a clear screenshot. Use the [proof and revision loop](references/workflow.md) with the actual reference and a short passage from the answers. Tell the image editor from the start that the goal is a complete handwritten PDF and that the writing should be super messy in the same way as the reference. If the proof misses the style, show the best faithful proof and explain what still looks off.
3. **Write the complete set.** Reuse the accepted proof settings. Generate short batches and read them back against the source. Redo sections that change or omit content or drift from the reference. Preserve diagram labels and keep tall expressions together.
4. **Export.** Create a PDF only when all requested text, equations, and figures has been handwritten and faithfully transcribed. If anything is missing, report what remains and show any proof as an image. Follow the [renderer guide](references/usage.md) or assemble whole pages when needed to preserve their layout. Open or render the PDF and confirm that it is readable, complete, and downloadable.
