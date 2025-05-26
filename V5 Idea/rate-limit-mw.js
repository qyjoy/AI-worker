// src/middleware/rate-limit-mw.js
import * as db from '../db.js';
import { getIpAddress } from '../utils.js';
import { corsHeaders } from '../utils.js'; // Import corsHeaders

export async function rateLimit(request, env, ctx) {
    if (request.method !== 'POST' || !request.url.includes('/chat-api')) { // Only for chat POSTs
        return; // Skip
    }
    
    const userIdentifier = request.user && request.user.isLoggedIn ? request.user.user_id.toString() : getIpAddress(request);
    
    const limit = parseInt(await db.getAppSetting(env.DB, 'rate_limit_requests') || '5', 10);
    const windowSeconds = parseInt(await db.getAppSetting(env.DB, 'rate_limit_window_seconds') || '60', 10);

    const currentRequests = await db.countRecentUserRequests(env.DB, userIdentifier, windowSeconds);

    if (currentRequests >= limit) {
        return new Response(JSON.stringify({ error: `Rate limit exceeded. Please try again in ${windowSeconds} seconds.` }), {
            status: 429,
            headers: { ...corsHeaders(), 'Content-Type': 'application/json', 'Retry-After': windowSeconds.toString() }
        });
    }
    await db.logUserRequest(env.DB, userIdentifier);
}