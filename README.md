# 🤖 Prompt Journal

> **A clean publishing platform for sharing selected LLM conversations as readable, searchable blog posts.** ✨

---

## 🎯 What is this?

Prompt Journal is a small, focused app for turning useful AI conversations into a public archive.

It gives you a private admin panel to draft, edit, tag, and publish conversations, and a public blog interface where readers can browse, search, and open each conversation through clean URLs.

It is built for people who want to preserve the better parts of their LLM usage: debugging sessions, research conversations, writing explorations, prompt experiments, or anything worth revisiting later. 🚀

---

## ✨ Features

### 🌐 Public blog
- Clean homepage for published conversations
- Individual conversation pages with readable formatting
- Search by title, content, tags, or LLM type 🔍
- Responsive layout for desktop and mobile 📱
- Dark and light mode support 🌗
- SEO-friendly routes, sitemap, and `robots.txt`

### 🔐 Admin panel
- Password-protected creator dashboard
- Create, edit, delete, draft, and publish conversations 📝
- Markdown editor with live preview
- Tag management 🏷️
- Import/export support for backups 💾
- Migration route for older locally stored data

### 🛠️ Technical
- Next.js 15 App Router
- TypeScript & Tailwind CSS 4
- Turso SQL / libSQL database
- Markdown rendering with syntax highlighting
- API routes for public and admin operations
- Designed for deployment on Vercel ⚡

---

## 🚀 Quick start

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

Open [http://localhost:3000](http://localhost:3000) and visit `/admin` to log in, write a post, and publish it! 🎉

---

## 🗄️ Database setup

Prompt Journal uses Turso SQL.

1. Create a database at [turso.tech](https://turso.tech) 💻
2. Copy the database URL
3. Create an auth token
4. Add both values to `.env.local` and your deployment environment:

```env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

To verify the app can reach the database, visit `/api/health` 🩺

---

## 🔧 Available scripts

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

## 📁 Project structure

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

## 🎨 Adding a new LLM

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

Place a `24x24px` PNG logo in `public/logos/your-new-llm.png`. 🖼️

---

## 🎨 Customization

- **Styling**: Most styling lives in `app/globals.css`. Component-level styles use Tailwind classes inside their files.
- **LLM badges**: Configured in `lib/llms.ts`.
- **Markdown appearance**: Adjust in `components/MarkdownRenderer.tsx` and `app/globals.css`.

---

## 🚀 Deployment

### Vercel

Vercel is the recommended hosting target.

#### Using the dashboard:
1. Import the repository.
2. Configure environment variables (`NEXT_PUBLIC_ADMIN_PASSWORD`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`).
3. Deploy! 🚀

#### Using the CLI:
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🔒 Security notes

Prompt Journal is designed for personal publishing, not as a multi-user CMS.

- Admin access is protected by a password.
- Secrets are stored securely in environment variables.
- Drafts and published conversations are separated.
- **Important**: Do not commit `.env.local` to Git! 🚫

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository and check out a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
2. Make your changes and test locally:
   ```bash
   npm run build
   npm run lint
   ```
3. Open a pull request with a description of the improvements. 🚀

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ by [CodeDreamer06](https://github.com/CodeDreamer06)**

*Share your AI conversations with the world! 🌟*

[⭐ Star this repo](https://github.com/CodeDreamer06/Prompt-Journal) • [🐛 Report Bug](https://github.com/CodeDreamer06/Prompt-Journal/issues) • [💡 Request Feature](https://github.com/CodeDreamer06/Prompt-Journal/issues)

</div>