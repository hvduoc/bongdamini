// Google Apps Script - API cho Giải Bóng Đá Mini
// Deploy: Extensions → Apps Script → Deploy → New deployment → Web app
// Cấu hình: Execute as: Me, Who has access: Anyone

const SHEET_ID = '1x3ueNpDsii_oMg9FXROZlHzKLW3SHHDr43TEsgoNcvQ';
const SHEET_NAME = 'KetQua';

// GET: Lấy dữ liệu từ sheet (tránh CORS)
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    
    // Lấy toàn bộ dữ liệu
    const data = sheet.getDataRange().getValues();
    
    // Chuyển thành JSON
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    
    // Trả về JSON với CORS header
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        data: rows,
        count: rows.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// POST: Cập nhật dữ liệu vào sheet
function doPost(e) {
  try {
    console.log('Request received:', e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Nếu sheet chưa tồn tại, tạo mới
    if (!sheet) {
      console.log('Sheet not found, creating new sheet');
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Parse JSON data từ request
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', data);

    // Nếu là reset, xóa dữ liệu cũ
    if (data.action === 'reset') {
      console.log('Reset action detected');
      sheet.clear();
      sheet.appendRow(['Khoi', 'DoiA', 'DoiB', 'TiSoA', 'TiSoB']);

      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Sheet cleared'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Nếu là update, ghi dữ liệu
    if (data.action === 'update' && data.results) {
      console.log('Update action detected with results:', data.results);
      // Xóa dữ liệu cũ
      sheet.clear();

      // Ghi header
      sheet.appendRow(['Khoi', 'DoiA', 'DoiB', 'TiSoA', 'TiSoB']);

      // Ghi dữ liệu mới
      data.results.forEach(row => {
        sheet.appendRow([row.khoi, row.doiA, row.doiB, row.tiSoA, row.tiSoB]);
      });

      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Data updated successfully',
          count: data.results.length
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    console.log('Invalid action or missing data');
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid action or missing data'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error occurred:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
