// worker.js
// Main entry point for the Cloudflare Worker.

import { handleRequest } from './request-handler.js';

export default {
  async fetch(request, env, ctx) {
    const requestId = request.headers.get('cf-ray') || crypto.randomUUID();
    const logPrefix = "[" + requestId + "]";

    console.log(logPrefix + " Worker received request: " + request.method + " " + request.url);

    return handleRequest(request, env, ctx, logPrefix);
  }
};