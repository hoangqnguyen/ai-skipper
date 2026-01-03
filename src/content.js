// AI Skipper Content Script
import { DEFAULT_KEYWORDS, DEFAULT_CHANNELS, DEFAULT_REGEX, DEFAULT_CHECK_INTERVAL } from "./defaults";

let config = {
  enabled: true,
  keywords: DEFAULT_KEYWORDS,
  channels: DEFAULT_CHANNELS,
  regexPatterns: DEFAULT_REGEX
};

// Initialize Config
chrome.storage.local.get(['enabled', 'keywords', 'channels', 'regexPatterns'], (result) => {
  if (result.enabled !== undefined) config.enabled = result.enabled;
  if (result.keywords) config.keywords = result.keywords;
  if (result.channels) config.channels = result.channels;
  if (result.regexPatterns) config.regexPatterns = result.regexPatterns;
  console.log("AI Skipper: Configuration loaded", config);
});

// Listen for changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.enabled) config.enabled = changes.enabled.newValue;
    if (changes.keywords) config.keywords = changes.keywords.newValue;
    if (changes.channels) config.channels = changes.channels.newValue;
    console.log("AI Skipper: Configuration updated", config);
  }
});

function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v");
}

function isAiContent() {
  if (!config.enabled) return false;

  const textContent = [];

  // Title
  const titleSelectors = [
    "h1.ytd-watch-metadata",
    "h1.style-scope.ytd-watch-metadata",
    "#title h1",
    "h1.title"
  ];
  
  for (const sel of titleSelectors) {
    const el = document.querySelector(sel);
    if (el && el.innerText) textContent.push(el.innerText.toLowerCase());
  }

  // Channel Name
  const channelSelectors = [
    "#owner-name a",
    "ytd-channel-name #text a",
    "ytd-video-owner-renderer #channel-name a",
    "#channel-name a"
  ];

  let channelName = "";
  for (const sel of channelSelectors) {
    const el = document.querySelector(sel);
    if (el && el.innerText && el.innerText.trim().length > 0) {
      channelName = el.innerText.trim();
      break;
    }
  }

  if (channelName) {
    textContent.push(channelName.toLowerCase());
    console.log(`AI Skipper: Found Channel Name: '${channelName}'`);
    
    // Check Channel Blocklist
    if (config.channels.some(c => c.trim().toLowerCase() === channelName.toLowerCase())) {
        console.log(`AI Skipper: Channel '${channelName}' is in blocklist. SKIPPING.`);
        return true;
    }
  }

  // Description
  const descSelectors = [
    "#description-inline-expander",
    "#description-inner",
    "#description",
    "ytd-text-inline-expander"
  ];

  for (const sel of descSelectors) {
    const el = document.querySelector(sel);
    if (el && el.innerText) textContent.push(el.innerText.toLowerCase());
  }

  // Official Labels
  const metadataSelectors = ["#above-the-fold", "#description", "ytd-watch-metadata"];
  for (const sel of metadataSelectors) {
    const el = document.querySelector(sel);
    if (el && el.innerText && (el.innerText.toLowerCase().includes("altered content") || el.innerText.toLowerCase().includes("synthetic content"))) {
      console.log("AI Skipper: Detected 'Altered/Synthetic content' label");
      return true;
    }
  }

  // Check Keywords
  for (const text of textContent) {
    for (const keyword of config.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        console.log(`AI Skipper: Detected '${keyword}' in text: "${text.substring(0, 50)}..."`);
        return true;
      }
    }
  }

  // Check Regex Patterns
  if (config.regexPatterns && config.regexPatterns.length > 0) {
    for (const pattern of config.regexPatterns) {
      try {
        const regex = new RegExp(pattern, 'i'); // Case insensitive
        for (const text of textContent) {
            if (regex.test(text)) {
                console.log(`AI Skipper: Detected Regex Match '${pattern}' in text: "${text.substring(0, 50)}..."`);
                return true;
            }
        }
      } catch (e) {
        console.warn(`AI Skipper: Invalid regex '${pattern}'`, e);
      }
    }
  }

  return false;
}

function skipVideo() {
  console.log("AI Skipper: Skipping AI content...");
  const nextButton = document.querySelector(".ytp-next-button");
  const videoElement = document.querySelector("video");

  if (nextButton && nextButton.getAttribute('aria-disabled') !== 'true') {
     console.log("AI Skipper: Clicking next button");
    nextButton.click();
    return;
  } 
  
  if (videoElement && !isNaN(videoElement.duration)) {
    console.log("AI Skipper: Seeking to end");
    videoElement.currentTime = videoElement.duration;
  }
}

function checkAndSkip() {
  const currentVideoId = getVideoId();
  if (!currentVideoId) return;

  if (isAiContent()) {
    skipVideo();
  }
}

// Inject Block Button
function injectBlockButton() {
  if (!config.enabled) return;

  const subscribeButton = document.querySelector("#owner #subscribe-button");
  if (!subscribeButton) return;

  let btn = document.getElementById("ai-skipper-block-btn");

  if (!btn) {
      btn = document.createElement("button");
      btn.id = "ai-skipper-block-btn";
      btn.style.cssText = `
        background-color: #ef4444; 
        color: white; 
        border: none; 
        padding: 0 16px;
        height: 36px;
        margin-left: 8px; 
        border-radius: 18px; 
        font-size: 14px; 
        font-weight: 500; 
        cursor: pointer; 
        font-family: Roboto, Arial, sans-serif;
        transition: background-color 0.2s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      `;
      
      btn.onmouseover = () => {
          if (!btn.disabled) btn.style.backgroundColor = "#dc2626";
      };
      btn.onmouseout = () => {
          if (!btn.disabled) btn.style.backgroundColor = "#ef4444";
      };

      btn.onclick = () => {
        const channelSelectors = [
            "#owner-name a",
            "ytd-channel-name #text a",
            "ytd-video-owner-renderer #channel-name a",
            "#channel-name a"
        ];

        let channelName = "";
        for (const sel of channelSelectors) {
            const el = document.querySelector(sel);
            if (el && el.innerText && el.innerText.trim().length > 0) {
            channelName = el.innerText.trim();
            break;
            }
        }

        if (!channelName) {
            alert("AI Skipper: Could not determine channel name.");
            return;
        }

        if (confirm(`Block channel "${channelName}"?`)) {
            const newChannels = [...config.channels, channelName];
            const uniqueChannels = [...new Set(newChannels)];
            
            chrome.storage.local.set({ channels: uniqueChannels }, () => {
                config.channels = uniqueChannels;
                // Ensure state updates immediately
                btn.innerText = "Blocked";
                btn.disabled = true;
                btn.style.backgroundColor = "#3f3f46";
                btn.style.cursor = "default";
                console.log(`AI Skipper: Blocked channel '${channelName}'`);
                checkAndSkip();
            });
        }
      };

      // Insert sibling to sit inline
      if (subscribeButton.parentNode) {
          subscribeButton.parentNode.insertBefore(btn, subscribeButton.nextSibling);
      } else {
          subscribeButton.appendChild(btn); 
      }
  }

  // ALWAYS Update State (Fixes per-video button state)
  const channelSelectors = [
    "#owner-name a",
    "ytd-channel-name #text a",
    "ytd-video-owner-renderer #channel-name a",
    "#channel-name a"
  ];

  let currentChannel = "";
  for (const sel of channelSelectors) {
    const el = document.querySelector(sel);
    if (el && el.innerText && el.innerText.trim().length > 0) {
      currentChannel = el.innerText.trim();
      break;
    }
  }

  if (currentChannel) {
      const isBlocked = config.channels.some(c => c.trim().toLowerCase() === currentChannel.toLowerCase());
      if (isBlocked) {
          if (btn.innerText !== "Blocked") {
              btn.innerText = "Blocked";
              btn.disabled = true;
              btn.style.backgroundColor = "#3f3f46";
              btn.style.cursor = "default";
          }
      } else {
           if (btn.innerText !== "Block Channel") {
              btn.innerText = "Block Channel";
              btn.disabled = false;
              btn.style.backgroundColor = "#ef4444";
              btn.style.cursor = "pointer";
          }
      }
  }
}

// Periodic check using dynamic timeout
function scheduleNextCheck() {
  const interval = config.checkInterval || DEFAULT_CHECK_INTERVAL;
  setTimeout(() => {
    // Check if extension context is still valid
    if (!chrome.runtime?.id) {
        console.log("AI Skipper: Extension context invalidated. Stopping background checks.");
        return;
    }

    try {
        // Config polling
        chrome.storage.local.get(['enabled', 'keywords', 'channels', 'regexPatterns', 'checkInterval'], (result) => {
            if (chrome.runtime.lastError) {
                console.log("AI Skipper: Runtime error during polling. Stopping.");
                return;
            }

            if (result.enabled !== undefined) config.enabled = result.enabled;
            if (result.keywords) config.keywords = result.keywords;
            if (result.channels) config.channels = result.channels;
            if (result.regexPatterns) config.regexPatterns = result.regexPatterns;
            if (result.checkInterval) config.checkInterval = result.checkInterval;
            
            if (config.enabled !== false) {
                checkAndSkip();
                injectBlockButton();
            }
            
            scheduleNextCheck();
        });
    } catch (e) {
        console.log("AI Skipper: Context invalidated during polling. Stopping.");
    }
  }, interval);
}

// Start the loop
scheduleNextCheck();

console.log("AI Skipper: Content script loaded (v2.3 - Dynamic Speed).");
