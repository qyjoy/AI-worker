// src/request-handler.js
import { renderHTML } from './html-renderer.js';
import { handleApiCall } from './api-handler.js';
import * as authService from './auth-service.js';
import * as adminHandler from './admin/admin-handler.js';
import * as db from './db.js';
import { corsHeaders, getBaseUrl, safeParseJson } from './utils.js';
import { optionalAuth, requireAuth, requireAdmin } from './middleware/auth-mw.js';
import { turnstileChallenge } from './middleware/turnstile-mw.js';
import { rateLimit } from './middleware/rate-limit-mw.js';
import { SESSION_COOKIE_NAME } from './config.js';

export async function handleRequest(request, env, ctx, logPrefix, isMobile) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    let responseHeaders = new Headers(corsHeaders()); // Start with CORS headers

    // Apply optional auth globally to make `request.user` available
    await optionalAuth(request, env, ctx);


    // --- OPTIONS Preflight ---
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: responseHeaders });
    }
    
    // --- Static Assets (if any, example) ---
    // if (pathname.startsWith('/static/')) { /* serve static files */ }

    // --- Authentication Routes ---
    if (pathname.startsWith('/auth/')) {
        if (pathname === '/auth/register' && request.method === 'POST') {
            const body = await safeParseJson(request);
            if (!body || !body.email || !body.password) {
                 return new Response(JSON.stringify({ message: "Email and password required." }), { status: 400, headers: responseHeaders });
            }
            const result = await authService.registerUser(env, body.email, body.password);
            return new Response(JSON.stringify(result), { status: result.success ? 201 : 400, headers: responseHeaders });
        }
        if (pathname === '/auth/login' && request.method === 'POST') {
            const body = await safeParseJson(request);
             if (!body || !body.email || !body.password) {
                 return new Response(JSON.stringify({ message: "Email and password required." }), { status: 400, headers: responseHeaders });
            }
            const result = await authService.loginUser(env, body.email, body.password);
            if (result.success) {
                const { headers: sessionHeaders } = await authService.createAndSetSession(env, ctx, result.user.id);
                sessionHeaders.forEach((value, key) => responseHeaders.append(key, value)); // Append Set-Cookie
                return new Response(JSON.stringify({ message: "Login successful", userId: result.user.id, email: result.user.email, role: result.user.role }), { status: 200, headers: responseHeaders });
            }
            return new Response(JSON.stringify(result), { status: 401, headers: responseHeaders });
        }
        if (pathname === '/auth/logout' && request.method === 'POST') {
            const authError = await requireAuth(request,env,ctx); // Requires auth & CSRF
            if (authError) return authError;

            const logoutCookieHeaders = await authService.logoutUser(env, request);
            logoutCookieHeaders.forEach((value, key) => responseHeaders.append(key, value));
            return new Response(JSON.stringify({ message: "Logout successful" }), { status: 200, headers: responseHeaders });
        }
    }
    
    // --- API for initial data for frontend ---
    if (pathname === '/api/initial-data' && request.method === 'GET') {
        const apiLines = await db.getActiveApiKeys(env.DB);
        const data = { apiLines };
        if (request.user && request.user.isLoggedIn) {
            data.user = { email: request.user.email, coins: request.user.coins, role: request.user.role };
            data.csrfToken = request.user.data.csrfToken; // Send CSRF token to client
        }
        // data.turnstileSiteKey = env.TURNSTILE_SITE_KEY; // Send if configured in env
        return new Response(JSON.stringify(data), { status: 200, headers: responseHeaders });
    }


    // --- Chat API Endpoint ---
    if (pathname === '/chat-api' && request.method === 'POST') {
        // Middleware execution order: auth (optional for user obj) -> rate limit -> turnstile -> main handler
        const rateLimitResponse = await rateLimit(request, env, ctx);
        if (rateLimitResponse) return rateLimitResponse;

        const turnstileResponse = await turnstileChallenge(request, env, ctx);
        if (turnstileResponse) return turnstileResponse;
        
        // handleApiCall needs request.user to be populated by optionalAuth
        return handleApiCall(request, env, ctx, logPrefix);
    }

    // --- Admin Panel Routes ---
    if (pathname.startsWith('/admin')) {
        return adminHandler.handleAdminRequest(request, env, ctx, logPrefix);
    }
    

    // --- Serve HTML for GET / ---
    if (request.method === "GET" && pathname === "/") {
        try {
            const html = renderHTML(isMobile, env); // Pass env for Turnstile site key
            responseHeaders.set("Content-Type", "text/html; charset=utf-8");
            return new Response(html, { headers: responseHeaders });
        } catch (e) {
            console.error(logPrefix + " Error rendering HTML:", e);
            responseHeaders.set("Content-Type", "text/plain; charset=utf-8");
            return new Response("Internal Server Error rendering page.", { status: 500, headers: responseHeaders });
        }
    }

    // --- Method Not Allowed / Not Found ---
    responseHeaders.set("Content-Type", "text/plain; charset=utf-8");
    if (request.method !== "GET") responseHeaders.set("Allow", "GET, POST, OPTIONS"); // Adjust based on actual allowed methods
    return new Response("Not Found or Method Not Allowed", { status: 404, headers: responseHeaders });
}