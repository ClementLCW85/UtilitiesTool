function doPost(e) {
  try {
    // 1. Get the data from the request
    // expects JSON body: { "filename": "...", "mimeType": "...", "fileData": "base64..." }
    var data = JSON.parse(e.postData.contents);
    var filename = data.filename;
    var mimeType = data.mimeType;
    var base64Data = data.fileData; // The file content sent as base64 string
    
    // 2. Folder Handling
    // By default, saves to the root of the "Execute as" user's Drive.
    // To save to a specific folder:
    // var folderId = "YOUR_FOLDER_ID_HERE"; 
    // var folder = DriveApp.getFolderById(folderId);
    // var file = folder.createFile(blob);
    
    // For this implementation, we use root or can be customized by the user in the script.
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, filename);
    var file = DriveApp.createFile(blob); // Creates in Root
    
    // 3. Set Permissions 
    // The public needs to be able to SEE the receipt if the dashboard links to it? 
    // Or only Admin? Requirement says "Proof of Payment". 
    // If the public dashboard doesn't need to show the image link to everyone, we can restrict it.
    // However, the current Admin app displays it.
    // Let's set it to ANYONE_WITH_LINK VIEW for simplicity so the Admin Portal (and potentially Public history) can view it easily without auth issues on the image itself.
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
