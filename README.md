# Prompt Journal

A beautiful, modern blog for sharing your LLM conversations with the world. Built with Next.js 15, Tailwind CSS 4, and TypeScript.

## Features

### Public Blog
- **Clean Homepage**: Browse all published conversations with previews
- **LLM Support**: ChatGPT, Claude, Gemini, and custom LLMs with distinctive styling
- **Search & Filter**: Find conversations by content, tags, or LLM type
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Dark Mode**: Automatic system preference detection with manual toggle
- **SEO Optimized**: Clean URLs and meta tags for better discoverability

### Admin Panel
- **Simple Authentication**: Environment variable-based password protection
- **Rich Editor**: Markdown editor with live preview
- **Import Support**: Bulk import from ChatGPT/Claude exports
- **Tag Management**: Organize conversations with custom tags
- **Draft System**: Save and preview before publishing
- **Export Data**: Backup all your conversations as JSON

### LLM Styling
Each LLM gets its own distinctive appearance:
- **ChatGPT**: Green theme with OpenAI styling
- **Claude**: Orange theme with Anthropic styling
- **Gemini**: Blue theme with Google styling
- **Custom**: Purple theme for other LLMs

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodeDreamer06/Prompt-Journal.git
   cd Prompt-Journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set your admin password:
   ```env
   ADMIN_PASSWORD=your-secure-password-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating Your First Conversation

1. Go to `/admin` and enter your password
2. Click "Create New Chat"
3. Fill in the details:
   - **Title**: Give your conversation a descriptive name
   - **LLM**: Select which AI you were chatting with
   - **Tags**: Add relevant tags for organization
   - **Content**: Paste your conversation in markdown format

### Markdown Format

Use this format for your conversations:

```markdown
### User

Your question or prompt here

---

### Assistant

The AI's response here with **formatting** and `code blocks`

---

### User

Follow-up question

---

### Assistant

Another response from the AI
```

## Development

### Project Structure

```
app/
├── layout.tsx              # Root layout with theme
├── page.tsx               # Public homepage
├── admin/                 # Admin panel (password protected)
│   ├── page.tsx          # Admin dashboard
│   ├── create/           # Create new chat
│   ├── edit/[id]/        # Edit existing chat
│   └── components/       # Admin-specific components
├── chat/[slug]/          # Public chat pages
├── api/                  # API routes
├── components/           # Shared components
│   ├── ChatViewer.tsx    # Renders chat conversations
│   ├── LLMBadge.tsx     # LLM logos and styling
│   ├── SearchBar.tsx    # Search functionality
│   └── ThemeToggle.tsx  # Dark/light mode toggle
└── lib/                 # Utilities
    ├── storage.ts       # Data persistence
    ├── llms.ts         # LLM configurations
    └── types.ts        # TypeScript definitions
```

### Environment Variables

Create a `.env.local` file with:

```env
# Admin password for accessing /admin routes
ADMIN_PASSWORD=your-secure-password
```

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables**
   ```bash
   vercel env add ADMIN_PASSWORD
   ```

## Security

- Admin routes are protected by environment variable password
- No sensitive data is stored in the codebase
- All user data is stored locally in browser localStorage
- Export functionality allows for easy backups

## License

This project is open source and available under the MIT License.

---

**Made with love by [CodeDreamer06](https://github.com/CodeDreamer06)**