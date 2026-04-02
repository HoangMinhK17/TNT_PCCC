import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import '../styles/Breadcrumbs.css';

import { getPublicProducts } from '../utils/productApi.js';
import { getNews } from '../utils/newsApi.js';
import { getAllHeader } from '../utils/headerApi.js';
import { getPublicServices } from '../utils/serviceApi.js';
import { getProjects } from '../utils/projectApi.js';



const Breadcrumbs = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [products, setProducts] = useState([]);
    const [news, setNews] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [services, setServices] = useState([])
    const [projects, setProjects] = useState([])


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
                setNews(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        const fetchHeaders = async () => {
            try {
                const response = await getAllHeader();
                setHeaders(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Error fetching headers:', error);
            }
        };

        const fetchServices = async () => {
            try {
                const response = await getPublicServices();
                setServices(Array.isArray(response) ? response : (response?.services || []));
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                setProjects(Array.isArray(response) ? response : (response?.projects || []));
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProducts();
        fetchNews();
        fetchHeaders();
        fetchServices();
        fetchProjects();
    }, []);

    if (location.pathname === '/') {
        return null;
    }

    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = [];

    breadcrumbs.push({ name: 'Trang chủ', path: '/' });

    const getName = (path) => {
        const matchingHeader = headers.find(h => {
            if (!h || !h.key) return false;
            return h.key === path;
        });

        return matchingHeader ? matchingHeader.name_vn : path.charAt(0).toUpperCase() + path.slice(1);
    };

    if (pathnames[0] === 'products') {
        const productHeaderName = getName('products');
        breadcrumbs.push({ name: productHeaderName === 'Products' ? 'Sản phẩm' : productHeaderName, path: '/products' });
        if (pathnames[1]) {
            const id = pathnames[1];
            const product = products.find(p => p._id === id || p.id === id || p.slug === id);
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
        const newsHeaderName = getName('news');
        breadcrumbs.push({ name: newsHeaderName === 'News' ? 'Tin tức' : newsHeaderName, path: '/news' });

        if (pathnames[1]) {
            const id = pathnames[1];
            const newsItem = news.find(n => n._id === id || n.id === id || n.slug === id);
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
    else if (pathnames[0] === 'services') {
        const serviceHeaderName = getName('services');
        breadcrumbs.push({ name: serviceHeaderName === 'Services' ? 'Dịch vụ' : serviceHeaderName, path: '/services' });

        if (pathnames[1]) {
            const id = pathnames[1];
            const service = services.find(s => s._id === id || s.id === id || s.slug === id);
            if (service) {
                if (service.name) {
                    breadcrumbs.push({
                        name: service.name,
                        path: `/services?category=${encodeURIComponent(service._id)}&categoryId=${service._id}`
                    });
                } else if (categoryParam && categoryParam !== 'Tất cả') {
                    breadcrumbs.push({ name: categoryParam, path: null });
                }
            } else {
                breadcrumbs.push({ name: 'Chi tiết dịch vụ', path: null });
            }
        } else if (categoryParam && categoryParam !== 'Tất cả') {
            breadcrumbs.push({ name: categoryParam, path: null });
        }
    }
    else if (pathnames[0] === 'projects') {
        const projectHeaderName = getName('projects');
        breadcrumbs.push({ name: projectHeaderName === 'Projects' ? 'Dự án' : projectHeaderName, path: '/projects' });

        if (pathnames[1]) {
            const id = pathnames[1];
            const project = projects.find(p => p._id === id || p.id === id || p.slug === id);
            if (project) {
                if (project.name) {
                    breadcrumbs.push({
                        name: project.name,
                        path: `/projects?category=${encodeURIComponent(project._id)}&categoryId=${project._id}`
                    });
                } else if (categoryParam && categoryParam !== 'Tất cả') {
                    breadcrumbs.push({ name: categoryParam, path: null });
                }
            } else {
                breadcrumbs.push({ name: 'Chi tiết dự án', path: null });
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
