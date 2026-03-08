# Google Apps Script Deployment Instructions

To enable seamless public file uploads without requiring residents to login, and to send PDF reports via email, you must deploy the provided Google Apps Script.

## Steps

1.  **Create the Script**
    *   Go to [https://script.google.com/](https://script.google.com/).
    *   Click **New Project**.
    *   Name it `Seapark Utility Receipt Uploader`.
    *   Delete any code in `Code.gs` and paste the content from `google-apps-script/Code.gs` (in this repo).

2.  **Configure OAuth Scopes (REQUIRED for Email Functionality)**
    *   Click **Project Settings** (gear icon).
    *   Check **"Show 'appsscript.json' manifest file in editor"**.
    *   Return to the Editor view.
    *   Open `appsscript.json` and replace its content with:
    ```json
    {
      "timeZone": "Asia/Kuala_Lumpur",
      "dependencies": {
        "enabledAdvancedServices": []
      },
      "oauthScopes": [
        "https://www.googleapis.com/auth/script.external_request",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/gmail.send"
      ],
      "exceptionLogging": "STACKDRIVER",
      "runtimeVersion": "V8",
      "webapp": {
        "access": "ANYONE",
        "executeAs": "USER_DEPLOYING"
      }
    }
    ```

3.  **Configurations (Folder Support)**
    *   This script supports dynamic folder selection via the client configuration.
    *   If you want to store receipts in a specific folder, you do **not** need to edit the script.
    *   Instead, you will add the Folder ID to `js/config.js` after deployment.

4.  **Deploy as Web App**
    *   **IMPORTANT:** If you are updating an existing script, you must create a **New deployment** (Version: New) for changes to take effect.
    *   Click `Deploy` (top right) -> `New deployment`.
    *   Click the gear icon (Select type) -> `Web app`.
    *   **Description**: `v2 Upload and Email`.
    *   **Execute as**: `Me` (This is critical - it ensures files are owned by YOU and emails sent from YOUR account).
    *   **Who has access**: `Anyone` (This allows the public website to connect).
    *   Click `Deploy`.

5.  **Authorize**
    *   It will ask to authorize access to:
        *   Your Google Drive (for file uploads)
        *   Gmail (for sending PDF reports)
    *   Review the permissions and click **Allow**.
    *   **Note:** You may see a warning "Google hasn't verified this app". Click **"Advanced"** -> **"Go to [Project Name] (unsafe)"** to proceed.

6.  **Get the URL**
    *   Copy the **Web App URL** (starts with `https://script.google.com/macros/s/...`).

7.  **Update Config**
    *   Open `js/config.js` in your text editor.
    *   Paste the URL into the `scriptUrl` field in `googleConfig`.

```javascript
// js/config.js example
const googleConfig = {
    // ...
    scriptUrl: "https://script.google.com/macros/s/AKfycbx.../exec"
};
```

## Troubleshooting

### "The script does not have permission to perform that action"
This error means the OAuth scopes are not properly configured. Ensure you:
1. Added the `appsscript.json` manifest with `https://www.googleapis.com/auth/gmail.send` scope
2. Created a **New deployment** (not just editing existing)
3. Re-authorized the permissions after adding the Gmail scope
