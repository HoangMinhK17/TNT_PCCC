import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './App.css'
import Home from './pages/Home'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetail'
import ProjectDetail from './pages/ProjectDetail'
import NewsDetail from './pages/NewsDetail'
import IntroductionCompany from './pages/IntroductionCompany'
import Project from './pages/Project'
import New from './pages/New'
import Contract from './pages/Contract'
import Recruiment from './pages/Recruiment'
import Partner from './pages/Partner'
import Service from './pages/Service'
import ServiceDetail from './pages/ServiceDetail'
import Login from './admin/login'
import MainLayout from './component/MainLayout'
import ForgetPassword from './admin/ForgetPassword'
import Dashboard from './admin/dashboard'
import api from './utils/api'


function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true
    });
  }, []);

  return (
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
          <Route path="/contact" element={<Contract />} />
          <Route path="/services" element={<Service />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/recruitment" element={<Recruiment />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/forget-password" element={<ForgetPassword />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
