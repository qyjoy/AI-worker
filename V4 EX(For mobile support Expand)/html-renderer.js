const getStyles = () => `
<style>
#video-bg {position: fixed;right: 0;bottom: 0;min-width: 100%;min-height: 100%;z-index: -1;object-fit: cover;}
:root {
  --table-bg-rgb: 0, 0, 0;
  --error-message-rgb: 185, 28, 28;
  --user-text-rgb: 255, 255, 255;
  --ai-text-rgb: 255, 255, 255;
  --link-text-rgb: 199, 210, 254;
  --theme-primary-rgb: 29, 78, 216; 
  --table-hover-rgb: 74, 85, 104;
  --input-border-rgb: 55, 65, 81;
  --table-border-rgb: 55, 65, 81;
  --table-header-rgb: 30, 41, 59;
  --input-bar-bg-rgb: 17, 24, 39; 
}
html, body { height: 100vh;margin: 0; padding: 0; overflow: hidden;}
body {background: url('https://img.picui.cn/free/2025/05/17/6828a34e93555.png') no-repeat center center fixed;background-size: cover; display: flex; flex-direction: column;}
.main-content-area {backdrop-filter: blur(2px); flex-grow: 1; display: flex; flex-direction: column; width: 100%; overflow: hidden;}
#chat-container { flex: 1 1 auto; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #4b5563 #374151; padding: 0.5rem 1rem; height: calc(100vh - 170px); }
#chat > div {background-color: rgba(var(--user-message-rgb), 0.8);}
.ai-message {  background-color: rgba(var(--ai-message-rgb), 0.8);}

#prompt, #sendBtn, #clearChatBtn, #settingsBtn, #fileUploadBtn, #customApiKey, #saveApiKeyBtn, #setBgBtn, select {  background-color: rgba(var(--input-bg-rgb), 0.5)!important; border-color: rgba(var(--input-border-rgb), 0.7) !important;}
#sendBtn:hover {  background-color: rgba(var(--theme-primary-rgb), 0.6)!important;}
.input-bar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000; 
  background-color: rgba(var(--input-bar-bg-rgb), 0.9);
  backdrop-filter: blur(2px);
  padding: 0.2rem 0.2rem;
  border-top: 1px solid rgba(var(--input-border-rgb), 0.7);
  display: flex;
  flex-direction: column;
  box-shadow: 0 -2px 1px rgba(0,0,0,0.1);
}
.user-message {
  background-color: rgba(var(--user-message-rgb), 0.8)!important;
  color: rgba(var(--user-text-rgb), 0.9)!important;
  align-self: flex-end;
  margin-left: 3%;
  border: 1px solid rgba(var(--user-message-rgb), 0.9);
  position: relative; 
}
.ai-message {
  background-color: rgba(var(--ai-message-rgb), 0.8)!important;
  color: rgba(var(--ai-text-rgb), 0.9)!important;
  align-self: flex-start;
  margin-right: 2%;
  white-space: pre-wrap;
  border: 1px solid rgba(var(--ai-message-rgb), 0.9);
}
#chat > div { margin-bottom: 0.2rem; padding: 0.25rem; border-radius: 0.5rem; max-width: 95%; word-break: break-word; line-height: 1.6; }
.ai-message > strong::before {content: "";display: inline-block;width: 20px;height: 20px;background-image: url('https://www.gstatic.com/lamda/images/sparkle_resting_v2_1ff6f6a71f2d298b1a31.gif');background-size: contain;background-repeat: no-repeat;margin-right: 8px;vertical-align: middle;}

.text-3xl{background:linear-gradient(45deg,red,orange,yellow,green,blue,purple,red);-webkit-background-clip:text;background-clip:text;color:transparent;background-size:500% auto;animation:rainbow 10s linear infinite}@keyframes rainbow{0%{background-position:0}300%{background-position:500%}}
@keyframes textGlow{0%{text-shadow:0 0 10px rgba(var(--theme-primary-rgb),.8),0 0 20px rgba(var(--theme-primary-rgb),.6);transform:scale(1)}50%{text-shadow:0 0 30px rgba(var(--theme-primary-rgb),.9),0 0 50px rgba(var(--theme-primary-rgb),.8),0 0 70px rgba(var(--theme-primary-rgb),.6);transform:scale(1.05)}100%{text-shadow:0 0 10px rgba(var(--theme-primary-rgb),.8),0 0 20px rgba(var(--theme-primary-rgb),.6);transform:scale(1)}}
.thinking{animation:textGlow 1.5s ease-in-out infinite;color:#a78bfa!important;font:italic bold 1.2em sans-serif}
@keyframes icon2DRotate {0% { opacity: 0; transform: scale(0) rotateY(0deg); } 10% { opacity: 1; transform: scale(3) rotateY(0deg); } 50% { transform: scale(3) rotateY(180deg); } 90% { transform: scale(3) rotateY(350deg); } 100% { opacity: 0; transform: scale(0) rotateY(360deg); }}
.thinking-icon {position: fixed; top: 40%; left: 50%;width: 80px; height: 80px; margin: -40px 0 0 -40px;pointer-events: none;animation: icon2DRotate 6s ease-in-out forwards;transform-origin: center center;transform-style: preserve-3d;filter: drop-shadow(0 0 25px #dba0ff) brightness(1.5) saturate(1.8);z-index: 9999;}
@media (min-width: 768px) {
  #chat > div {
    max-width: min(95%, 1200px); 
    padding: 1rem 1.25rem;
  }
  
  .user-message, .ai-message {
    margin-left: 1%;
    margin-right: 1%;
  }
}
.ai-message .response-content p { margin-bottom: 0.5em; }
.ai-message .response-content ul, .ai-message .response-content ol { margin-left: 0.5em; margin-bottom: 0.5em; }
.ai-message .response-content li { margin-bottom: 0.25em; }
.ai-message img.generated-image { display: block; max-width: 100%; max-height: 300px; height: auto; margin-top: 0.75rem; border-radius: 0.375rem; background-color: #4b5563; }
.ai-message strong, .user-message strong { display: block; margin-bottom: 0.25rem; font-weight: bold; color: #9ca3af; }
.ai-message .response-content strong { font-weight: bold; color: inherit; }
.error-message { background-color: rgba(var(--error-message-rgb), 0.8) !important; color: white !important; }
.loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; display: inline-block; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
textarea#prompt { scrollbar-width: thin; scrollbar-color: #4b5563 #374151; min-height: 42px; /* Match button height */ line-height: 1.5; resize: none;} 
@keyframes breathe{0%{color:white;text-shadow:0 0 8px rgba(255,255,255,0.7);}50%{color:#22d3ee;text-shadow:0 0 12px rgba(34,211,238,0.9);}100%{color:white;text-shadow:0 0 8px rgba(255,255,255,0.7);}}.animate-breathe{animation:breathe 3s ease-in-out infinite;}

.ai-message table {
  border-collapse: collapse;
  width: 98%;
  margin: 1em auto;
  background: rgba(var(--table-bg-rgb), 0.9)!important;
  border: 1px solid rgba(var(--table-border-rgb), 0.8)!important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.ai-message th {  background-color: rgba(var(--table-header-rgb), 0.9)!important; color: #E2E8F0; font-weight: bold;}
.ai-message tr:hover td {  background-color: rgba(var(--table-hover-rgb), 0.4)!important;}
.ai-message th, .ai-message td {
  border: 1px solid rgba(var(--table-border-rgb), 0.8);
  padding: 0.5rem 0.75rem;
  text-align: left;
  background: transparent!important;
}
.ai-message tr { background: transparent!important; }
.ai-message table strong::before { display: none!important; }

#chat > div {
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
#chat > div:hover {
  transform: scale(1.01); /* Subtle hover */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

/* Edit pencil button */
.edit-prompt-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: rgba(100,100,100,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  cursor: pointer;
  display: none; /* Hidden by default */
  opacity: 0.7;
  transition: opacity 0.2s;
  line-height: 24px; text-align: center;
}
.user-message:hover .edit-prompt-btn { display: inline-block; }
.edit-prompt-btn:hover { opacity: 1; }

/* File preview */
.file-preview-badge {
  display: inline-block;
  background-color: rgba(var(--theme-primary-rgb), 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  margin-right: 3px;
  margin-bottom: 3px;
}
.file-preview-badge .remove-file {
  margin-left: 3px;
  cursor: pointer;
  font-weight: bold;
}
.input-bar-container {position: fixed;bottom: 0;left: 0;right: 0;}
#filePreviews { box-shadow: none !important; border: none !important; }
#filePreviews.has-files { box-shadow: none !important; border: none !important; }
.video-preview-badge {display: inline-block;background-color: rgba(var(--theme-primary-rgb), 0.6);color: white;padding: 2px 8px;border-radius: 12px;font-size: 0.8em;margin-right: 5px;margin-bottom: 5px;}

/* Rainbow Theme Specifics */
@keyframes rainbowBreath {
    0% { background-position: 0% 50%; filter: hue-rotate(0deg); opacity: 0.8; }
    50% { background-position: 100% 50%; filter: hue-rotate(180deg); opacity: 0.95; }
    100% { background-position: 0% 50%; filter: hue-rotate(360deg); opacity: 0.8; }
}

/* Main content area subtle rainbow background */
.rainbow-theme-bg {
  animation: rainbowBreath 20s ease-in-out infinite !important;
  background: linear-gradient(45deg, rgba(105,25,205,0.05) 0%, rgba(255,0,0,0.05) 15%, rgba(255,165,0,0.05) 30%, rgba(255,255,0,0.05) 45%, rgba(0,255,0,0.05) 60%, rgba(0,0,255,0.05) 75%, rgba(75,0,130,0.05) 90%, rgba(255,211,255,0.05) 100%) !important;
  background-size: 300% 300% !important;
}

/* Chat bubbles for rainbow theme */
.user-message.rainbow-theme-bubble {
  border-color: rgba(255,255,255,0.5) !important;
  animation: rainbowBreath 9s linear infinite !important; 
  background: linear-gradient(60deg, 
    rgba(0,0,255,0.5) 0%,      /* Blue */
    rgba(75,0,130,0.5) 20%,   /* Indigo */
    rgba(255,0,0,0.5) 40%,    /* Red */
    rgba(255,165,0,0.5) 60%, /* Orange */
    rgba(255,255,0,0.5) 80%, /* Yellow */
    rgba(0,255,0,0.5) 100%   /* Green */
  ) !important;
  background-size: 300% 300% !important;
  color: white !important; 
}

.ai-message.rainbow-theme-bubble {
  border-color: rgba(255,255,255,0.5)!important;
  animation: rainbowBreath 8s linear infinite !important;
  background: linear-gradient(45deg, 
    rgba(255, 211, 255, 0.5) 0%, /* Pinkish */
    rgba(255,165,0,0.5) 20%,   /* Orange */
    rgba(255,255,0,0.5) 40%,   /* Yellow */
    rgba(0,255,0,0.5) 60%,     /* Green */
    rgba(0,0,255,0.5) 80%,     /* Blue */
    rgba(148,0,211,0.5) 100%   /* Violet */
  ) !important;
  background-size: 300% 300% !important;
  color: white !important; 
}

.input-bar-container.rainbow-active #prompt,
.input-bar-container.rainbow-active #sendBtn,
.input-bar-container.rainbow-active #clearChatBtn,
.input-bar-container.rainbow-active #settingsBtn,
.input-bar-container.rainbow-active #fileUploadBtn,
.input-bar-container.rainbow-active #customApiKey,
.input-bar-container.rainbow-active #saveApiKeyBtn,
.input-bar-container.rainbow-active #setBgBtn,
.input-bar-container.rainbow-active select,
.input-bar-container.rainbow-active #filePreviews .file-preview-badge,
.input-bar-container.rainbow-active #filePreviews .video-preview-badge {
    animation: rainbowBreath 8s linear infinite !important;
    background: linear-gradient(45deg,
      rgba(255, 211, 255, 0.7) 0%, /* Pinkish */
      rgba(255,165,0,0.7) 15%,    /* Orange */
      rgba(255,255,0,0.7) 30%,    /* Yellow */
      rgba(0,255,0,0.7) 45%,      /* Green */
      rgba(0,0,255,0.7) 60%,      /* Blue */
      rgba(75,0,130,0.7) 75%,     /* Indigo */
      rgba(148,0,211,0.7) 90%,    /* Purple */
      rgba(255,211,255,0.7) 100% /* Loop back to Pinkish for smooth transition */
    ) !important;
    background-size: 300% 300% !important;
    border-color: rgba(255,255,255,0.6) !important;
    color: white !important; /* Ensure text is visible */
    text-shadow: 0 1px 2px rgba(0,0,0,0.3); 
}

/* Hover effects for the buttons in the rainbow theme */
.input-bar-container.rainbow-active #sendBtn:hover,
.input-bar-container.rainbow-active #clearChatBtn:hover,
.input-bar-container.rainbow-active #settingsBtn:hover,
.input-bar-container.rainbow-active #fileUploadBtn:hover,
.input-bar-container.rainbow-active #saveApiKeyBtn:hover,
.input-bar-container.rainbow-active #setBgBtn:hover {
    filter: brightness(1.2) saturate(1.2); 
    box-shadow: 0 0 10px rgba(255,255,255,0.4);
}

.input-bar-container.rainbow-active #prompt::placeholder,
.input-bar-container.rainbow-active #customApiKey::placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
    opacity: 1; 
}
.dragover-active {
  border-color: rgba(var(--theme-primary-rgb), 0.9) !important;
  box-shadow: 0 0 0 3px rgba(var(--theme-primary-rgb), 0.6) !important;
}
#fontSizeSlider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%; /* Full width within its container */
  height: 8px;
  background: rgba(var(--input-bg-rgb), 0.6);
  border-radius: 5px;
  outline: none;
  opacity: 0.8;
  transition: opacity .15s ease-in-out;
  border: 1px solid rgba(var(--input-border-rgb), 0.7);
}
#fontSizeSlider:hover {
  opacity: 1;
}
#fontSizeSlider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: rgba(var(--theme-primary-rgb), 0.9);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid rgba(255,255,255,0.6);
  box-shadow: 0 0 5px rgba(var(--theme-primary-rgb),0.6);
}
#fontSizeSlider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: rgba(var(--theme-primary-rgb), 0.9);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid rgba(255,255,255,0.6);
  box-shadow: 0 0 5px rgba(var(--theme-primary-rgb),0.6);
}
.input-bar-container.rainbow-active #fontSizeSlider {
    border-color: rgba(255,255,255,0.6) !important; /* Already covered by general rule but explicit for clarity */
}
.input-bar-container.rainbow-active #fontSizeSlider::-webkit-slider-thumb,
.input-bar-container.rainbow-active #fontSizeSlider::-moz-range-thumb {
  /* Thumb will use the animated background from the general rule for .rainbow-active controls */
}
</style>
`;

const getClientScript = () => `
<script>
document.addEventListener('DOMContentLoaded', () => {
  const themeConfig = {
     pink: { 
     bg: '45,30,40', user: '255,105,180', ai: '220,130,170', input: '200,100,150', table: '180,80,130', 
     tableHeader: '190,90,140', tableHover: '230,150,180', tableBorder: '210,120,160', error: '255,80,120', 
     primary: '255,150,200', userText: '255,240,245', aiText: '255,230,240', linkText: '255,180,220',
     inputBar: '30,20,30'
   },
    blue: { 
      bg: '20,42,58', user: '30,144,200', ai: '50,110,140', input: '40,100,130', table: '35,90,120', 
      tableHeader: '30,41,59', tableHover: '74,85,104', tableBorder: '55,65,81', error: '185,28,28',      
      primary: '0,150,200', userText: '240,250,255', aiText: '230,240,250', linkText: '160,220,255',
      inputBar: '17,24,39'
    },
    purple: {
      bg: '49,46,129', user: '76,29,149', ai: '76,29,149', input: '76,29,149', table: '76,29,149', 
      tableHeader: '60,20,120', tableHover: '90,40,160', tableBorder: '76,29,149', error: '134,25,143', 
      primary: '124,58,237', userText: '245,243,255', aiText: '245,243,255', linkText: '216,180,254',
      inputBar: '30,25,80'
    },
    green: {
      bg: '6,78,59', user: '5,150,105', ai: '5,150,105', input: '5,150,105', table: '5,150,105', 
      tableHeader: '4,120,80', tableHover: '10,170,120', tableBorder: '5,150,105', error: '28,185,100', 
      primary: '16,185,129', userText: '240,253,244', aiText: '240,253,244', linkText: '167,243,208',
      inputBar: '3,60,40'
    },
    cyberpunk: {
      bg: '17,24,39', user: '63,114,175', ai: '88,28,135', input: '28,28,40', table: '28,100,138',
      tableHeader: '15,82,87', tableHover: '0,255,255', tableBorder: '0,255,187', error: '255,0,122',
      primary: '0,255,187', userText: '224,242,254', aiText: '245,200,255', linkText: '0,255,255',
      inputBar: '10,15,30'
    },
    gradient: {
      bg: '25,25,112', user: '70,130,180', ai: '147,112,219', input: '106,90,205', table: '72,61,139',
      tableHeader: '123,104,238', tableHover: '138,43,226', tableBorder: '147,112,219', error: '255,99,71',
      primary: '255,140,0', userText: '240,248,255', aiText: '230,230,250', linkText: '255,215,0',
      inputBar: '20,20,80'
    },
    prism: {
      bg: '10,10,30', user: '255,105,180', ai: '147,112,219', input: '75,0,130', table: '123,104,238',
      tableHeader: '138,43,226', tableHover: '148,0,211', tableBorder: '255,20,147', error: '255,0,0',
      primary: '0,255,255', userText: '255,255,255', aiText: '255,215,0', linkText: '255,20,147',
      inputBar: '5,5,20'
    },
    rainbow: { 
      bg: '20,20,20', 
      user: '255,0,0', ai: '0,255,0', input: '0,0,255', table: '255,255,0',
      tableHeader: '255,0,255', tableHover: '0,255,255', tableBorder: '255,165,0',
      error: '255,0,122', primary: '148,0,211', userText: '250,250,250',
      aiText: '250,250,250', linkText: '255,255,255',
      inputBar: '15,15,15' 
    },
    red: {
      bg: '255,245,245', user: '255,100,100', ai: '255,150,150', input: '255,200,200', table: '255,230,230',
      tableHeader: '255,180,180', tableHover: '255,210,210', tableBorder: '255,160,160', error: '255,50,50',
      primary: '255,80,80', userText: '50,0,0', aiText: '60,0,0', linkText: '220,0,0', inputBar: '255,235,235'
    },
    yellow: { 
      bg: '50,40,5', user: '255,215,50', ai: '240,200,40', input: '200,180,40', table: '150,130,30',
      tableHeader: '170,150,35', tableHover: '230,210,80', tableBorder: '200,180,40', error: '255,100,0',
      primary: '255,190,0', userText: '40,30,0', aiText: '40,30,0', linkText: '255,165,0',
      inputBar: '40,35,10' 
     }
  };
  const themeSelect = document.getElementById('theme');
  const mainContentArea = document.querySelector('.main-content-area');
  const inputBarContainer = document.querySelector('.input-bar-container');

  function applyTheme(themeName) {
    const theme = themeConfig[themeName] || themeConfig.blue; // Fallback to blue (was default)
    const root = document.documentElement;
    root.style.setProperty('--theme-bg-rgb', theme.bg);
    root.style.setProperty('--table-hover-rgb', theme.tableHover || themeConfig.blue.tableHover);
    root.style.setProperty('--table-border-rgb', theme.tableBorder || themeConfig.blue.tableBorder);
    root.style.setProperty('--input-border-rgb', theme.input);
    root.style.setProperty('--table-header-rgb', theme.tableHeader || themeConfig.blue.tableHeader);
    root.style.setProperty('--user-message-rgb', theme.user);
    root.style.setProperty('--ai-message-rgb', theme.ai);
    root.style.setProperty('--input-bg-rgb', theme.input);
    root.style.setProperty('--table-bg-rgb', theme.table);
    root.style.setProperty('--error-message-rgb', theme.error);
    root.style.setProperty('--theme-primary-rgb', theme.primary);
    root.style.setProperty('--user-text-rgb', theme.userText);
    root.style.setProperty('--ai-text-rgb', theme.aiText);
    root.style.setProperty('--link-text-rgb', theme.linkText);
    root.style.setProperty('--input-bar-bg-rgb', theme.inputBar || themeConfig.blue.inputBar);

    const isCyberpunk = themeName === 'cyberpunk';
    const allInteractiveElements = document.querySelectorAll(
      'select, #prompt, #sendBtn, #clearChatBtn, #settingsBtn, #fileUploadBtn, #customApiKey, #saveApiKeyBtn, #setBgBtn, #fontSizeSlider'
    );
    const textElementsInSettings = document.querySelectorAll('#apiKeyControls label, #fontSizeValue');
    allInteractiveElements.forEach(el => {
      // Clear any inline styles first, to let CSS classes take precedence or apply new theme's styles
      el.style.borderColor = '';
      el.style.backgroundColor = '';

      if (themeName === 'rainbow') {
      } else if (isCyberpunk) {
        el.style.borderColor = 'rgba(0,255,187,0.8)';
        el.style.backgroundColor = 'rgba(28,28,40,0.9)';
        // Ensure text color for cyberpunk if not covered by general styles
        if (el.tagName === 'SELECT' || el.id === 'prompt' || el.id === 'customApiKey') {
            el.style.color = 'white'; 
        }
      } else { // Other themes (blue, pink, etc.)
        el.style.borderColor = 'rgba(' + getComputedStyle(root).getPropertyValue('--input-border-rgb') + ',0.7)';
        el.style.backgroundColor = 'rgba(' + getComputedStyle(root).getPropertyValue('--input-bg-rgb') + ',0.5)';
        // Ensure text color for other themes if not covered (usually white by default)
         if (el.tagName === 'SELECT' || el.id === 'prompt' || el.id === 'customApiKey') {
            el.style.color = 'rgba(' + getComputedStyle(root).getPropertyValue('--user-text-rgb') + ',0.9)';
        }
      }
    });
    textElementsInSettings.forEach(el => {
        if (themeName === 'rainbow') {
        } else {
            el.style.color = 'rgba(' + getComputedStyle(root).getPropertyValue('--user-text-rgb') + ',0.9)';
            el.style.textShadow = ''; 
        }
    });
    if (mainContentArea) {
        mainContentArea.classList.toggle('rainbow-theme-bg', themeName === 'rainbow');
    }
    document.body.classList.remove('rainbow-theme-active'); 
    if (inputBarContainer) {
      inputBarContainer.classList.toggle('rainbow-active', themeName === 'rainbow');
    }
    document.querySelectorAll('#chat > div').forEach(el => {
        el.style.backgroundColor = ''; 
        if (themeName === 'rainbow') {
            el.classList.add('rainbow-theme-bubble');
         } else {
            el.classList.remove('rainbow-theme-bubble');
            // Reapply theme-specific bubble colors if not rainbow
            if (el.classList.contains('user-message')) {
                el.style.backgroundColor = 'rgba(' + getComputedStyle(root).getPropertyValue('--user-message-rgb') + ',0.8)';
            } else if (el.classList.contains('ai-message')) {
                 el.style.backgroundColor = 'rgba(' + getComputedStyle(root).getPropertyValue('--ai-message-rgb') + ',0.8)';
            }
         }
    });
  }

  function initTheme() {
    themeSelect.value = 'rainbow'; 
    applyTheme('rainbow'); 

    themeSelect.addEventListener('change', (e) => {
      applyTheme(e.target.value);
      adjustMainContentPadding();
      const currentScroll = chatContainer.scrollTop;
      setTimeout(() => chatContainer.scrollTop = currentScroll, 0);
    });
    applyTheme('rainbow'); 
    adjustMainContentPadding();
  }
  initTheme();
  function adjustMainContentPadding() {
    const inputBar = document.querySelector('.input-bar-container');
    const mainArea = document.querySelector('.main-content-area');
    const filePreviews = document.getElementById('filePreviews');
    if (inputBar && mainArea) {
        var inputBarHeight = inputBar.offsetHeight;
        mainArea.style.paddingBottom = inputBarHeight + 'px';
        if (filePreviews) { // Adjust file previews to sit above the input bar
            filePreviews.style.bottom = (inputBarHeight + 1) + 'px';
        }
    }
  }
  "use strict";
  console.log("DOM fully loaded and parsed.");
  const chat = document.getElementById('chat');
  const chatContainer = document.getElementById('chat-container');
  const sendBtn = document.getElementById('sendBtn');
  const promptTextarea = document.getElementById('prompt');
  const modelSelect = document.getElementById('model');
  const sendIcon = document.getElementById('sendIcon');
  const loadingIcon = document.getElementById('loadingIcon');
  const buttonText = sendBtn ? sendBtn.querySelector('.button-text') : null;

  const clearChatBtn = document.getElementById('clearChatBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const customApiKeyInput = document.getElementById('customApiKey');
  const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
  const setBgBtn = document.getElementById('setBgBtn');
  const bgFileInput = document.getElementById('bgFileInput');
  const apiKeyControls = document.getElementById('apiKeyControls');
  const fileUploadBtn = document.getElementById('fileUploadBtn');
  const fileInput = document.getElementById('fileUpload');
  const filePreviewsContainer = document.getElementById('filePreviews');
  const DEFAULT_BODY_BACKGROUND_IMAGE = "url('https://www.sensecore.cn/upload/20230330/crjfafitbja7qufwrt.jpg')";
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
  
  let conversationHistory = [];
  let uploadedFiles = [];
  const essentialElements = [chat, chatContainer, sendBtn, promptTextarea, modelSelect, sendIcon, loadingIcon, buttonText, clearChatBtn, settingsBtn, customApiKeyInput, saveApiKeyBtn, setBgBtn, bgFileInput, apiKeyControls, fileUploadBtn, fileInput, filePreviewsContainer, fontSizeSlider, fontSizeValue];  
  if (essentialElements.some(el => !el)) {
    console.error("CRITICAL ERROR: One or more essential HTML elements not found. Missing elements:", essentialElements.map((el,i) => el ? '' : i).filter(String));
    alert("Page load error: Essential chat interface elements are missing. Please check HTML or try later.");
    return;
  }
  console.log("All essential elements found.");

  const savedApiKey = localStorage.getItem('customGeminiApiKey');
  if (savedApiKey) {
    customApiKeyInput.value = savedApiKey;
    console.log("Loaded custom API key from localStorage.");
  }
  function applyChatFontSize(size) {
    const newSize = parseInt(size, 10);
    if (chat) chat.style.fontSize = \`\${newSize}px\`;
    if (fontSizeSlider) fontSizeSlider.value = newSize;
    if (fontSizeValue) fontSizeValue.textContent = \`\${newSize}px\`;
    localStorage.setItem('chatFontSize', newSize);
  }

  const savedFontSize = localStorage.getItem('chatFontSize') || '16'; // Default 16px
  applyChatFontSize(savedFontSize);

  fontSizeSlider.addEventListener('input', function() {
    applyChatFontSize(this.value);
  });
  settingsBtn.addEventListener('click', () => {
    apiKeyControls.classList.toggle('hidden');
    adjustInputBarLayout();
    setTimeout(adjustMainContentPadding, 50);
  });

  saveApiKeyBtn.addEventListener('click', () => {
    const apiKey = customApiKeyInput.value.trim();
    if (apiKey) {
      localStorage.setItem('customGeminiApiKey', apiKey);
      alert('API Key saved locally.');
    } else {
      localStorage.removeItem('customGeminiApiKey');
      alert('Custom API Key cleared.');
    }
    apiKeyControls.classList.add('hidden');
    adjustInputBarLayout();
    setTimeout(adjustMainContentPadding, 50);
      });

  setBgBtn.addEventListener('click', () => {
    bgFileInput.click();
  });

  bgFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const oldVideo = document.getElementById('video-bg');
        if (oldVideo) oldVideo.remove();
        document.body.style.backgroundImage = 'url(' + e.target.result + ')';
        const bgData = {
         type: 'image',
          imageData: e.target.result,
          expiry: new Date().getTime() + (24 * 60 * 60 * 1000) 
        }; 
        localStorage.setItem('customBackgroundData', JSON.stringify(bgData)); 
      }; 
      reader.readAsDataURL(file); 
    } else if (file && file.type.startsWith('video/')) { 
      const reader = new FileReader();
      reader.onload = (e) => {
        document.body.style.backgroundImage = 'none'; 
        const oldVideo = document.getElementById('video-bg');
        if (oldVideo) oldVideo.remove();
        
        const videoHTML = \`<video autoplay muted loop id="video-bg">
        <source src="\` + e.target.result + \`" type="\` + file.type + \`"
          </video>
        \`;
        document.body.insertAdjacentHTML('afterbegin', videoHTML);
        
        const bgData = {
          type: 'video',
          videoData: e.target.result,
          videoDataUrl: e.target.result, 
          videoMimeType: file.type,    
         expiry: new Date().getTime() + (24 * 60 * 60 * 1000)
        };
        localStorage.setItem('customBackgroundData', JSON.stringify(bgData));
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid image file.');
    }
    bgFileInput.value = ''; 
  });
  
  clearChatBtn.addEventListener('click', () => {
    chat.innerHTML = '';
    conversationHistory = [];
    uploadedFiles = [];
    filePreviewsContainer.innerHTML = '';
    resetToDefaultBackground();
    addMessage("你好!请选择一个模型并输入任意问题😀<br>Hi! Get started by selecting any models and input whatever you want!", 'ai', false, 'initial-greeting');
    scrollToBottom();
  });

  fileUploadBtn.addEventListener('click', () => {
    fileInput.click();
  });

  function processAndAddFiles(filesToProcess) {
    var alertShownForLimitThisBatch = false;
    // filesToProcess can be a FileList or an Array of File objects
    for (var i = 0; i < filesToProcess.length; i++) {
        var file = filesToProcess[i];

        if (uploadedFiles.length >= 10) {
            if (!alertShownForLimitThisBatch) {
                alert("Maximum 10 files allowed. Some subsequent files from this batch were not added.");
                alertShownForLimitThisBatch = true;
            }
            break; // Stop processing more files from this batch
        }

        if (file.size > 100 * 1024 * 1024) { // 100MB limit
            alert("File '" + file.name + "' is too large (max 100MB) and will not be uploaded.");
            continue; // Skip this file, process next in the loop
        }

        var reader = new FileReader();
        // Use an IIFE to correctly capture the 'file' variable for the async onload callback
        (function(fileForReader) {
            reader.onload = function(e) {
                // Final check before pushing, in case limit was hit by other async file reads
                if (uploadedFiles.length < 10) {
                    var base64Data = e.target.result.split(',')[1];
                    uploadedFiles.push({
                        name: fileForReader.name,
                        mimeType: fileForReader.type,
                        base64Data: base64Data
                    });
                    renderFilePreviews(); // This will call adjustMainContentPadding
                } else {
                    // This case might be hit if many small files are processed rapidly and fill the queue
                    if (!alertShownForLimitThisBatch) {
                        alert("最多支持上传10文件！Maximum 10 files allowed. File " + fileForReader.name + " could not be added as limit was reached during processing.");
                        alertShownForLimitThisBatch = true;
                    }
                }
            };
            reader.readAsDataURL(fileForReader);
        })(file);
    }
}

  fileInput.addEventListener('change', function(event) {
    var files = event.target.files;
    if (!files) return;
    processAndAddFiles(files);
    fileInput.value = ''; // Clear the input to allow re-selecting the same file
  });

  function renderFilePreviews() {
    filePreviewsContainer.innerHTML = '';
    var filesToRender = uploadedFiles.slice(0, 10);
    filesToRender.forEach(function(file) {
        var badge = document.createElement('span');
        badge.className = 'file-preview-badge';
        badge.textContent = file.name.length > 15 ? file.name.substring(0,12) + '...' : file.name;
        var removeBtn = document.createElement('span');
        removeBtn.className = 'remove-file';
        removeBtn.textContent = 'x';
        removeBtn.title = 'Remove ' + file.name;
        var fileToRemoveOnClick = file;
        removeBtn.onclick = function() {
            var originalIndex = -1;
            for(var i = 0; i < uploadedFiles.length; i++) {if(uploadedFiles[i] === fileToRemoveOnClick) {originalIndex = i;break;}}          
            if (originalIndex !== -1) {uploadedFiles.splice(originalIndex, 1);} else {console.warn("Could not find file by reference in uploadedFiles to remove it. This may happen if array/object was unexpectedly altered.");            }
            renderFilePreviews();
        };
        badge.appendChild(removeBtn);
        filePreviewsContainer.appendChild(badge);
    });
    adjustMainContentPadding();
  }

  function adjustInputBarLayout() {
    const isApiInputVisible = !apiKeyControls.classList.contains('hidden');
    if (isApiInputVisible) {
        sendBtn.classList.remove('flex-grow');
        sendBtn.style.width = 'auto'; 
    } else {
        sendBtn.classList.add('flex-grow');
        sendBtn.style.width = ''; 
    }
  }
  adjustInputBarLayout(); 
  promptTextarea.addEventListener('dragover', function(event) {
    event.preventDefault(); // Necessary to allow drop
    event.stopPropagation();
    promptTextarea.classList.add('dragover-active');
  });

  promptTextarea.addEventListener('dragleave', function(event) {
    event.preventDefault();
    event.stopPropagation();
    promptTextarea.classList.remove('dragover-active');
  });

  promptTextarea.addEventListener('drop', function(event) {
    event.preventDefault();
    event.stopPropagation();
    promptTextarea.classList.remove('dragover-active');
    var files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processAndAddFiles(files);
    }
  });
  promptTextarea.addEventListener('paste', function(event) {
    var clipboardItems = (event.clipboardData || event.originalEvent.clipboardData).items;
    var filesToProcess = [];
    if (clipboardItems) {
        for (var i = 0; i < clipboardItems.length; i++) {
            if (clipboardItems[i].kind === 'file') {
                var file = clipboardItems[i].getAsFile();
                if (file) { filesToProcess.push(file); }
            }
        }
    }
    if (filesToProcess.length > 0) {
      event.preventDefault(); // Prevent pasting file path as text or file metadata
      processAndAddFiles(filesToProcess);
    }
  });
  function setLoadingState(isLoading) {
    if (!sendBtn || !promptTextarea || !buttonText || !sendIcon || !loadingIcon) {
        console.error("Error inside setLoadingState: Required elements missing.");
        return;
    }
    try {
        sendBtn.disabled = isLoading;
        promptTextarea.disabled = isLoading;
        fileUploadBtn.disabled = isLoading;
        clearChatBtn.disabled = isLoading;
        settingsBtn.disabled = isLoading;

        buttonText.textContent = isLoading ? "处理中..." : "发送 (Post)";
        sendIcon.classList.toggle('hidden', isLoading);
        loadingIcon.classList.toggle('hidden', !isLoading);
    } catch (e) { console.error("Error executing setLoadingState:", e); }
  }

  function spawnThinkingIcon() {
    let icon = document.querySelector('.thinking-icon');
    if (icon) icon.remove(); 

    icon = document.createElement('img');
    icon.src = 'https://i.ibb.co/ch21FSqt/cf.png';
    icon.className = 'thinking-icon';
    document.body.appendChild(icon);
    icon.addEventListener('animationend', function() { icon.remove(); });
  }

  function addMessage(textOrParts, sender = 'ai', isLoading = false, messageId = null) {
    if (!chat || !modelSelect) { console.error("Error inside addMessage: Chat or modelSelect element not found."); return null; }
    try {
      let messageDiv = document.createElement('div');
      messageDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
      if (messageId) messageDiv.id = messageId;

      // Apply rainbow bubble class if rainbow theme is active
      if (inputBarContainer && inputBarContainer.classList.contains('rainbow-active')) {
          messageDiv.classList.add('rainbow-theme-bubble');
      }


      const senderStrong = document.createElement('strong');
      senderStrong.textContent = sender === 'user' ? '你:' : 'AI:';
      messageDiv.appendChild(senderStrong);
      
      const contentSpan = document.createElement('span');
      contentSpan.className = 'response-content';

      if (isLoading) {
        const thinkingSpan = document.createElement('span');
        thinkingSpan.className = 'thinking';
        thinkingSpan.textContent = '🧠深度思考中(Deep Reasoning)...';
        messageDiv.appendChild(thinkingSpan);
        messageDiv.appendChild(contentSpan); 
        spawnThinkingIcon();
      } else {
        if (sender === 'user') {
          if (typeof textOrParts === 'string') {
            contentSpan.textContent = textOrParts;
          } else if (Array.isArray(textOrParts)) {
            textOrParts.forEach(part => {
              if (part.text) {
                const p = document.createElement('p');
                p.textContent = part.text;
                contentSpan.appendChild(p);
              } else if (part.inline_data && part.inline_data.mime_type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = 'data:' + part.inline_data.mime_type + ';base64,' + part.inline_data.data;
                img.alt = 'Uploaded image';
                img.style.maxWidth = '200px'; img.style.maxHeight = '200px'; img.style.borderRadius = '0.375rem'; img.style.marginTop = '0.5rem';
                contentSpan.appendChild(img);
              } else if (part.file_data) { 
                const p = document.createElement('p');
                p.textContent = '[File: ' + part.file_data.file_name + ']'; 
                contentSpan.appendChild(p);
              }
            });
          }
          const pencilBtn = document.createElement('button');
          pencilBtn.innerHTML = '✎';
          pencilBtn.className = 'edit-prompt-btn';
          pencilBtn.title = 'Edit this prompt';
          pencilBtn.onclick = function() {
            let promptTextToEdit = '';
            if (typeof textOrParts === 'string') {
                promptTextToEdit = textOrParts;
            } else if (Array.isArray(textOrParts)) {
                const textPart = textOrParts.find(p => p.text);
                if (textPart) promptTextToEdit = textPart.text;
            }
            promptTextarea.value = promptTextToEdit;
            promptTextarea.focus();
          };
          messageDiv.appendChild(pencilBtn);

        } else { // AI message
          if (typeof marked !== 'undefined') {
            contentSpan.innerHTML = marked.parse(textOrParts); 
          } else {
            contentSpan.textContent = textOrParts; 
          }
        }
        messageDiv.appendChild(contentSpan);
      }
      chat.appendChild(messageDiv);
      scrollToBottom();
      chatContainer.scrollTop = chatContainer.scrollHeight;
      return messageDiv;
    } catch (e) { console.error("Error executing addMessage:", e); return null; }
  }
  
  addMessage("你好!请选择一个模型并输入任意问题😀<br><br>Hi! Get started by selecting any models and input whatever you want!", 'ai', false, 'initial-greeting');

function scrollToBottom() {
  try {
    if (chatContainer) { 
      // 添加平滑滚动效果
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  } catch (e) { console.error("Error scrolling:", e); }
}

  function escapeHTML(str) { 
    if (typeof str !== 'string') return '';
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }

  function autoResizeTextarea() {
    try {
        if (promptTextarea) {
            promptTextarea.style.height = 'auto'; 
            let newHeight = promptTextarea.scrollHeight;
            const maxHeight = 200; 
            if (newHeight > maxHeight) {
                newHeight = maxHeight;
                promptTextarea.style.overflowY = 'auto'; 
            } else {
                promptTextarea.style.overflowY = 'hidden'; 
            }
            promptTextarea.style.height = newHeight + 'px';
        } else { console.error("Error resizing textarea: promptTextarea not found.");}
    } catch (e) { console.error("Error executing autoResizeTextarea:", e); }
  }

  async function handleSend() {
    let aiMessageDiv = null;
    let responseContentSpan = null;

    try {
      const promptText = promptTextarea.value.trim();
      const model = modelSelect.value;
      
      if (!promptText && uploadedFiles.length === 0) { 
        alert("请输入你的内容、描述或上传文件！"); 
        promptTextarea.focus(); return; 
      }

      setLoadingState(true);
      
      const userMessageParts = [];
      if (promptText) {
        userMessageParts.push({ text: promptText });
      }
      uploadedFiles.forEach(file => {
        userMessageParts.push({ inline_data: { mime_type: file.mimeType, data: file.base64Data }, file_data: { file_name: file.name } });
      });
      
      addMessage(userMessageParts.length > 0 ? userMessageParts : promptText, 'user');
      
      const currentTurnUserParts = [];
      if (promptText) {
        currentTurnUserParts.push({ text: promptText });
      }
      uploadedFiles.forEach(file => {
        currentTurnUserParts.push({ inline_data: { mime_type: file.mimeType, data: file.base64Data } });
      });
      conversationHistory.push({ role: "user", parts: currentTurnUserParts });

      promptTextarea.value = '';
      uploadedFiles = []; 
      renderFilePreviews();
      autoResizeTextarea();
      
      aiMessageDiv = addMessage('', 'ai', true);
      if (!aiMessageDiv) { throw new Error("Failed to create AI placeholder message element."); }
      responseContentSpan = aiMessageDiv.querySelector('.response-content');
      const thinkingSpan = aiMessageDiv.querySelector('.thinking');
      if (!responseContentSpan) { throw new Error("Failed to find response content span in AI placeholder."); }

      const requestPayload = {
          prompt: promptText, 
          model: model,
          history: conversationHistory.slice(0, -1), 
          currentTurnParts: currentTurnUserParts 
      };
      
      const customKey = localStorage.getItem('customGeminiApiKey');
      if (customKey) {
          requestPayload.customApiKey = customKey;
      }

      const res = await fetch(location.href, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload)
      });

      if (thinkingSpan) thinkingSpan.remove();
      let thinkingIcon = document.querySelector('.thinking-icon');
      if (thinkingIcon) thinkingIcon.remove();


      if (!res.ok) {
        const errorText = await res.text();
        console.error("Worker/API Error Response (Status " + res.status + "):", errorText);
        if (responseContentSpan && aiMessageDiv) {
            responseContentSpan.textContent = "请求出错 (" + res.status + "): " + escapeHTML(errorText.substring(0, 500)) + (errorText.length > 500 ? '...' : '');
            aiMessageDiv.classList.add('error-message');
            conversationHistory.pop(); 
            scrollToBottom();
        } else { console.error("Cannot display fetch error in chat: message elements not found."); }
        throw new Error("Server responded with status " + res.status);
      }

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
          buffer = lines.pop(); 
          for (const line of lines) {
              if (line.startsWith('data: ')) {
                  const jsonStr = line.substring(6).trim();
                  if (jsonStr === '[DONE]' || !jsonStr) continue;
                  try {
                      const chunk = JSON.parse(jsonStr);
                      const textPart = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
                      if (textPart) {
                          currentText += textPart;
                          if (typeof marked !== 'undefined') {
                            responseContentSpan.innerHTML = marked.parse(currentText);
                          } else {
                            responseContentSpan.textContent = currentText; 
                          }
                          scrollToBottom();
                      } else if (chunk.promptFeedback?.blockReason) {
                          const blockMessage = "\\n[内容被阻止: " + chunk.promptFeedback.blockReason + "]";
                          currentText += blockMessage;
                           if (typeof marked !== 'undefined') {
                            responseContentSpan.innerHTML = marked.parse(currentText);
                          } else {
                            responseContentSpan.textContent = currentText;
                          }
                          aiMessageDiv.classList.add('error-message'); 
                          scrollToBottom();
                      }
                  } catch (e) {
                      console.error("Error parsing streaming JSON chunk:", e, "Chunk:", jsonStr);
                      const parseErrorMessage = '\\n[解析数据块时出错]';
                      currentText += parseErrorMessage;
                      if (typeof marked !== 'undefined') {
                        responseContentSpan.innerHTML = marked.parse(currentText);
                      } else {
                        responseContentSpan.textContent = currentText;
                      }
                      scrollToBottom();
                  }
              } else if (line.trim()) { console.log("Received non-data SSE line:", line); }
          }
      }
      if (buffer.trim() && buffer.startsWith('data: ')) {
        const jsonStr = buffer.substring(6).trim();
        try {
            const chunk = JSON.parse(jsonStr);
            const textPart = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textPart) {
                currentText += textPart;
                if (typeof marked !== 'undefined') { responseContentSpan.innerHTML = marked.parse(currentText); } 
                else { responseContentSpan.textContent = currentText; }
                scrollToBottom();
            }
        } catch (e) {
            console.error("Error parsing final buffer:", e);
            currentText += '\\n[处理流末尾数据时出错]';
            if (typeof marked !== 'undefined') { responseContentSpan.innerHTML = marked.parse(currentText); } 
            else { responseContentSpan.textContent = currentText; }
            scrollToBottom();
        }
      }
      if (currentText) {
        conversationHistory.push({ role: "model", parts: [{ text: currentText }] });
      } else if (aiMessageDiv.classList.contains('error-message')) {
      } else {
        responseContentSpan.textContent = "[AI did not provide a text response]";
        conversationHistory.push({ role: "model", parts: [{ text: "" }] });
      }
      console.log("handleSend processing completed successfully.");
    } catch (error) {
      console.error("CLIENT-SIDE CATCH BLOCK ERROR in handleSend:", error);
      if (responseContentSpan) {
          if (!responseContentSpan.textContent.includes("出错")) {
             responseContentSpan.textContent = '客户端错误: ' + error.message; 
          }
          if (aiMessageDiv && !aiMessageDiv.classList.contains('error-message')) {
              aiMessageDiv.classList.add('error-message');
          }
          scrollToBottom();
      } else { console.error("Cannot display error in chat bubble: responseContentSpan not found."); }
    } finally {
      console.log("CLIENT-SIDE FINALLY BLOCK in handleSend");
      setLoadingState(false);
      promptTextarea.focus();
      let thinkingIcon = document.querySelector('.thinking-icon'); 
      if (thinkingIcon) thinkingIcon.remove();
      console.log("UI re-enabled.");
    }
  }
  function resetToDefaultBackground() {
    document.body.style.backgroundImage = DEFAULT_BODY_BACKGROUND_IMAGE;
     const oldVideo = document.getElementById('video-bg');
    if (oldVideo) oldVideo.remove();
    localStorage.removeItem('customBackgroundData');
  }
  const savedBgDataString = localStorage.getItem('customBackgroundData');
  if (savedBgDataString) {
    try {
      const savedBgData = JSON.parse(savedBgDataString);
        if (savedBgData && savedBgData.expiry && new Date().getTime() < savedBgData.expiry) {
        if (savedBgData.type === 'video' && savedBgData.videoDataUrl && savedBgData.videoMimeType) {
          document.body.style.backgroundImage = 'none'; 
          const oldVideo = document.getElementById('video-bg');
          if (oldVideo) oldVideo.remove();
          const videoHTML = \`<video autoplay muted loop id="video-bg">
              <source src="\` + savedBgData.videoDataUrl + \`" type="\` + savedBgData.videoMimeType + \`">
            </video>
          \`;
          document.body.insertAdjacentHTML('afterbegin', videoHTML);
        } else if (savedBgData.type === 'image' && savedBgData.imageData) {
          const oldVideo = document.getElementById('video-bg');
          if (oldVideo) oldVideo.remove(); 
          document.body.style.backgroundImage = 'url(' + savedBgData.imageData + ')';
        } else {
          resetToDefaultBackground(); 
        }
      } else {
        resetToDefaultBackground(); 
      }
    } catch (e) {
      console.error("Error parsing custom background data:", e);
      resetToDefaultBackground(); 
    }
  } 
  sendBtn.addEventListener('click', handleSend);
  promptTextarea.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });
  promptTextarea.addEventListener('input', autoResizeTextarea);
  autoResizeTextarea();
  window.addEventListener('resize', adjustMainContentPadding);
  console.log("Event listeners attached and initial setup done.");
});
</script>
`;
// Main HTML structure
export function renderHTML(isMobile) {
  const styles = getStyles();
  const clientScript = getClientScript();
   const viewportMeta = isMobile
    ? '<meta name="viewport" content="width=1024"> <!-- Forcing desktop-like viewport for mobile -->'
    : '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">${viewportMeta}
  <title>輕音Joy-AI公益站</title>
  <link rel="icon" href="https://www.cloudflare.com/favicon.ico" type="image/x-icon">
  <script src="https://cdn.tailwindcss.com"></script>
   <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  ` + styles + `
</head>
<style>
  a {color: rgba(var(--link-text-rgb), 0.9)!important;text-shadow: 0 2px 4px rgba(var(--link-text-rgb), 0.3);}
  a:hover {color: rgba(var(--link-text-rgb), 1)!important;text-decoration: underline;}
  .hidden { display: none !important; }
</style>
<body class="bg-gray-900 text-gray-100 font-sans">

  <div class="main-content-area">
    <div class="p-0 text-center mb-1">
      <h1 class="text-3xl font-bold my-1">Ultra AI ☁ Cloudflare 輕音Joy-AI公益站</h1>
      <a href="https://www.qyjoy.vip" target="_blank" class="block font-bold cursor-pointer mb-1 animate-breathe" style="text-shadow:0 0 3px rgba(150, 255, 3, 0.97);">Serverless Powered By ⚡ 抖音|Bilibili|Youtube|网易云|公众号:輕音Joy</a>
    </div>

    <div class="px-4 sm:px-6 pb-0">
      <div class="flex flex-col sm:flex-row gap-3 my-1">
        <div class="w-full sm:w-1/2">
          <label for="model" class="block mb-1 text-sm font-medium text-gray-300">👆选择模型 Choose A Model：</label>
          <select id="model" class="w-full p-2.5 rounded border text-white focus:ring-blue-500 focus:border-blue-500">
            <option value="gemini-2.0-flash" selected>Gemini 2.0 Flash ⚡ (Popular)</option>
            <option value="gemini-2.5-flash-preview-05-20">Gemini 2.5 Preview 🔥 (Hot)</option>
            <option value="gemini-2.5-pro-preview-06-05">Gemini 2.5 Pro Preview ⚙ (请在设置中填入自己的API)</option>
            <option value="gemini-2.0-flash-preview-image-generation">Gemini Image Gen 图片生成 🛠️ (需在设置中填入自己的API)</option>
            <option value="veo-2.0-generate-001">Gemini Veo2 视频生成 🎬 (需在设置中填入自己的API)</option>
            <option value="" disabled>ChatGPT 4.5 🧪 (研发中-敬请期待)</option>
            <option value="" disabled>Claude 3.7 🔬 (研发中-敬请期待)</option>
            <option value="" disabled>Cursor 💡 (研发中-敬请期待)</option>
          </select>
        </div>
        <div class="w-full sm:w-1/2">
          <label for="theme" class="block mb-1 text-sm font-medium text-gray-300">🎨主题颜色 Theme color:</label>
          <select id="theme" class="w-full p-2.5 rounded border text-white">
            <option value="rainbow" selected>🌈彩虹呼吸 Rainbow Breathing</option>
            <option value="cyberpunk">💿赛博霓虹 Cyberpunk Neon</option>
            <option value="prism">💠幻彩棱镜 Iridescent Prism</option>
            <option value="blue">🔵科技蓝 Tech Blue</option>
            <option value="purple">🟣梦幻紫 Dreamy Purple</option>
            <option value="green">🟢自然绿 Natural Green</option>
            <option value="pink">💖少女粉 Soft Pink</option>
            <option value="gradient">🟠渐变紫橙 Gradient Purple-Orange</option>
            <option value="red">🔴热情红 Passionate Red</option>
            <option value="yellow">🟡活力黄 Vibrant Yellow</option>
          </select>
        </div>
      </div>
    </div>

    <div id="chat-container" class="flex-grow px-2 pb-1">
      <div id="chat" class="flex flex-col space-y-2 p-1">
      </div>
    </div>
  </div>

  <div class="input-bar-container bg-transparent">
    <div id="filePreviews" class="fixed bottom-[60px] left-4 right-4 max-h-[30vh] overflow-y-auto rounded-lg shadow-lg z-10"></div>
    <div class="flex items-end gap-2 relative">
      <button id="fileUploadBtn" title="Upload Files" class="p-2.5 rounded text-white hover:bg-gray-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
      <input type="file" id="fileUpload" multiple accept=".ini,.txt,.doc,.docx,.pdf,text/*,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" class="hidden">
      
      <textarea id="prompt" rows="1" class="flex-grow p-2.5 rounded border text-white focus:ring-blue-500 focus:border-blue-500" placeholder="输入你的任意问题... (Input whatever you want here...)"></textarea>
      <button id="sendBtn" class="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 p-2.5 rounded font-semibold text-white/90 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed" style="min-width: 120px; border:1px solid rgba(255,255,255,0.8)!important;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
      <img src="https://www.cloudflare.com/favicon.ico" alt="Cloudflare" class="w-4 h-4">
        <span class="button-text">发送 Post</span><span id="sendIcon">➤</span><span id="loadingIcon" class="loader hidden"></span>
      </button>

      <button id="clearChatBtn" title="Clear Chat & Memory" class="p-2.5 rounded text-white hover:bg-gray-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
      </button>
      <button id="settingsBtn" title="Settings / Custom API Key" class="p-2.5 rounded text-white hover:bg-gray-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </button>
    </div>
    <div id="apiKeyControls" class="hidden mt-2 flex items-center gap-2">
      <input type="password" id="customApiKey" placeholder="输入自定义API (Enter Your Own API Key if needed)" class="flex-grow p-2 rounded border text-white" style="min-width: 180px;">
      <button id="saveApiKeyBtn" class="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">保存API(Save)</button>
      <div id="fontSizeControlContainer" class="flex items-center gap-2 flex-grow" style="min-width: 200px; max-width:300px;">
        <label for="fontSizeSlider" class="text-sm text-gray-300 whitespace-nowrap">字号(FontSize):</label>
        <input type="range" id="fontSizeSlider" min="12" max="28" class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer">
        <span id="fontSizeValue" class="text-sm text-gray-300 w-12 text-right">16px</span>
      </div>
      <button id="setBgBtn" class="p-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" style="flex-shrink: 0;">设置背景(Set background)</button>   
      <input type="file" id="bgFileInput" class="hidden" accept="image/*,video/*,.mp4,.mkv,.webm">
    </div>
  </div>
  ` + clientScript + `
</body>
</html>`;
}
