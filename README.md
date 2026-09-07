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
│   │   ├── models/        # 22 Mongoose models → MongoDB collections
│   │   ├── routes/
│   │   └── server.js
│   └── .env
└── .github/
    └── workflows/
        └── keep-alive.yml
```

### 🗄️ Database – MongoDB Atlas Collections

Dự án sử dụng **MongoDB Atlas** (cloud) với database tên `tnt_company`. Toàn bộ schema được định nghĩa qua **Mongoose** trong `backend/src/models/`:

| Collection               | Model File                 | Mô tả                                   |
|--------------------------|----------------------------|-----------------------------------------|
| `auditlogs`              | `AuditLog.js`              | Lưu vết mọi thao tác thay đổi hệ thống |
| `categorynews`           | `CategoryNews.js`          | Danh mục tin tức                        |
| `categoryproducts`       | `CategoryProduct.js`       | Danh mục sản phẩm                       |
| `contacts`               | `Contact.js`               | Thông tin liên hệ từ khách hàng         |
| `contactrecruitments`    | `ContactRecruitment.js`    | Đơn ứng tuyển tuyển dụng               |
| `headers`                | `Header.js`                | Cấu hình header website                 |
| `informations`           | `Information.js`           | Thông tin chung công ty                 |
| `introductcompanies`     | `IntroductCompany.js`      | Nội dung giới thiệu công ty             |
| `leaders`                | `Leader.js`                | Thông tin ban lãnh đạo                  |
| `news`                   | `News.js`                  | Bài viết / tin tức                      |
| `partners`               | `Partner.js`               | Đối tác của công ty                     |
| `products`               | `Product.js`               | Danh sách sản phẩm                      |
| `projects`               | `Project.js`               | Dự án đã thực hiện                      |
| `recruitments`           | `Recruitment.js`           | Tin tuyển dụng                          |
| `services`               | `Service.js`               | Dịch vụ cung cấp                        |
| `sessions`               | `Session.js`               | Phiên đăng nhập (giám sát real-time)   |
| `testimonials`           | `Testimonial.js`           | Đánh giá / phản hồi khách hàng         |
| `themefooters`           | `ThemeFooter.js`           | Cấu hình giao diện footer               |
| `themeheaders`           | `ThemeHeader.js`           | Cấu hình giao diện header               |
| `users`                  | `User.js`                  | Tài khoản quản trị viên                 |
| `whychoosecompanies`     | `WhyChooseCompany.js`      | Nội dung "Tại sao chọn chúng tôi"      |
| `whychooseservices`      | `WhyChooseService.js`      | Lý do chọn dịch vụ                      |

---

## ⚙️ Yêu cầu môi trường

| Công cụ          | Phiên bản tối thiểu |
|------------------|---------------------|
| Node.js          | >= 18.x             |
| npm              | >= 9.x              |
| Git              | Bất kỳ              |
| MongoDB Atlas    | Free Tier (M0)      |

> Tải Node.js tại: https://nodejs.org/
> Đăng ký MongoDB Atlas miễn phí tại: https://www.mongodb.com/atlas

---

## 🚀 Chạy project ở môi trường Local (Development)

### Bước 1 – Clone repository

```bash
git clone https://github.com/<your-username>/TNT_PCCC.git
cd TNT_PCCC
```

---

### Bước 1.5 – Cấu hình Database (MongoDB Atlas)

> ⚠️ **Bắt buộc thực hiện trước khi chạy Backend.**

#### 1. Tạo tài khoản & Cluster
1. Truy cập [mongodb.com/atlas](https://www.mongodb.com/atlas) → Đăng ký miễn phí
2. Tạo **Cluster M0** (Free Tier)
3. Tạo **Database User**: vào *Database Access* → Add New Database User
4. Cấu hình **Network Access**: vào *Network Access* → Add IP Address → chọn `0.0.0.0/0` (cho phép mọi IP, phù hợp development)

#### 2. Lấy Connection String
1. Vào cluster → Click **Connect** → chọn **Drivers**
2. Chọn Driver: **Node.js**, Version: **5.5 or later**
3. Copy chuỗi kết nối có dạng:

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tnt_company?retryWrites=true&w=majority&appName=Cluster0
```

4. Thay `<username>`, `<password>` bằng thông tin Database User đã tạo
5. Dán vào biến `MONGO_URI` trong file `backend/.env`

#### 3. Database sẽ tự động khởi tạo
> Khi backend chạy lần đầu và có request, **Mongoose sẽ tự động tạo các collections** tương ứng với 22 models. Không cần chạy migration hay seed thủ công.

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

| Service    | URL                              |
|------------|----------------------------------|
| Frontend   | http://localhost:5173            |
| Backend    | http://localhost:5001            |
| API Base   | http://localhost:5001/api/tnt    |
| Database   | MongoDB Atlas (cloud connection) |

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

### Database – MongoDB Atlas

1. Đăng nhập [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Tạo **Cluster M0** (Free Tier) → chọn region gần nhất (Singapore recommended)
3. Vào **Database Access** → Add New Database User:
   - Authentication: **Password**
   - Role: **Atlas Admin** (hoặc `readWriteAnyDatabase`)
4. Vào **Network Access** → Add IP Address:
   - Development: `0.0.0.0/0`
   - Production: thêm IP cố định của Render.com
5. Lấy **Connection String** → dán vào biến `MONGO_URI` trên Render.com

> ✅ Database **không cần deploy riêng** – MongoDB Atlas là dịch vụ cloud managed, luôn sẵn sàng 24/7.

---

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

### 🗺️ Sơ đồ triển khai tổng thể

```
┌─────────────────┐     HTTPS      ┌─────────────────┐
│   Vercel         │ ─────────────► │   Render.com     │
│   (Frontend)     │  REST API /    │   (Backend)      │
│   React + Vite   │  Socket.IO     │   Node + Express │
└─────────────────┘                └────────┬────────┘
                                             │ MONGO_URI
                                             │ (mongodb+srv://)
                                             ▼
                                   ┌─────────────────┐
                                   │  MongoDB Atlas   │
                                   │  (Database)      │
                                   │  22 Collections  │
                                   └─────────────────┘
```

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

### Database

| Công nghệ          | Mục đích                                        |
|--------------------|-------------------------------------------------|
| MongoDB Atlas      | Cloud database (NoSQL document store)           |
| Mongoose 8         | ODM – định nghĩa Schema, validation, relations  |
| MongoDB M0 Cluster | Free tier – 512MB storage, shared cluster       |

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

### `database` – Không có file `.env` riêng

> MongoDB Atlas không cần file cấu hình riêng. Toàn bộ kết nối được quản lý qua biến `MONGO_URI` trong `backend/.env`.

| Thông số             | Giá trị mặc định                      |
|----------------------|---------------------------------------|
| Database Name        | `tnt_company`                         |
| Auth Source          | `admin`                               |
| Connection Pool      | Mongoose mặc định (5 connections)     |
| Retry Writes         | `true`                                |
| Write Concern        | `majority`                            |

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

