import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import '../styles/Breadcrumbs.css';
import { products } from '../data/products';
import { news } from '../data/news';

const Breadcrumbs = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');

    // Safety check for home page
    if (location.pathname === '/') {
        return null;
    }

    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = [];

    // Always start with Home
    breadcrumbs.push({ name: 'Trang chủ', path: '/' });

    const routeNameMap = {
        'about': 'Giới thiệu',
        'projects': 'Dự án',
        'contact': 'Liên hệ',
        'services': 'Dịch vụ',
        'recruitment': 'Tuyển dụng',
        'partner': 'Đối tác'
    };

    // Helper to get formatted name
    const getName = (path) => routeNameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);

    // Logic for Products
    if (pathnames[0] === 'products') {
        breadcrumbs.push({ name: 'Sản phẩm', path: '/products' });

        if (pathnames[1]) {
            // Detail Page
            const id = parseInt(pathnames[1]);
            const product = products.find(p => p.id === id);
            if (product) {
                // Link back to category
                breadcrumbs.push({
                    name: product.category,
                    path: `/products?category=${encodeURIComponent(product.category)}`
                });
                // Current Item
                breadcrumbs.push({ name: product.name, path: null });
            } else {
                breadcrumbs.push({ name: 'Chi tiết sản phẩm', path: null });
            }
        } else if (categoryParam && categoryParam !== 'Tất cả') {
            // Category Filtered Page
            breadcrumbs.push({ name: categoryParam, path: null });
        }
    }
    // Logic for News
    else if (pathnames[0] === 'news') {
        breadcrumbs.push({ name: 'Tin tức', path: '/news' });

        if (pathnames[1]) {
            // Detail Page
            const id = parseInt(pathnames[1]);
            const newsItem = news.find(n => n.id === id);
            if (newsItem) {
                breadcrumbs.push({
                    name: newsItem.category,
                    path: `/news?category=${encodeURIComponent(newsItem.category)}`
                });
                breadcrumbs.push({ name: newsItem.title, path: null });
            } else {
                breadcrumbs.push({ name: 'Chi tiết tin tức', path: null });
            }
        } else if (categoryParam && categoryParam !== 'Tất cả') {
            // Category Filtered Page
            breadcrumbs.push({ name: categoryParam, path: null });
        }
    }
    // Default Logic for other pages
    else {
        pathnames.forEach((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;

            // Skip ID segments if we handled them (currently only simple mapping here)
            // But for projects/services/:id, we might want generic "Chi tiết" or fetch data if available.
            // For now, simple mapping as per original behavior minus standard products/news.

            if (!isNaN(value)) {
                breadcrumbs.push({ name: 'Chi tiết', path: isLast ? null : to });
            } else {
                breadcrumbs.push({ name: getName(value), path: isLast ? null : to });
            }
        });
    }

    return (
        <div className="breadcrumbs-container">
            <div className="container">
                <ul className="breadcrumbs-list">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        if (isLast || !crumb.path) {
                            return (
                                <li key={index} className="breadcrumb-item active" aria-current="page">
                                    {crumb.name}
                                </li>
                            );
                        } else {
                            return (
                                <li key={index} className="breadcrumb-item">
                                    <Link to={crumb.path}>{crumb.name}</Link>
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Breadcrumbs;
