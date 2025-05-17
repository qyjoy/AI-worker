// worker.js
// Main entry point for the Cloudflare Worker.

import { handleRequest } from './request-handler.js';

export default {
  async fetch(request, env, ctx) {
    const requestId = request.headers.get('cf-ray') || crypto.randomUUID();
    const logPrefix = "[" + requestId + "]";
       const userAgent = request.headers.get('User-Agent') || '';
  // Simple mobile detection
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    console.log(logPrefix + " Worker received request: " + request.method + " " + request.url + (isMobile ? " (Mobile UA detected)" : ""));

        // Pass the isMobile flag to handleRequest
    return handleRequest(request, env, ctx, logPrefix, isMobile);
  }
};