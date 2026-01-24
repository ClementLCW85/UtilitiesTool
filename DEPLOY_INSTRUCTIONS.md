# Google Apps Script Deployment Instructions

To enable seamless public file uploads without requiring residents to login, you must deploy the provided Google Apps Script.

## Steps

1.  **Create the Script**
    *   Go to [https://script.google.com/](https://script.google.com/).
    *   Click **New Project**.
    *   Name it `Seapark Utility Receipt Uploader`.
    *   Delete any code in `Code.gs` and paste the content from `google-apps-script/Code.gs` (in this repo).

2.  **Configurations (Folder Support)**
    *   This script supports dynamic folder selection via the client configuration.
    *   If you want to store receipts in a specific folder, you do **not** need to edit the script.
    *   Instead, you will add the Folder ID to `js/config.js` after deployment.

3.  **Deploy as Web App**
    *   **IMPORTANT:** If you are updating an existing script, you must create a **New deployment** (Version: New) for changes to take effect.
    *   Click `Deploy` (top right) -> `New deployment`.
    *   Click the gear icon (Select type) -> `Web app`.
    *   **Description**: `v1 Public Upload`.
    *   **Execute as**: `Me` (This is critical - it ensures files are owned by YOU).
    *   **Who has access**: `Anyone` (This allows the public website to connect).
    *   Click `Deploy`.

4.  **Authorize**
    *   It will ask to authorize access to your Drive. Review and Allow.

5.  **Get the URL**
    *   Copy the **Web App URL** (starts with `https://script.google.com/macros/s/...`).

6.  **Update Config**
    *   Open `js/config.js` in your text editor.
    *   Paste the URL into the `scriptUrl` field in `googleConfig`.

```javascript
// js/config.js example
const googleConfig = {
    // ...
    scriptUrl: "https://script.google.com/macros/s/AKfycbx.../exec"
};
```
