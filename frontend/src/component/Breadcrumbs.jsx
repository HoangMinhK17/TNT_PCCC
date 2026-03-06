import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import '../styles/Breadcrumbs.css';

import { getPublicProducts } from '../utils/productApi.js';
import { getNews } from '../utils/newsApi.js';

const Breadcrumbs = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [products, setProducts] = useState([]);
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getPublicProducts();
                setProducts(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchNews = async () => {
            try {
                const response = await getNews();
                console.log("data", response);
                setNews(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchProducts();
        fetchNews();
    }, []);

    if (location.pathname === '/') {
        return null;
    }

    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = [];

    breadcrumbs.push({ name: 'Trang chủ', path: '/' });

    const routeNameMap = {
        'about': 'Giới thiệu',
        'projects': 'Dự án',
        'contact': 'Liên hệ',
        'services': 'Dịch vụ',
        'recruitment': 'Tuyển dụng',
        'partner': 'Đối tác'
    };

    const getName = (path) => routeNameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);

    if (pathnames[0] === 'products') {
        breadcrumbs.push({ name: 'Sản phẩm', path: '/products' });

        if (pathnames[1]) {
            const id = pathnames[1];
            const product = products.find(p => p._id === id || p.id === id);
            if (product) {
                if (product.categoryId && product.categoryId.name) {
                    breadcrumbs.push({
                        name: product.categoryId.name,
                        path: `/products?category=${encodeURIComponent(product.categoryId.name)}&categoryId=${product.categoryId._id}`
                    });
                } else if (categoryParam && categoryParam !== 'Tất cả') {
                    breadcrumbs.push({ name: categoryParam, path: null });
                }
                breadcrumbs.push({ name: product.name, path: null });
            } else {
                breadcrumbs.push({ name: 'Chi tiết sản phẩm', path: null });
            }
        } else if (categoryParam && categoryParam !== 'Tất cả') {
            breadcrumbs.push({ name: categoryParam, path: null });
        }
    }
    else if (pathnames[0] === 'news') {
        breadcrumbs.push({ name: 'Tin tức', path: '/news' });

        if (pathnames[1]) {
            const id = pathnames[1];
            const newsItem = news.find(n => n._id === id || n.id === id);
            if (newsItem) {
                if (newsItem.categoryNewsId && newsItem.categoryNewsId.name) {
                    breadcrumbs.push({
                        name: newsItem.categoryNewsId.name,
                        path: `/news?category=${encodeURIComponent(newsItem.categoryNewsId.name)}&categoryId=${newsItem.categoryNewsId._id}`
                    });
                } else if (categoryParam && categoryParam !== 'Tất cả') {
                    breadcrumbs.push({ name: categoryParam, path: null });
                }
                breadcrumbs.push({ name: newsItem.name || newsItem.title, path: null });
            } else {
                breadcrumbs.push({ name: 'Chi tiết tin tức', path: null });
            }
        } else if (categoryParam && categoryParam !== 'Tất cả') {
            breadcrumbs.push({ name: categoryParam, path: null });
        }
    }
    else {
        pathnames.forEach((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;

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
