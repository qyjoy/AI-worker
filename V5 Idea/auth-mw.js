// src/middleware/auth-mw.js
import { getSessionIdFromCookie, verifyCsrfToken } from '../auth-service.js';
import * as db from '../db.js';
import { CSRF_HEADER_NAME } from '../config.js';

// Attaches user to request.user if logged in
export async function optionalAuth(request, env, ctx) {
    const sessionId = getSessionIdFromCookie(request);
    if (sessionId) {
        const session = await db.getSession(env.DB, sessionId);
        if (session) {
            request.user = session; // Attach full session object which includes user details
            request.user.isLoggedIn = true;
        } else {
            request.user = { isLoggedIn: false }; // Invalid or expired session
        }
    } else {
        request.user = { isLoggedIn: false };
    }
}

// Requires authentication
export async function requireAuth(request, env, ctx) {
    await optionalAuth(request, env, ctx);
    if (!request.user || !request.user.isLoggedIn) {
        return new Response("Unauthorized: Authentication required.", { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    // CSRF protection for POST, PUT, DELETE by authenticated users
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
        const csrfValid = await verifyCsrfToken(request.user, request);
        if (!csrfValid) {
            return new Response("Forbidden: Invalid CSRF token.", { status: 403, headers: { 'Content-Type': 'application/json' }});
        }
    }
}

// Requires admin role
export async function requireAdmin(request, env, ctx) {
    const authError = await requireAuth(request, env, ctx);
    if (authError) return authError;

    if (request.user.role !== 'admin') {
        return new Response("Forbidden: Admin access required.", { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
}