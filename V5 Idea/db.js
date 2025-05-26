// src/db.js

// --- User Functions ---
export async function getUserByEmail(db, email) {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return await stmt.bind(email).first();
}

export async function getUserById(db, userId) {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    return await stmt.bind(userId).first();
}

export async function createUser(db, email, hashedPassword, saltForPassword) { // Salt should be generated per user
    // In a real app, you'd store the salt with the user.
    // For simplicity here, assuming salt might be part of APP_SECRET or a fixed value for demo.
    // Better: generate salt, store it like: `password_hash_pbkdf2_sha256$iterations$salt$hash`
    // Or have a separate salt column. For this example, password_hash includes this.
    const defaultCoins = await getAppSetting(db, 'default_coins_on_register') || 50;
    const stmt = db.prepare("INSERT INTO users (email, password_hash, coins, role) VALUES (?, ?, ?, 'user') RETURNING id");
    try {
        const { results } = await stmt.bind(email, hashedPassword, parseInt(defaultCoins,10)).run();
        return results && results.length > 0 ? results[0].id : null;
    } catch (e) {
        if (e.message.includes("UNIQUE constraint failed")) {
            return null; // User already exists
        }
        throw e;
    }
}

export async function updateUserCoins(db, userId, newCoinAmount) {
    const stmt = db.prepare("UPDATE users SET coins = ? WHERE id = ?");
    return await stmt.bind(newCoinAmount, userId).run();
}

export async function incrementUserRequestCount(db, userId) {
    const stmt = db.prepare("UPDATE users SET request_count_since_last_turnstile = request_count_since_last_turnstile + 1 WHERE id = ?");
    return await stmt.bind(userId).run();
}

export async function resetUserRequestCount(db, userId) {
    const stmt = db.prepare("UPDATE users SET request_count_since_last_turnstile = 0 WHERE id = ?");
    return await stmt.bind(userId).run();
}

// --- API Key Functions ---
export async function getActiveApiKeys(db) {
    const stmt = db.prepare("SELECT id, line_name, api_key_value FROM api_keys WHERE is_active = TRUE ORDER BY id");
    return await stmt.all().then(res => res.results);
}

export async function getApiKeyById(db, keyId) {
    const stmt = db.prepare("SELECT id, line_name, api_key_value FROM api_keys WHERE id = ? AND is_active = TRUE");
    return await stmt.bind(keyId).first();
}

// --- Model Cost Functions ---
export async function getModelCost(db, modelName) {
    const stmt = db.prepare("SELECT cost_per_request FROM model_costs WHERE model_name = ?");
    const result = await stmt.bind(modelName).first();
    return result ? result.cost_per_request : 1; // Default to 1 if not found
}

// --- App Settings Functions ---
export async function getAppSetting(db, settingKey) {
    const stmt = db.prepare("SELECT setting_value FROM app_settings WHERE setting_key = ?");
    const result = await stmt.bind(settingKey).first();
    return result ? result.setting_value : null;
}

export async function getAllAppSettings(db) {
    const stmt = db.prepare("SELECT setting_key, setting_value, description FROM app_settings");
    return await stmt.all().then(res => res.results);
}

export async function updateAppSetting(db, settingKey, settingValue) {
    const stmt = db.prepare("UPDATE app_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?");
    return await stmt.bind(settingValue, settingKey).run();
}


// --- Session Functions ---
export async function createSession(db, userId, sessionId, expiresAt, data = null) {
    const stmt = db.prepare("INSERT INTO sessions (session_id, user_id, expires_at, data) VALUES (?, ?, ?, ?)");
    await stmt.bind(sessionId, userId, expiresAt.toISOString(), JSON.stringify(data)).run();
}

export async function getSession(db, sessionId) {
    const stmt = db.prepare("SELECT s.*, u.email, u.role, u.coins FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.session_id = ? AND s.expires_at > CURRENT_TIMESTAMP");
    const session = await stmt.bind(sessionId).first();
    if (session && session.data) {
        try {
            session.data = JSON.parse(session.data);
        } catch (e) {
            console.error("Failed to parse session data:", e);
            session.data = {};
        }
    }
    return session;
}

export async function deleteSession(db, sessionId) {
    const stmt = db.prepare("DELETE FROM sessions WHERE session_id = ?");
    await stmt.bind(sessionId).run();
}

export async function deleteExpiredSessions(db) {
    // This could be run periodically if desired, e.g., in a scheduled worker
    const stmt = db.prepare("DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP");
    await stmt.run();
}

// --- Rate Limiting Log ---
export async function logUserRequest(db, userIdentifier) {
    const stmt = db.prepare("INSERT INTO user_request_logs (user_identifier) VALUES (?)");
    await stmt.bind(userIdentifier).run();
}

export async function countRecentUserRequests(db, userIdentifier, windowSeconds) {
    const dateOffset = new Date(Date.now() - windowSeconds * 1000).toISOString();
    const stmt = db.prepare("SELECT COUNT(*) as count FROM user_request_logs WHERE user_identifier = ? AND timestamp > ?");
    const result = await stmt.bind(userIdentifier, dateOffset).first();
    return result ? result.count : 0;
}

export async function cleanupOldRequestLogs(db, olderThanSeconds) {
    // Run periodically
    const dateOffset = new Date(Date.now() - olderThanSeconds * 1000).toISOString();
    const stmt = db.prepare("DELETE FROM user_request_logs WHERE timestamp <= ?");
    await stmt.bind(dateOffset).run();
}

// --- Admin Panel Specific DB Functions ---
export async function getAllUsers(db) {
    const stmt = db.prepare("SELECT id, email, coins, role, created_at, last_login_at FROM users ORDER BY id");
    return await stmt.all().then(res => res.results);
}

export async function updateUserAdmin(db, userId, email, coins, role) {
    const stmt = db.prepare("UPDATE users SET email = ?, coins = ?, role = ? WHERE id = ?");
    return await stmt.bind(email, coins, role, userId).run();
}

export async function getAllApiKeysAdmin(db) {
    const stmt = db.prepare("SELECT * FROM api_keys ORDER BY id");
    return await stmt.all().then(res => res.results);
}

export async function addApiKeyAdmin(db, lineName, apiKeyValue, isActive, notes) {
    const stmt = db.prepare("INSERT INTO api_keys (line_name, api_key_value, is_active, notes) VALUES (?, ?, ?, ?)");
    return await stmt.bind(lineName, apiKeyValue, isActive, notes).run();
}
export async function updateApiKeyAdmin(db, id, lineName, apiKeyValue, isActive, notes) {
    const stmt = db.prepare("UPDATE api_keys SET line_name = ?, api_key_value = ?, is_active = ?, notes = ? WHERE id = ?");
    return await stmt.bind(lineName, apiKeyValue, isActive, notes, id).run();
}
export async function deleteApiKeyAdmin(db, id) {
    const stmt = db.prepare("DELETE FROM api_keys WHERE id = ?");
    return await stmt.bind(id).run();
}

export async function getAllModelCostsAdmin(db) {
    const stmt = db.prepare("SELECT * FROM model_costs ORDER BY model_name");
    return await stmt.all().then(res => res.results);
}
export async function updateModelCostAdmin(db, modelName, cost) {
    const stmt = db.prepare("INSERT OR REPLACE INTO model_costs (model_name, cost_per_request, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)");
    return await stmt.bind(modelName, cost).run();
}