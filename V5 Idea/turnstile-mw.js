// src/middleware/turnstile-mw.js
import * as db from '../db.js';
import { getIpAddress } from '../utils.js';
import { TURNSTILE_CHALLENGE_NEEDED_KEY, TURNSTILE_TOKEN_KEY } from '../config.js';


async function verifyTurnstileToken(token, secretKey, ip) {
    const body = `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}&remoteip=${encodeURIComponent(ip)}`;
    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error("Turnstile verification failed:", error);
        return false;
    }
}


export async function turnstileChallenge(request, env, ctx) {
    if (request.method !== 'POST' || !request.url.includes('/chat-api')) { // Only for chat POSTs
        return; // Skip for other requests
    }

    const userIdentifier = request.user && request.user.isLoggedIn ? request.user.user_id.toString() : getIpAddress(request);
    const turnstileThreshold = parseInt(await db.getAppSetting(env.DB, 'turnstile_threshold') || '3', 10);
    
    let requestCount = 0;
    if (request.user && request.user.isLoggedIn) {
        const userRecord = await db.getUserById(env.DB, request.user.user_id);
        requestCount = userRecord ? userRecord.request_count_since_last_turnstile : 0;
    } else {
        // For anonymous users, this is trickier. KV might be better for IP-based counts.
        // For simplicity, this example focuses on logged-in users for persistent count.
        // A session-based counter for anonymous users could be an alternative.
        // Or, always challenge anonymous users after N requests in a short window.
        // For now, let's assume if not logged in, they might be challenged more often or this logic is simplified.
        // This example will assume for anonymous, we don't track persistent count across multiple requests easily without sessions.
        // So, we can check a session variable or a short-lived KV store.
        // Let's assume for anonymous we set a session cookie that turnstile is needed.
    }
    
    if (requestCount >= turnstileThreshold) {
        const turnstileToken = request.headers.get(TURNSTILE_TOKEN_KEY) || (await request.clone().formData()).get(TURNSTILE_TOKEN_KEY); // Check header or form data

        if (!turnstileToken) {
            // Signal to client that Turnstile challenge is needed
            const responseBody = { error: "Turnstile challenge required.", [TURNSTILE_CHALLENGE_NEEDED_KEY]: true };
            return new Response(JSON.stringify(responseBody), { 
                status: 403, 
                headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
            });
        }

        const ip = getIpAddress(request);
        const turnstileSecret = env.TURNSTILE_SECRET_KEY; // This MUST be set as a secret in Wrangler/Cloudflare Dashboard

        if (!turnstileSecret) {
            console.error("CRITICAL: TURNSTILE_SECRET_KEY is not set in environment.");
            return new Response(JSON.stringify({ error: "Server configuration error: Turnstile secret missing." }), { 
                status: 500, 
                headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
            });
        }
        
        const isValid = await verifyTurnstileToken(turnstileToken, turnstileSecret, ip);

        if (!isValid) {
            return new Response(JSON.stringify({ error: "Invalid Turnstile token. Please try again." }), { 
                status: 403, 
                headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
            });
        }

        // Reset count if successful
        if (request.user && request.user.isLoggedIn) {
            await db.resetUserRequestCount(env.DB, request.user.user_id);
        }
    }

    // Increment count for next time (only for logged-in users in this simplified persistent model)
    if (request.user && request.user.isLoggedIn) {
        await db.incrementUserRequestCount(env.DB, request.user.user_id);
    }
}