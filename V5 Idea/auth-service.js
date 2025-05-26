// src/auth-service.js
import { hashPassword, verifyPassword, generateRandomString } from './utils.js';
import * as db from './db.js';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS, CSRF_HEADER_NAME } from './config.js';

export async function registerUser(env, email, password) {
    if (!email || !password) {
        return { success: false, message: "Email and password are required." };
    }
    if (password.length < 8) {
        return { success: false, message: "Password must be at least 8 characters long." };
    }

    const existingUser = await db.getUserByEmail(env.DB, email);
    if (existingUser) {
        return { success: false, message: "User with this email already exists." };
    }

    // In a real app, generate and store a unique salt per user.
    // For this example, we're simplifying and might use a part of APP_SECRET.
    // THIS IS NOT SECURE FOR PRODUCTION. YOU MUST USE UNIQUE SALTS.
    const salt = env.APP_SECRET.substring(0, 16); // Example: using part of app secret as salt (BAD PRACTICE)
    const hashedPassword = await hashPassword(password, salt);

    const userId = await db.createUser(env.DB, email, hashedPassword);
    if (!userId) {
        return { success: false, message: "Failed to create user account." };
    }
    return { success: true, userId, message: "User registered successfully." };
}

export async function loginUser(env, email, password) {
    const user = await db.getUserByEmail(env.DB, email);
    if (!user) {
        return { success: false, message: "Invalid email or password." };
    }

    // Retrieve salt (assuming it's stored or derived consistently)
    const salt = env.APP_SECRET.substring(0, 16); // Example: using part of app secret as salt (BAD PRACTICE)
    const passwordMatch = await verifyPassword(password, salt, user.password_hash);

    if (!passwordMatch) {
        return { success: false, message: "Invalid email or password." };
    }

    // Update last login time
    const stmt = env.DB.prepare("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?");
    await stmt.bind(user.id).run();
    
    return { success: true, user };
}

export async function createAndSetSession(env, ctx, userId) {
    const sessionId = generateRandomString(64);
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
    const csrfToken = generateRandomString(32);

    await db.createSession(env.DB, userId, sessionId, expiresAt, { csrfToken });

    const cookieOptions = {
        path: '/',
        httpOnly: true,
        secure: new URL(ctx.request.url).protocol === 'https:', // True if HTTPS
        sameSite: 'Lax',
        expires: expiresAt,
    };
    
    // `context.cookie` would be from a framework like Hono. Manually setting headers:
    const headers = new Headers();
    headers.append('Set-Cookie', `${SESSION_COOKIE_NAME}=${sessionId}; ${Object.entries(cookieOptions).map(([k,v]) => {
        if (typeof v === 'boolean') return v ? k : '';
        if (v instanceof Date) return `${k}=${v.toUTCString()}`;
        return `${k}=${v}`;
    }).filter(Boolean).join('; ')}`);

    return { sessionId, csrfToken, headers };
}

export async function logoutUser(env, request) {
    const sessionId = getSessionIdFromCookie(request);
    if (sessionId) {
        await db.deleteSession(env.DB, sessionId);
    }
    // Expire the cookie
    const headers = new Headers();
    headers.append('Set-Cookie', `${SESSION_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`);
    return headers;
}

export function getSessionIdFromCookie(request) {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return null;
    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === SESSION_COOKIE_NAME) {
            return value;
        }
    }
    return null;
}

export async function verifyCsrfToken(session, request) {
    if (!session || !session.data || !session.data.csrfToken) return false;
    const requestCsrfToken = request.headers.get(CSRF_HEADER_NAME);
    return session.data.csrfToken === requestCsrfToken;
}