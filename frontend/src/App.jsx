import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './App.css'
import Header from './component/Header'
import Footer from './component/Footer'
import ContactButtons from './component/ContactButtons'
import Breadcrumbs from './component/Breadcrumbs'
import Home from './pages/Home'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetail'
import ProjectDetail from './pages/ProjectDetail'
import NewsDetail from './pages/NewsDetail'
import InfotmationCompany from './pages/InfotmationCompany'
import Project from './pages/project'
import New from './pages/New'
import Contract from './pages/Contract'
import Recruiment from './pages/Recruiment'
import Partner from './pages/Partner'
import Service from './pages/Service'

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
      <Header />
      <ContactButtons />
      <Breadcrumbs />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/about" element={<InfotmationCompany />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/news" element={<New />} />
        <Route path="/contact" element={<Contract />} />
        <Route path="/services" element={<Service />} />
        <Route path="/recruitment" element={<Recruiment />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
