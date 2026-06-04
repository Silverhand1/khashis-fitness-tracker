# PWA Skill

How to make this app installable on iPhone:

1. `public/manifest.json` must have: name, short_name, start_url, display: standalone, background_color, theme_color, icons
2. Icons needed: 192x192 and 512x512 PNG
3. In `index.html`: `<link rel="manifest" href="/manifest.json">` and `<meta name="apple-mobile-web-app-capable" content="yes">`
4. Service worker optional for this app (localStorage works offline by default)
5. To install on iPhone: Safari → Share → Add to Home Screen
