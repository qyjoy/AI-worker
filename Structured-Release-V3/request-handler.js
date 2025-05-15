// request-handler.js
// Handles incoming requests, routing, and basic validation.
import { renderHTML } from './html-renderer.js';
import { handleApiCall } from './api-handler.js';
import { corsHeaders } from './utils.js';

export async function handleRequest(request, env, ctx, logPrefix) {
  // --- API Key Check ---
  const GEMINI_API_KEY = env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 30) {
    console.error(`${logPrefix} CRITICAL ERROR: API Key 未配置或无效`);
    return new Response("Server Configuration Error: Invalid API Key.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
    });
  }

  // --- CORS Preflight ---
  if (request.method === "OPTIONS") {
    console.log(`${logPrefix} Responding to OPTIONS request.`);
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  // --- Serve HTML for GET ---
  if (request.method === "GET") {
    console.log(`${logPrefix} Responding to GET request with HTML.`);
    try {
      const html = renderHTML();
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders() },
      });
    } catch (e) {
      console.error(`${logPrefix} Error rendering HTML:`, e);
      return new Response("Internal Server Error rendering page.", { status: 500, headers: corsHeaders() });
    }
  }

  // --- Handle POST for API calls ---
  if (request.method === "POST") {
    return handleApiCall(request, env, logPrefix);
  }

  // --- Method Not Allowed ---
  console.log(`${logPrefix} Method Not Allowed: ${request.method}`);
  return new Response("Method Not Allowed", {
    status: 405,
    headers: { "Allow": "GET, POST, OPTIONS", ...corsHeaders() }
  });
}
