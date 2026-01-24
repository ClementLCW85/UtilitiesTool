// Google Drive Service Wrapper
// Handles Auth and File Upload via OAuth 2.0 (Identity Services) and REST API

const DriveService = {
    tokenClient: null,
    accessToken: null,
    isGisLoaded: false,

    // Initialize the Service
    init: function() {
        console.log("Initializing Drive Service (OAuth 2.0)...");
        // Expects the GIS library to be loaded via script tags with onload handlers
    },

    // Callback for when GIS script loads
    handleGisLoad: function() {
        try {
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: window.googleConfig.clientId,
                scope: window.googleConfig.scopes,
                callback: (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        this.accessToken = tokenResponse.access_token;
                        console.log("Access Token received.");
                    }
                },
            });
            this.isGisLoaded = true;
            console.log('GIS client initialized.');
        } catch (err) {
            console.error("Error initializing GIS client", err);
        }
    },

    // Helper to get a valid token
    // Returns a Promise that resolves to the access token
    getAccessToken: function() {
        return new Promise((resolve, reject) => {
            if (this.accessToken) {
                // Ideally check expiration, but for this simple app, we assume it's valid if present
                // or let the API call fail and retry. For now, return it.
                // Simple enhancement: Check if it's been a while?  Let's keep it simple.
                resolve(this.accessToken);
                return;
            }

            // Need to request token.
            // CAUTION: This triggers a popup. Must be called from a user event handler.
            if (!this.tokenClient) {
                reject("Token Client not initialized. GIS script might still be loading.");
                return;
            }

            // Update the callback for this specific request
            this.tokenClient.callback = (resp) => {
                if (resp.error !== undefined) {
                    reject(resp);
                }
                this.accessToken = resp.access_token;
                resolve(this.accessToken);
            };

            // Request permission
            // 'prompt': '' -> attempts to authorize without popup if previously consented
            // 'prompt': 'consent' -> force popup
            this.tokenClient.requestAccessToken({ prompt: '' });
        });
    },

    uploadFile: async function(file) {
        if (!file) throw new Error("No file provided.");

        try {
            const token = await this.getAccessToken();
            
            // Prepare FormData for Multipart Upload
            const metadata = {
                'name': `Seapark_Receipt_${Date.now()}_${file.name}`,
                'mimeType': file.type || 'application/octet-stream',
                // Optional: 'parents': ['FOLDER_ID'] 
            };
            
            const formData = new FormData();
            formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            formData.append('file', file);

            // POST to Drive API
            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,thumbnailLink', {
                method: 'POST',
                headers: new Headers({ 'Authorization': 'Bearer ' + token }),
                body: formData
            });

            const data = await response.json();
            if (data.error) throw new Error(JSON.stringify(data.error));

            // Set Permission to Public Reading
            await this.makeFilePublic(data.id, token);

            return data.webViewLink; // The link to view the file
        } catch (error) {
            console.error("Upload failed", error);
            throw error;
        }
    },

    makeFilePublic: async function(fileId, token) {
        try {
            await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    role: 'reader',
                    type: 'anyone'
                })
            });
        } catch (err) {
            console.warn("Could not make file public. It might be private.", err);
        }
    }
};

// Global Exposure
window.DriveService = DriveService;

// Setup global callback functions for the script tags in index.html
window.handleGisLoad = () => DriveService.handleGisLoad();
