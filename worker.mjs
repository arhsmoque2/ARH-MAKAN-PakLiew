/**
 * Pak Liew Chinese Muslim Restaurant PWA - Cloudflare Workers Edge Router
 * Serves static assets at edge with zero-build latency.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Direct root request to index.html
    const targetRequest = (url.pathname === '/' || url.pathname === '')
      ? new Request(`${url.origin}/index.html`, request)
      : request;

    return await env.ASSETS.fetch(targetRequest);
  }
};
