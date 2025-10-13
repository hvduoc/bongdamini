// Google Apps Script - API đơn giản cho Giải Bóng Đá Mini
// Deploy: Extensions → Apps Script → Deploy → New deployment → Web app
// Cấu hình: Execute as: Me, Who has access: Anyone

const SHEET_ID = '1x3ueNpDsii_oMg9FXROZlHzKLW3SHHDr43TEsgoNcvQ';
const SHEET_NAME = 'KetQua';

// GET: Lấy dữ liệu hoặc cập nhật (hỗ trợ JSONP)
function doGet(e) {
  try {
    // Xử lý update nếu có action=update
    if (e.parameter.action === 'update') {
      return handleUpdate(e);
    }
    
    // Lấy dữ liệu thông thường
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    
    // Lấy dữ liệu
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    
    const result = {
      status: 'success',
      data: rows,
      count: rows.length
    };
    
    return returnResponse(result, e.parameter.callback);
      
  } catch (error) {
    const result = {
      status: 'error',
      message: error.toString()
    };
    
    return returnResponse(result, e.parameter.callback);
  }
}

// Hàm helper để trả về response (JSON hoặc JSONP)
function returnResponse(result, callback) {
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// Xử lý update dữ liệu
function handleUpdate(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Xóa dữ liệu cũ
    sheet.clear();
    sheet.appendRow(['Khoi', 'DoiA', 'DoiB', 'TiSoA', 'TiSoB']);
    
    // Parse dữ liệu từ parameter
    const results = JSON.parse(e.parameter.data || '[]');
    results.forEach(row => {
      sheet.appendRow([row.khoi, row.doiA, row.doiB, row.tiSoA, row.tiSoB]);
    });

    const result = {
      status: 'success',
      message: 'Data updated successfully',
      count: results.length
    };
    
    return returnResponse(result, e.parameter.callback);
  } catch (error) {
    const result = {
      status: 'error',
      message: error.toString()
    };
    
    return returnResponse(result, e.parameter.callback);
  }
}

// POST: Chuyển thành GET (không cần thiết nữa)
function doPost(e) {
  return doGet(e);
}
