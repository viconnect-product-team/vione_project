# KỸ NĂNG & CHECKLIST KIỂM THỬ (SKILLS) - PHÂN HỆ WEB CRM VIONE
## VIONE CRM PLATFORM TESTING & QUALITY GATES

> **Mã tài liệu:** `VIONE-SKILLS-CRM-06`  
> **Phân hệ:** Web CRM ViOne Enterprise

---

## 1. CHECKLIST KIỂM THỬ CÁC LUẬT NGHIỆP VỤ CỐT LÕI (BR TEST MATRIX)

| STT | Mã luật | Kịch bản kiểm thử | Kết quả mong đợi |
| :--- | :--- | :--- | :--- |
| 1 | **BR-WRK-01** | Tạo công việc thiếu Assignee hoặc Deadline | Form báo lỗi đỏ, chặn submit thành công |
| 2 | **BR-WRK-02** | Công việc có Deadline nhỏ hơn ngày hiện tại | Thẻ công việc hiển thị viền đỏ phát sáng (Glowing Red Pulse) |
| 3 | **BR-WRK-06** | Nhân viên đã có 5 việc In Progress, kéo thêm việc thứ 6 | Hệ thống chặn và hiện toast cảnh báo giới hạn WIP Limit $\le 5$ |
| 4 | **BR-WRK-07** | Chuyển việc sang Done khi checklist chưa đạt 100% | Hệ thống chặn chuyển trạng thái, yêu cầu hoàn thành checklist |
| 5 | **BR-WRK-14** | Nhân viên có tổng giờ làm $> 45\text{h/tuần}$ | Ô trên Workload Heatmap chuyển sang màu đỏ và gắn nhãn "Quá tải" |
| 6 | **BR-FIN-02** | Tờ trình chi $> 20.000.000$ đ | Chỉ tài khoản CEO mới có quyền Ký duyệt, Trưởng phòng/CFO chỉ được xem hoặc soát xét |
| 7 | **BR-FIN-06** | Sau khi CEO ký duyệt chi | API trả về mã VietQR Napas 24/7 gạch nợ tức thì |
| 8 | **BR-HRM-01** | Check-in tọa độ $> 50\text{m}$ so với văn phòng | Bị từ chối check-in với thông báo "Vượt quá bán kính cho phép" |

---

## 2. LỆNH KIỂM TRA CHẤT LƯỢNG MÃ NGUỒN TRƯỚC KHI BÀN GIAO

```powershell
# Chạy type check cho CRM
cd apps/vione_app_fe
npx tsc --noEmit
```
Yêu cầu trả về exit code 0 (0 errors).
