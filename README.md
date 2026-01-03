# AI Skipper - Chrome Extension (v2.7)

**AI Skipper** automatically detects and skips AI-generated music videos on YouTube. It uses a combination of keyword detection, regex matching, and channel blocklists to ensure your listening experience is authentic.

## Features

*   **🚫 Smart Detection**: skips videos with keywords like "AI Cover", "Suno", "Udio", "Synthetic Voice", etc.
*   **📝 Regex Support**: Add your own regular expressions for powerful title matching (e.g., `\(AI .* Cover\)`).
*   **⛔ Channel Blocking**:
    *   **Manage List**: Add channels to a global blocklist via the popup.
    *   **One-Click Block**: Use the red **"Block Channel" button** next to the Subscribe button on any video.
*   **⚡ High Performance**: Written in React + Vite for a blazing fast popup UI.
*   **🛠️ Configurable**: Toggle features on/off instantly.

## Installation

1.  **Build the Project** (if not already built):
    ```bash
    npm install
    npm run build
    ```
2.  **Load in Chrome**:
    *   Go to `chrome://extensions/`.
    *   Enable **Developer mode** (top right).
    *   Click **Load unpacked**.
    *   **IMPORTANT**: Select the **`dist`** folder inside this project (`ai-skipper/dist`).

## Configuration

Click the extension icon in your toolbar:
*   **General**: Toggle extension on/off, view stats.
*   **Keywords**: Add/Remove specific words to trigger a skip.
*   **Channels**: Manage your blocked channels list.
*   **Regex**: Add advanced pattern matching rules.

## Contributing

We welcome contributions!
*   **Defaults**: To add common AI keywords or regex patterns for everyone, edit **`src/defaults.js`**.
*   **UI**: The popup is built with React + TailwindCSS (`src/App.jsx`).
*   **Logic**: The detection logic is in `src/content.js`.

## License

MIT
