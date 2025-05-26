-- Drop tables if they exist for a clean setup (optional, be careful in prod)
DROP TABLE IF EXISTS user_request_logs;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS model_costs;
DROP TABLE IF EXISTS api_keys;
DROP TABLE IF EXISTS app_settings;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    coins INTEGER DEFAULT 50,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    request_count_since_last_turnstile INTEGER DEFAULT 0, -- For Turnstile trigger
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    line_name TEXT UNIQUE NOT NULL,
    api_key_value TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_api_keys_line_name ON api_keys (line_name);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys (is_active);


CREATE TABLE IF NOT EXISTS model_costs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_name TEXT UNIQUE NOT NULL,
    cost_per_request INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);
CREATE INDEX IF NOT EXISTS idx_model_costs_model_name ON model_costs (model_name);

CREATE TABLE IF NOT EXISTS app_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_request_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_identifier TEXT NOT NULL, -- user_id if logged in, IP otherwise
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_request_logs_identifier_timestamp ON user_request_logs (user_identifier, timestamp);

CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    data TEXT, -- Store additional session data if needed (e.g., CSRF token)
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions (expires_at);

-- Initial Admin User (Change email and password during setup)
-- Password: 'adminpassword' (Hashed version needs to be inserted after first run or manually)
-- For now, insert a placeholder, then update it after running a script to hash 'adminpassword'
INSERT OR IGNORE INTO users (email, password_hash, role, coins) VALUES
    ('admin@example.com', 'placeholder_password_hash', 'admin', 99999);

-- Default Settings
INSERT OR IGNORE INTO app_settings (setting_key, setting_value, description) VALUES
    ('turnstile_threshold', '3', 'Number of POST requests before triggering Turnstile for a user session/IP.'),
    ('rate_limit_requests', '5', 'Max requests for rate limiting.'),
    ('rate_limit_window_seconds', '60', 'Time window in seconds for rate limiting (e.g., 5 requests per 60 seconds).'),
    ('default_coins_on_register', '50', 'Coins new users receive upon registration.');
    -- TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY are better managed as env secrets

-- Default Model Costs (examples)
INSERT OR IGNORE INTO model_costs (model_name, cost_per_request) VALUES
    ('gemini-2.0-flash', 1),
    ('gemini-2.5-flash-preview-04-17', 2),
    ('gemini-2.5-pro-preview-05-06', 5),
    ('gemini-2.0-flash-preview-image-generation', 3),
    ('veo-2.0-generate-001', 10);

-- Initial API Key (Admin should add real keys via Admin Panel or direct D1 insert)
INSERT OR IGNORE INTO api_keys (line_name, api_key_value, is_active, notes) VALUES
    ('Default Line (Gemini Pro 1.0 - Needs Update)', 'YOUR_GEMINI_API_KEY_PLACEHOLDER', TRUE, 'Update this with a valid AI API Key.');