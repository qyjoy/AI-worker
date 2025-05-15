// worker.js
// Main entry point for the Cloudflare Worker.

import { handleRequest } from './request-handler.js';

export default {
  async fetch(request, env, ctx) {
    // Assign a unique ID for request tracing
    const requestId = request.headers.get('cf-ray') || crypto.randomUUID();
    const logPrefix = `[${requestId}]`;

    console.log(`${logPrefix} Worker received request: ${request.method} ${request.url}`);

    // Delegate to the request handler
    return handleRequest(request, env, ctx, logPrefix);
  }
};
