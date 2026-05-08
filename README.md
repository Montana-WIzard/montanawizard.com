# Montana Wizard Podcast — Website

A redesign of montanawizard.com with a rugged-Montana-meets-professional-podcast aesthetic.

## File structure

```
montanawizard/
├── index.html            ← Homepage with hero + audio player
├── episodes.html         ← Full episode archive
├── about.html            ← About the show
├── contact.html          ← Contact form & links
├── sitemap.xml           ← For search engines
├── robots.txt            ← Crawler instructions
├── llms.txt              ← AI/LLM-friendly site map
├── ads.txt               ← Authorized ad sellers (placeholder)
├── css/
│   └── styles.css        ← All styles
├── js/
│   ├── chrome.js         ← Universal header & footer (loaded on every page)
│   └── episodes.js       ← Episode data + audio player logic
├── images/
│   ├── emblem.svg        ← Hero emblem
│   └── mountains.svg     ← Mountain silhouette
└── audio/                ← Drop MP3 files here
```

## How it works

### Universal header & footer

`js/chrome.js` injects the same nav and footer into every page. To change them, edit only `chrome.js` — every page updates automatically. Each page just needs:

```html
<div id="site-header"></div>
... page content ...
<div id="site-footer"></div>
<script src="js/chrome.js"></script>
```

### Adding / editing episodes

Edit the `EPISODES` array at the top of `js/episodes.js`. Each entry:

```js
{
  num: '05',
  title: 'Episode Title',
  description: 'One-sentence summary.',
  youtubeId: 'abc123XYZ',     // YouTube video ID (the part after v=)
  audioUrl: 'audio/ep05.mp3', // Optional - drop MP3 in /audio/ folder
  duration: '38:45',
  date: '2026-01-15'
}
```

The episode shows up in the homepage player AND the episodes grid automatically.

### Adding audio playback

1. Drop your MP3 file into the `/audio/` folder.
2. Update the `audioUrl` field for that episode in `js/episodes.js`.
3. Done — the player on the homepage will stream it.

If `audioUrl` is empty, clicking play opens an alert pointing visitors to YouTube.

### Adding YouTube embeds

Get the video ID from the YouTube URL:
- `https://youtube.com/watch?v=ABC123xyz` → ID is `ABC123xyz`

Paste it into the episode's `youtubeId` field. The episode card will embed it.

## Deployment

Upload everything to your web host's public directory (e.g. `public_html` or the root of your hosting). The site is fully static — no build step, no server-side code required.

If your hosting supports it, the SEO files at the root (`sitemap.xml`, `robots.txt`, `ads.txt`, `llms.txt`) will be served automatically.

## SEO files

- **sitemap.xml** — submit this URL to Google Search Console: `https://montanawizard.com/sitemap.xml`
- **robots.txt** — controls crawlers; AI bots are allowed by default for discoverability. Edit if you want to opt out.
- **llms.txt** — the emerging standard for telling AI assistants what your site is about.
- **ads.txt** — placeholder. Add your ad-network publisher IDs when you start running ads.

## Customization tips

- **Colors**: Edit the CSS variables at the top of `css/styles.css` (lines 13-26).
- **Fonts**: Replace the `@import` URL on line 8 of `css/styles.css` and update `--font-display` and `--font-body`.
- **Hero text**: Edit `index.html` directly.
