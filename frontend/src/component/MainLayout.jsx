import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ContactButtons from './ContactButtons'
import Breadcrumbs from './Breadcrumbs'

const MainLayout = () => {
    return (
        <div className="public-layout">
            <Header />
            <ContactButtons />
            <Breadcrumbs />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default MainLayout
