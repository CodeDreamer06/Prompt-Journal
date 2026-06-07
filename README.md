# Prompt Journal

A blog for publishing LLM conversations. Paste a chat, pick the model, hit publish — readers get a clean, searchable page they can actually enjoy reading.

**Live** → [prompt-journal-nine.vercel.app](https://prompt-journal-nine.vercel.app/)

---

## Why this exists

Most AI conversations live and die in a chat window. The good ones — the ones where you cracked a tricky bug, explored an idea, or got a surprisingly beautiful explanation — deserve better than a screenshot on Twitter.

Prompt Journal gives those conversations a proper home: formatted markdown, syntax highlighting, search, dark mode, the works.

## What you get

- **A public blog** with search, model filtering, and individual chat pages with clean URLs.
- **An admin panel** behind a password, where you create, edit, preview, and publish conversations.
- **Markdown rendering** with syntax highlighting, LaTeX support, and copy-to-clipboard on code blocks.
- **Model badges** with logos for GPT, Claude, Gemini, DeepSeek, Grok, Perplexity, Qwen, and more.
- **Dark and light themes** that follow system preferences or manual toggle.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Turso (libSQL / SQLite at the edge) |
| Search | Fuse.js (client-side fuzzy search) |
| Markdown | react-markdown + remark-gfm + rehype-katex |
| Hosting | Vercel |

## Getting started

```bash
git clone https://github.com/CodeDreamer06/Prompt-Journal.git
cd Prompt-Journal
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_ADMIN_PASSWORD=pick-something-strong
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

Then:

```bash
npm run dev        # → http://localhost:3000
```

Visit `/admin`, log in, create a chat, publish it. That's the whole flow.

## Project layout

```
app/
  page.tsx              # Public homepage
  chat/[slug]/          # Individual chat pages
  admin/                # Admin panel (create, edit, dashboard)
  api/chats/            # REST endpoints for chat CRUD
components/             # ChatViewer, SearchBar, MarkdownRenderer, etc.
lib/                    # Types, storage helpers, LLM configs, auth
public/logos/           # Model logo PNGs
```

## Deployment

Push to GitHub, connect the repo to [Vercel](https://vercel.com), set the three environment variables above, done. Vercel will handle builds and edge deployment automatically.

For Turso, create a free database at [turso.tech](https://turso.tech) and grab the URL + auth token.

## Adding a new model

1. Add the model identifier to the `LLMType` union in `lib/types.ts`.
2. Add its display name, logo path, and colors in `lib/llms.ts`.
3. Drop a logo PNG into `public/logos/`.

## Contributing

Fork it, branch off `main`, make your changes, open a PR. Keep it clean — match the existing code style, test both dev and production builds, and update docs if you're adding something user-facing.

Bug reports and feature ideas go in [Issues](https://github.com/CodeDreamer06/Prompt-Journal/issues).

## License

MIT — do whatever you want with it.