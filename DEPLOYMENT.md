# Deployment Instructions

## 🚀 Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_ADMIN_PASSWORD
   ```
   Enter your secure admin password when prompted.

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub: `https://github.com/CodeDreamer06/Prompt-Journal.git`
4. Add environment variable:
   - Name: `NEXT_PUBLIC_ADMIN_PASSWORD`
   - Value: Your secure admin password
5. Deploy!

## 🔧 Local Development

1. **Clone and install**
   ```bash
   git clone https://github.com/CodeDreamer06/Prompt-Journal.git
   cd Prompt-Journal
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set your admin password.

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## 🎯 First Steps After Deployment

1. **Access Admin Panel**
   - Go to `/admin` on your deployed site
   - Enter your admin password

2. **Create Your First Chat**
   - Click "New Chat"
   - Fill in title, select LLM, add tags
   - Paste your conversation in the markdown format:
     ```markdown
     ### 🧑‍💻 User
     
     Your question here
     
     ---
     
     ### 🤖 Assistant
     
     AI response here
     ```
   - Check "Published" and save

3. **Share Your Blog**
   - Your conversations will appear on the homepage
   - Each chat gets a clean URL like `/chat/your-conversation-title`
   - Share individual conversations or the main blog

## 🔒 Security Notes

- Admin password is stored as an environment variable
- No sensitive data in the codebase
- All data stored in browser localStorage
- Use export/import for backups

## 📱 Features Overview

### Public Features
- ✅ Clean blog homepage
- ✅ Search and filter conversations
- ✅ LLM-specific styling (ChatGPT, Claude, Gemini, Custom)
- ✅ Responsive design
- ✅ Dark mode auto-detection
- ✅ Individual chat pages with clean URLs

### Admin Features
- ✅ Password-protected admin panel
- ✅ Create/edit/delete conversations
- ✅ Draft and publish system
- ✅ Tag management
- ✅ Export/import functionality
- ✅ Live preview while editing

### Technical Features
- ✅ Next.js 15 with App Router
- ✅ Tailwind CSS 4
- ✅ TypeScript
- ✅ Markdown rendering with syntax highlighting
- ✅ SEO optimized
- ✅ Static site generation

## 🎨 Customization

### Adding New LLMs
Edit `lib/llms.ts` to add new LLM configurations:

```typescript
export const LLM_CONFIGS = {
  // ... existing configs
  'your-llm': {
    name: 'Your LLM',
    logo: '🚀',
    color: 'border-purple-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950'
  }
}
```

### Styling
- Main styles: `app/globals.css`
- Tailwind config: Uses Tailwind CSS 4 with automatic dark mode
- Component styles: Inline with Tailwind classes

## 📊 Analytics (Optional)

To add Google Analytics:
1. Add `NEXT_PUBLIC_GA_ID` to your environment variables
2. The tracking code is already set up in the layout

## 🔄 Backup & Migration

### Export Data
- Use the "Export All" button in admin panel
- Downloads JSON file with all conversations

### Import Data
- Use the "Import" button in admin panel
- Upload previously exported JSON file

## 🐛 Troubleshooting

### Build Issues
- Ensure Node.js 18+ is installed
- Run `npm install` to update dependencies
- Check TypeScript errors with `npm run build`

### Admin Access Issues
- Verify `NEXT_PUBLIC_ADMIN_PASSWORD` is set correctly
- Clear browser session storage if needed
- Check browser console for errors

### Deployment Issues
- Ensure environment variables are set in Vercel dashboard
- Check build logs for errors
- Verify GitHub repository is public or Vercel has access

## 🎉 You're All Set!

Your Prompt Journal is now ready to share your LLM conversations with the world!