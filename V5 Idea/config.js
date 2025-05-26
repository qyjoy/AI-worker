// src/config.js
export const SESSION_COOKIE_NAME = "__Host-session-id"; // Using __Host- prefix for security
export const CSRF_HEADER_NAME = "X-CSRF-Token";
export const TURNSTILE_CHALLENGE_NEEDED_KEY = "turnstile_challenge_needed";
export const TURNSTILE_TOKEN_KEY = "cf-turnstile-response"; // Default from Turnstile

// Max age for session cookie (e.g., 7 days)
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

// Models that don't use streaming SSE
export const NON_STREAMING_MODELS = [
    "gemini-2.0-flash-preview-image-generation",
    "veo-2.0-generate-001"
];

export const MODEL_ENDPOINTS = {
    "gemini-2.0-flash-preview-image-generation": "generateContent",
    "veo-2.0-generate-001": "generateVideo", // Or specific endpoint for Veo
    // Default for others
    "DEFAULT": "streamGenerateContent"
};

export const API_VERSION = "v1beta";