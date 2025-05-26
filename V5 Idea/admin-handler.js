// src/admin/admin-handler.js
import { renderAdminPage, renderAdminLoginForm } from './admin-html.js';
import { requireAdmin } from '../middleware/auth-mw.js';
import * as db from '../db.js';
import { corsHeaders, safeParseJson } from '../utils.js';

export async function handleAdminRequest(request, env, ctx, logPrefix) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    let responseHeaders = new Headers(corsHeaders());
    responseHeaders.set('Content-Type', 'text/html; charset=utf-8');


    // Check if admin is authenticated for any /admin path except potentially /admin/login
    if (pathname !== '/admin/login') { // Login page itself doesn't require prior auth
        const adminAuthError = await requireAdmin(request, env, ctx);
        if (adminAuthError) {
            // If HTML is expected, redirect to login or show an error page
            // For API-like admin actions, it returns JSON error.
            // For simplicity here, if it's a GET, we might try to render login.
            if (request.method === 'GET' && adminAuthError.status === 401) {
                 return new Response(renderAdminLoginForm("Session expired or not logged in as admin."), { status: 401, headers: responseHeaders });
            }
            return adminAuthError; // Return JSON error for non-GET or if already forbidden
        }
    }


    if (request.method === 'GET') {
        if (pathname === '/admin' || pathname === '/admin/') {
            // Fetch data needed for admin dashboard
            const users = await db.getAllUsers(env.DB);
            const apiKeys = await db.getAllApiKeysAdmin(env.DB);
            const modelCosts = await db.getAllModelCostsAdmin(env.DB);
            const appSettings = await db.getAllAppSettings(env.DB);
            
            const html = renderAdminPage({ users, apiKeys, modelCosts, appSettings, csrfToken: request.user.data.csrfToken });
            return new Response(html, { headers: responseHeaders });
        }
        // Add more GET routes for specific admin views if needed
    }

    if (request.method === 'POST') {
        // Example: Update app settings
        if (pathname === '/admin/settings/update') {
            const formData = await request.formData(); // Or JSON body
            const settingKey = formData.get('setting_key');
            const settingValue = formData.get('setting_value');
            if (settingKey && settingValue) {
                await db.updateAppSetting(env.DB, settingKey, settingValue);
                // Redirect back to admin page or send success
                return Response.redirect(new URL('/admin', request.url).toString(), 303);
            }
            return new Response("Missing data for setting update.", { status: 400, headers: responseHeaders });
        }

        // Example: Add API Key
        if (pathname === '/admin/apikeys/add') {
            const formData = await request.formData();
            const lineName = formData.get('line_name');
            const keyValue = formData.get('api_key_value');
            const isActive = formData.get('is_active') === 'on'; // Checkbox
            const notes = formData.get('notes');
            if (lineName && keyValue) {
                await db.addApiKeyAdmin(env.DB, lineName, keyValue, isActive, notes);
                return Response.redirect(new URL('/admin', request.url).toString(), 303);
            }
             return new Response("Missing data for API key.", { status: 400, headers: responseHeaders });
        }
        // Add more POST routes for other admin actions (update user, delete API key, etc.)
    }

    responseHeaders.set('Content-Type', 'text/plain');
    return new Response("Admin action not found.", { status: 404, headers: responseHeaders });
}