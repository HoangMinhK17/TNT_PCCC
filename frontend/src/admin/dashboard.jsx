import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Table, Tag, Statistic, Dropdown, Modal, Form, Input, Button, message, Timeline } from 'antd';
import { DownOutlined, KeyOutlined, UserOutlined, LogoutOutlined, ClockCircleOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';
import { getContactsForManage } from '../utils/contactApi.js';
import { getProductForManage } from '../utils/productApi.js';
import { getProjectsForManage } from '../utils/projectApi.js';
import { getNewsForManage } from '../utils/newsApi.js';
import { changePasswordAPI, updateInfoAPI } from '../utils/userApi.js';
import { getAllAuditLogs } from '../utils/auditLog.js';

const { Title } = Typography;
const Dashboard = () => {
    const [user, setUser] = useState(() => {
        const userString = localStorage.getItem("user");
        return userString ? JSON.parse(userString) : {};
    });

    const [recentContacts, setRecentContacts] = useState([]);
    const [recentAuditLogs, setRecentAuditLogs] = useState([]);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
    const [passwordForm] = Form.useForm();
    const [infoForm] = Form.useForm();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert("Đã đăng xuất!");
        navigate('/admin/login');
    };

    const dropdownItems = [
        {
            key: '1',
            label: 'Cập nhật thông tin',
            icon: <UserOutlined />,
            onClick: () => {
                infoForm.setFieldsValue({
                    name: user?.name || "",
                    email: user?.email || ""
                });
                setIsInfoModalVisible(true);
            }
        },
        {
            key: '2',
            label: 'Đổi mật khẩu',
            icon: <KeyOutlined />,
            onClick: () => {
                passwordForm.resetFields();
                setIsPasswordModalVisible(true);
            }
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout
        }
    ];

    const handleChangePassword = async (values) => {
        try {
            await changePasswordAPI(values.currentPassword, values.newPassword);
            message.success('Đổi mật khẩu thành công!');
            setIsPasswordModalVisible(false);
            passwordForm.resetFields();
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu!');
        }
    };

    const handleUpdateInfo = async (values) => {
        try {
            await updateInfoAPI(values.name);
            message.success('Cập nhật thông tin thành công!');
            const updatedUser = { ...user, name: values.name };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsInfoModalVisible(false);
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin!');
        }
    };

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
                    setRecentContacts(response.contacts.map(item => ({ ...item, key: item._id })));
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
                if (response && response.totalProducts !== undefined) {
                    setTotalProducts(response.totalProducts);
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
                const response = await getNewsForManage({ page: 1, limit: 5 });
                if (response && response.totalNews !== undefined) {
                    setTotalNews(response.totalNews);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    useEffect(() => {
        const fetchAuditLogs = async () => {
            try {
                const res = await getAllAuditLogs(1, 5);
                setRecentAuditLogs(res?.auditLogs || []);
            } catch {
                setRecentAuditLogs([]);
            }
        };
        fetchAuditLogs();
    }, []);

    const ACTION_COLOR = { create: 'green', update: 'blue', delete: 'red' };
    const ACTION_LABEL = { create: 'Thêm mới', update: 'Cập nhật', delete: 'Xóa' };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', year: 'numeric' });
    };

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
            render: (_, record) => record.productId?.name ?
                <Link to={`/products/${record.productId._id}`} target="_blank">
                    <Tag color="cyan" style={{ cursor: 'pointer' }}>{record.productId.name}</Tag>
                </Link> : <Tag color="gray">Không có</Tag>
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
                        <Dropdown menu={{ items: dropdownItems }} trigger={['click']} placement="bottomRight">
                            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Xin chào <b>{user?.name || ""}</b> <DownOutlined style={{ fontSize: '12px' }} />
                            </span>
                        </Dropdown>
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

                    <Row gutter={[16, 16]}>
                        <Col xs={24} xl={14}>
                            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', height: '100%' }}>
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
                                    size="normal"
                                />
                            </div>
                        </Col>
                        <Col xs={24} xl={10}>
                            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', height: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <Title level={5} style={{ margin: 0 }}>Hoạt động gần đây</Title>
                                    <Link to="/admin/audit-log">Xem tất cả</Link>
                                </div>
                                {recentAuditLogs.length === 0 ? (
                                    <p style={{ color: '#aaa', textAlign: 'center', marginTop: 32 }}>Chưa có hoạt động nào</p>
                                ) : (
                                    <Timeline
                                        items={recentAuditLogs.map(log => ({
                                            dot: <ClockCircleOutlined style={{ color: ACTION_COLOR[log.action] || '#ccc' }} />,
                                            children: (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 4 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                        <Tag color={ACTION_COLOR[log.action]} style={{ margin: 0, fontSize: 11 }}>
                                                            {ACTION_LABEL[log.action]}
                                                        </Tag>
                                                        <Tag color="geekblue" style={{ margin: 0, fontSize: 11 }}>{log.module}</Tag>
                                                        <span style={{ fontWeight: 600, fontSize: 13, color: '#222' }}>
                                                            {log.recordName || '---'}
                                                        </span>
                                                    </div>
                                                    <div style={{ color: '#000', fontSize: 12, fontWeight: 500 }}>
                                                        {log.userId?.name || 'Ẩn danh'} &bull; {formatDate(log.createdAt)}
                                                    </div>
                                                </div>
                                            )
                                        }))}
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>

                <Modal
                    title="Đổi mật khẩu"
                    open={isPasswordModalVisible}
                    onCancel={() => setIsPasswordModalVisible(false)}
                    footer={null}
                >
                    <Form form={passwordForm} onFinish={handleChangePassword} layout="vertical">
                        <Form.Item
                            name="currentPassword"
                            label="Mật khẩu hiện tại"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }, { min: 6, max: 20, message: 'Mật khẩu phải có ít nhất 6 ký tự và tối đa 20 ký tự!' }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu mới" />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Xác nhận mật khẩu mới" />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Button onClick={() => setIsPasswordModalVisible(false)} style={{ marginRight: 8 }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Cập nhật thông tin"
                    open={isInfoModalVisible}
                    onCancel={() => setIsInfoModalVisible(false)}
                    footer={null}
                >
                    <Form form={infoForm} onFinish={handleUpdateInfo} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        >
                            <Input placeholder="Nhập họ và tên" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                        >
                            <Input placeholder="Nhập email" readOnly />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Button onClick={() => setIsInfoModalVisible(false)} style={{ marginRight: 8 }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </main>
        </div>
    );
};

export default Dashboard;