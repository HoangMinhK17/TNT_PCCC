import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import './styles/ThemeAITeal.css'
import './styles/ThemeMidnightDark.css'
import Home from './pages/Home'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetail'
import ProjectDetail from './pages/ProjectDetail'
import NewsDetail from './pages/NewsDetail'
import IntroductionCompany from './pages/IntroductionCompany'
import Project from './pages/Project'
import New from './pages/New'
import Contact from './pages/Contact'
import Recruiment from './pages/Recruiment'
import Partner from './pages/Partner'
import Service from './pages/Service'
import ServiceDetail from './pages/ServiceDetail'
import Login from './admin/login'
import MainLayout from './component/MainLayout'
import ForgetPassword from './admin/ForgetPassword'
import ResetPassword from './admin/ResetPassword'
import Dashboard from './admin/dashboard'
import AdminIntroduction from './admin/AdminIntroduction'
import AdminProduct from './admin/AdminProduct'
import AdminProject from './admin/AdminProject'
import AdminService from './admin/AdminService'
import AdminNews from './admin/AdminNews'
import AdminRecruitment from './admin/AdminRecruitment'
import AdminPartner from './admin/AdminPartner'
import AdminContact from './admin/AdminContact'
import AdminInformation from './admin/AdminInformation'
import AdminTestimonial from './admin/AdminTestimonial'
import AdminAuditLog from './admin/AdminAuditLog'
import ProtectedRoute from './component/ProtectedRoute'
import api from './utils/api'
import { getImageInformation } from './utils/informationApi'
import { initSocket, registerUser, disconnectSocket } from './utils/socket'

const imageModules = import.meta.glob('./uploads/**/*.{png,jpg,jpeg,svg,webp,ico}', { eager: true, query: '?url', import: 'default' });

import { HeaderProvider } from './context/HeaderContext'

import { ThemeProvider } from './context/ThemeContext'

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true
    });
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const deviceId = localStorage.getItem('deviceId');
    const socket = initSocket();

    if (user?.id && deviceId) {
      registerUser(user.id, deviceId);
      socket.on('connect', () => {
        registerUser(user.id, deviceId);
      });
    }

    socket.on('force_logout', ({ reason }) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      disconnectSocket();
      toast.error(reason || 'Phiên đăng nhập của bạn đã bị đăng xuất!', {
        autoClose: 3000,
        onClose: () => {
          if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login';
          }
        }
      });

      setTimeout(() => {
        if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }, 3200);
    });

    return () => {
      socket.off('force_logout');
    };
  }, []);

  useEffect(() => {
    const fetchLogoPath = async () => {
      try {
        const res = await getImageInformation();
        const obj = Array.isArray(res) ? res[0] : res;

        if (obj?.name) {
          document.title = obj.name;
        }

        const faviconPath = obj?.favicon;

        if (faviconPath) {
          let finalPath = faviconPath;

          if (!faviconPath.startsWith('http') && !faviconPath.startsWith('blob:') && !faviconPath.startsWith('data:')) {
            const globPath = `.${faviconPath}`;
            if (imageModules[globPath]) {
              finalPath = imageModules[globPath];
            }
          }

          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = finalPath;
        }
      } catch (error) {
        console.error("Error setting favicon from API:", error);
      }
    };
    fetchLogoPath();
  }, []);

  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const isSubdomainAdmin = hostname.startsWith('admin.') || (typeof window !== 'undefined' && window.location.search.includes('subdomain=admin'));

  useEffect(() => {
    // Nếu truy cập các đường dẫn /admin từ domain chính (pccctnt.com.vn), chuyển hướng sang subdomain admin
    const host = window.location.hostname.toLowerCase();
    if (host.includes('pccctnt.com.vn') && !host.startsWith('admin.')) {
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = `https://admin.pccctnt.com.vn${window.location.pathname}${window.location.search}`;
      }
    }
  }, []);

  const renderAdminRoutes = () => (
    <>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/forget-password" element={<ForgetPassword />} />
      <Route path="/admin/reset-password/:retoken" element={<ResetPassword />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/about"
        element={
          <ProtectedRoute>
            <AdminIntroduction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <AdminProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute>
            <AdminProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute>
            <AdminService />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/news"
        element={
          <ProtectedRoute>
            <AdminNews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/recruitment"
        element={
          <ProtectedRoute>
            <AdminRecruitment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/partners"
        element={
          <ProtectedRoute>
            <AdminPartner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contacts"
        element={
          <ProtectedRoute>
            <AdminContact />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/testimonial"
        element={
          <ProtectedRoute>
            <AdminTestimonial />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/information"
        element={
          <ProtectedRoute>
            <AdminInformation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-log"
        element={
          <ProtectedRoute>
            <AdminAuditLog />
          </ProtectedRoute>
        }
      />
    </>
  );

  return (
    <ThemeProvider>
      <HeaderProvider>
        <Router>
          {isSubdomainAdmin ? (
            <Routes>
              {/* Khi vào admin.pccctnt.com.vn hoặc /admin -> tự động vào Dashboard (hoặc Login nếu chưa xác thực) */}
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/login" element={<Navigate to="/admin/login" replace />} />
              <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/forget-password" element={<Navigate to="/admin/forget-password" replace />} />
              <Route path="/reset-password/:retoken" element={<ResetPassword />} />

              {/* Shortcut URL tiện ích trên subdomain */}
              <Route path="/about" element={<Navigate to="/admin/about" replace />} />
              <Route path="/products" element={<Navigate to="/admin/products" replace />} />
              <Route path="/projects" element={<Navigate to="/admin/projects" replace />} />
              <Route path="/services" element={<Navigate to="/admin/services" replace />} />
              <Route path="/news" element={<Navigate to="/admin/news" replace />} />
              <Route path="/recruitment" element={<Navigate to="/admin/recruitment" replace />} />
              <Route path="/partners" element={<Navigate to="/admin/partners" replace />} />
              <Route path="/contacts" element={<Navigate to="/admin/contacts" replace />} />
              <Route path="/testimonial" element={<Navigate to="/admin/testimonial" replace />} />
              <Route path="/information" element={<Navigate to="/admin/information" replace />} />
              <Route path="/audit-log" element={<Navigate to="/admin/audit-log" replace />} />

              {/* Các route Admin chính thức */}
              {renderAdminRoutes()}

              {/* Mọi đường dẫn lạ khác trên subdomain admin sẽ tự động quay về /admin/dashboard */}
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          ) : (
            <Routes>
              {/* Main Site Routes (dành cho domain chính và khách hàng) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Product />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/about" element={<IntroductionCompany />} />
                <Route path="/projects" element={<Project />} />
                <Route path="/news" element={<New />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Service />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/recruitment" element={<Recruiment />} />
              </Route>

              {/* Admin Routes (vẫn giữ để hỗ trợ localhost dev và fallback) */}
              {renderAdminRoutes()}
            </Routes>
          )}
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </Router>
      </HeaderProvider>
    </ThemeProvider>
  )
}


export default App
