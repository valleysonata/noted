# noted

noted is an agent skill for turning homework handwriting samples into a checked, identical PDF of worked solutions. It uses your sample to guide the handwriting, including uneven lettering, spacing, and equation layout. Send the assignment and sample together in one prompt.

## Install

Use the complete [skills/noted](skills/noted) folder so the renderer and notebook preset travel with the skill.

- **Codex:** Ask `$skill-installer install https://github.com/valleysonata/noted/tree/main/skills/noted`. Start a new session and invoke `$noted`.
- **Claude Code:** Copy `skills/noted` to `~/.claude/skills/noted` or `.claude/skills/noted` in your project. Invoke `/noted`.
- **Other agents:** Copy the folder to the host's skills directory or point the agent at [SKILL.md](skills/noted/SKILL.md). The full workflow needs image editing that accepts references and a shell that can run Node.js 20+. ChatGPT support depends on whether your workspace exposes skill import and the required tools.

## Use

Attach the assignment and a handwriting sample. A PDF or photo works as a style reference. You can also attach your own worked answers for transcription.

> Use noted. Solve the attached physics homework and produce a PDF using the handwriting and ruled layout in the attached sample.

The agent checks the solutions, proofs one representative section, and repairs mismatched image batches before exporting. If you already have ink images, it can trace those directly. PDF title and author are optional.

Run `npm run demo` with Node.js 20+ and open `example.pdf` to try the renderer offline. See the [renderer guide](skills/noted/references/usage.md) for manifest, metadata, and verification commands.
