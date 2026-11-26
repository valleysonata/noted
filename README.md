# Notebook Ink

Turn handwritten math images into a sharp, ruled PDF. Includes an agent skill for generating and checking notebook pages.

## Usage

With Node.js 20 or newer, run this from the repository folder:

```sh
npm run demo
```

Open `example.pdf` to see the included sample. To render your own notes, pass a manifest and an output filename:

```sh
node scripts/render.cjs private/notes.json private/notes.pdf
```

## Documentation

- [Setup and usage](references/usage.md)
- [Agent skill](SKILL.md)
- [Rendering workflow](references/workflow.md)
