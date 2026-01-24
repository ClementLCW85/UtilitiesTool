# Google Apps Script Deployment Instructions

To enable seamless public file uploads without requiring residents to login, you must deploy the provided Google Apps Script.

## Steps

1.  **Create the Script**
    *   Go to [https://script.google.com/](https://script.google.com/).
    *   Click **New Project**.
    *   Name it `Seapark Utility Receipt Uploader`.
    *   Delete any code in `Code.gs` and paste the content from `google-apps-script/Code.gs` (in this repo).

2.  **Configurations (Optional)**
    *   If you want files to go to a specific folder in your Google Drive (instead of Root):
        *   Create the folder in Drive.
        *   Get the ID from the URL (e.g., `folders/12345abcde...`).
        *   Modify the script to use `DriveApp.getFolderById("YOUR_ID").createFile(blob)`.

3.  **Deploy as Web App**
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
