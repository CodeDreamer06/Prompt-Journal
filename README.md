# 🤖 Prompt Journal

> **A modern, beautiful blog platform for sharing LLM conversations with the world**

Transform your AI conversations into a professional blog that others can explore, search, and learn from. Built with Next.js 15, Tailwind CSS 4, TypeScript, and Vercel KV for global accessibility.

🌐 **Live Demo**: [https://prompt-journal-nine.vercel.app/](https://prompt-journal-nine.vercel.app/)

![Prompt Journal Preview](https://via.placeholder.com/800x400/0a0a0a/ffffff?text=Prompt+Journal+Preview)

---

## 📖 Table of Contents

- [🎯 What is Prompt Journal?](#-what-is-prompt-journal)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Development Guide](#-development-guide)
- [🎨 Customization](#-customization)
- [🚀 Deployment](#-deployment)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)

---

## 🎯 What is Prompt Journal?

**Prompt Journal** is a personal blog platform specifically designed for sharing LLM (Large Language Model) conversations. Think of it as a **Medium for AI conversations** where you can:

- **Publish your best AI conversations** for others to read and learn from
- **Organize conversations by LLM type** (ChatGPT, Claude, Gemini, etc.)
- **Search and filter** through conversations by content, tags, or AI model
- **Share individual conversations** via clean, SEO-friendly URLs
- **Maintain full control** over what gets published vs. kept as drafts

### 🎭 Target Audience

- **AI Enthusiasts** sharing interesting conversations
- **Developers** documenting AI-assisted coding sessions
- **Researchers** publishing AI interaction studies
- **Content Creators** building AI-focused blogs
- **Anyone** who wants to share their AI conversations professionally

---

## ✨ Key Features

### 🌐 Public Blog Experience
- **Beautiful Homepage**: Grid layout showcasing published conversations
- **Individual Chat Pages**: Clean, readable conversation views
- **Advanced Search**: Find conversations by content, LLM type, or tags
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Dark/Light Mode**: Auto-detection with manual toggle
- **SEO Optimized**: Clean URLs, meta tags, sitemap

### 🔐 Admin Panel (Creator Only)
- **Password Protection**: Simple environment variable authentication
- **Rich Editor**: Markdown editor with live preview
- **CRUD Operations**: Create, read, update, delete conversations
- **Draft System**: Save and preview before publishing
- **Tag Management**: Organize conversations with custom tags
- **Import/Export**: Backup and restore conversation data
- **Migration Tools**: Auto-migrate from localStorage to cloud storage

### 🤖 Multi-LLM Support
Each LLM gets distinctive styling and branding:

| LLM | Theme | Logo | Use Case |
|-----|-------|------|----------|
| **ChatGPT** | Green | 🤖 | General conversations, coding help |
| **Claude** | Orange | 🧠 | Analysis, writing assistance |
| **Gemini** | Blue | ✨ | Research, creative tasks |
| **GPT-4** | Emerald | 4️⃣ | Advanced reasoning |
| **Perplexity** | Cyan | 🔍 | Research and fact-checking |
| **Llama** | Red | 🦙 | Open-source AI conversations |
| **Mistral** | Indigo | 🌪️ | European AI model discussions |
| **Custom** | Purple | ⚡ | Any other LLM |

### 🛠️ Technical Features
- **Global Storage**: Vercel KV (Redis) for worldwide accessibility
- **Real-time Updates**: Instant publishing and updates
- **Markdown Rendering**: Full markdown support with syntax highlighting
- **Type Safety**: Full TypeScript implementation
- **Performance**: Static generation with dynamic updates
- **Scalability**: Built on Vercel's edge network

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    A[Public Users] --> B[Next.js Frontend]
    C[Admin User] --> B
    B --> D[API Routes]
    D --> E[Vercel KV Redis]
    B --> F[Static Pages]
    
    subgraph "Frontend"
        B --> G[Public Blog]
        B --> H[Admin Panel]
        B --> I[Individual Chats]
    end
    
    subgraph "Backend"
        D --> J["API: /api/chats - Public API"]
        D --> K["API: /api/chats/admin - Admin API"]
        D --> L["API: /api/chats/slug - Individual Chat"]
        D --> M["API: /api/chats/migrate - Migration"]
    end
```

### 🔄 Data Flow

1. **Admin creates/edits** conversations in the admin panel
2. **Data is stored** in Vercel KV (Redis) for global access
3. **Public users** can view published conversations
4. **Search and filtering** happens client-side for speed
5. **Individual chats** are served via API with caching

### 🗄️ Data Storage

- **Production**: Vercel KV (Redis) - globally distributed
- **Development**: Can use localStorage for testing
- **Backup**: JSON export/import functionality
- **Migration**: Automatic localStorage → KV migration

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (LTS recommended)
- **npm/yarn/pnpm** (package manager)
- **Git** (version control)
- **Vercel Account** (for deployment and KV database)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/CodeDreamer06/Prompt-Journal.git
cd Prompt-Journal

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2. Environment Setup

Edit `.env.local`:

```env
# Required: Admin password for /admin access
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password

# Required for production: Vercel KV Redis URL
REDIS_URL=redis://default:password@host:port

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=your-ga-id
```

### 3. Development

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### 4. First Steps

1. **Visit `/admin`** and login with your password
2. **Create your first chat** with sample content
3. **Publish it** and view on the homepage
4. **Test in incognito** to see the public experience

---

## 📁 Project Structure

```
Prompt-Journal/
├── 📁 app/                          # Next.js 15 App Router
│   ├── 📄 layout.tsx               # Root layout, theme, metadata
│   ├── 📄 page.tsx                 # Homepage (public blog)
│   ├── 📄 sitemap.ts               # SEO sitemap generation
│   ├── 📄 robots.ts                # SEO robots.txt
│   │
│   ├── 📁 admin/                   # 🔐 Admin Panel (Password Protected)
│   │   ├── 📄 page.tsx             # Admin dashboard & chat list
│   │   ├── 📁 create/              # Create new conversations
│   │   ├── 📁 edit/[id]/           # Edit existing conversations
│   │   └── 📁 components/          # Admin-specific components
│   │       ├── 📄 AdminLayout.tsx  # Admin wrapper with nav
│   │       └── 📄 ChatEditor.tsx   # Markdown editor with preview
│   │
│   ├── 📁 chat/[slug]/             # 🌐 Public Chat Pages
│   │   └── 📄 page.tsx             # Individual conversation view
│   │
│   └── 📁 api/                     # 🔌 Backend API Routes
│       └── 📁 chats/               # Chat management endpoints
│           ├── 📄 route.ts         # Public: GET published chats
│           ├── 📁 admin/           # Admin: CRUD operations
│           ├── 📁 [slug]/          # Public: GET chat by slug
│           └── 📁 migrate/         # Migration: localStorage → KV
│
├── 📁 components/                   # 🧩 Reusable UI Components
│   ├── 📄 ChatViewer.tsx          # Renders conversations with syntax highlighting
│   ├── 📄 LLMBadge.tsx            # LLM logos and themed badges
│   ├── 📄 SearchBar.tsx           # Search and filter functionality
│   └── 📄 ThemeToggle.tsx         # Dark/light mode switcher
│
├── 📁 lib/                         # 🛠️ Utilities & Configuration
│   ├── 📄 types.ts                # TypeScript type definitions
│   ├── 📄 llms.ts                 # LLM configurations (logos, colors)
│   ├── 📄 storage.ts              # Legacy localStorage functions
│   ├── 📄 api-storage.ts          # Modern API-based storage
│   ├── 📄 auth.ts                 # Admin authentication helpers
│   └── 📄 markdown.ts             # Markdown parsing utilities
│
├── 📁 public/                      # 📦 Static Assets
│   └── 📁 logos/                  # LLM logo SVG files
│       ├── 📄 chatgpt.svg         # ChatGPT logo
│       ├── 📄 claude.svg          # Claude logo
│       └── 📄 ...                 # Other LLM logos
│
├── 📄 package.json                # Dependencies and scripts
├── 📄 next.config.ts              # Next.js configuration
├── 📄 tailwind.config.ts          # Tailwind CSS configuration
├── 📄 tsconfig.json               # TypeScript configuration
└── 📄 README.md                   # This file
```

### 🗂️ Key File Purposes

| File/Folder | Purpose | When to Modify |
|-------------|---------|----------------|
| `app/page.tsx` | Public homepage | Changing blog layout |
| `app/admin/page.tsx` | Admin dashboard | Adding admin features |
| `components/ChatViewer.tsx` | Conversation display | Changing chat appearance |
| `lib/llms.ts` | LLM configurations | Adding new AI models |
| `lib/api-storage.ts` | API communication | Changing data flow |
| `app/api/chats/` | Backend endpoints | Adding new API features |

---

## 🔧 Development Guide

### 🏃‍♂️ Running the Project

```bash
# Development with hot reload
npm run dev

# Production build (test before deploy)
npm run build
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

### 🧪 Testing Your Changes

1. **Local Development**:
   ```bash
   npm run dev
   # Test at http://localhost:3000
   ```

2. **Production Build**:
   ```bash
   npm run build
   # Ensure no build errors
   ```

3. **Admin Panel Testing**:
   - Visit `/admin`
   - Test create/edit/delete operations
   - Verify preview functionality

4. **Public Experience**:
   - Test in incognito mode
   - Verify search and filtering
   - Check mobile responsiveness

### 🐛 Common Development Tasks

#### Adding a New LLM

1. **Update types** in `lib/types.ts`:
   ```typescript
   export type LLMType = 'chatgpt' | 'claude' | 'your-new-llm';
   ```

2. **Add configuration** in `lib/llms.ts`:
   ```typescript
   'your-new-llm': {
     name: 'Your New LLM',
     logo: '/logos/your-llm.svg',
     color: 'border-purple-500',
     textColor: 'text-purple-600 dark:text-purple-400',
     bgColor: 'bg-purple-50 dark:bg-purple-950'
   }
   ```

3. **Add logo** in `public/logos/your-llm.svg`

#### Modifying the Chat Display

Edit `components/ChatViewer.tsx`:
- **Message styling**: Update CSS classes
- **Syntax highlighting**: Modify code block rendering
- **Copy functionality**: Enhance clipboard features

#### Adding New Admin Features

1. **Create component** in `app/admin/components/`
2. **Add route** if needed in `app/admin/`
3. **Update navigation** in `AdminLayout.tsx`

#### Customizing the Homepage

Edit `app/page.tsx`:
- **Layout changes**: Modify grid structure
- **Search features**: Enhance filtering
- **Statistics**: Add new metrics

---

## 🎨 Customization

### 🎨 Styling & Themes

The project uses **Tailwind CSS 4** with automatic dark mode:

```css
/* app/globals.css */
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

#### Customizing Colors

1. **LLM Colors**: Edit `lib/llms.ts`
2. **Global Theme**: Modify `app/globals.css`
3. **Component Styles**: Update individual component files

### 🖼️ Logo Management

**Logo Requirements**:
- **Format**: SVG (recommended) or PNG
- **Size**: 24x24px for optimal display
- **Style**: Should work in both light and dark modes

**Adding Logos**:
1. Place in `public/logos/`
2. Update `lib/llms.ts` with the path
3. Ensure proper naming convention

### 📝 Markdown Customization

**Supported Features**:
- Headers (H1-H6)
- **Bold** and *italic* text
- `Inline code` and code blocks
- Lists (ordered and unordered)
- Links and images
- Blockquotes
- Horizontal rules (`---`)

**Custom Styling**:
Edit `app/globals.css` in the `.prose` section for markdown appearance.

---

## 🚀 Deployment

### 🌐 Vercel (Recommended)

Vercel provides the best experience with built-in KV database:

#### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_ADMIN_PASSWORD
```

#### Option 2: GitHub Integration

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import from GitHub
   - Select `Prompt-Journal` repository

2. **Configure Environment**:
   - Add `NEXT_PUBLIC_ADMIN_PASSWORD`
   - Vercel will auto-add `REDIS_URL` when you create KV database

3. **Set up Vercel KV**:
   - Go to Storage tab in Vercel dashboard
   - Create KV database
   - Connect to your project

### 🗄️ Database Setup (Vercel KV)

1. **Create KV Database**:
   - Vercel Dashboard → Your Project → Storage
   - Create Database → KV (Redis)
   - Choose "Hobby" plan (free)

2. **Connect to Project**:
   - Select your Prompt Journal project
   - Environment variables are auto-added

3. **Verify Connection**:
   - Visit `/api/test-kv` on your deployed site
   - Should return `"success": true`

### 🌍 Alternative Deployments

#### Netlify
```bash
# Build command
npm run build

# Publish directory
out/

# Environment variables
NEXT_PUBLIC_ADMIN_PASSWORD=your-password
REDIS_URL=your-redis-url
```

#### Railway
```bash
# Deploy with Railway CLI
railway login
railway link
railway up
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔒 Security

### 🛡️ Security Features

- **Admin Authentication**: Environment variable-based password
- **No Sensitive Data in Code**: All secrets in environment variables
- **API Protection**: Admin endpoints require password verification
- **Data Isolation**: Published vs. draft content separation
- **HTTPS Only**: Secure connections in production

### 🔐 Best Practices

1. **Strong Admin Password**:
   ```env
   NEXT_PUBLIC_ADMIN_PASSWORD=use-a-very-strong-password-here
   ```

2. **Environment Security**:
   - Never commit `.env.local` to git
   - Use different passwords for different environments
   - Rotate passwords periodically

3. **Content Security**:
   - Review conversations before publishing
   - Use draft mode for sensitive content
   - Regular backups via export functionality

### 🚨 Security Considerations

- **Public Repository**: Source code is public, but no secrets are exposed
- **Admin Access**: Only you can create/edit content
- **Data Privacy**: Conversations stored in your Vercel KV instance
- **CORS**: API endpoints are protected against unauthorized access

---

## 🤝 Contributing

### 🌟 How to Contribute

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Follow the development guide above
4. **Test Thoroughly**: Ensure all features work
5. **Commit Changes**: `git commit -m 'Add amazing feature'`
6. **Push to Branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**: Describe your changes

### 📋 Contribution Guidelines

- **Code Style**: Follow existing TypeScript/React patterns
- **Testing**: Test your changes in both development and production builds
- **Documentation**: Update README if adding new features
- **Backwards Compatibility**: Don't break existing functionality

### 🐛 Reporting Issues

When reporting bugs, please include:
- **Environment**: Development or production
- **Browser**: Chrome, Firefox, Safari, etc.
- **Steps to Reproduce**: Clear instructions
- **Expected vs. Actual**: What should happen vs. what happens
- **Screenshots**: If applicable

### 💡 Feature Requests

For new features, please describe:
- **Use Case**: Why is this feature needed?
- **Implementation**: How should it work?
- **Alternatives**: Other ways to solve the problem
- **Impact**: Who would benefit from this feature?

---

## 📞 Support & Community

### 🆘 Getting Help

1. **Check Documentation**: This README covers most use cases
2. **Search Issues**: Look for existing solutions
3. **Create Issue**: For bugs or feature requests
4. **Discussions**: For general questions and ideas

### 🔗 Useful Links

- **Live Demo**: [Your deployed site]
- **GitHub Repository**: [https://github.com/CodeDreamer06/Prompt-Journal](https://github.com/CodeDreamer06/Prompt-Journal)
- **Vercel Documentation**: [https://vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

### 🏷️ Version History

- **v1.0.0**: Initial release with localStorage
- **v2.0.0**: Vercel KV integration for global access
- **v2.1.0**: Enhanced LLM support and UI improvements

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2024 CodeDreamer06

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Vercel**: For hosting and KV database
- **Tailwind CSS**: For the utility-first CSS framework
- **TypeScript**: For type safety and developer experience
- **Open Source Community**: For inspiration and tools

---

<div align="center">

**Made with ❤️ by [CodeDreamer06](https://github.com/CodeDreamer06)**

*Share your AI conversations with the world! 🌟*

[⭐ Star this repo](https://github.com/CodeDreamer06/Prompt-Journal) • [🐛 Report Bug](https://github.com/CodeDreamer06/Prompt-Journal/issues) • [💡 Request Feature](https://github.com/CodeDreamer06/Prompt-Journal/issues)

</div>