/**
 * Cloudflare Worker: forwards a browser request to a Discord incoming webhook.
 *
 * Why this exists: Discord webhook endpoints do not send CORS headers, so a static
 * GitHub Pages page cannot POST directly to them. Deploy this Worker, put its URL
 * in discord-webhook.html (for example https://your-worker.workers.dev), and the
 * page will POST { url, payload } to /webhook.
 *
 * Deploy:
 *   1. Cloudflare dashboard -> Workers & Pages -> Create Worker.
 *   2. Paste this file, save, deploy.
 *   3. Optionally add a secret/allowed origin below.
 */

const ALLOWED_ORIGINS = [
  "https://drillsandpiecesapp.github.io",
  "http://localhost",
  "http://127.0.0.1"
];

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.some((o) => origin === o || origin.startsWith(o + ":"));
  return {
    "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(body, status, request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(request) }
  });
}

export default {
  async fetch(request) {
    const headers = corsHeaders(request);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, request);
    }

    let data;
    try {
      data = await request.json();
    } catch (_) {
      return json({ error: "Invalid JSON body" }, 400, request);
    }

    const url = (data && data.url) || "";
    const payload = data && data.payload;
    if (!/^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[\w-]+$/i.test(url)) {
      return json({ error: "Invalid Discord webhook URL" }, 400, request);
    }
    if (!payload || typeof payload !== "object") {
      return json({ error: "Missing payload object" }, 400, request);
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const text = await response.text();
      // Discord normally answers 204 with no body; a Response with that status
      // is not allowed to have one.
      if (response.status === 204 || !text) {
        return new Response(null, { status: response.status || 204, headers });
      }
      return new Response(text, {
        status: response.status,
        headers: {
          "Content-Type": response.headers.get("Content-Type") || "application/json",
          ...headers
        }
      });
    } catch (err) {
      return json({ error: "Could not reach Discord: " + err.message }, 502, request);
    }
  }
};
