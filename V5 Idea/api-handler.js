// src/api-handler.js
import { corsHeaders } from './utils.js';
import * as db from './db.js';
import { NON_STREAMING_MODELS, MODEL_ENDPOINTS, API_VERSION } from './config.js';

export async function handleApiCall(request, env, ctx, logPrefix) {
    console.log(logPrefix + " Processing POST request for API call.");

    let requestBody;
    try {
        requestBody = await request.json();
    } catch (e) {
        console.error(logPrefix + " Invalid JSON body:", e);
        return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
            status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
    }

    const { model, history, currentTurnParts, apiLineId /*, customApiKey (removed, use lines) */ } = requestBody;

    // --- User Authentication & Coin Check ---
    if (!request.user || !request.user.isLoggedIn) {
        // Allow anonymous access if configured, or enforce login
        // For this example, let's assume some free tier for anonymous or block
        // console.warn(logPrefix + " Anonymous user attempting API call. Configure policy.");
        // return new Response(JSON.stringify({ error: "Login required for API access." }), {
        //     status: 401, headers: { "Content-Type": "application/json", ...corsHeaders() }
        // });
        // For now, let's say anonymous users have 0 coins implicitly
        if (request.user) request.user.coins = 0; // Ensure coins property exists
    }
    
    const modelCost = await db.getModelCost(env.DB, model);
    if (request.user && request.user.isLoggedIn && request.user.coins < modelCost) {
        return new Response(JSON.stringify({ error: `Insufficient coins. This action costs ${modelCost} coins, you have ${request.user.coins}.` }), {
            status: 402, // Payment Required
            headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
    }


    if (!model || !currentTurnParts || !Array.isArray(currentTurnParts)) {
        return new Response(JSON.stringify({ error: "Missing model or currentTurnParts." }), {
            status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
    }

    // Fetch all model names from model_costs table for validation
    const allModelsFromDB = await db.getAllModelCostsAdmin(env.DB); // Re-use admin function
    const allowedModels = allModelsFromDB.map(m => m.model_name);


    if (!allowedModels.includes(model)) {
        return new Response(JSON.stringify({ error: `Invalid model selected: ${model}.` }), {
            status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
    }

    let AI_API_KEY;
    if (apiLineId) {
        const apiKeyRecord = await db.getApiKeyById(env.DB, apiLineId);
        if (!apiKeyRecord) {
            return new Response(JSON.stringify({ error: "Selected API line not found or inactive." }), {
                status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() }
            });
        }
        AI_API_KEY = apiKeyRecord.api_key_value;
    } else {
        // Fallback: try to get the first active API key if no line selected
        const activeKeys = await db.getActiveApiKeys(env.DB);
        if (!activeKeys || activeKeys.length === 0) {
             return new Response(JSON.stringify({ error: "No active API lines configured by admin." }), {
                status: 503, headers: { "Content-Type": "application/json", ...corsHeaders() }
            });
        }
        AI_API_KEY = activeKeys[0].api_key_value; // Use the first one as default
    }

    if (!AI_API_KEY) {
        console.error(logPrefix + " CRITICAL ERROR: API Key not available for the selected line or default.");
        return new Response(JSON.stringify({ error: "Server Configuration Error: API Key not available." }), {
            status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
    }

    const apiEndpointAction = MODEL_ENDPOINTS[model] || MODEL_ENDPOINTS["DEFAULT"];
    const isStreaming = !NON_STREAMING_MODELS.includes(model);
    
    const apiUrl = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${model}:${apiEndpointAction}?key=${AI_API_KEY}` + (isStreaming ? "&alt=sse" : "");
    console.log(logPrefix + " Target API URL: " + apiUrl.replace(AI_API_KEY, "[REDACTED_KEY]"));


    const contentsForApi = [];
    if (history && Array.isArray(history)) {
        history.forEach(turn => {
            if (turn.role && turn.parts) {
                contentsForApi.push({ role: turn.role, parts: turn.parts });
            }
        });
    }
    
    // System prompt logic (as before)
    const systemPrompt = "answer in 中文"; // Or fetch from settings
    let promptedUserParts = [...currentTurnParts]; 
    if (promptedUserParts.length > 0 && typeof promptedUserParts[0].text === 'string') {
      promptedUserParts[0] = { ...promptedUserParts[0], text: systemPrompt + " " + promptedUserParts[0].text };
    } else {
      promptedUserParts.unshift({ text: systemPrompt });
    }
    contentsForApi.push({ role: "user", parts: promptedUserParts });

    const apiRequestBody = { contents: contentsForApi, /* Add generationConfig if needed */ };

    try {
        console.log(logPrefix + " Sending request to Google API...");
        const apiResponse = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(apiRequestBody)
        });
        console.log(logPrefix + " Google API response status: " + apiResponse.status + ", ok: " + apiResponse.ok);

        if (!apiResponse.ok) {
            // ... (existing Google API error handling, return JSON error) ...
            const errorBodyText = await apiResponse.text();
            // ... (construct userFriendlyError) ...
            return new Response(JSON.stringify({ error: userFriendlyError }), {
                status: apiResponse.status, headers: { "Content-Type": "application/json", ...corsHeaders() }
            });
        }

        // --- Deduct Coins on Success ---
        let newCoinBalance = null;
        if (request.user && request.user.isLoggedIn) {
            newCoinBalance = request.user.coins - modelCost;
            await db.updateUserCoins(env.DB, request.user.user_id, newCoinBalance);
        }

        const responseHeaders = new Headers(corsHeaders()); // Start with CORS
        responseHeaders.set("Content-Type", isStreaming ? "text/event-stream; charset=utf-8" : "application/json; charset=utf-8");
        responseHeaders.set("Cache-Control", "no-cache");
        if (isStreaming) responseHeaders.set("Connection", "keep-alive");
        
        if (newCoinBalance !== null) {
            responseHeaders.set('X-Coins-Remaining', newCoinBalance.toString());
        }

        if (isStreaming) {
            const { readable, writable } = new TransformStream();
            apiResponse.body.pipeTo(writable).catch(err => {
                console.error(logPrefix + " Error piping Gemini stream:", err);
            });
            return new Response(readable, { status: 200, headers: responseHeaders });
        } else {
            // Handle non-streaming response (e.g., image generation)
            const jsonResponse = await apiResponse.json();
            // The client expects SSE-like chunks, so wrap it if necessary, or adjust client
            // For simplicity, let's send it as a single "data: " event.
            const sseFormattedResponse = `data: ${JSON.stringify(jsonResponse)}\n\n`;
            // Or just return the JSON directly and have client handle it. Let's assume client needs SSE format
             return new Response(sseFormattedResponse, { status: 200, headers: responseHeaders });
        }

    } catch (error) {
        console.error(logPrefix + " Worker fetch error calling Google API:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error: " + error.message }), {
            status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
    }
}