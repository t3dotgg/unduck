# Unduck - Enhanced Bang Redirects

DuckDuckGo's bang redirects are too slow. This enhanced version provides lightning-fast client-side redirects with custom bang support and privacy-first design.

## Features

✅ **Lightning Fast**: Client-side redirects eliminate server delays  
✅ **Custom Bangs**: Create and manage your own search shortcuts  
✅ **Default Bang Selection**: Choose any bang (custom or built-in) as your default search engine  
✅ **Privacy-First**: No tracking, no analytics, all data stored locally  
✅ **Lightweight**: Minimal, practical UI focused on functionality  
✅ **Dark Mode**: Automatic dark/light mode support  

## Quick Setup

Add the following URL as a custom search engine to your browser:

```
https://unduck.link?q=%s
```

This enables all of DuckDuckGo's bangs plus your custom ones!

## How to Use

### Basic Search
- `!g hello world` → Google search for "hello world"
- `!gh t3dotgg/unduck` → GitHub repository search
- `!yt cats` → YouTube search for "cats"

### Custom Bangs
1. Visit https://unduck.link (without search query)
2. Scroll to "Custom Bangs" section
3. Add your custom bang with:
   - **Trigger**: Short code (e.g., "mysite")
   - **Name**: Descriptive name (e.g., "My Website")
   - **URL**: Template with `{{{s}}}` placeholder (e.g., "https://mysite.com/search?q={{{s}}}")

### Default Search Engine
1. Visit the settings page (https://unduck.link)
2. Select your preferred default from the dropdown
3. Now searches without bangs will use your chosen default

## Examples of Custom Bangs

```
Trigger: jira
Name: Company JIRA
URL: https://company.atlassian.net/browse/{{{s}}}

Trigger: docs
Name: Internal Docs
URL: https://docs.company.com/search?q={{{s}}}

Trigger: npm
Name: NPM Package Search
URL: https://www.npmjs.com/search?q={{{s}}}
```

## Why is it faster?

DuckDuckGo does their redirects server-side, which involves:
1. DNS lookup to DuckDuckGo
2. Server processing
3. HTTP redirect response
4. Another DNS lookup to final destination

Unduck does everything client-side:
1. Cached JavaScript processes the bang locally
2. Direct redirect to final destination
3. No intermediate server calls

## Privacy

- **No tracking scripts** (removed Plausible analytics)
- **No data collection** - everything stays on your device
- **Local storage only** - custom bangs and preferences stored in browser
- **No server-side processing** - all logic runs in your browser

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment to Cloudflare Pages

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Pages**:
   - Connect your GitHub repository to Cloudflare Pages
   - Set build command: `npm run build`
   - Set build output directory: `dist`
   - Deploy!

3. **Alternative - Manual Upload**:
   - Run `npm run build`
   - Upload the `dist` folder contents to Cloudflare Pages

## Technical Details

- **Framework**: Vanilla TypeScript + Vite
- **Storage**: Browser localStorage for custom bangs and preferences
- **Styling**: Modern CSS with dark mode support
- **Build**: Optimized for static hosting (Cloudflare Pages, Netlify, etc.)

## Contributing

This project follows the KISS (Keep It Simple, Stupid) philosophy. When contributing:
- Keep the UI lightweight and functional
- Maintain privacy-first approach
- Ensure fast client-side performance
- Test with various bang formats

---

**Original concept by**: [Theo](https://x.com/theo) • **Enhanced version with custom bangs and privacy improvements**
