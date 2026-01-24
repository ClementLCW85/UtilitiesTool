# Seapark Apartment Block E - Utility Bill Tracker

## Overview
A web-based application to track contributions for the common area electric bill of Block E, Seapark Apartment.
Provides transparency for 44 units regarding monthly bills and payments.

## Hosting
This project is configured to be hosted on **GitHub Pages**.

### How to Deploy
1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Source**, select **GitHub Actions**.
4. The `.github/workflows/deploy.yml` workflow will automatically build and deploy the site on every push to `master` or `main`.

## Local Development
1. Clone the repository.
2. Open `index.html` in your browser.

## Configuration

### Google Drive Integration Setup (Required for Receipt Uploads)
To enable the image upload feature, the system Admin must configure a Google Cloud Project:

1.  **Create a Project:**
    -   Go to [Google Cloud Console](https://console.cloud.google.com/).
    -   Create a new project (e.g., "Seapark Utility Tracker").

2.  **Enable Drive API:**
    -   In the sidebar, go to **APIs & Services > Library**.
    -   Search for **"Google Drive API"**.
    -   Click **Enable**.

3.  **Configure OAuth Consent Screen:**
    -   Go to **APIs & Services > OAuth consent screen**.
    -   Select **External**.
    -   **Important:** You cannot create an OAuth Client ID (Step 4) until this screen is configured.
    -   Fill in the App Name ("Seapark Tracker"), Support Email, and Developer Contact Info. Click **Save and Continue**.
    -   **Scopes:**
        -   On the "Scopes" page, click **Add or Remove Scopes**.
        -   In the "Manually add scopes" text box or Search filter, enter: `https://www.googleapis.com/auth/drive.file`
        -   Select it from the list and click **Update**, then **Save and Continue**.
    -   **Test Users (Crucial):** 
        -   Keep the "Publishing Status" as **Testing** (do not click "Publish App" unless you want to go through Google verification).
        -   You **MUST** add the email addresses of the specific Admins who will log in.
        -   *If this is skipped, users will receive an "Access Blocked: App has not completed the Google verification process" error.*

4.  **Create Credentials:**
    -   **OAuth Client ID:**
        -   Go to **APIs & Services > Credentials**.
        -   Click **Create Credentials > OAuth client ID**.
        -   Application Type: **Web application**.
        -   **Authorized JavaScript origins:**
            -   Add your hosting domains:
                -   `http://localhost` (or your local IP for testing)
                -   `https://<your-username>.github.io`
        -   Click **Create**.
        -   Copy the **Client ID** and paste it into `js/config.js` as `clientId`.

5.  **Finalize Config:**
    -   Open `js/config.js`.
    -   Update the `googleConfig` object with your Client ID.
