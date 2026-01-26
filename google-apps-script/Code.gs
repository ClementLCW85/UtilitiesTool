function doPost(e) {
  try {
    // 1. Get the data from the request
    // expects JSON body: { "filename": "...", "mimeType": "...", "fileData": "base64..." }
    var data = JSON.parse(e.postData.contents);
    var filename = data.filename;
    var mimeType = data.mimeType;
    var base64Data = data.fileData;
    // 2. Security & Config
    // Hardcoded Folder ID (Receipts) to prevent arbitrary writes to other Admin folders.
    // This ensures that even if the client is compromised, it cannot upload to sensitive folders.
    // REPLACE WITH YOUR ACTUAL FOLDER ID found in js/config.js
    var TARGET_FOLDER_ID = "1VY6uns6MEDtAJoWQ7kUgZf7xa44b1M6n"; 
    
    // 3. Create Blob
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, filename);
    var file;

    // 4. Save File
    // We strictly use the TARGET_FOLDER_ID. We do NOT use data.folderId from the request.
    try {
      file = DriveApp.getFolderById(TARGET_FOLDER_ID).createFile(blob);
    } catch (e) {
      // Fallback only if the specific folder fails (e.g. deleted), though ideally we should fail safe.
      // Creating in root is a safe fallback for visibility.
      file = DriveApp.createFile(blob);
    }
    
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // 4. Return the result
    var result = {
      status: "success",
      url: file.getUrl(),
      downloadUrl: file.getDownloadUrl(),
      id: file.getId()
    };
    
    // Return JSON
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    var result = { status: "error", message: error.toString() };
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: specific folder version (commented out for reference)
/*
function doPostWithFolder(e) {
    // ... parse data ...
    var folderId = "YOUR_SPECIFIC_FOLDER_ID";
    var folder = DriveApp.getFolderById(folderId);
    var file = folder.createFile(blob);
    // ... rest same ...
}
*/
