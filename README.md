# noted

An agent skill to generate realistic handwritten PDFs from text, equations, or notes using a handwriting sample.

## Install

In Codex:

```text
$skill-installer install https://github.com/valleysonata/noted/tree/main/skills/noted
```

For Claude Code or another compatible agent, copy the complete [`skills/noted`](skills/noted) folder into its skills directory. Handwriting generation requires an image editor that accepts references. The bundled PDF renderer uses Node.js 20+.

## Use

Attach a handwriting sample and point to the content you want written:

> Use noted to turn the answers above into a handwritten PDF in the style of this sample.

`noted` generates new ink and follows the sample's letter shapes, pen weight, spacing, and page layout. It preserves the supplied content.

[Renderer guide](skills/noted/references/usage.md)
