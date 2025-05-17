// api-handler.js
// Handles communication with the Google Generative AI API.

import { corsHeaders } from './utils.js';

export async function handleApiCall(request, env, logPrefix) {
  console.log(logPrefix + " Processing POST request for API call.");

  let requestBody;
  try {
    requestBody = await request.json();
    console.log(logPrefix + " Parsed request body. Model: " + requestBody?.model);
  } catch (e) {
    console.error(logPrefix + " Invalid JSON body received:", e);
    return new Response("Invalid JSON body.", {
      status: 400, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
    });
  }

  const { model, history, currentTurnParts, customApiKey } = requestBody;
  // 'prompt' from requestBody is not directly used for API call structure, 
  // 'currentTurnParts' and 'history' are used instead.

  if (!model || !currentTurnParts || !Array.isArray(currentTurnParts)) {
    console.error(logPrefix + " Missing model or currentTurnParts in request body.");
    return new Response("Missing model or currentTurnParts in request body.", {
      status: 400, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
    });
  }

  const allowedModels = [
      "gemini-2.5-flash-preview-04-17",
      "gemini-2.5-pro-preview-05-06"
  ];

  if (!allowedModels.includes(model)) {
    console.error(logPrefix + " Invalid model selected: " + model);
    return new Response("Invalid model selected: " + model + ". Allowed: " + allowedModels.join(", "), {
      status: 400, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
    });
  }

  const GEMINI_API_KEY = customApiKey || env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error(logPrefix + " CRITICAL ERROR: API Key not available (neither custom nor server default).");
    return new Response("Server Configuration Error: API Key not available.", {
      status: 500, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
    });
  }

  const apiEndpoint = 'streamGenerateContent'; // Always streaming for these models
  const apiVersion = "v1beta";
  const apiUrl = "https://generativelanguage.googleapis.com/" + apiVersion + "/models/" + model + ":" + apiEndpoint + "?key=" + GEMINI_API_KEY + "&alt=sse";
  console.log(logPrefix + " Target API URL: " + apiUrl);

  const contentsForApi = [];
  if (history && Array.isArray(history)) {
    history.forEach(turn => {
      if (turn.role && turn.parts) {
        contentsForApi.push({ role: turn.role, parts: turn.parts });
      }
    });
  }
  // Add current user turn
  contentsForApi.push({ role: "user", parts: currentTurnParts });
  
  // Log contents structure before sending for debugging
  // console.log(logPrefix + " API Request Contents: " + JSON.stringify(contentsForApi, null, 2));


  const apiRequestBody = {
    contents: contentsForApi,
    // Optional: Add generationConfig if needed
    // generationConfig: {
    //   temperature: 0.7,
    //   topK: 1,
    //   topP: 1,
    //   maxOutputTokens: 2048,
    // }
  };

  try {
    console.log(logPrefix + " Sending request to Google API...");
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apiRequestBody)
    });
    console.log(logPrefix + " Google API response status: " + apiResponse.status + ", ok: " + apiResponse.ok);

    if (!apiResponse.ok) {
      const errorBodyText = await apiResponse.text();
      console.error(logPrefix + " Google API Error (" + apiResponse.status + "): " + errorBodyText);
      let userFriendlyError = "Google API Error (" + apiResponse.status + ")";
      try {
        const errorJson = JSON.parse(errorBodyText);
        if (errorJson.error && errorJson.error.message) {
             userFriendlyError += ": " + errorJson.error.message;
        } else {
            userFriendlyError += ": " + errorBodyText.substring(0, 200) + (errorBodyText.length > 200 ? "..." : "");
        }
      } catch (e) {
        userFriendlyError += ": " + errorBodyText.substring(0, 200) + (errorBodyText.length > 200 ? "..." : "");
      }
      return new Response(userFriendlyError, {
        status: apiResponse.status, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
      });
    }

    console.log(logPrefix + " Streaming Gemini response back to client.");
    const { readable, writable } = new TransformStream();
    apiResponse.body.pipeTo(writable).catch(err => {
      console.error(logPrefix + " Error piping Gemini stream:", err);
    });
    const responseHeaders = new Headers({
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      ...corsHeaders()
    });
    return new Response(readable, { status: 200, headers: responseHeaders });

  } catch (error) {
    console.error(logPrefix + " Worker fetch error calling Google API:", error);
    const errorMsg = "Internal Server Error calling Google API: " + error.message;
    return new Response(errorMsg, {
      status: 500, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
    });
  }
}