# Hướng dẫn sử dụng

## 1. Cấu hình Google Apps Script

1. Mở file `google-script.gs` trong Google Apps Script.
2. Đảm bảo `SHEET_ID` và `SHEET_NAME` khớp với Google Sheet bạn muốn sử dụng.
3. Triển khai script:
   - Vào menu `Extensions` → `Apps Script` → `Deploy` → `New deployment` → `Web app`.
   - Cấu hình:
     - `Execute as`: Me.
     - `Who has access`: Anyone.

## 2. Sử dụng chức năng

### 2.1. Đẩy dữ liệu lên Sheet
- Gửi yêu cầu POST đến URL của Web App.
- Dữ liệu yêu cầu:
  ```json
  {
    "action": "update",
    "results": [
      {"khoi": "Khối 4", "doiA": "Đội A", "doiB": "Đội B", "tiSoA": 2, "tiSoB": 1},
      {"khoi": "Khối 5", "doiA": "Đội C", "doiB": "Đội D", "tiSoA": 3, "tiSoB": 2}
    ]
  }
  ```

### 2.2. Xóa dữ liệu cũ
- Gửi yêu cầu POST với dữ liệu:
  ```json
  {
    "action": "reset"
  }
  ```

## 3. Debugging
- Kiểm tra log trong Google Apps Script để xem chi tiết lỗi.
- Các log đã được thêm vào hàm `doPost` để hỗ trợ việc kiểm tra.

## 4. Lỗi thường gặp

### 4.1. Failed to fetch
- Kiểm tra URL của Web App.
- Đảm bảo quyền truy cập được đặt thành "Anyone".
- Kiểm tra dữ liệu gửi đi có đúng định dạng JSON.

### 4.2. Sheet không tồn tại
- Script sẽ tự động tạo sheet nếu không tìm thấy sheet với tên `SHEET_NAME`.

## 5. Liên hệ
- Nếu gặp vấn đề, vui lòng liên hệ quản trị viên để được hỗ trợ.