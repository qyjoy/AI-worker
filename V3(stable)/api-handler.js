// api-handler.js
// Handles communication with the Google Generative AI API.

import { corsHeaders } from './utils.js';

export async function handleApiCall(request, env, logPrefix) {
  console.log(`${logPrefix} Processing POST request for API call.`);

  let requestBody;
  try {
    requestBody = await request.json();
    console.log(`${logPrefix} Parsed request body. Model: ${requestBody?.model}, Prompt starts with: ${String(requestBody?.prompt).substring(0, 30)}...`);
  } catch (e) {
    console.error(`${logPrefix} Invalid JSON body received:`, e);
    return new Response("Invalid JSON body.", {
      status: 400, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
    });
  }

  const { prompt, model } = requestBody;

  if (!prompt || !model) {
    console.error(`${logPrefix} Missing prompt or model in request body.`);
    return new Response("Missing prompt or model in request body.", {
      status: 400, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
    });
  }

  // Extended list of models based on comments in original HTML
  const allowedModels = [
      "gemini-2.5-flash-preview-04-17", // Default and explicitly mentioned
      "gemini-1.5-pro-preview-0409",
      "gemini-1.5-flash-preview-0514",
      "gemini-pro",
      "gemini-pro-vision",
      "imagen-3.0-generate-002" // Example Imagen model
      // Add other specific Imagen model versions if known, e.g., "imagen-..."
  ];


  if (!allowedModels.includes(model) && !model.startsWith("imagen")) { // Allow any model starting with "imagen" for flexibility
    console.error(`${logPrefix} Invalid model selected: ${model}`);
    return new Response(`Invalid model selected: ${model}. Allowed: ${allowedModels.join(", ")} or any 'imagen-...' model.`, {
      status: 400, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
    });
  }

  const GEMINI_API_KEY = env.GEMINI_API_KEY;
  const isImagen = model.startsWith("imagen");
  const apiEndpoint = isImagen ? 'generateContent' : 'streamGenerateContent';
  // Note: v1beta is used. For stable versions, it might be v1.
  const apiVersion = "v1beta"; // Or "v1" if you are using stable models without "preview" in their names.
  const apiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:${apiEndpoint}?key=${GEMINI_API_KEY}${isImagen ? '' : '&alt=sse'}`;
  console.log(`${logPrefix} Target API URL: ${apiUrl}`);

  const apiRequestBody = isImagen
    ? { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { candidateCount: 1 } }
    : { contents: [{ parts: [{ text: prompt }] }] };

  try {
    console.log(`${logPrefix} Sending request to Google API...`);
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apiRequestBody)
    });
    console.log(`${logPrefix} Google API response status: ${apiResponse.status}, ok: ${apiResponse.ok}`);

    if (!apiResponse.ok) {
      const errorBodyText = await apiResponse.text();
      console.error(`${logPrefix} Google API Error (${apiResponse.status}): ${errorBodyText}`);
      let userFriendlyError = `Google API Error (${apiResponse.status})`;
      try {
        const errorJson = JSON.parse(errorBodyText);
        userFriendlyError += `: ${errorJson.error?.message || 'Unknown error structure.'}`;
      } catch (e) {
        userFriendlyError += `: ${errorBodyText.substring(0, 200)}${errorBodyText.length > 200 ? "..." : ""}`;
      }

      if (isImagen) {
        return new Response(JSON.stringify({ images: [], message: userFriendlyError }), {
          status: apiResponse.status, headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
      } else {
        return new Response(userFriendlyError, {
          status: apiResponse.status, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
        });
      }
    }

    if (isImagen) {
      console.log(`${logPrefix} Processing successful Imagen response.`);
      const responseBodyText = await apiResponse.text();
      let data;
      try {
        data = JSON.parse(responseBodyText);
        console.log(`${logPrefix} Parsed Imagen JSON successfully. Candidates count: ${data.candidates?.length}`);
      } catch (parseError) {
        console.error(`${logPrefix} Error parsing Imagen JSON response:`, parseError, "Body snippet:", responseBodyText.substring(0, 500));
        return new Response(JSON.stringify({ images: [], message: "Internal Server Error: Failed to parse Imagen API response." }), {
          status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
      }

      if (data.promptFeedback?.blockReason) {
        console.warn(`${logPrefix} Imagen request blocked: ${data.promptFeedback.blockReason}`);
        return new Response(JSON.stringify({ images: [], message: `请求被阻止: ${data.promptFeedback.blockReason}` }), {
          status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
      }
      if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content?.parts) {
        console.warn(`${logPrefix} Imagen response ok, but no valid candidates/parts found.`);
        return new Response(JSON.stringify({ images: [], message: "API success, but no generated images found in response." }), {
          status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
      }

      const imageUrls = data.candidates[0].content.parts
        .filter(part => part.inlineData?.mimeType?.startsWith("image/"))
        .map(part => `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);

      if (imageUrls.length > 0) {
        console.log(`${logPrefix} Found ${imageUrls.length} images. Sending JSON response.`);
        return new Response(JSON.stringify({ images: imageUrls }), {
          headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
      } else {
        console.warn(`${logPrefix} Imagen response ok and candidates exist, but no image parts found.`);
        return new Response(JSON.stringify({ images: [], message: "API success, but no image data found in response parts." }), {
          status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
      }
    } else { // Gemini SSE stream
      console.log(`${logPrefix} Streaming Gemini response back to client.`);
      const { readable, writable } = new TransformStream();
      apiResponse.body.pipeTo(writable).catch(err => {
        console.error(`${logPrefix} Error piping Gemini stream:`, err);
      });
      const responseHeaders = new Headers({
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        ...corsHeaders()
      });
      return new Response(readable, { status: 200, headers: responseHeaders });
    }
  } catch (error) {
    console.error(`${logPrefix} Worker fetch error calling Google API:`, error);
    const errorMsg = `Internal Server Error calling Google API: ${error.message}`;
    if (isImagen) {
      return new Response(JSON.stringify({ images: [], message: errorMsg }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() }
      });
    } else {
      return new Response(errorMsg, {
        status: 500, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
      });
    }
  }
}
