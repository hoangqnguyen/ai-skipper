# AI Skipper - Chrome Extension (v2.8.3)

**AI Skipper** automatically detects and skips AI-generated content on YouTube. It uses a combination of keyword detection, regex matching, and channel blocklists to ensure your experience is authentic.

## 🌟 Features

*   **⚡ Detection Speed**: Configurable speed slider (0.5s - 5s) to balance performance and battery.
*   **🚫 Smart Detection**: Skips videos with keywords like "AI Cover", "Suno", "Udio", etc.
*   **📝 Regex Support**: Powerful custom patterns for advanced matching.
*   **⛔ One-Click Block**: Block entire channels directly from the video page.
*   **🎨 Modern UI**: Clean, centered tabs built with React & Tailwind.

## 🚀 Publishing to Chrome Web Store

1. **Create Account**: Register at the [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole).
2. **Build Project**: Run `npm run build` to generate production files.
3. **Zip Bundle**: Use the generated **`ai-skipper-v2.8.3.zip`** in the root directory.
4. **Upload**: Click **"New Item"** in the console and upload the zip.
5. **Metadata**: Use icons from `public/icons` for store assets.

## 🛠 Installation (Local)

1.  **Build**: `npm install` then `npm run build`.
2.  **Load**: Go to `chrome://extensions/`, enable **Developer mode**, and **Load unpacked** the `dist` folder.

## 🛠 Development

Edit `src/defaults.js` to update default blocklists.

---
*Created for a cleaner YouTube experience.*

