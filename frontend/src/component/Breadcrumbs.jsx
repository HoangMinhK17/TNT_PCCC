import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Breadcrumbs.css';

const Breadcrumbs = () => {
    const location = useLocation();
    if (location.pathname === '/') {
        return null;
    }

    const pathnames = location.pathname.split('/').filter((x) => x);

    const routeNameMap = {
        'products': 'Sản phẩm',
        'product': 'Sản phẩm',
        'about': 'Giới thiệu',
        'projects': 'Dự án',
        'project': 'Dự án',
        'news': 'Tin tức',
        'contact': 'Liên hệ',
        'services': 'Dịch vụ',
        'recruitment': 'Tuyển dụng'
    };

    return (
        <div className="breadcrumbs-container">
            <div className="container">
                <ul className="breadcrumbs-list">
                    <li className="breadcrumb-item">
                        <Link to="/">Trang chủ</Link>
                    </li>
                    {pathnames.map((value, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathnames.length - 1;

                        const isId = !isNaN(value);

                     
                        let displayName = routeNameMap[value];

                        if (!displayName) {
                            if (isId) {
                                displayName = "Chi tiết";
                            } else {
                                displayName = value.charAt(0).toUpperCase() + value.slice(1);
                            }
                        }

            

                        return isLast ? (
                            <li key={to} className="breadcrumb-item active" aria-current="page">
                                {displayName}
                            </li>
                        ) : (
                            <li key={to} className="breadcrumb-item">
                                <Link to={to}>{displayName}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Breadcrumbs;
