// src/html-renderer.js
import { TURNSTILE_SITE_KEY } from './config.js'; // You'll get this from env or D1

// --- Existing getStyles() ---
// Add new styles for login/register forms, user info display, API line selector, Turnstile
const getStyles = () => `
<style>
/* ... (all existing styles) ... */

/* Login/Register Form Styles */
.auth-form-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: none; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(5px); }
.auth-form { background: rgba(var(--input-bar-bg-rgb), 0.95); padding: 2rem; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 90%; max-width: 400px; }
.auth-form h2 { text-align: center; margin-bottom: 1.5rem; color: rgba(var(--user-text-rgb), 0.9); }
.auth-form input { width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid rgba(var(--input-border-rgb), 0.7); border-radius: 4px; background: rgba(var(--input-bg-rgb), 0.7); color: rgba(var(--user-text-rgb),0.9); }
.auth-form button { width: 100%; padding: 0.75rem; background: rgba(var(--theme-primary-rgb),0.8); color: white; border: none; border-radius: 4px; cursor: pointer; transition: background 0.3s; }
.auth-form button:hover { background: rgba(var(--theme-primary-rgb),1); }
.auth-form .toggle-form { text-align: center; margin-top: 1rem; font-size: 0.9em; }
.auth-form .toggle-form a { color: rgba(var(--link-text-rgb),0.9); cursor: pointer; text-decoration: underline; }
.auth-form .error-message-form { color: red; font-size: 0.9em; margin-bottom: 1rem; text-align: center; }

/* User Info Display */
#userInfo { display: flex; align-items: center; gap: 10px; padding: 5px 10px; position: absolute; top: 10px; right: 10px; background: rgba(var(--input-bar-bg-rgb), 0.7); border-radius: 6px; z-index: 100; color: rgba(var(--user-text-rgb),0.8); font-size: 0.9em;}
#userInfo .coins { font-weight: bold; }
#userInfo button { background: rgba(var(--theme-primary-rgb),0.6); color: white; border:none; padding: 5px 8px; border-radius: 4px; cursor: pointer; font-size:0.9em; }
#userInfo button:hover { background: rgba(var(--theme-primary-rgb),0.8); }

/* API Line Selector */
#apiLineContainer { margin-top: 0.5rem; }
#apiLine { width: 100%; p-2.5 rounded border text-white focus:ring-blue-500 focus:border-blue-500 /* Copied from modelSelect */ }

/* Turnstile Widget Placeholder */
#turnstileWidgetContainer { margin-top: 10px; display: flex; justify-content: center; }

/* Particle Button Animation (Placeholder) */
.particle-button-active { /* Styles for when particle animation is active */ }

/* ... Rainbow theme specific styles ... */
/* Ensure rainbow theme styles apply to new elements if needed */
.rainbow-active .auth-form, .rainbow-active #userInfo { /* Apply rainbow gradient backgrounds */
  animation: rainbowBreath 10s linear infinite !important;
  background: linear-gradient(60deg, /* ... similar to other rainbow elements ... */ ) !important;
  background-size: 300% 300% !important;
  border-color: rgba(255,255,255,0.6) !important;
}
.rainbow-active .auth-form input, .rainbow-active .auth-form button, .rainbow-active #userInfo button {
   /* ... similar styles for rainbow inputs/buttons ... */
}
</style>
`;

// --- Updated getClientScript() ---
const getClientScript = (turnstileSiteKeyFromEnv) => `
<script>
// Turnstile callback will be defined globally if needed
let turnstileWidgetId = null;
function onTurnstileSuccess(token) {
    console.log('Turnstile success, token:', token);
    // Add token to a hidden input or store globally to send with the next request
    document.getElementById('turnstileTokenInput').value = token;
    // Optionally, auto-submit the form or enable the send button
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn.dataset.pendingAction === 'send') {
        handleSend(true); // Pass a flag to indicate Turnstile was just solved
    }
    hideTurnstileModal();
}
function onTurnstileError() { console.error('Turnstile error.'); hideTurnstileModal(); }
function onTurnstileExpired() { console.warn('Turnstile expired.'); hideTurnstileModal(); requestTurnstile(); }

function showTurnstileModal() {
    const modal = document.getElementById('turnstileModal');
    if (!modal) return;
    modal.style.display = 'flex';
    if (!turnstileWidgetId && typeof turnstile !== 'undefined') {
        turnstileWidgetId = turnstile.render('#turnstileWidgetContainer', {
            sitekey: '${turnstileSiteKeyFromEnv}', // Injected from server
            callback: onTurnstileSuccess,
            'error-callback': onTurnstileError,
            'expired-callback': onTurnstileExpired,
            theme: 'dark', // or 'light' or 'auto'
        });
    } else if (turnstileWidgetId && typeof turnstile !== 'undefined') {
        turnstile.reset(turnstileWidgetId);
    }
}
function hideTurnstileModal() {
    const modal = document.getElementById('turnstileModal');
    if (modal) modal.style.display = 'none';
}
function requestTurnstile() { // Call this when server indicates challenge needed
    showTurnstileModal();
}

// Particle Animation Placeholder
function triggerButtonParticleAnimation(buttonElement) {
    if (document.documentElement.classList.contains('rainbow-theme-active')) return; // Skip for rainbow
    // TODO: Implement particle effect for other themes
    // Example: buttonElement.classList.add('particle-button-active');
    // Use a library like tsparticles or a custom CSS/JS animation
    console.log("Particle animation would trigger for button:", buttonElement.id);
}

document.addEventListener('DOMContentLoaded', () => {
  // ... (existing themeConfig and theme application logic) ...
  // --- MODIFIED: applyTheme needs to consider new elements ---
  function applyTheme(themeName) {
    // ... (existing theme application to root vars) ...
    const isRainbow = themeName === 'rainbow';
    document.documentElement.classList.toggle('rainbow-theme-active', isRainbow); // For global rainbow state

    const allInteractiveElements = document.querySelectorAll(
      'select, #prompt, #sendBtn, #clearChatBtn, #settingsBtn, #fileUploadBtn, #customApiKey, #saveApiKeyBtn, #setBgBtn, #fontSizeSlider, .auth-form input, .auth-form button, #userInfo button, #apiLine'
    );
    // ... (rest of applyTheme logic, ensuring new elements are styled) ...
    // Handle auth form and user info specific styling if needed based on theme
    const authForm = document.querySelector('.auth-form');
    const userInfoDisplay = document.getElementById('userInfo');
    if (authForm) authForm.classList.toggle('rainbow-active', isRainbow);
    if (userInfoDisplay) userInfoDisplay.classList.toggle('rainbow-active', isRainbow);
  }
  // ... (rest of initTheme) ...

  // DOM Elements
  // ... (all existing elements) ...
  const loginFormContainer = document.getElementById('loginFormContainer');
  const registerFormContainer = document.getElementById('registerFormContainer');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showLoginBtn = document.getElementById('showLoginBtn');
  const showRegisterBtn = document.getElementById('showRegisterBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userInfoDisplay = document.getElementById('userInfo');
  const userEmailDisplay = document.getElementById('userEmail');
  const userCoinsDisplay = document.getElementById('userCoins');
  const apiLineSelect = document.getElementById('apiLine');
  const turnstileTokenInput = document.getElementById('turnstileTokenInput');

  let csrfToken = null; // Store CSRF token after login/page load

  // Function to fetch user state and API lines
  async function fetchInitialData() {
    try {
      const response = await fetch('/api/initial-data', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch initial data');
      const data = await response.json();

      if (data.user) {
        updateUserInfo(data.user.email, data.user.coins);
        csrfToken = data.csrfToken; // Store CSRF token
        if(showLoginBtn) showLoginBtn.style.display = 'none';
        if(showRegisterBtn) showRegisterBtn.style.display = 'none';
        if(logoutBtn) logoutBtn.style.display = 'inline-block';
        if(userInfoDisplay) userInfoDisplay.style.display = 'flex';
      } else {
        updateUserInfo(null, null);
        if(showLoginBtn) showLoginBtn.style.display = 'inline-block';
        if(showRegisterBtn) showRegisterBtn.style.display = 'inline-block';
        if(logoutBtn) logoutBtn.style.display = 'none';
        if(userInfoDisplay) userInfoDisplay.style.display = 'none';
      }

      if (data.apiLines && apiLineSelect) {
        apiLineSelect.innerHTML = ''; // Clear existing
        data.apiLines.forEach(line => {
          const option = document.createElement('option');
          option.value = line.id;
          option.textContent = line.line_name;
          apiLineSelect.appendChild(option);
        });
      }
      
      // If Turnstile site key is provided by server (e.g. from D1 settings)
      // This example uses a key injected into the script from html-renderer.js
      // if (data.turnstileSiteKey && typeof turnstile !== 'undefined') {
      //    // Initialize Turnstile if not already
      // }


    } catch (error) {
      console.error("Error fetching initial data:", error);
      // Handle error, maybe show a default state
    }
  }

  function updateUserInfo(email, coins) {
    if (email && userEmailDisplay) userEmailDisplay.textContent = email;
    if (coins !== null && userCoinsDisplay) userCoinsDisplay.textContent = coins;
  }

  // Auth Form Handling
  function toggleAuthForms(showForm) {
    if (loginFormContainer) loginFormContainer.style.display = (showForm === 'login' ? 'flex' : 'none');
    if (registerFormContainer) registerFormContainer.style.display = (showForm === 'register' ? 'flex' : 'none');
  }

  if (showLoginBtn) showLoginBtn.addEventListener('click', () => toggleAuthForms('login'));
  if (showRegisterBtn) showRegisterBtn.addEventListener('click', () => toggleAuthForms('register'));
  document.querySelectorAll('.close-auth-form').forEach(btn => {
    btn.addEventListener('click', () => {
        if(loginFormContainer) loginFormContainer.style.display = 'none';
        if(registerFormContainer) registerFormContainer.style.display = 'none';
    });
  });
   document.querySelectorAll('.toggle-form a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetForm = e.target.dataset.target;
        toggleAuthForms(targetForm);
    });
  });


  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      const errorMsgEl = loginForm.querySelector('.error-message-form');
      if (response.ok) {
        if(errorMsgEl) errorMsgEl.textContent = '';
        toggleAuthForms(null);
        await fetchInitialData(); // Refresh user state
      } else {
        if(errorMsgEl) errorMsgEl.textContent = result.message || 'Login failed.';
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      const confirmPassword = e.target.confirmPassword.value;
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      const errorMsgEl = registerForm.querySelector('.error-message-form');
      if (response.ok) {
         if(errorMsgEl) errorMsgEl.textContent = '';
        alert(result.message || 'Registration successful! Please log in.');
        toggleAuthForms('login'); // Switch to login form
      } else {
        if(errorMsgEl) errorMsgEl.textContent = result.message || 'Registration failed.';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const response = await fetch('/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', [csrfToken ? 'X-CSRF-Token' : '']: csrfToken || '' } // Add CSRF token
      });
      if (response.ok) {
        csrfToken = null; // Clear CSRF token
        await fetchInitialData(); // Refresh user state
      } else {
        alert('Logout failed. Please try again.');
      }
    });
  }
  
  // ... (all other existing client-side JS: addMessage, handleSend, etc.) ...

  // --- MODIFIED: setLoadingState ---
  function setLoadingState(isLoading) {
    // ... (existing logic) ...
    if (buttonText && sendBtn) { // Ensure buttonText is valid
        buttonText.textContent = isLoading ? "处理中..." : "发送 (Post)";
        if (isLoading) {
            triggerButtonParticleAnimation(sendBtn); // Trigger particle animation
        } else {
            // TODO: Stop particle animation if applicable
            // sendBtn.classList.remove('particle-button-active');
        }
    }
    // ...
  }
  
  // --- MODIFIED: handleSend ---
  async function handleSend(turnstileSolved = false) {
    let aiMessageDiv = null;
    let responseContentSpan = null;
    const sendBtnElement = document.getElementById('sendBtn');


    try {
      const promptText = promptTextarea.value.trim();
      const model = modelSelect.value;
      const selectedApiLine = apiLineSelect ? apiLineSelect.value : null; // Get selected API line

      if (!promptText && uploadedFiles.length === 0) { 
        alert("请输入你的内容、描述或上传文件！"); 
        promptTextarea.focus(); return; 
      }
      
      // If Turnstile was just solved, the token is in turnstileTokenInput
      // Otherwise, it might be empty if not needed or already used.
      let currentTurnstileToken = turnstileSolved ? turnstileTokenInput.value : ""; 
      
      // If server previously indicated Turnstile is needed, but token is not available,
      // (e.g. user closed modal without solving), then re-request.
      // This logic needs to be robust based on server signals.
      // For now, if turnstileTokenInput is empty and we *think* we need one, show modal.
      // This is a simplification. Server should explicitly tell client via a flag.
      if (sendBtnElement.dataset.turnstileRequired === 'true' && !currentTurnstileToken && !turnstileSolved) {
          sendBtnElement.dataset.pendingAction = 'send'; // Store that send was attempted
          requestTurnstile();
          return; // Stop here, wait for Turnstile callback
      }
      sendBtnElement.dataset.pendingAction = ''; // Clear pending action

      setLoadingState(true);
      // ... (rest of user message preparation) ...
      
      const requestPayload = {
          prompt: promptText, 
          model: model,
          history: conversationHistory.slice(0, -1), 
          currentTurnParts: currentTurnUserParts,
          apiLineId: selectedApiLine, // Send selected API line
          // 'cf-turnstile-response': currentTurnstileToken // Send Turnstile token if available/needed
      };
      
      const headers = { 
        "Content-Type": "application/json",
      };
      if (csrfToken) { // Add CSRF token for authenticated users
          headers['X-CSRF-Token'] = csrfToken;
      }
      if (currentTurnstileToken) { // Add Turnstile token if present
          headers['cf-turnstile-response'] = currentTurnstileToken;
      }


      // If using custom API key from local storage (kept for individual use if desired)
      // const customKey = localStorage.getItem('customGeminiApiKey');
      // if (customKey) {
      //     requestPayload.customApiKey = customKey;
      // }

      const res = await fetch('/chat-api', { // Changed endpoint
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestPayload)
      });
      
      // Clear Turnstile token after use
      if (turnstileTokenInput) turnstileTokenInput.value = '';
      sendBtnElement.dataset.turnstileRequired = 'false'; // Assume not required for next unless server says so

      if (thinkingSpan) thinkingSpan.remove();
      let thinkingIcon = document.querySelector('.thinking-icon');
      if (thinkingIcon) thinkingIcon.remove();

      if (res.status === 401) { // Unauthorized (e.g. session expired)
          alert("Session expired or unauthorized. Please log in again.");
          await fetchInitialData(); // Refresh to show login
          throw new Error("Unauthorized");
      }
      if (res.status === 403) { // Forbidden
          const errorData = await res.json();
          if (errorData && errorData.turnstile_challenge_needed) {
              sendBtnElement.dataset.turnstileRequired = 'true';
              sendBtnElement.dataset.pendingAction = 'send';
              requestTurnstile(); // Show Turnstile challenge
              // Don't throw error yet, wait for user to solve challenge.
              // setLoadingState(false) will be called in finally, or handleSend re-triggered.
              return; 
          } else if (errorData && errorData.error.includes("CSRF")) {
             alert("Security token mismatch. Please refresh the page and try again.");
             throw new Error("CSRF token error");
          } else {
             alert("Access denied. " + (errorData.error || ""));
             throw new Error("Forbidden");
          }
      }
      if (res.status === 429) { // Rate limited
          const errorData = await res.json();
          alert(errorData.error || "Rate limit exceeded. Please try again later.");
          throw new Error("Rate limited");
      }
       if (res.status === 402) { // Payment Required (insufficient coins)
          const errorData = await res.json();
          alert(errorData.error || "Insufficient coins. Please recharge or use a cheaper model.");
          await fetchInitialData(); // Refresh coin balance
          throw new Error("Insufficient coins");
      }


      if (!res.ok) {
        // ... (existing error handling for other non-ok statuses) ...
      }
      
      // After successful response, update coin display if user is logged in
      if (res.headers.get('X-Coins-Remaining')) {
          const coinsRemaining = res.headers.get('X-Coins-Remaining');
          updateUserInfo(null, coinsRemaining); // Only update coins
      }

      // ... (rest of SSE processing logic, unchanged) ...
    } catch (error) {
      // ... (existing catch block) ...
    } finally {
      // ... (existing finally block) ...
      setLoadingState(false);
      promptTextarea.focus();
      let thinkingIcon = document.querySelector('.thinking-icon'); 
      if (thinkingIcon) thinkingIcon.remove();
      console.log("UI re-enabled.");
    }
  }
  
  // Fetch initial data on load
  fetchInitialData();
  // Add Turnstile script dynamically
  const turnstileScript = document.createElement('script');
  turnstileScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  turnstileScript.async = true;
  turnstileScript.defer = true;
  document.head.appendChild(turnstileScript);

});
</script>
`;

// --- Updated renderHTML() ---
export function renderHTML(isMobile, env) { // Pass env to get Turnstile site key
  const styles = getStyles();
  const turnstileSiteKey = env.TURNSTILE_SITE_KEY; // Get from environment
  const clientScript = getClientScript(turnstileSiteKey);
  // ... (viewportMeta) ...

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <!-- ... (existing head content: charset, title, icon, tailwind, marked) ... -->
  ${styles}
</head>
<!-- ... (existing body tag) ... -->

  <!-- Auth Modals -->
  <div id="loginFormContainer" class="auth-form-container">
    <div class="auth-form">
      <span class="close-auth-form" style="position:absolute;top:10px;right:15px;font-size:20px;cursor:pointer;">×</span>
      <h2>登录 Login</h2>
      <p class="error-message-form"></p>
      <form id="loginForm">
        <input type="email" name="email" placeholder="邮箱 Email" required>
        <input type="password" name="password" placeholder="密码 Password" required>
        <button type="submit">登录 Login</button>
      </form>
      <div class="toggle-form">没有账户? <a data-target="register">立即注册 Register</a></div>
    </div>
  </div>
  <div id="registerFormContainer" class="auth-form-container">
    <div class="auth-form">
      <span class="close-auth-form" style="position:absolute;top:10px;right:15px;font-size:20px;cursor:pointer;">×</span>
      <h2>注册 Register</h2>
      <p class="error-message-form"></p>
      <form id="registerForm">
        <input type="email" name="email" placeholder="邮箱 Email" required>
        <input type="password" name="password" placeholder="密码 Password (min 8 chars)" required>
        <input type="password" name="confirmPassword" placeholder="确认密码 Confirm Password" required>
        <button type="submit">注册 Register</button>
      </form>
      <div class="toggle-form">已有账户? <a data-target="login">立即登录 Login</a></div>
    </div>
  </div>

  <!-- Turnstile Modal -->
  <div id="turnstileModal" class="auth-form-container" style="z-index: 2001;"> <!-- Higher z-index -->
    <div class="auth-form" style="text-align: center;">
        <h2>安全验证 Security Check</h2>
        <p style="margin-bottom:1rem; color: rgba(var(--user-text-rgb),0.8);">请完成验证以继续 Please complete the check to continue.</p>
        <div id="turnstileWidgetContainer"></div>
        <input type="hidden" id="turnstileTokenInput">
    </div>
  </div>


  <!-- User Info Display -->
  <div id="userInfo" style="display:none;">
    <span id="userEmail"></span> | 💰 <span id="userCoins"></span> Coins
    <button id="logoutBtn" style="display:none;">登出 Logout</button>
    <a href="/admin" id="adminLink" style="display:none; margin-left:10px; color: yellow; text-decoration:underline;">管理后台</a>
  </div>
  <button id="showLoginBtn" style="position:absolute; top:10px; right:120px; z-index:100; /* style like other buttons */">登录</button>
  <button id="showRegisterBtn" style="position:absolute; top:10px; right:10px; z-index:100; /* style like other buttons */">注册</button>


  <div class="main-content-area">
    <!-- ... (existing h1, link to qyjoy.vip) ... -->
    <div class="px-4 sm:px-6 pb-0">
      <div class="flex flex-col sm:flex-row gap-3 my-1">
        <div class="w-full sm:w-1/3"> <!-- Adjusted width -->
          <label for="model" class="block mb-1 text-sm font-medium text-gray-300">👆选择模型 Choose A Model：</label>
          <select id="model" class="w-full p-2.5 rounded border text-white focus:ring-blue-500 focus:border-blue-500">
            <!-- Options remain the same -->
          </select>
        </div>
        <div class="w-full sm:w-1/3"> <!-- Adjusted width -->
          <label for="theme" class="block mb-1 text-sm font-medium text-gray-300">🎨主题颜色 Theme color:</label>
          <select id="theme" class="w-full p-2.5 rounded border text-white">
            <!-- Options remain the same -->
          </select>
        </div>
        <div class="w-full sm:w-1/3"> <!-- New API Line Selector -->
          <label for="apiLine" class="block mb-1 text-sm font-medium text-gray-300">📡选择线路 API Line:</label>
          <select id="apiLine" class="w-full p-2.5 rounded border text-white focus:ring-blue-500 focus:border-blue-500">
            <!-- Options will be populated by JS -->
            <option value="">Loading lines...</option>
          </select>
        </div>
      </div>
    </div>
    <!-- ... (chat-container and chat div) ... -->
  </div>
  <!-- ... (input-bar-container and its contents, filePreviews, prompt, sendBtn, clearChatBtn, settingsBtn) ... -->
  <!-- Note: customApiKey input can be re-purposed or removed if all API keys are managed centrally via lines -->
  
  ${clientScript}
</body>
</html>`;
}