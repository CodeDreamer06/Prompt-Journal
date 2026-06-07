# Prompt Journal

A clean publishing platform for sharing selected LLM conversations as readable, searchable blog posts.

**Live demo:** [prompt-journal-nine.vercel.app](https://prompt-journal-nine.vercel.app/)
**Repository:** [github.com/CodeDreamer06/Prompt-Journal](https://github.com/CodeDreamer06/Prompt-Journal)

---

## What is this?

Prompt Journal is a small, focused app for turning useful AI conversations into a public archive.

It gives you a private admin panel to draft, edit, tag, and publish conversations, and a public blog interface where readers can browse, search, and open each conversation through clean URLs.

It is built for people who want to preserve the better parts of their LLM usage: debugging sessions, research conversations, writing explorations, prompt experiments, or anything worth revisiting later.

---

## Features

### Public blog

- Clean homepage for published conversations
- Individual conversation pages with readable formatting
- Search by title, content, tags, or LLM type
- Responsive layout for desktop and mobile
- Dark and light mode support
- SEO-friendly routes, metadata, sitemap, and `robots.txt`

### Admin panel

- Password-protected creator dashboard
- Create, edit, delete, draft, and publish conversations
- Markdown editor with preview
- Tag management
- Import/export support for backups
- Migration route for older locally stored data

### Technical

- Next.js 15 App Router
- TypeScript
- Tailwind CSS 4
- Turso SQL / libSQL database
- Markdown rendering with syntax highlighting
- API routes for public and admin operations
- Designed for deployment on Vercel

---

## Tech stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Turso SQL / libSQL |
| Deployment | Vercel |
| Content format | Markdown |

---

## Quick start

### 1. Clone the repository

```bash
git clone https://github.com/CodeDreamer06/Prompt-Journal.git
cd Prompt-Journal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

```bash
cp .env.example .env.local
```

Then update `.env.local`:

```env
# Admin password for /admin
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password

# Turso database
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Optional analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### 4. Run the app locally

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Then visit:

```txt
http://localhost:3000/admin
```

Use your admin password, create a conversation, publish it, and check the public homepage.

---

## Database setup

Prompt Journal uses Turso SQL.

1. Create a database at [turso.tech](https://turso.tech)
2. Copy the database URL
3. Create an auth token
4. Add both values to `.env.local` and to your deployment environment

Required variables:

```env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

To verify the app can reach the database, visit:

```txt
/api/health
```

---

## Available scripts

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Start the production server
npm run start

# Run linting
npm run lint

# Run type checks, if configured
npm run type-check
```

---

## Project structure

```txt
Prompt-Journal/
├── app/
│   ├── page.tsx                 # Public homepage
│   ├── layout.tsx               # Root layout and metadata
│   ├── globals.css              # Global styles
│   ├── sitemap.ts               # Sitemap generation
│   ├── robots.ts                # robots.txt generation
│   │
│   ├── admin/                   # Admin dashboard
│   │   ├── page.tsx
│   │   ├── create/
│   │   ├── edit/[id]/
│   │   └── components/
│   │
│   ├── chat/[slug]/             # Public conversation pages
│   │   └── page.tsx
│   │
│   └── api/                     # API routes
│       ├── chats/
│       └── health/
│
├── components/                  # Shared UI components
│   ├── ChatViewer.tsx
│   ├── MarkdownRenderer.tsx
│   ├── EnhancedSearchBar.tsx
│   ├── LLMBadge.tsx
│   └── ThemeToggle.tsx
│
├── lib/                         # Utilities and app logic
│   ├── types.ts
│   ├── llms.ts
│   ├── auth.ts
│   ├── markdown.ts
│   ├── search.ts
│   └── api-storage.ts
│
├── public/
│   └── logos/                   # LLM logos
│
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Adding a new LLM

To add support for another model/provider:

### 1. Update the type

In `lib/types.ts`:

```ts
export type LLMType =
  | "gpt-4o"
  | "claude"
  | "gemini"
  | "your-new-llm";
```

### 2. Add its display config

In `lib/llms.ts`:

```ts
"your-new-llm": {
  name: "Your New LLM",
  logo: "/logos/your-new-llm.png",
  color: "border-purple-500",
  textColor: "text-purple-600 dark:text-purple-400",
  bgColor: "bg-purple-50 dark:bg-purple-950"
}
```

### 3. Add the logo

Place the logo here:

```txt
public/logos/your-new-llm.png
```

Recommended size: `24x24px`.

---

## Customization

### Styling

Most styling lives in:

```txt
app/globals.css
```

Component-level styling is handled with Tailwind classes inside the relevant component files.

### LLM badges

Model names, colors, and logos are configured in:

```txt
lib/llms.ts
```

### Markdown appearance

Markdown rendering can be adjusted in:

```txt
components/MarkdownRenderer.tsx
app/globals.css
```

---

## Deployment

### Vercel

Vercel is the easiest deployment target for this project.

#### Using the Vercel dashboard

1. Import the GitHub repository into Vercel
2. Add the required environment variables:
   - `NEXT_PUBLIC_ADMIN_PASSWORD`
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
3. Deploy

#### Using the Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Add environment variables through the Vercel dashboard or CLI.

---

## Security notes

Prompt Journal is designed for personal publishing, not as a full multi-user CMS.

Current security model:

- Admin access is protected by a password
- Secrets are stored in environment variables
- Drafts and published conversations are treated separately
- Admin routes are separated from public routes

Important:

- Do not commit `.env.local`
- Use a strong admin password
- Review conversations before publishing
- Avoid publishing private, sensitive, or identifying data
- If you extend this for multi-user use, replace the simple password gate with proper authentication

---

## Contributing

Contributions are welcome.

If you want to improve the project:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Test locally

```bash
npm run build
npm run lint
```

5. Open a pull request with a clear description

For bugs, please include:

- What happened
- What you expected
- Steps to reproduce
- Browser and environment
- Screenshots, if useful

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgements

Built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Turso](https://turso.tech/)
- [Vercel](https://vercel.com/)

---

<p align="center">
  Made by <a href="https://github.com/CodeDreamer06">CodeDreamer06</a>
</p>