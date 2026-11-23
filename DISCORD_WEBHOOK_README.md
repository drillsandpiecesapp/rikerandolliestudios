# Discord Webhook Embed Builder

Static page for building Discord incoming-webhook embeds and sending them from GitHub Pages.

## Files

- `discord-webhook.html` — the builder. Open it directly in a browser or publish it to GitHub Pages.
- `discord-proxy-worker.js` — optional Cloudflare Worker that makes browser sending possible.

## Why a proxy is needed

Discord webhook endpoints do **not** send CORS headers. A `fetch()` from a `github.io` page is blocked by the browser before Discord receives it. The page therefore supports two modes:

1. **Copy JSON** — always works. Paste the JSON into `curl`, Postman, or any server-side script.
2. **Send to Discord** — works when you deploy the tiny Cloudflare Worker and paste its URL into the page.

The webhook URL is never hardcoded in the page. With "Remember URL" checked it is stored only in your browser's localStorage.

## Setup

1. In Discord, open **Server Settings → Integrations → Webhooks → New Webhook**, choose a channel, and copy the webhook URL.
2. Deploy `discord-proxy-worker.js`:
   - Cloudflare dashboard → **Workers & Pages** → **Create Worker**.
   - Paste the file contents, deploy, and copy the worker URL (for example `https://your-worker.workers.dev`).
3. Open `discord-webhook.html` (or its GitHub Pages URL).
4. Paste the Discord webhook URL into **Discord webhook URL**.
5. Paste the worker URL into **Proxy endpoint URL** and leave **Use proxy** checked.
6. Build an embed, then click **Send to Discord**.

If you only want the JSON, leave **Use proxy** unchecked and click **Copy JSON**.

## Embed support

The builder covers all user-settable fields of a Discord `rich` embed:

- title, description, URL
- color (picker and hex; converted to Discord's decimal integer)
- author name, URL, icon URL
- thumbnail URL, image URL
- footer text and icon URL
- timestamp (inserted when sending)
- up to 25 fields per embed, each with name, value, and inline flag
- up to 10 embeds per message

Message-level options: content (2000 chars), username override, avatar URL, text-to-speech, and mention suppression (`allowed_mentions.parse: []`).

Character limits are checked before sending: embed titles 256, descriptions 4096, field names 256, field values 1024, footer 2048, 25 fields per embed, 10 embeds, and 6000 total embed characters.

## Security notes

- Anyone with the webhook URL can post to that channel. Do not commit the URL to the repo.
- The Worker validates that the URL is a Discord webhook URL, but it has no authentication. Restrict `ALLOWED_ORIGINS` in `discord-proxy-worker.js` to your GitHub Pages origin before wide use if you care about others reusing the endpoint.
- The webhook URL is stored in localStorage only when **Remember URL** is checked.
