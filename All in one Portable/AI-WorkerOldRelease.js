// Helper Function for CORS Headers
function corsHeaders() 
    {return {
      "Access-Control-Allow-Origin": "*", // WARNING: Restrict this in production
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type", // Add any other headers your client might send
    };      }
  
  function renderHTML() {
    return `
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <title>輕音Joy-AI公益站</title>
    <link rel="icon" href="https://www.cloudflare.com/favicon.ico" type="image/x-icon">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
    .ai-message strong::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      background-image: url('https://www.gstatic.com/lamda/images/sparkle_resting_v2_1ff6f6a71f2d298b1a31.gif');
      background-size: contain;
      background-repeat: no-repeat;
      margin-right: 8px;
      vertical-align: middle;
    }
  .text-3xl{background:linear-gradient(90deg,red,orange,yellow,green,blue,purple,red);-webkit-background-clip:text;background-clip:text;color:transparent;background-size:500% auto;animation:rainbow 10s linear infinite}@keyframes rainbow{0%{background-position:0}100%{background-position:500%}}  
    /* 恢复深度思考中文字动画 */
  @keyframes textGlow{0%{text-shadow:0 0 10px rgba(255,255,255,.8),0 0 20px rgba(100,200,255,.6);transform:scale(1)}50%{text-shadow:0 0 30px rgba(100,150,255,.9),0 0 50px rgba(200,100,255,.8),0 0 70px rgba(255,0,200,.6);transform:scale(1.05)}100%{text-shadow:0 0 10px rgba(255,255,255,.8),0 0 20px rgba(100,200,255,.6);transform:scale(1)}}
  .thinking{animation:textGlow 1.5s ease-in-out infinite;color:#a78bfa!important;font:italic bold 1.2em sans-serif}
    @keyframes icon2DRotate {
      0% { opacity: 0; transform: scale(0) rotateY(0deg); }
      10% { opacity: 1; transform: scale(3) rotateY(0deg); }
      50% { transform: scale(3) rotateY(180deg); }
      90% { transform: scale(3) rotateY(350deg); }
      100% { opacity: 0; transform: scale(0) rotateY(360deg); }
    }  
    .thinking-icon {
      position: absolute; top: 30%; left: 50%;
      width: 80px; height: 80px; margin: -40px 0 0 -40px;
      pointer-events: none;
      animation: icon2DRotate 6s ease-in-out forwards;
      transform-origin: center center;
      transform-style: preserve-3d;
      filter: drop-shadow(0 0 25px #dba0ff) brightness(1.5) saturate(1.8);
      z-index: 999;
    }  
     body {
        background: url('https://www.sensecore.cn/upload/20230330/crjfafitbja7qufwrt.jpg') no-repeat center center fixed;
        background-size: cover;
      }
      /* 添加透明背景设置https://www.bleepstatic.com/content/hl-images/2023/11/02/cloudflare.jpg   https://dlink.host/sharepoint/aHR0cHM6Ly80YzJ4ZHQtbXkuc2hhcmVwb2ludC5jb20vOmk6L2cvcGVyc29uYWwvYWRtaW5fNGMyeGR0X29ubWljcm9zb2Z0X2NvbS9FUms0ZTloVldPQk5reU0zLWxaSEwyQUJjRm1DNUltUUdwVGpCcXNoLVNBTzNBP2U9ZllDVkp0.png*/
      .w-full.max-w-6xl {
        background-color: rgba(31, 41, 55, 0.85)!important;
        backdrop-filter: blur(4px); /* 可选：背景模糊效果 */
      }
      
      /* 聊天消息透明 */
      #chat > div {
        background-color: rgba(30, 64, 175, 0.8); /* 用户消息 */
      }
      .ai-message {background-color: rgba(55, 65, 81, 0.8); /* AI消息 */}
      /* 输入框透明 */
        background-color: rgba(55, 65, 81, 0.5)!important;
        backdrop-filter: blur(2px);
        #sendBtn, select { background-color: rgba(55, 65, 81, 0.5)!important; }
  #sendBtn:hover { background-color: rgba(29, 78, 216, 0.6)!important;} 
      #chat-container { max-height: 60vh; overflow-y: auto; }
      #chat > div { margin-bottom: 1rem; padding: 0.75rem; border-radius: 0.5rem; max-width: 90%; word-break: break-word; line-height: 1.6; }
      .user-message { background-color: #1e40af; color: white; align-self: flex-end; margin-left: 10%; }
      .ai-message { background-color: #374151; color: white; align-self: flex-start; margin-right: 10%; white-space: pre-wrap; }
      .ai-message img { display: block; max-width: 100%; max-height: 400px; height: auto; margin-top: 0.75rem; border-radius: 0.375rem; background-color: #4b5563; }
      .ai-message strong, .user-message strong { display: block; margin-bottom: 0.25rem; font-weight: bold; color: #9ca3af; }
      .error-message { background-color: #b91c1c; color: white; }
      .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; display: inline-block; margin-left: 8px; }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      textarea { scrollbar-width: thin; scrollbar-color: #4b5563 #374151; }
    </style>
  </head>
  <body class="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center p-4 font-sans"> 
    <h1 class="text-3xl font-bold my-6 text-center">Ultra Gemini ☁ Cloudflare 輕音Joy-AI公益站</h1>
    <a href="https://qyjoy.vip" target="_blank" class="text-center block font-bold cursor-pointer mb-6 animate-breathe" style="text-shadow:0 0 8px rgba(0,255,255,0.7);">抖音 | Bilibili | Youtube | 小红书 | 公众号: 輕音Joy</a>
    <style>@keyframes breathe{0%{color:white;text-shadow:0 0 8px rgba(255,255,255,0.7);}50%{color:#22d3ee;text-shadow:0 0 12px rgba(34,211,238,0.9);}100%{color:white;text-shadow:0 0 8px rgba(255,255,255,0.7);}}.animate-breathe{animation:breathe 3s ease-in-out infinite;}</style>  
    <div class="w-full max-w-6xl bg-gray-800 shadow-lg rounded-lg p-6">
      <div class="mb-4">
        <label for="model" class="block mb-2 text-sm font-medium text-gray-300">选择模型：</label>
       <select id="model" class="w-full p-2.5 rounded bg-gray-700 border border-gray-600/50 text-white focus:ring-blue-500 focus:border-blue-500" style="background:rgba(55,65,81,0)!important;backdrop-filter:blur(4px)">
        <option value="gemini-2.5-flash-preview-04-17">Gemini 2.5 Pro Preview </option>
        </select>
      </div>
      <div class="mb-4">
        <label for="prompt" class="block mb-2 text-sm font-medium text-gray-300">输入你的内容或画面描述：</label>
        <textarea id="prompt" rows="3" class="w-full p-2.5 rounded bg-gray-700 border border-gray-600/50 text-white focus:ring-blue-500 focus:border-blue-500 resize-y" placeholder="例如：輕音Joy是哪个博主" style="background:rgba(55,65,81,0)!important;backdrop-filter:blur(4px)"></textarea>
        </div>
        <button id="sendBtn" class="flex items-center justify-center gap-2 w-full p-3 rounded font-semibold text-white/90 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed" style="background:rgba(37,99,235,0.75)!important;border:1px solid rgba(255,255,255,0.8)!important;backdrop-filter:blur(8px);box-shadow:0 2px 8px rgba(0,0,0,0.1)" onmouseover="this.style.background='rgba(29,78,216,0.1)'" onmouseout="this.style.background='rgba(37,99,235,0.85)'"><img src="https://www.cloudflare.com/favicon.ico" alt="Cloudflare" class="w-4 h-4"><span class="button-text">发送 Post</span><span id="sendIcon">➤</span><span id="loadingIcon" class="loader hidden"></span></button>
            <div id="chat-container" class="mt-6 border-t border-gray-700 pt-4">
        <div id="chat" class="flex flex-col space-y-4">
          <div class="ai-message"><strong>AI:</strong> 你好！请选择一个模型并输入你的请求。</div>
        </div>
   <p class="text-yellow-300 font-bold mb-6 text-center text-sm">Powered By Cloudflare Worker Serverless(BETA) | © 2025 輕音Joy </p>
        </div>
    </div>
    <footer class="text-center text-gray-500 text-sm mt-8">
    </footer>
  
  <script>
    // Wait for the DOM to be fully loaded before executing script logic
    document.addEventListener('DOMContentLoaded', () => {
      "use strict"; 
  
      console.log("DOM fully loaded and parsed.");
      // --- Element References ---
      const chat = document.getElementById('chat');
      const chatContainer = document.getElementById('chat-container');
      const sendBtn = document.getElementById('sendBtn');
      const promptTextarea = document.getElementById('prompt');
      const modelSelect = document.getElementById('model');
      const sendIcon = document.getElementById('sendIcon');
      const loadingIcon = document.getElementById('loadingIcon');
      const buttonText = sendBtn ? sendBtn.querySelector('.button-text') : null;
  
      if (!chat || !chatContainer || !sendBtn || !promptTextarea || !modelSelect || !sendIcon || !loadingIcon || !buttonText) {
        console.error("CRITICAL ERROR: One or more essential HTML elements not found.");
        alert("页面加载错误：无法找到必要的聊天界面元素。请检查HTML结构或稍后重试。");
        return; // Stop script execution
      }
      console.log("All essential elements found.");
  
      function setLoadingState(isLoading) {
        console.log(\`setLoadingState called with isLoading: \${isLoading}\`);
        // Check elements again just in case, though initial check should suffice
        if (!sendBtn || !promptTextarea || !buttonText || !sendIcon || !loadingIcon) {
            console.error("Error inside setLoadingState: Required elements missing.");
            return;
        }
        try {
            sendBtn.disabled = isLoading;
            promptTextarea.disabled = isLoading;
            if (isLoading) {
                buttonText.textContent = "处理中...";
                sendIcon.classList.add('hidden');
                loadingIcon.classList.remove('hidden');
            } else {
                buttonText.textContent = "发送(Post)";
                sendIcon.classList.remove('hidden');
                loadingIcon.classList.add('hidden');
            }
            console.log("setLoadingState finished.");
        } catch (e) {
            console.error("Error executing setLoadingState:", e);
        }
      } 
  
      function addMessage(text, sender = 'ai', isLoading = false) {
        function spawnThinkingIcon() {
          const icon = document.createElement('img');
          icon.src = 'https://i.ibb.co/ch21FSqt/cf.png'; // 你之前的图标地址
          icon.className = 'thinking-icon';
          document.body.appendChild(icon);
        
          icon.addEventListener('animationend', function() {
            icon.remove();
          });
        }                
        console.log('addMessage called. Sender: ' + sender + ', isLoading: ' + isLoading);
        if (!chat || !modelSelect) { 
          console.error("Error inside addMessage: Chat or modelSelect element not found.");
          return null;
        }
      
        try {
          let messageDiv = document.createElement('div');
          messageDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
      
          const senderStrong = document.createElement('strong');
          senderStrong.textContent = sender === 'user' ? '你:' : 'Gemini-AI:';
          messageDiv.appendChild(senderStrong);
      
          const contentSpan = document.createElement('span');
          contentSpan.className = 'response-content';
      
          if (isLoading) {
            const thinkingSpan = document.createElement('span');
            thinkingSpan.className = 'thinking';
            thinkingSpan.textContent = ' 深度思考中...';
            
            messageDiv.appendChild(thinkingSpan);
            messageDiv.appendChild(contentSpan);
            spawnThinkingIcon();
          } else {
            if (sender === 'user') {
              contentSpan.textContent = text;
            } else {
              if (modelSelect.value.startsWith('imagen') && (text.includes('<img') || text.includes('data:image'))) {
                contentSpan.innerHTML = text;
              } else {
                contentSpan.textContent = text;
              }
            }
            messageDiv.appendChild(contentSpan);
          }
      
          chat.appendChild(messageDiv);
          console.log("Message added to chat.");
          scrollToBottom();
          return messageDiv;
        } catch (e) {
          console.error("Error executing addMessage:", e);
          return null;
        }
      }    
      function scrollToBottom() {
         try {
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            } else {
                console.error("Error scrolling: chatContainer not found.");
            }
         } catch (e) {
            console.error("Error executing scrollToBottom:", e);
         }
      } // END scrollToBottom definition
  
      function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
      } // END escapeHTML definition
  
      function autoResizeTextarea() {
        try {
            if (promptTextarea) {
                promptTextarea.style.height = 'auto';
                promptTextarea.style.height = Math.min(promptTextarea.scrollHeight, 200) + 'px';
            } else {
                console.error("Error resizing textarea: promptTextarea not found.");
            }
        } catch (e) {
            console.error("Error executing autoResizeTextarea:", e);
        }
      } // END autoResizeTextarea definition
  
  
      // --- Main Send Logic Definition ---
      async function handleSend() {
        console.log("handleSend function started.");
        let aiMessageDiv = null; // Define here for broader scope
        let responseContentSpan = null;
  
        try {
          const prompt = promptTextarea.value.trim();
          const model = modelSelect.value;
          console.log(\`Prompt: "\${prompt}", Model: "\${model}"\`);
  
          if (!prompt) {
            console.log("Prompt is empty. Alerting user.");
            alert("请输入你的内容或画面描述！");
            promptTextarea.focus();
            return; // Stop execution
          }
  
          console.log("Setting loading state to true.");
          setLoadingState(true); // CALL to setLoadingState
  
          console.log("Adding user message.");
          addMessage(prompt, 'user'); // Call to addMessage
          promptTextarea.value = ''; // Clear prompt
          autoResizeTextarea(); // Call to autoResizeTextarea
  
          console.log("Adding AI placeholder message.");
          aiMessageDiv = addMessage('', 'ai', true); // Call to addMessage
          if (!aiMessageDiv) {
              throw new Error("Failed to create AI placeholder message element.");
          }
          responseContentSpan = aiMessageDiv.querySelector('.response-content');
          const thinkingSpan = aiMessageDiv.querySelector('.thinking');
          if (!responseContentSpan) {
               throw new Error("Failed to find response content span in AI placeholder.");
          }
          console.log("AI placeholder added.");
  
          // Scroll after adding placeholder
          // scrollToBottom(); // Already called inside addMessage
  
          console.log("Initiating fetch request to worker:", location.href);
          const res = await fetch(location.href, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, model })
          });
          console.log(\`Workspace response received. Status: \${res.status}, ok: \${res.ok}\`);
  
          if (thinkingSpan) thinkingSpan.remove(); // Remove "Thinking..."
  
          if (!res.ok) {
            const errorText = await res.text();
            console.error(\`Worker/API Error Response (Status \${res.status}):\`, errorText);
            // Update UI
            if (responseContentSpan && aiMessageDiv) {
                responseContentSpan.textContent = \`请求出错 (\${res.status}): \${escapeHTML(errorText.substring(0, 500))}\${errorText.length > 500 ? '...' : ''}\`;
                aiMessageDiv.classList.add('error-message');
                scrollToBottom();
            } else {
                 console.error("Cannot display fetch error in chat: message elements not found.");
            }
            // Throw error to be caught by outer catch block -> triggers finally
            throw new Error(\`Server responded with status \${res.status}\`);
          }
  
          const selectedModelType = model.startsWith("imagen") ? "imagen" : "gemini";
          console.log(\`Handling response for model type: \${selectedModelType}\`);
  
          if (selectedModelType === "gemini") {
              console.log("Processing Gemini SSE stream...");
              const reader = res.body.getReader();
              const decoder = new TextDecoder();
              let buffer = '';
              let currentText = '';
              let loopCount = 0;
  
              while (loopCount < 10000) { // Safety break
                  loopCount++;
                  const { done, value } = await reader.read();
                  if (done) {
                      console.log("SSE stream finished (done is true).");
                      break;
                  }
                  buffer += decoder.decode(value, { stream: true });
                  const lines = buffer.split('\\n'); // Split by newline
                  buffer = lines.pop(); // Keep potential partial line
  
                  for (const line of lines) {
                      if (line.startsWith('data: ')) {
                          const jsonStr = line.substring(6).trim();
                          if (jsonStr === '[DONE]' || !jsonStr) continue;
  
                          try {
                              const chunk = JSON.parse(jsonStr);
                              const textPart = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
                              if (textPart) {
                                  currentText += textPart;
                                  responseContentSpan.textContent = currentText; // Update UI
                                  scrollToBottom();
                              } else {
                                  console.log("Received non-text chunk or unexpected structure:", chunk);
                                  if (chunk.promptFeedback?.blockReason) {
                                      currentText += \`\\n[内容被阻止: \${chunk.promptFeedback.blockReason}]\`;
                                      responseContentSpan.textContent = currentText;
                                      aiMessageDiv.classList.add('error-message');
                                      scrollToBottom();
                                  }
                              }
                          } catch (e) {
                              console.error("Error parsing streaming JSON chunk:", e, "Chunk:", jsonStr);
                              currentText += '\\n[解析数据块时出错]';
                              responseContentSpan.textContent = currentText;
                              scrollToBottom();
                          }
                      } else if (line.trim()) {
                          console.log("Received non-data SSE line:", line);
                      }
                  } // end for line loop
              } // end while loop
  
              if (loopCount >= 10000) console.warn("SSE loop safety break triggered.");
  
              if (buffer.trim()) { // Process remaining buffer
                console.warn("Processing remaining buffer after stream end:", buffer);
                 if (buffer.startsWith('data: ')) {
                    const jsonStr = buffer.substring(6).trim();
                     try {
                         const chunk = JSON.parse(jsonStr);
                         const textPart = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
                         if (textPart) {
                             currentText += textPart;
                             responseContentSpan.textContent = currentText;
                             scrollToBottom();
                         }
                     } catch (e) {
                         console.error("Error parsing final buffer:", e);
                         currentText += '\\n[处理流末尾数据时出错]';
                         responseContentSpan.textContent = currentText;
                         scrollToBottom();
                     }
                 } else {
                     console.log("Final buffer does not start with 'data:', content:", buffer);
                 }
              }
              console.log("Gemini SSE processing finished.");
  
          } else if (selectedModelType === "imagen") {
            console.log("Processing Imagen JSON response...");
            try {
                const data = await res.json();
                console.log("Imagen response JSON parsed:", data); // Log the parsed data structure
  
                if (data.images && data.images.length > 0) {
                    console.log(\`Found \${data.images.length} images.\`);
                    responseContentSpan.innerHTML = data.images.map((imgSrc, index) =>
                        \`<img src="\${imgSrc}" class="my-2 rounded shadow-md" alt="Generated image \${index + 1}" loading="lazy"/>\`
                    ).join('');
                } else {
                    const message = data.message || (data.promptFeedback?.blockReason ? \`请求被阻止: \${data.promptFeedback.blockReason}\` : "未生成任何图像或收到意外响应。");
                    console.log("No images found or message received:", message);
                    responseContentSpan.textContent = escapeHTML(message);
                    if (message.includes("Blocked") || message.includes("Error") || message.includes("出错") || message.includes("Unexpected") || message.includes("阻止")) {
                        aiMessageDiv.classList.add('error-message');
                    }
                }
                scrollToBottom();
            } catch (e) {
                console.error("Error parsing Imagen JSON response:", e);
                // Update UI
                if(responseContentSpan && aiMessageDiv){
                   responseContentSpan.textContent = '解析图像响应时出错：' + e.message;
                   aiMessageDiv.classList.add('error-message');
                   scrollToBottom();
                }
                // Throw error to be caught by outer catch block -> triggers finally
                throw new Error('Failed to parse Imagen JSON: ' + e.message);
            }
            console.log("Imagen JSON processing finished.");
          } // End Imagen processing
  
          console.log("handleSend processing completed successfully.");
  
        } catch (error) { // Catch errors from fetch, response processing, or explicitly thrown errors
          console.error("!!!! CLIENT-SIDE CATCH BLOCK ERROR in handleSend !!!!:", error);
          // Alert removed as it can be annoying, rely on console and chat message
          // alert('处理请求时发生错误: ' + error.message);
  
          // Ensure UI reflects error state if possible
          if (responseContentSpan) {
              // Check if the content is already set by specific error handling above
              if (!responseContentSpan.textContent.includes("出错")) {
                   responseContentSpan.textContent = '客户端错误: ' + error.message;
              }
              if (aiMessageDiv && !aiMessageDiv.classList.contains('error-message')) {
                  aiMessageDiv.classList.add('error-message');
              }
              scrollToBottom(); // Scroll to show error
          } else {
              console.error("Cannot display error in chat bubble: responseContentSpan not found.");
          }
  
        } finally { // This block ALWAYS runs
          console.log("!!!! CLIENT-SIDE FINALLY BLOCK in handleSend !!!!");
          setLoadingState(false); // Ensure UI is re-enabled
          promptTextarea.focus(); // Put cursor back
          console.log("UI re-enabled.");
        }
      } // END handleSend definition
  
      // --- Attach Event Listeners ---
      sendBtn.addEventListener('click', handleSend);
      console.log("Send button click listener attached.");
  
      promptTextarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          console.log("Enter key pressed, triggering handleSend.");
          handleSend(); // Call the main handler
        }
      });
      console.log("Textarea keypress listener attached.");
  
      promptTextarea.addEventListener('input', autoResizeTextarea);
      console.log("Textarea input listener attached.");
  
  
      // --- Initial Setup Calls ---
      autoResizeTextarea(); // Resize initially
      console.log("Initial textarea resize done.");
      // scrollToBottom(); // Optional: Scroll down initially if needed
  
    }); // END DOMContentLoaded listener
  </script>
  
  </body>
  </html>
    `; // End of the main template literal
  } // End of renderHTML
  
  
  // ========================================================================== //
  // ===================== CLOUDFLARE WORKER ENTRY POINT ====================== //
  // ========================================================================== //
  
  export default {
    async fetch(request, env, ctx) {
      
      // Assign a unique ID for request tracing
      const requestId = request.headers.get('cf-ray') || crypto.randomUUID();
      const logPrefix = `[${requestId}]`;
  
      console.log(`${logPrefix} Worker received request: ${request.method} ${request.url}`);
  
      // --- Hardcoded API Key (FOR TESTING ONLY - INSECURE) ---
      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      // >>>>>>>> IMPORTANT: REPLACE WITH YOUR ACTUAL VALID API KEY <<<<<<<
      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      const GEMINI_API_KEY = env.GEMINI_API_KEY;
          // 检查环境变量是否配置
          if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 30) {
               console.error(`${logPrefix} CRITICAL ERROR: API Key 未配置或无效`);
           return new Response("Server Configuration Error: Invalid API Key.", {
               status: 500,
               headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
           });
      }
  
      // --- CORS Preflight ---
      if (request.method === "OPTIONS") {
        console.log(`${logPrefix} Responding to OPTIONS request.`);
        return new Response(null, { status: 204, headers: corsHeaders() });
      }
  
      // --- Serve HTML for GET ---
      if (request.method === "GET") {
        console.log(`${logPrefix} Responding to GET request with HTML.`);
        try {
            const html = renderHTML();
            return new Response(html, {
              headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders() },
            });
        } catch (e) {
            console.error(`${logPrefix} Error rendering HTML:`, e);
            return new Response("Internal Server Error rendering page.", { status: 500 });
        }
      }
  
      // --- Handle POST for API calls ---
      if (request.method === "POST") {
        console.log(`${logPrefix} Processing POST request.`);
  
        let requestBody;
        try {
          requestBody = await request.json();
          // Avoid logging full prompt if sensitive, log excerpt or confirmation
          console.log(`${logPrefix} Parsed request body. Model: ${requestBody?.model}, Prompt starts with: ${String(requestBody?.prompt).substring(0,30)}...`);
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
  
        const allowedModels = ["imagen-3.0-generate-002", "gemini-2.5-flash-preview-04-17"];
        if (!allowedModels.includes(model)) {
          console.error(`${logPrefix} Invalid model selected: ${model}`);
          return new Response(`Invalid model selected: ${model}. Allowed: ${allowedModels.join(", ")}`, {
            status: 400, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
          });
        }
  
        // --- Prepare Google API Request ---
        const isImagen = model.startsWith("imagen");
        const apiEndpoint = isImagen ? 'generateContent' : 'streamGenerateContent';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${apiEndpoint}?key=${GEMINI_API_KEY}${isImagen ? '' : '&alt=sse'}`;
        console.log(`${logPrefix} Target API URL: ${apiUrl}`); // Log URL (Key is visible here, acceptable for testing logs)
  
        const apiRequestBody = isImagen
          ? { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { candidateCount: 1 } } // Request 1 image for Imagen
          : { contents: [{ parts: [{ text: prompt }] }] }; // Simple content for Gemini
  
        // --- Call Google API ---
        try {
          console.log(`${logPrefix} Sending request to Google API...`);
          const apiResponse = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(apiRequestBody)
          });
          console.log(`${logPrefix} Google API response status: ${apiResponse.status}, ok: ${apiResponse.ok}`);
  
          // --- Handle API Error Response ---
          if (!apiResponse.ok) {
            const errorBodyText = await apiResponse.text(); // Read error body
            console.error(`${logPrefix} Google API Error (${apiResponse.status}): ${errorBodyText}`);
            let userFriendlyError = `Google API Error (${apiResponse.status})`;
             try { // Attempt to parse standard Google API error JSON
                 const errorJson = JSON.parse(errorBodyText);
                 userFriendlyError += `: ${errorJson.error?.message || 'Unknown error structure.'}`;
             } catch (e) { // Fallback to raw text if not JSON
                 userFriendlyError += `: ${errorBodyText.substring(0, 200)}${errorBodyText.length > 200 ? "..." : ""}`;
             }
  
             // Return error TO CLIENT in appropriate format
             if (isImagen) { // Imagen expects JSON response
                  return new Response(JSON.stringify({ images: [], message: userFriendlyError }), {
                      status: apiResponse.status, // Use original Google status code
                      headers: { "Content-Type": "application/json", ...corsHeaders() }
                  });
              } else { // Gemini streaming expects text/event-stream on success, return plain text error
                  return new Response(userFriendlyError, {
                      status: apiResponse.status, // Use original Google status code
                      headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }
                  });
              }
          } // End API Error Handling
  
          // --- Handle API Success Response ---
  
          if (isImagen) { // Process Imagen JSON response
            console.log(`${logPrefix} Processing successful Imagen response.`);
            const responseBodyText = await apiResponse.text();
            let data;
            try {
                data = JSON.parse(responseBodyText);
                // Avoid logging potentially large base64 data unless necessary
                console.log(`${logPrefix} Parsed Imagen JSON successfully. Candidates count: ${data.candidates?.length}`);
            } catch (parseError) {
                console.error(`${logPrefix} Error parsing Imagen JSON response:`, parseError, "Body snippet:", responseBodyText.substring(0, 500));
                 return new Response(JSON.stringify({ images: [], message: "Internal Server Error: Failed to parse Imagen API response." }), {
                     status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() }
                 });
            }
  
            // Check for safety blocks or other issues within the 'successful' response
            if (data.promptFeedback?.blockReason) {
                 console.warn(`${logPrefix} Imagen request blocked: ${data.promptFeedback.blockReason}`);
                 return new Response(JSON.stringify({ images: [], message: `请求被阻止: ${data.promptFeedback.blockReason}` }), {
                     status: 200, // Technically API call succeeded, but content blocked
                     headers: { "Content-Type": "application/json", ...corsHeaders() }
                 });
            }
            // Check if candidates array exists and has content
            if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content?.parts) {
                  console.warn(`${logPrefix} Imagen response ok, but no valid candidates/parts found.`);
                  return new Response(JSON.stringify({ images: [], message: "API success, but no generated images found in response." }), {
                       status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() }
                   });
            }
  
            // Extract image data
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
  
          } else { // Stream Gemini SSE response
            console.log(`${logPrefix} Streaming Gemini response back to client.`);
            // Use TransformStream for pass-through
            const { readable, writable } = new TransformStream();
            // Pipe the response body to the writable end. Handle potential errors during piping.
            apiResponse.body.pipeTo(writable).catch(err => {
                 console.error(`${logPrefix} Error piping Gemini stream:`, err);
                 // Difficult to signal error back to client once headers are sent
             });
  
            // Set appropriate headers for SSE
            const responseHeaders = new Headers({
              "Content-Type": "text/event-stream; charset=utf-8",
              "Cache-Control": "no-cache",
              "Connection": "keep-alive",
              ...corsHeaders() // Apply CORS headers
            });
  
            // Return the readable end of the stream
            return new Response(readable, {
              status: 200, // Successful stream initiation
              headers: responseHeaders
            });
          } // End Gemini Streaming
  
        } catch (error) { // Catch network errors during fetch to Google API
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
      } // End POST handler
  
      // --- Method Not Allowed ---
      console.log(`${logPrefix} Method Not Allowed: ${request.method}`);
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { "Allow": "GET, POST, OPTIONS", ...corsHeaders() }
      });
  
    } // End async fetch
  }; // End export default