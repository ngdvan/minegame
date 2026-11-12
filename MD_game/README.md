# Ca đầu tiên của tôi — game top-down

Game 2D nhìn từ trên xuống bằng Three.js. Người chơi điều khiển thợ mỏ đi qua khu sinh hoạt minh họa, gặp người hướng dẫn và tự thực hiện nhiệm vụ đầu ca/cuối ca. Giao diện tiếng Việt, ưu tiên điện thoại; không cần cài gói hoặc biên dịch.

## Chạy game

Từ thư mục gốc dự án:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Mở **http://localhost:8080/MD_game/**. Cần máy chủ HTTP vì trình duyệt tải ES module. Khi muốn truy cập bằng điện thoại cùng mạng, bỏ `--bind 127.0.0.1` và dùng IP mạng nội bộ của máy.

## Điều khiển và cách học

- Chạm đất để đi; chạm công trình để đi tới người trực bên ngoài. Nhân vật tự tìm đường tránh tòa nhà.
- Trên điện thoại có bốn nút di chuyển; trên máy tính dùng WASD hoặc phím mũi tên.
- Đứng gần địa điểm rồi bấm **Tương tác** hoặc **E**. Chọn thao tác thực tế trong bối cảnh: báo công, mang từng món bảo hộ, nhận/trả đèn và bình tự cứu…
- Nút **Dẫn tới điểm này** giúp đi đến mục tiêu; người chơi vẫn phải tự tương tác và thực hiện từng thao tác.
- Bản đồ nhỏ hiển thị vị trí người chơi và mục tiêu. Túi trang bị cập nhật khi nhận/trả đồ; ngoại hình đổi khi thay bảo hộ và nhận đèn.
- Đi sai nơi không hoàn thành nhiệm vụ: nhân vật tại đó nhắc bước cần làm. Không tính điểm tốc độ hoặc thưởng việc bỏ bước.
- Tiến độ, trang bị và vị trí tự lưu trên thiết bị. Có tạm nghỉ, tiếp tục và chơi lại. Sổ hành trình ghi lại điều đã thực hiện và bài học tương ứng.

## 13 nhiệm vụ

1. Báo công tại phòng giao ca.
2. Ăn cơm đầu ca tại nhà ăn.
3. Thay bốn nhóm bảo hộ trong bài giảng: quần áo, ủng và ghệt, mũ lò, bảo hộ chuyên dùng theo công việc.
4. Cất đồ sạch và khóa tủ cá nhân.
5. Nhận cả đèn và bình tự cứu tại nhà đèn.
6. Trở lại phòng giao ca nhận lệnh sản xuất.
7. Đến gặp người kèm cặp tại điểm nhận việc.
8. Sau phần làm việc được lược qua: báo cáo/lấy thẻ lò tại trạm theo quy định.
9. Trả đèn và bình tự cứu tại nhà đèn.
10. Trả bảo hộ tại nhà tắm.
11. Tắm sau ca.
12. Về tủ cá nhân thay đồ sạch.
13. Đi theo hành lang ngoài để ra về.

## Nguồn và giới hạn

Nguồn chính: [Bài giảng huấn luyện AT bước 1 — P.TCLĐ (2017)](<../docs/MD/Bài giảng huấn luyện AT bước 1. P.TCLĐ.doc>), Bài 2 mục 3, 4.1–4.3.a; Bài 3 mục 3.6.b. Mỗi nhiệm vụ lưu đề mục nguồn và giải thích trong `missions.js`; nội dung hiển thị khi tương tác và trong sổ hành trình.

Bố trí địa điểm, hội thoại, nhân vật, đường đi và cơ chế tương tác là thiết kế hư cấu phục vụ học tập. Sơ đồ không dùng dẫn đường thực tế. Game lược qua thời gian làm việc, không mô phỏng thao tác khai thác, sử dụng bình tự cứu hay thoát nạn. Danh mục bảo hộ theo nghề và trình tự hiện hành cần được đơn vị đối chiếu với tài liệu năm 2017 trước khi dùng huấn luyện. Kết quả không phải chứng nhận đủ điều kiện làm việc.

## Cấu trúc

- `index.html`, `topdown.css`: khung trang, HUD, điều khiển cảm ứng và hộp tương tác.
- `topdown.js`: cảnh Three.js, nhân vật, camera bám, tương tác theo khoảng cách, lưu tiến độ.
- `missions.js`: dữ liệu nhiệm vụ, nguồn tham chiếu, trạng thái và kiểm tra trình tự.
- `navigation.js`: tìm đường trên lưới và kiểm tra va chạm.
- `tests/gameplay.mjs`: kiểm tra toàn bộ nhiệm vụ, nhận/trả đồ, chặn bỏ bước, dữ liệu lưu và đường đi.
- `vendor/`: Three.js 0.180.0 và giấy phép MIT; không tải tài nguyên ngoài mạng khi chơi.
- `game.js`, `journey.js`, `styles.css`: bản trắc nghiệm/bản đồ cũ được giữ để tham khảo, không tải trong game mới.
- `Y_TUONG_GAME_HUAN_LUYEN.md`: bản ý tưởng ban đầu.

Cần trình duyệt hỗ trợ WebGL 2. Nếu đồ họa không khởi tạo được, trang hiển thị thông báo; bản top-down chưa có chế độ chơi thay thế không dùng WebGL. Chưa có mô phỏng thao tác lao động thực tế bên trong công trình.

## Kiểm tra

```sh
node MD_game/tests/gameplay.mjs
node --check MD_game/topdown.js
```

Kiểm tra trình duyệt qua Chrome headless: di chuyển bằng bàn phím, đi theo đường tới mục tiêu, tương tác và làm đủ 13 nhiệm vụ, cập nhật trang bị, tải lại/tiếp tục; kiểm tra bố cục tại 390×844, 360×740 và 1440×1000. Đây là kiểm tra trình duyệt mô phỏng, chưa thay thế thử trên điện thoại thật.

## Skill Three.js đã áp dụng

- [threejs-fundamentals](https://github.com/CloudAI-X/threejs-skills/tree/main/skills/threejs-fundamentals): camera trực giao, scene, resize, giới hạn pixel ratio.
- [threejs-interaction](https://github.com/CloudAI-X/threejs-skills/tree/main/skills/threejs-interaction): pointer events và raycasting theo tọa độ canvas.

Đã đọc và áp dụng trong phiên triển khai; chưa cài vào cấu hình Codex toàn cục. Skill mô tả r186; dự án ghim r180 và sử dụng các API tương thích. Dừng vòng lặp khi tab ẩn; tùy chọn giảm chuyển động tắt nhún bước chân và dấu mục tiêu.
