function doPost(e) {
  try {
    // 1. Get the data from the request
    // expects JSON body: { "filename": "...", "mimeType": "...", "fileData": "base64..." }
    var data = JSON.parse(e.postData.contents);
    var filename = data.filename;
    var mimeType = data.mimeType;
    var base64Data = data.fileData;
    var folderId = data.folderId;
    
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, filename);
    var file;

    if (folderId) {
      try {
        file = DriveApp.getFolderById(folderId).createFile(blob);
      } catch (e) {
        file = DriveApp.createFile(blob);
      }
    } else {
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
