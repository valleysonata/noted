# noted

Turn finished answers into a handwritten PDF styled from your notes.

## Install

In Codex:

```text
$skill-installer install https://github.com/valleysonata/noted/tree/main/skills/noted
```

For Claude Code or another compatible agent, copy the complete [`skills/noted`](skills/noted) folder into its skills directory. Handwriting generation requires an image editor that accepts references. The bundled PDF renderer uses Node.js 20+.

## Use

Finish your answers first. Then attach a handwriting sample and invoke the skill in the same chat:

> Use noted to turn the answers above into a handwritten PDF in the style of this sample.

You can also attach the finished answers as a separate file. `noted` copies the answers as written and uses the sample for letter shapes, pen weight, spacing, and page layout.

[Renderer guide](skills/noted/references/usage.md)
