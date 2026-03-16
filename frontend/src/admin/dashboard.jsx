import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Card, Typography, Table, Tag, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';
import { getContactsForManage } from '../utils/contactApi.js';
import { getProductForManage } from '../utils/productApi.js';
import { getProjectsForManage } from '../utils/projectApi.js';
import { getNewsForManage } from '../utils/newsApi.js';

const { Content } = Layout;
const { Title } = Typography;
const Dashboard = () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};

    const [recentContacts, setRecentContacts] = useState([]);
    const [loading, setLoading] = useState(false);
 

    const [totalContacts, setTotalContacts] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalNews, setTotalNews] = useState(0);

    useEffect(() => {
        const fetchRecentContacts = async () => {
            setLoading(true);
            try {
                const response = await getContactsForManage(1, 5);
                if (response && response.contacts) {
                    setRecentContacts(response.contacts.map(item => ({...item, key: item._id})));
                    setTotalContacts(response.total || 0);
                } else {
                    setRecentContacts([]);
                }
            } catch (error) {
                console.error('Error fetching recent contacts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentContacts();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await getProductForManage();
                if (response && response.length > 0) {
                    setTotalProducts(response.length);
                } 
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const response = await getProjectsForManage();
                if (response && response.projects) {
                    setTotalProjects(response.totalProjects || 0);
                } 
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await getNewsForManage(1, 5);
                if (response && response.news) {
                    setTotalNews(response.totalNews || 0);
                } 
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const stats = [
        { label: 'Liên hệ', value: totalContacts },
        { label: 'Sản phẩm', value: totalProducts },
        { label: 'Dự án', value: totalProjects },
        { label: 'Tin tức', value: totalNews }
    ];

    const columns = [
        {
            title: 'Khách hàng',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Sản phẩm quan tâm',
            key: 'subject',
            render: (_, record) => record.productId?.name ? <Tag color="cyan">{record.productId.name}</Tag> : <Tag color="gray">Không có</Tag>
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (status) => {
                let color = status === 'replied' ? 'success' : status === 'rejected' ? 'error' : 'processing';
                let text = status === 'replied' ? 'Đã phản hồi' : status === 'rejected' ? 'Từ chối' : 'Chờ xử lý';
                return <Tag color={color}>{text}</Tag>;
            }
        }
    ];

    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />
            <main className="admin-main" style={{ padding: '24px 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <Title level={2} style={{ color: '#1A237E', margin: 0 }}>Tổng quan hệ thống</Title>
                    <div>
                        <span>Xin chào <b>{user?.name || "Admin"}</b></span>
                    </div>
                </div>

                <div style={{ minHeight: '80vh' }}>
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            {stats.map((stat, index) => (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                                    <Statistic
                                        title={<span style={{ color: '#7f8c8d' }}>{stat.label}</span>}
                                        value={stat.value}
                                        valueStyle={{ color: '#1A237E', fontWeight: 'bold' }}
                                        
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Title level={5} style={{ margin: 0 }}>Liên hệ mới nhất</Title>
                            <Link to="/admin/contacts">Xem tất cả</Link>
                        </div>
                        <Table 
                            columns={columns} 
                            dataSource={recentContacts} 
                            loading={loading}
                            pagination={false}
                            bordered
                            rowKey="key"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;