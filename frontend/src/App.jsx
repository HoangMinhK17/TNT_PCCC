import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
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
import ProtectedRoute from './component/ProtectedRoute'
import api from './utils/api'
import { getImageInformation } from './utils/informationApi'

const imageModules = import.meta.glob('./uploads/**/*.{png,jpg,jpeg,svg,webp,ico}', { eager: true, query: '?url', import: 'default' });

import { HeaderProvider } from './context/HeaderContext'

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true
    });
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

  return (
    <HeaderProvider>
      <Router>
        <Routes>
          {/* Main Site Routes */}
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

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/forget-password" element={<ForgetPassword />} />
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
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </Router>
    </HeaderProvider>
  )
}


export default App
