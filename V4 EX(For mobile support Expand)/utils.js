// utils.js
// Utility functions for the worker.

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization", 
  };
}