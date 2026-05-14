/// <reference types="@cloudflare/workers-types" />

import redirects from "./generated/redirects.json";

interface Env {
  ASSETS: Fetcher;
  CLICKS: AnalyticsEngineDataset;
}

const map = redirects as Record<string, string>;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const m = url.pathname.match(/^\/out\/([a-z0-9-]+)\/?$/);

    if (m) {
      const slug = m[1];
      const target = map[slug];
      if (!target) {
        return new Response("Unknown link", { status: 404 });
      }

      try {
        env.CLICKS.writeDataPoint({
          blobs: [
            request.cf?.country?.toString() ?? "",
            request.headers.get("user-agent") ?? "",
            request.headers.get("referer") ?? "",
          ],
          indexes: [slug],
        });
      } catch {
        // analytics is best-effort; never block the redirect
      }

      return new Response(null, {
        status: 302,
        headers: {
          Location: target,
          "Cache-Control": "no-store",
          "Referrer-Policy": "no-referrer",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
