import React from 'react';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';
const Dashboard = () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const stats = [
        { label: 'Tổng sản phẩm', value: '124', trend: '+12%', isUp: true },
        { label: 'Dự án đang thực hiện', value: '15', trend: '+2', isUp: true },
        { label: 'Tin tức mới', value: '8', trend: 'Tuần này', isUp: true },
        { label: 'Liên hệ chưa đọc', value: '5', trend: '-20%', isUp: false },
    ];

    const recentContacts = [
        { id: 1, name: 'Nguyễn Văn A', email: 'vana@gmail.com', subject: 'Tư vấn lắp đặt PCCC', status: 'Mới' },
        { id: 2, name: 'Trần Thị B', email: 'thib@gmail.com', subject: 'Báo giá thiết bị', status: 'Mới' },
        { id: 3, name: 'Công ty ABC', email: 'contact@abc.vn', subject: 'Hợp đồng bảo trì', status: 'Đã xử lý' },
    ];

    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />

            <main className="admin-main">
                <header className="admin-header">
                    <h1>Tổng quan hệ thống</h1>
                    <div className="admin-user-info">
                        <span>Xin chào {user?.name || "Admin"}</span>
                    </div>
                </header>

                <div className="admin-content">
                    <div className="stat-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <span className="stat-label">{stat.label}</span>
                                <span className="stat-value">{stat.value}</span>
                                <span className={`stat-trend ${stat.isUp ? 'trend-up' : 'trend-down'}`}>
                                    {stat.isUp ? '↑' : '↓'} {stat.trend}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="admin-table-container">
                        <div className="table-header">
                            <h3>Liên hệ mới nhất</h3>
                            <button className="back-to-site" style={{ marginTop: 0 }}>Xem tất cả</button>
                        </div>

                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Khách hàng</th>
                                    <th>Email</th>
                                    <th>Chủ đề</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentContacts.map((contact) => (
                                    <tr key={contact.id}>
                                        <td>{contact.name}</td>
                                        <td>{contact.email}</td>
                                        <td>{contact.subject}</td>
                                        <td>
                                            <span className={`status-badge ${contact.status === 'Mới' ? 'status-new' : 'status-done'}`}>
                                                {contact.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button style={{ background: 'none', border: 'none', color: '#1A237E', cursor: 'pointer', fontWeight: 600 }}>Chi tiết</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;