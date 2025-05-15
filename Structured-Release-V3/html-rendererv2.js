// html-renderer.js
// Generates the complete HTML page, including CSS and client-side JavaScript.
// CSS styles for the page
const getStyles = () => `
<style>
/* 调整：AI头像仅在最外层strong显示 */
.ai-message > strong::before {content: "";display: inline-block;width: 20px;height: 20px;background-image: url('https://www.gstatic.com/lamda/images/sparkle_resting_v2_1ff6f6a71f2d298b1a31.gif');background-size: contain;background-repeat: no-repeat;margin-right: 8px;vertical-align: middle;}

.text-3xl{background:linear-gradient(90deg,red,orange,yellow,green,blue,purple,red);-webkit-background-clip:text;background-clip:text;color:transparent;background-size:500% auto;animation:rainbow 10s linear infinite}@keyframes rainbow{0%{background-position:0}100%{background-position:500%}}
@keyframes textGlow{0%{text-shadow:0 0 10px rgba(255,255,255,.8),0 0 20px rgba(100,200,255,.6);transform:scale(1)}50%{text-shadow:0 0 30px rgba(100,150,255,.9),0 0 50px rgba(200,100,255,.8),0 0 70px rgba(255,0,200,.6);transform:scale(1.05)}100%{text-shadow:0 0 10px rgba(255,255,255,.8),0 0 20px rgba(100,200,255,.6);transform:scale(1)}}
.thinking{animation:textGlow 1.5s ease-in-out infinite;color:#a78bfa!important;font:italic bold 1.2em sans-serif}
@keyframes icon2DRotate {0% { opacity: 0; transform: scale(0) rotateY(0deg); } 10% { opacity: 1; transform: scale(3) rotateY(0deg); } 50% { transform: scale(3) rotateY(180deg); } 90% { transform: scale(3) rotateY(350deg); } 100% { opacity: 0; transform: scale(0) rotateY(360deg); }}
.thinking-icon {position: absolute; top: 30%; left: 50%;width: 80px; height: 80px; margin: -40px 0 0 -40px;pointer-events: none;animation: icon2DRotate 6s ease-in-out forwards;transform-origin: center center;transform-style: preserve-3d;filter: drop-shadow(0 0 25px #dba0ff) brightness(1.5) saturate(1.8);z-index: 999;}
body {background: url('https://www.sensecore.cn/upload/20230330/crjfafitbja7qufwrt.jpg') no-repeat center center fixed;background-size: cover;}
.w-full.max-w-6xl {background-color: rgba(31, 41, 55, 0.85)!important;backdrop-filter: blur(4px);}
#chat > div {background-color: rgba(30, 64, 175, 0.8);} /* User messages default, AI messages override this */
.ai-message {background-color: rgba(55, 65, 81, 0.8);}
#prompt {background-color: rgba(55, 65, 81, 0.5)!important;backdrop-filter: blur(2px);}
#sendBtn, select { background-color: rgba(55, 65, 81, 0.5)!important; }
#sendBtn:hover { background-color: rgba(29, 78, 216, 0.6)!important;}
#chat-container { max-height: calc(100vh - 300px); min-height: 200px; overflow-y: auto; } /* Adjusted for mobile */
@media (max-width: 768px) { #chat-container { max-height: calc(100vh - 350px); } } /* Further adjustment for smaller screens */
#chat > div { margin-bottom: 1rem; padding: 0.75rem; border-radius: 0.5rem; max-width: 90%; word-break: break-word; line-height: 1.6; }
.user-message { background-color: #1e40af; color: white; align-self: flex-end; margin-left: 10%; }
.ai-message { background-color: #374151; color: white; align-self: flex-start; margin-right: 10%; white-space: pre-wrap; } /* white-space is important for pre-formatted text from AI */
.ai-message .response-content p { margin-bottom: 0.5em; } /* Add some space between paragraphs from Markdown */
.ai-message .response-content ul, .ai-message .response-content ol { margin-left: 1.5em; margin-bottom: 0.5em; }
.ai-message .response-content li { margin-bottom: 0.25em; }
.ai-message img { display: block; max-width: 100%; max-height: 300px; height: auto; margin-top: 0.75rem; border-radius: 0.375rem; background-color: #4b5563; } /* Adjusted max-height for mobile */
.ai-message strong, .user-message strong { display: block; margin-bottom: 0.25rem; font-weight: bold; color: #9ca3af; }
/* Ensure Markdown strong is also bold */
.ai-message .response-content strong { font-weight: bold; color: inherit; }
.error-message { background-color: #b91c1c; color: white; }
.loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; display: inline-block; margin-left: 8px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
textarea { scrollbar-width: thin; scrollbar-color: #4b5563 #374151; }
@keyframes breathe{0%{color:white;text-shadow:0 0 8px rgba(255,255,255,0.7);}50%{color:#22d3ee;text-shadow:0 0 12px rgba(34,211,238,0.9);}100%{color:white;text-shadow:0 0 8px rgba(255,255,255,0.7);}}.animate-breathe{animation:breathe 3s ease-in-out infinite;}

/* 修改后的表格样式 */
.ai-message table { 
  border-collapse: collapse; 
  width: 98%; 
  margin: 1em auto;
  background: rgba(0,0,0,0.5)!important; /* 统一表格背景 */
  border: 1px solid #4A5568;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.ai-message th, .ai-message td { 
  border: 1px solid #4A5568; 
  padding: 0.5rem 0.75rem; 
  text-align: left;
  background: transparent!important; /* 取消交替颜色 */
}
.ai-message th { 
  background-color: rgba(45, 55, 72, 0.9)!important; /* 表头颜色加深 */
  color: #E2E8F0; 
  font-weight: bold;
}
/* 移除交替行颜色 */
.ai-message tr {
  background: transparent!important;
}
/* 表格悬停效果 */
.ai-message tr:hover td {
  background-color: rgba(74, 85, 104, 0.3)!important;
}
/* 确保表格内的strong不显示图标 */
.ai-message table strong::before {
  display: none!important;
}
</style>
`;


// Client-side JavaScript
const getClientScript = () => `
<script>
document.addEventListener('DOMContentLoaded', () => {
  "use strict";
  if (typeof marked === 'undefined') {
    console.error("marked.js library is not loaded. Markdown will not be rendered.");
    // Optionally, alert the user or disable Markdown-dependent features.
    // For now, we'll let it proceed, and text will appear unformatted.
  }

  console.log("DOM fully loaded and parsed.");
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
    return;
  }
  console.log("All essential elements found.");

  function setLoadingState(isLoading) {
    console.log(\`setLoadingState called with isLoading: \${isLoading}\`);
    if (!sendBtn || !promptTextarea || !buttonText || !sendIcon || !loadingIcon) {
        console.error("Error inside setLoadingState: Required elements missing.");
        return;
    }
    try {
        sendBtn.disabled = isLoading;
        promptTextarea.disabled = isLoading;
        buttonText.textContent = isLoading ? "处理中..." : "发送(Post)";
        sendIcon.classList.toggle('hidden', isLoading);
        loadingIcon.classList.toggle('hidden', !isLoading);
        console.log("setLoadingState finished.");
    } catch (e) { console.error("Error executing setLoadingState:", e); }
  }

  function spawnThinkingIcon() {
    const icon = document.createElement('img');
    icon.src = 'https://i.ibb.co/ch21FSqt/cf.png';
    icon.className = 'thinking-icon';
    document.body.appendChild(icon);
    icon.addEventListener('animationend', function() { icon.remove(); });
  }

  function addMessage(text, sender = 'ai', isLoading = false) {
    console.log('addMessage called. Sender: ' + sender + ', isLoading: ' + isLoading);
    if (!chat || !modelSelect) { console.error("Error inside addMessage: Chat or modelSelect element not found."); return null; }
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
        messageDiv.appendChild(contentSpan); // Add empty contentSpan for placeholder
        spawnThinkingIcon();
      } else {
        if (sender === 'user') {
          contentSpan.textContent = text; // User messages are plain text
        } else {
          // For AI messages, parse Markdown if marked.js is available
          if (modelSelect.value.startsWith('imagen') && (text.includes('<img') || text.includes('data:image'))) {
            contentSpan.innerHTML = text; // Imagen response might already be HTML (img tags)
          } else if (typeof marked !== 'undefined') {
            contentSpan.innerHTML = marked.parse(text); // Parse Markdown to HTML
          } else {
            contentSpan.textContent = text; // Fallback if marked.js is not loaded
          }
        }
        messageDiv.appendChild(contentSpan);
      }
      chat.appendChild(messageDiv);
      console.log("Message added to chat.");
      scrollToBottom();
      return messageDiv;
    } catch (e) { console.error("Error executing addMessage:", e); return null; }
  }

  function scrollToBottom() {
     try {
        if (chatContainer) { chatContainer.scrollTop = chatContainer.scrollHeight; }
        else { console.error("Error scrolling: chatContainer not found."); }
     } catch (e) { console.error("Error executing scrollToBottom:", e); }
  }

  function escapeHTML(str) { // Keep this for cases where you might need to escape HTML, though not used for AI response directly now
    if (typeof str !== 'string') return '';
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }

  function autoResizeTextarea() {
    try {
        if (promptTextarea) {
            promptTextarea.style.height = 'auto';
            promptTextarea.style.height = Math.min(promptTextarea.scrollHeight, 200) + 'px'; // Max height 200px
        } else { console.error("Error resizing textarea: promptTextarea not found.");}
    } catch (e) { console.error("Error executing autoResizeTextarea:", e); }
  }

  async function handleSend() {
    console.log("handleSend function started.");
    let aiMessageDiv = null;
    let responseContentSpan = null;

    try {
      const prompt = promptTextarea.value.trim();
      const model = modelSelect.value;
      console.log(\`Prompt: "\${prompt}", Model: "\${model}"\`);
      if (!prompt) { alert("请输入你的内容或画面描述！"); promptTextarea.focus(); return; }

      setLoadingState(true);
      addMessage(prompt, 'user');
      promptTextarea.value = '';
      autoResizeTextarea();
      aiMessageDiv = addMessage('', 'ai', true);
      if (!aiMessageDiv) { throw new Error("Failed to create AI placeholder message element."); }
      responseContentSpan = aiMessageDiv.querySelector('.response-content');
      const thinkingSpan = aiMessageDiv.querySelector('.thinking');
      if (!responseContentSpan) { throw new Error("Failed to find response content span in AI placeholder."); }

      console.log("Initiating fetch request to worker:", location.href);
      const res = await fetch(location.href, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model })
      });
      console.log(\`Worker response received. Status: \${res.status}, ok: \${res.ok}\`);

      if (thinkingSpan) thinkingSpan.remove();

      if (!res.ok) {
        const errorText = await res.text();
        console.error(\`Worker/API Error Response (Status \${res.status}):\`, errorText);
        if (responseContentSpan && aiMessageDiv) {
            // For error messages, we might want to display them as plain text or escaped HTML
            // to avoid them being misinterpreted as Markdown.
            responseContentSpan.textContent = \`请求出错 (\${res.status}): \${escapeHTML(errorText.substring(0, 500))}\${errorText.length > 500 ? '...' : ''}\`;
            aiMessageDiv.classList.add('error-message');
            scrollToBottom();
        } else { console.error("Cannot display fetch error in chat: message elements not found."); }
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
          // eslint-disable-next-line no-constant-condition
          while (true) {
              const { done, value } = await reader.read();
              if (done) { console.log("SSE stream finished."); break; }
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\\n');
              buffer = lines.pop(); // Keep potential partial line for next read
              for (const line of lines) {
                  if (line.startsWith('data: ')) {
                      const jsonStr = line.substring(6).trim();
                      if (jsonStr === '[DONE]' || !jsonStr) continue;
                      try {
                          const chunk = JSON.parse(jsonStr);
                          const textPart = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
                          if (textPart) {
                              currentText += textPart;
                              // Parse and render Markdown progressively
                              if (typeof marked !== 'undefined') {
                                responseContentSpan.innerHTML = marked.parse(currentText);
                              } else {
                                responseContentSpan.textContent = currentText; // Fallback
                              }
                              scrollToBottom();
                          } else if (chunk.promptFeedback?.blockReason) {
                              const blockMessage = \`\\n[内容被阻止: \${chunk.promptFeedback.blockReason}]\`;
                              currentText += blockMessage;
                              if (typeof marked !== 'undefined') {
                                responseContentSpan.innerHTML = marked.parse(currentText);
                              } else {
                                responseContentSpan.textContent = currentText; // Fallback
                              }
                              aiMessageDiv.classList.add('error-message'); // Style as error
                              scrollToBottom();
                          }
                      } catch (e) {
                          console.error("Error parsing streaming JSON chunk:", e, "Chunk:", jsonStr);
                          const parseErrorMessage = '\\n[解析数据块时出错]';
                          currentText += parseErrorMessage;
                          if (typeof marked !== 'undefined') {
                            responseContentSpan.innerHTML = marked.parse(currentText);
                          } else {
                            responseContentSpan.textContent = currentText; // Fallback
                          }
                          scrollToBottom();
                      }
                  } else if (line.trim()) { console.log("Received non-data SSE line:", line); }
              }
          }
          // Process any remaining data in the buffer after the stream ends
          if (buffer.trim() && buffer.startsWith('data: ')) {
            const jsonStr = buffer.substring(6).trim();
            try {
                const chunk = JSON.parse(jsonStr);
                const textPart = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textPart) {
                    currentText += textPart;
                    if (typeof marked !== 'undefined') {
                      responseContentSpan.innerHTML = marked.parse(currentText);
                    } else {
                      responseContentSpan.textContent = currentText; // Fallback
                    }
                    scrollToBottom();
                }
            } catch (e) {
                console.error("Error parsing final buffer:", e);
                const finalBufferError = '\\n[处理流末尾数据时出错]';
                currentText += finalBufferError;
                if (typeof marked !== 'undefined') {
                  responseContentSpan.innerHTML = marked.parse(currentText);
                } else {
                  responseContentSpan.textContent = currentText; // Fallback
                }
                scrollToBottom();
            }
          }
          console.log("Gemini SSE processing finished.");
      } else if (selectedModelType === "imagen") {
        console.log("Processing Imagen JSON response...");
        try {
            const data = await res.json();
            console.log("Imagen response JSON parsed:", data);
            if (data.images && data.images.length > 0) {
                // Imagen response is typically direct HTML (img tags)
                responseContentSpan.innerHTML = data.images.map((imgSrc, index) => \`<img src="\${imgSrc}" class="my-2 rounded shadow-md" alt="Generated image \${index + 1}" loading="lazy"/>\`).join('');
            } else {
                const message = data.message || (data.promptFeedback?.blockReason ? \`请求被阻止: \${data.promptFeedback.blockReason}\` : "未生成任何图像或收到意外响应。");
                responseContentSpan.textContent = escapeHTML(message); // Display as plain text
                if (message.includes("Blocked") || message.includes("Error") || message.includes("出错") || message.includes("Unexpected") || message.includes("阻止")) {
                    aiMessageDiv.classList.add('error-message');
                }
            }
            scrollToBottom();
        } catch (e) {
            console.error("Error parsing Imagen JSON response:", e);
            if(responseContentSpan && aiMessageDiv){
               responseContentSpan.textContent = '解析图像响应时出错：' + e.message; // Display as plain text
               aiMessageDiv.classList.add('error-message');
               scrollToBottom();
            }
            throw new Error('Failed to parse Imagen JSON: ' + e.message);
        }
        console.log("Imagen JSON processing finished.");
      }
      console.log("handleSend processing completed successfully.");
    } catch (error) {
      console.error("!!!! CLIENT-SIDE CATCH BLOCK ERROR in handleSend !!!!:", error);
      if (responseContentSpan) {
          if (!responseContentSpan.textContent.includes("出错")) {
             responseContentSpan.textContent = '客户端错误: ' + error.message; // Display as plain text
          }
          if (aiMessageDiv && !aiMessageDiv.classList.contains('error-message')) {
              aiMessageDiv.classList.add('error-message');
          }
          scrollToBottom();
      } else { console.error("Cannot display error in chat bubble: responseContentSpan not found."); }
    } finally {
      console.log("!!!! CLIENT-SIDE FINALLY BLOCK in handleSend !!!!");
      setLoadingState(false);
      promptTextarea.focus();
      console.log("UI re-enabled.");
    }
  }

  sendBtn.addEventListener('click', handleSend);
  promptTextarea.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });
  promptTextarea.addEventListener('input', autoResizeTextarea);
  autoResizeTextarea();
  console.log("Event listeners attached and initial setup done.");
});
</script>
`;

// Main HTML structure
export function renderHTML() {
  const styles = getStyles();
  const clientScript = getClientScript();

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>輕音Joy-AI公益站</title>
  <link rel="icon" href="https://www.cloudflare.com/favicon.ico" type="image/x-icon">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script> ${styles}
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center p-4 font-sans">
  <h1 class="text-3xl font-bold my-6 text-center">Ultra Gemini ☁ Cloudflare 輕音Joy-AI公益站</h1>
  <a href="https://qyjoy.vip" target="_blank" class="text-center block font-bold cursor-pointer mb-6 animate-breathe" style="text-shadow:0 0 8px rgba(0,255,255,0.7);">抖音 | Bilibili | Youtube | 小红书 | 公众号: 輕音Joy</a>
  <div class="w-full max-w-6xl bg-gray-800 shadow-lg rounded-lg p-6">
    <div class="mb-4">
      <label for="model" class="block mb-2 text-sm font-medium text-gray-300">选择模型：</label>
      <select id="model" class="w-full p-2.5 rounded bg-gray-700 border border-gray-600/50 text-white focus:ring-blue-500 focus:border-blue-500" style="background:rgba(55,65,81,0)!important;backdrop-filter:blur(4px)">
        <option value="gemini-2.5-flash-preview-04-17">Gemini 2.5 Pro Preview</option>
        </select>
    </div>
    <div class="mb-4">
      <label for="prompt" class="block mb-2 text-sm font-medium text-gray-300">输入你的内容或画面描述：</label>
      <textarea id="prompt" rows="3" class="w-full p-2.5 rounded bg-gray-700 border border-gray-600/50 text-white focus:ring-blue-500 focus:border-blue-500 resize-y" placeholder="例如：輕音Joy是哪个博主" style="background:rgba(55,65,81,0)!important;backdrop-filter:blur(4px)"></textarea>
    </div>
    <button id="sendBtn" class="flex items-center justify-center gap-2 w-full p-3 rounded font-semibold text-white/90 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed" style="background:rgba(37,99,235,0.75)!important;border:1px solid rgba(255,255,255,0.8)!important;backdrop-filter:blur(8px);box-shadow:0 2px 8px rgba(0,0,0,0.1)" onmouseover="this.style.background='rgba(29,78,216,0.1)'" onmouseout="this.style.background='rgba(37,99,235,0.85)'">
      <img src="https://www.cloudflare.com/favicon.ico" alt="Cloudflare" class="w-4 h-4"><span class="button-text">发送 Post</span><span id="sendIcon">➤</span><span id="loadingIcon" class="loader hidden"></span>
    </button>
    <div id="chat-container" class="mt-6 border-t border-gray-700 pt-4">
      <div id="chat" class="flex flex-col space-y-4">
        <div class="ai-message"><strong>AI:</strong> 你好！请选择一个模型并输入你的请求。</div>
      </div>
    </div>
    <p class="text-yellow-300 font-bold mt-4 mb-2 text-center text-sm">Powered By Cloudflare Worker Serverless (BETA) | © 2025 輕音Joy</p>
  </div>
  <footer class="text-center text-gray-500 text-sm mt-8 pb-4"></footer>
  ${clientScript}
</body>
</html>`;
}
