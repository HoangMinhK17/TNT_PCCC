# 🧯 TNT PCCC - Nền tảng Thương mại & Quản trị Doanh nghiệp

**TNT PCCC** là giải pháp Web Fullstack toàn diện được xây dựng cho công ty TNHH TNT PCCC. Dự án không chỉ cung cấp website giới thiệu sản phẩm, dự án, tin tức và đặt hàng, mà còn tích hợp một **Hệ thống Quản trị (Admin Dashboard)** mạnh mẽ với các module chuyên sâu.

## 🌟 Tính năng nổi bật

### 🛒 Dành cho Khách hàng (Client-side)
- **📧 Xác thực & Bảo mật:** Quản lý tài khoản bảo mật, hỗ trợ lấy lại mật khẩu và thông báo đổi mật khẩu tự động qua hệ thống Email.
- Xem thông tin công ty, dự án, tin tức chuyên ngành PCCC.
- Duyệt danh mục sản phẩm và thao tác đặt hàng trực tuyến dễ dàng.
- Giao diện thân thiện, chuẩn SEO và tương thích mọi thiết bị (Responsive).

### ⚙️ Hệ thống Quản trị (Admin Dashboard)
Bên cạnh các chức năng quản lý (CRUD) cốt lõi, hệ thống tạo điểm nhấn với các tính năng nâng cao giúp tối ưu vận hành:
- **🎨 Tùy biến giao diện (Dynamic UI):** Admin có thể tự do thay đổi màu sắc, kích cỡ chữ của Header/Footer trực tiếp từ dashboard mà không cần can thiệp source code.
- **🛡️ Audit Logs & Bảo mật:** Lưu vết (log) chi tiết mọi thao tác thay đổi hệ thống. Lưu trữ thông tin địa chỉ, thiết bị đăng nhập để rà soát bất thường.
- **⚡ Quản lý truy cập Real-time:** Ứng dụng Socket.IO cho phép giám sát phiên hoạt động và có khả năng "Kick" (buộc người dùng đăng xuất) ngay lập tức theo thời gian thực.
- **🔄 Thao tác Kéo thả (Drag & Drop):** Sắp xếp thứ tự hiển thị của sản phẩm trực quan chỉ bằng thao tác kéo thả, tăng trải nghiệm UX cho Admin.

---

> 💻 **Tech Stack:** Dự án sử dụng **React + Vite** (Frontend), **Node.js + Express** (Backend), **MongoDB Atlas** (Database), và **Cloudinary** (Lưu trữ media).

---

## 📁 Cấu trúc thư mục

```
TNT_PCCC/
├── frontend/          # React + Vite (chạy ở port 5173)
│   ├── src/
│   ├── public/
│   ├── .env
│   ├── vite.config.js
│   └── vercel.json
├── backend/           # Node.js + Express (chạy ở port 5001)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── .env
└── .github/
    └── workflows/
        └── keep-alive.yml
```

---

## ⚙️ Yêu cầu môi trường

| Công cụ     | Phiên bản tối thiểu |
|-------------|---------------------|
| Node.js     | >= 18.x             |
| npm         | >= 9.x              |
| Git         | Bất kỳ              |

> Tải Node.js tại: https://nodejs.org/

---

## 🚀 Chạy project ở môi trường Local (Development)

### Bước 1 – Clone repository

```bash
git clone https://github.com/<your-username>/TNT_PCCC.git
cd TNT_PCCC
```

---

### Bước 2 – Cài đặt và cấu hình Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/` (hoặc kiểm tra file đã có sẵn):

```env
PORT = 5001
MONGO_URI = mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tnt_company?appName=Cluster0

JWT_SECRET = <your-jwt-secret>
JWT_EXPIRES_IN = 15m
JWT_EXPIRES_IN_REFRESH = 1d
JWT_SECRET_REFRESH = <your-refresh-secret>

CLOUDINARY_CLOUD_NAME = <your-cloud-name>
CLOUDINARY_API_KEY = <your-api-key>
CLOUDINARY_API_SECRET = <your-api-secret>

EMAIL_USENAME = <your-email@gmail.com>
EMAIL_PASSWORD = <your-app-password>

BREVO_USER = <brevo-smtp-user>
BREVO_PASS = <brevo-smtp-pass>

FRONTEND_URL = http://localhost:5173
```

Chạy backend ở chế độ development (tự động reload với nodemon):

```bash
npm run dev
```

> Backend sẽ chạy tại: **http://localhost:5001**

---

### Bước 3 – Cài đặt và cấu hình Frontend

Mở terminal **mới**, vào thư mục frontend:

```bash
cd frontend
npm install
```

Tạo hoặc kiểm tra file `.env` trong thư mục `frontend/`:

```env
VITE_API_URL = http://localhost:5001/api/tnt
VITE_SOCKET_URL = http://localhost:5001
```

Chạy frontend ở chế độ development:

```bash
npm run dev
```

> Frontend sẽ chạy tại: **http://localhost:5173**

---

### ✅ Kết quả sau khi chạy thành công

| Service  | URL                           |
|----------|-------------------------------|
| Frontend | http://localhost:5173         |
| Backend  | http://localhost:5001         |
| API Base | http://localhost:5001/api/tnt |

---

## 🧱 Các lệnh hữu ích

### Frontend

```bash
# Chạy development server
npm run dev

# Build production
npm run build

# Preview bản build
npm run preview

# Kiểm tra lỗi ESLint
npm run lint
```

### Backend

```bash
# Chạy development (nodemon – tự reload khi sửa code)
npm run dev

# Chạy production
npm start
```

---

## ☁️ Triển khai (Deployment)

### Backend – Render.com

1. Đẩy code lên GitHub
2. Vào [render.com](https://render.com), tạo **Web Service** mới
3. Chọn repository và cấu hình:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`
4. Thêm tất cả biến môi trường trong phần **Environment Variables**
5. Deploy → Backend chạy tại: `https://tnt-pccc.onrender.com`

> ⚠️ Render free tier sẽ **ngủ** sau 15 phút không hoạt động. Project đã có GitHub Action
> `.github/workflows/keep-alive.yml` tự động ping mỗi **10 phút** để giữ service luôn sống.

---

### Frontend – Vercel

1. Vào [vercel.com](https://vercel.com), import repository từ GitHub
2. Cấu hình:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Thêm biến môi trường trên Vercel Dashboard:
   ```
   VITE_API_URL = https://tnt-pccc.onrender.com/api/tnt
   VITE_SOCKET_URL = https://tnt-pccc.onrender.com
   ```
4. Deploy → File `vercel.json` đã cấu hình sẵn proxy API và SPA routing

---

## 🔧 Công nghệ sử dụng

### Frontend

| Thư viện              | Mục đích                       |
|-----------------------|--------------------------------|
| React 18              | UI framework                   |
| Vite 8                | Build tool & Dev server        |
| React Router DOM 7    | Client-side routing            |
| Ant Design 6          | UI component library           |
| Axios                 | HTTP client                    |
| Socket.IO Client      | Real-time communication        |
| i18next               | Đa ngôn ngữ (i18n)             |
| React Quill           | Rich text editor               |
| React Toastify        | Thông báo toast                |
| Lucide React          | Icon library                   |
| @dnd-kit              | Drag & Drop                    |

### Backend

| Thư viện       | Mục đích                        |
|----------------|---------------------------------|
| Express 5      | Web framework                   |
| Mongoose       | MongoDB ODM                     |
| JWT            | Xác thực người dùng             |
| Bcrypt         | Mã hóa mật khẩu                 |
| Cloudinary     | Lưu trữ và quản lý ảnh/video    |
| Socket.IO      | Real-time communication         |
| Nodemailer     | Gửi email                       |
| Multer         | Upload file                     |
| Nodemon        | Auto-reload khi dev             |

---

## 🌐 Biến môi trường tham khảo

### `backend/.env`

| Biến                     | Mô tả                                   |
|--------------------------|-----------------------------------------|
| `PORT`                   | Cổng chạy server (mặc định: `5001`)     |
| `MONGO_URI`              | Chuỗi kết nối MongoDB Atlas             |
| `JWT_SECRET`             | Khóa bí mật cho access token           |
| `JWT_EXPIRES_IN`         | Thời hạn access token (VD: `15m`)      |
| `JWT_SECRET_REFRESH`     | Khóa bí mật cho refresh token          |
| `JWT_EXPIRES_IN_REFRESH` | Thời hạn refresh token (VD: `1d`)      |
| `CLOUDINARY_CLOUD_NAME`  | Tên cloud Cloudinary                    |
| `CLOUDINARY_API_KEY`     | API key Cloudinary                      |
| `CLOUDINARY_API_SECRET`  | API secret Cloudinary                   |
| `EMAIL_USENAME`          | Email dùng để gửi mail                  |
| `EMAIL_PASSWORD`         | App password của Gmail                  |
| `BREVO_USER`             | SMTP user của Brevo                     |
| `BREVO_PASS`             | SMTP password của Brevo                 |
| `FRONTEND_URL`           | URL của frontend (dùng cho CORS)        |

### `frontend/.env`

| Biến               | Mô tả                       |
|--------------------|-----------------------------|
| `VITE_API_URL`     | URL base của REST API       |
| `VITE_SOCKET_URL`  | URL kết nối Socket.IO       |

---

## ❓ Lỗi thường gặp

### ❌ CORS Error
Kiểm tra biến `FRONTEND_URL` trong `backend/.env` phải khớp với URL frontend đang chạy.

### ❌ Cannot connect to MongoDB
- Đảm bảo `MONGO_URI` đúng cú pháp và tài khoản có quyền truy cập
- Kiểm tra **Network Access** trên MongoDB Atlas: thêm IP `0.0.0.0/0` cho development

### ❌ Vite proxy không hoạt động
Kiểm tra `vite.config.js`, đảm bảo `target` trỏ đúng đến backend:

```js
proxy: {
  '/api': {
    target: 'http://localhost:5001',
    changeOrigin: true,
  }
}
```

### ❌ Port đã được sử dụng (Windows)

```powershell
# Tìm process đang dùng port
netstat -ano | findstr :5001

# Kill process theo PID
taskkill /PID <PID> /F
```

---

## 👨‍💻 Tác giả & Thông tin liên hệ (Author & Contact)

Dự án này được phân tích, thiết kế hệ thống và phát triển toàn bộ bởi:

**Hoàng Minh** - *Software Engineer / Fullstack Developer*

- 📧 **Email:**  [minhhoang1601dev@gmail.com]
- 🐙 **GitHub:** [@HoangMinhK17](https://github.com/HoangMinhK17)

