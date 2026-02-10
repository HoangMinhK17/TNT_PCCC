import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './App.css'
import Header from './component/Header'
import Footer from './component/Footer'
import Home from './pages/Home'
import Product from './pages/Product'
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
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
