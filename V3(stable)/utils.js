// utils.js
// Utility functions for the worker.

export function corsHeaders() {
    return {
      "Access-Control-Allow-Origin": "*", // WARNING: Restrict this in production for security
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization", // Added Authorization as an example, include any other custom headers
    };
  }
  