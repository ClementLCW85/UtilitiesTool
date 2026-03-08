function doPost(e) {
  try {
    // 1. Get the data from the request
    var data = JSON.parse(e.postData.contents);
    var action = data.action || 'upload'; // 'upload' or 'sendEmail'
    
    // Handle different actions
    if (action === 'sendEmail') {
      return handleSendEmail(data);
    }
    
    // Default: file upload
    var filename = data.filename;
    var mimeType = data.mimeType;
    var base64Data = data.fileData;
    
    // 2. Input Validation - Ensure required fields are present
    if (!filename || !base64Data || !mimeType) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error", 
        message: "Missing required fields: filename, mimeType, or fileData"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 3. File Size Limit - Max 5MB (prevent storage abuse)
    var decodedLength = Utilities.base64Decode(base64Data).length;
    if (decodedLength > 5 * 1024 * 1024) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error", 
        message: "File too large. Maximum size is 5MB."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 4. Target Folder ID (Hardcoded for security - prevents arbitrary folder writes)
    // To get ID, open folder in Drive, look at URL: folders/YOUR_ID_HERE
    var TARGET_FOLDER_ID = "1VY6uns6MEDtAJoWQ7kUgZf7xa44b1M6n"; 
    
    // 5. Create the file from Base64
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, filename);
    var file;
    
    // Save to target folder, fallback to root if folder fails
    try {
      var folder = DriveApp.getFolderById(TARGET_FOLDER_ID);
      file = folder.createFile(blob);
    } catch (folderError) {
      // Fallback: create in root if specific folder fails (e.g. deleted)
      file = DriveApp.createFile(blob);
    }
    
    // 6. Set Permissions (Make it viewable by anyone with the link)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // 7. Return the result
    var result = {
      status: "success",
      url: file.getUrl(),
      downloadUrl: file.getDownloadUrl(),
      id: file.getId()
    };
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    var result = { status: "error", message: error.toString() };
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle sending email with PDF attachment
 */
function handleSendEmail(data) {
  try {
    var recipient = data.recipient;
    var subject = data.subject;
    var body = data.body;
    var pdfBase64 = data.pdfData;
    var pdfFilename = data.pdfFilename || 'report.pdf';
    
    // Validation
    if (!recipient || !subject || !pdfBase64) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Missing required fields: recipient, subject, or pdfData"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Create PDF blob from base64
    var pdfBlob = Utilities.newBlob(
      Utilities.base64Decode(pdfBase64),
      'application/pdf',
      pdfFilename
    );
    
    // Send email with attachment
    GmailApp.sendEmail(recipient, subject, body, {
      attachments: [pdfBlob],
      name: 'Seapark Utility Tracker'
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Email sent successfully to " + recipient
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
