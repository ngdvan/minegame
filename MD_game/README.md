# Ca đầu tiên của tôi

Web game ôn tập bằng HTML, CSS và JavaScript thuần; không cần cài thư viện hoặc biên dịch. Giao diện tiếng Việt, ưu tiên điện thoại.

## Chạy game

Mở `index.html` bằng trình duyệt, hoặc từ thư mục gốc dự án chạy:

```sh
python3 -m http.server 8080
```

Truy cập `http://localhost:8080/MD_game/`. Phục vụ từ thư mục gốc giúp các liên kết tài liệu tại `../docs/MD/` hoạt động. Để mở trên điện thoại cùng mạng, dùng địa chỉ IP mạng nội bộ của máy thay cho `localhost`.

## Nội dung

- 10 thử thách qua 4 chặng: đầu ca, trang bị bảo hộ, nhận lệnh/giao ca và cuối ca.
- Hai bài sắp xếp bằng nút lên/xuống, một bài chọn nhiều trang bị, bảy câu hỏi một đáp án.
- Đúng lần đầu được 1 điểm. Sai được giải thích, xem đáp án và thử lại; phải trả lời đúng mới sang bài tiếp theo. Không đếm ngược hoặc thưởng tốc độ.
- Tiến độ sau mỗi thử thách được lưu trên trình duyệt nếu có quyền lưu trữ. Thử thách đang làm sẽ bắt đầu lại khi tải lại trang. Nút “Tạm nghỉ” giữ điểm các thử thách đã hoàn thành.
- Không gửi dữ liệu ra ngoài, không dùng phông chữ hoặc thư viện từ mạng.

## Cấu trúc

- `index.html`: khung trang và hộp tài liệu nguồn.
- `styles.css`: giao diện đáp ứng điện thoại/máy tính.
- `game.js`: câu hỏi, nguồn, đáp án, trạng thái và điểm số.
- `Y_TUONG_GAME_HUAN_LUYEN.md`: bản ý tưởng ban đầu.

Nguồn chính: **Bài giảng huấn luyện AT bước 1 — P.TCLĐ (2017)**, Bài 2 mục 3, 4.1–4.3; Bài 3 mục 3.6. Mỗi câu hiển thị đề mục nguồn. Chương trình khung 2019 và 2020 cung cấp phạm vi chủ đề, không thay thế quy trình thao tác chi tiết.

Nội dung phản ánh tài liệu cũ được cung cấp; trước khi dùng huấn luyện tại đơn vị, cần đối chiếu với quy trình hiện hành và danh mục bảo hộ theo nghề. Điểm game không phải chứng nhận nghiệp vụ.
