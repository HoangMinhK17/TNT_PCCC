import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    Table, Tag, Typography, Space, Select, Input, Modal, Descriptions, Empty, Button, DatePicker, Tabs, Badge, Popconfirm, Tooltip, Form, message, Avatar
} from 'antd';
import dayjs from 'dayjs';
import { EyeOutlined, LogoutOutlined, DesktopOutlined, MobileOutlined, GlobalOutlined, ReloadOutlined, DeleteOutlined, UserAddOutlined, EditOutlined, UserOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';
import { getAllAuditLogs, getModulFilter, getActionFilter } from '../utils/auditLog';
import { getAllSessionsAPI, logoutSessionAPI, deleteSessionAPI, getAllUsers, createUser, updateStatusUser } from '../utils/userApi';

const { Title, Text } = Typography;

const getPlatformIcon = (platform = '') => {
    const p = platform.toLowerCase();
    if (p.includes('mobile') || p.includes('android') || p.includes('iphone') || p.includes('ios')) {
        return <MobileOutlined />;
    }
    if (p.includes('desktop') || p.includes('windows') || p.includes('mac') || p.includes('linux')) {
        return <DesktopOutlined />;
    }
    return <GlobalOutlined />;
};

const DeviceManagementTab = () => {
    const [sessions, setSessions] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [filterActive, setFilterActive] = useState('');
    const [searchVal, setSearchVal] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const debounceRef = useRef(null);
    const pageSize = 5;

    const fetchSessions = useCallback(async (pg = 1, active = '', search = '') => {
        setLoading(true);
        try {
            const res = await getAllSessionsAPI({ page: pg, pageSize, isActive: active, search });
            setSessions((res.sessions || []).map(s => ({ ...s, key: s._id })));
            setTotal(res.total || 0);
        } catch {
            setSessions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchSessions(page, filterActive, searchVal); }, [page, filterActive, searchVal]);

    const handleLogout = async (sessionId) => {
        try {
            await logoutSessionAPI(sessionId);
            fetchSessions(page, filterActive, searchVal);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (sessionId) => {
        try {
            await deleteSessionAPI(sessionId);
            fetchSessions(page, filterActive, searchVal);
        } catch (e) {
            console.error(e);
        }
    };

    const columns = [
        { title: '#', key: 'idx', width: 52, render: (_, __, i) => (page - 1) * pageSize + i + 1 },
        {
            title: 'Người dùng', key: 'user', width: 200,
            render: (_, row) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{row.userId?.name || <Text type="secondary">Ẩn danh</Text>}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{row.userId?.email || ''}</Text>
                </div>
            )
        },
        {
            title: 'Thiết bị', key: 'device', width: 90, align: 'center',
            render: (_, row) => (
                <Tooltip title={`${row.platform || ''} – ${row.os || ''}`}>
                    <span style={{ fontSize: 20, color: '#1A237E' }}>{getPlatformIcon(row.platform)}</span>
                </Tooltip>
            )
        },
        { title: 'IP', dataIndex: 'ip', key: 'ip', width: 160, render: v => <Text code>{v || '---'}</Text> },
        { title: 'Trình duyệt', dataIndex: 'browser', key: 'browser', width: 100, render: v => v || '---' },
        { title: 'Hệ điều hành', dataIndex: 'os', key: 'os', width: 140, render: v => v || '---' },
        {
            title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive', width: 110, align: 'center',
            render: v => v
                ? <Badge status="success" text={<Text style={{ color: '#52c41a', fontWeight: 600 }}>Đang hoạt động</Text>} />
                : <Badge status="default" text={<Text type="secondary">Đã đăng xuất</Text>} />
        },
        {
            title: 'Đăng nhập lần cuối', dataIndex: 'lastActive', key: 'lastActive', width: 170,
            render: d => d ? new Date(d).toLocaleString('vi-VN') : '---'
        },
        {
            title: 'Thao tác', key: 'action',
            render: (_, row) => (
                <Space>
                    {row.isActive && (
                        <Popconfirm
                            title="Đăng xuất thiết bị này?"
                            description="Phiên đăng nhập sẽ bị vô hiệu hóa ngay lập tức."
                            okText="Đăng xuất"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => handleLogout(row._id)}
                        >
                            <Button danger size="small" icon={<LogoutOutlined />}>Đăng xuất</Button>
                        </Popconfirm>
                    )}
                    {row.isActive == false && (
                        <Popconfirm
                            title="Xóa thiết bị này?"
                            description="Hành động này không thể hoàn tác."
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => handleDelete(row._id)}
                        >
                            <Button danger type="primary" size="small" icon={<DeleteOutlined />}>Xóa</Button>
                        </Popconfirm>

                    )}
                </Space>
            )
        },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                <Select
                    placeholder="Trạng thái"
                    allowClear
                    style={{ width: 180 }}
                    options={[
                        { label: 'Đang hoạt động', value: 'true' },
                        { label: 'Đã đăng xuất', value: 'false' },
                    ]}
                    onChange={v => { setFilterActive(v ?? ''); setPage(1); }}
                />
                <Input.Search
                    placeholder="Tìm theo tên hoặc email..."
                    allowClear
                    style={{ width: 280 }}
                    value={searchInput}
                    onChange={e => {
                        setSearchInput(e.target.value);
                        if (debounceRef.current) clearTimeout(debounceRef.current);
                        debounceRef.current = setTimeout(() => { setSearchVal(e.target.value); setPage(1); }, 500);
                    }}
                    onSearch={v => { setSearchVal(v); setPage(1); }}
                    onClear={() => { setSearchVal(''); setPage(1); }}
                />
                <Button icon={<ReloadOutlined />}
                    onClick={() => fetchSessions(page, filterActive, searchVal)}>
                    Làm mới
                </Button>
            </Space>
            <Table
                columns={columns}
                dataSource={sessions}
                loading={loading}
                bordered
                locale={{ emptyText: <Empty description="Chưa có phiên đăng nhập nào" /> }}
                pagination={{
                    current: page,
                    pageSize,
                    total,
                    showSizeChanger: false,
                    showLessItems: true,
                    onChange: p => setPage(p),
                    showTotal: t => `Tổng ${t} phiên`,
                    showSizeChanger: false,
                }}
            />
        </div>
    );
};

// ===================== USER MANAGEMENT TAB =====================
const ROLE_COLOR = { admin: 'red', staff: 'blue', user: 'default' };
const ROLE_LABEL = { admin: 'Quản trị viên', staff: 'Nhân viên', user: 'Người dùng' };

const UserManagementTab = () => {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [searchVal, setSearchVal] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const debounceRefUser = useRef(null);

    const [createVisible, setCreateVisible] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createForm] = Form.useForm();

    const [editVisible, setEditVisible] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [editForm] = Form.useForm();

    const fetchUsers = useCallback(async (pg = 1, search = '', role = '', status = '') => {
        setLoading(true);
        try {
            const res = await getAllUsers(pg, pageSize, search, role, status);
            const currentUserLocal = JSON.parse(localStorage.getItem("user") || "{}");
            const currentUserId = currentUserLocal?.id || currentUserLocal?._id;

            let fetchedUsers = (res.users || []).map(u => ({ ...u, key: u._id }));

            fetchedUsers.sort((a, b) => {
                if (a._id === currentUserId) return -1;
                if (b._id === currentUserId) return 1;
                return 0;
            });

            setUsers(fetchedUsers);
            setTotal(res.totalUsers || 0);
        } catch {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(page, searchVal, filterRole, filterStatus); }, [page, searchVal, filterRole, filterStatus]);

    const handleCreate = async (values) => {
        setCreateLoading(true);
        try {
            await createUser(values.name, values.email, values.role);
            message.success('Tạo tài khoản thành công! Mật khẩu đã được gửi qua email.');
            setCreateVisible(false);
            createForm.resetFields();
            fetchUsers(page, searchVal, filterRole, filterStatus);
        } catch (e) {
            message.error(e?.response?.data?.message || 'Tạo tài khoản thất bại!');
        } finally {
            setCreateLoading(false);
        }
    };

    const openEdit = (record) => {
        setEditRecord(record);
        editForm.setFieldsValue({ role: record.role, status: record.status });
        setEditVisible(true);
    };

    const handleEdit = async (values) => {
        setEditLoading(true);
        try {
            await updateStatusUser(editRecord._id, values.status, values.role);
            message.success('Cập nhật thành công!');
            setEditVisible(false);
            fetchUsers(page, searchVal, filterRole, filterStatus);
        } catch (e) {
            message.error(e?.response?.data?.message || 'Cập nhật thất bại!');
        } finally {
            setEditLoading(false);
        }
    };

    const columns = [
        { title: '#', key: 'idx', width: 52, align: 'center', render: (_, __, i) => (page - 1) * pageSize + i + 1 },
        {
            title: 'Người dùng', key: 'user',
            render: (_, row) => {
                const currentUserLocal = JSON.parse(localStorage.getItem("user") || "{}");
                const currentUserId = currentUserLocal?.id || currentUserLocal?._id;
                const isCurrentUser = row._id === currentUserId;

                return (
                    <Space>
                        <Avatar style={{ backgroundColor: isCurrentUser ? '#faad14' : '#1A237E' }} icon={<UserOutlined />} />
                        <div>
                            <div style={{ fontWeight: 600 }}>
                                {row.name} {isCurrentUser && <Tag color="orange" style={{ marginLeft: 8, border: 0 }}>Tài khoản của tôi</Tag>}
                            </div>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>{row.email}</Typography.Text>
                        </div>
                    </Space>
                )
            }
        },
        {
            title: 'Vai trò', dataIndex: 'role', key: 'role', align: 'center',
            render: v => <Tag color={ROLE_COLOR[v] || 'default'}>{ROLE_LABEL[v] || v}</Tag>
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status', align: 'center',
            render: v => v === 'active'
                ? <Badge status="success" text={<Typography.Text style={{ color: '#52c41a', fontWeight: 600 }}>Hoạt động</Typography.Text>} />
                : <Badge status="error" text={<Typography.Text type="danger">Bị khóa</Typography.Text>} />
        },
        {
            title: 'Thao tác', key: 'action', align: 'center',
            render: (_, row) => {
                const currentUserLocal = JSON.parse(localStorage.getItem("user") || "{}");
                const currentUserId = currentUserLocal?.id || currentUserLocal?._id;
                const isCurrentUser = row._id === currentUserId;

                return (
                    <Tooltip title={isCurrentUser ? "Không thể chỉnh sửa quyền của chính mình" : "Chỉnh sửa vai trò & trạng thái"}>
                        <Button
                            type="primary"
                            ghost
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => openEdit(row)}
                            disabled={isCurrentUser}
                        >
                            Chỉnh sửa
                        </Button>
                    </Tooltip>
                );
            }
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 8 }}>
                <Title level={4} style={{ margin: 0 }}>Danh sách tài khoản</Title>
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => { createForm.resetFields(); setCreateVisible(true); }}
                >
                    Thêm người dùng
                </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16, gap: 8 }}>
                <Input.Search 
                    placeholder='Tìm kiếm...' 
                    style={{ width: '25%' }} 
                    value={searchInput}
                    onChange={e => {
                        setSearchInput(e.target.value);
                        if (debounceRefUser.current) clearTimeout(debounceRefUser.current);
                        debounceRefUser.current = setTimeout(() => { setSearchVal(e.target.value); setPage(1); }, 500);
                    }}
                    onSearch={v => { setSearchVal(v); setPage(1); }}
                    allowClear
                />
                <Select
                    placeholder="Trạng thái"
                    allowClear
                    style={{ width: '15%' }}
                    options={[
                        { value: 'active', label: 'Hoạt động' },
                        { value: 'inactive', label: 'Bị khóa' },
                    ]}
                    onChange={v => { setFilterStatus(v ?? ''); setPage(1); }}
                />
                <Select
                    placeholder="Vai trò"
                    allowClear
                    style={{ width: '15%' }}
                    options={[
                        { value: 'admin', label: 'Quản trị viên' },
                        { value: 'staff', label: 'Nhân viên' },
                        { value: 'user', label: 'Người dùng' },
                    ]}
                    onChange={v => { setFilterRole(v ?? ''); setPage(1); }}
                />

                <Button icon={<ReloadOutlined />} onClick={() => fetchUsers(page, searchVal, filterRole, filterStatus)}>Làm mới</Button>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                loading={loading}
                bordered
                locale={{ emptyText: <Empty description="Chưa có người dùng nào" /> }}
                pagination={{
                    current: page,
                    pageSize,
                    total,
                    showSizeChanger: false,
                    showLessItems: true,
                    onChange: p => setPage(p),
                    showTotal: t => `Tổng ${t} tài khoản`,
                }}
            />

            <Modal
                title={
                    <Space>
                        <UserAddOutlined style={{ color: '#1A237E' }} />
                        <span>Thêm người dùng mới</span>
                    </Space>
                }
                open={createVisible}
                onCancel={() => { setCreateVisible(false); createForm.resetFields(); }}
                onOk={() => createForm.submit()}
                okText="Tạo tài khoản"
                cancelText="Hủy"
                confirmLoading={createLoading}
                okButtonProps={{ style: { background: '#1A237E' } }}
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreate} style={{ marginTop: 12 }}>
                    <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                    >
                        <Input placeholder="Nhập họ và tên..." prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input placeholder="Nhập địa chỉ email..." />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select
                            placeholder="Chọn vai trò"
                            options={[
                                { label: 'Nhân viên', value: 'staff' },
                                { label: 'Người dùng', value: 'user' },
                            ]}
                        />
                    </Form.Item>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        * Mật khẩu ngẫu nhiên sẽ được tạo và gửi đến email của người dùng.
                    </Typography.Text>
                </Form>
            </Modal>

            <Modal
                title={
                    <Space>
                        <EditOutlined style={{ color: '#1A237E' }} />
                        <span>Chỉnh sửa: <strong>{editRecord?.name}</strong></span>
                    </Space>
                }
                open={editVisible}
                onCancel={() => setEditVisible(false)}
                onOk={() => editForm.submit()}
                okText="Lưu thay đổi"
                cancelText="Hủy"
                confirmLoading={editLoading}
                okButtonProps={{ style: { background: '#1A237E' } }}
            >
                <Form form={editForm} layout="vertical" onFinish={handleEdit} style={{ marginTop: 12 }}>
                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select
                            options={[
                                { label: 'Quản trị viên', value: 'admin' },
                                { label: 'Nhân viên', value: 'staff' },
                                { label: 'Người dùng', value: 'user' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select
                            options={[
                                { label: <Space><CheckCircleOutlined style={{ color: '#52c41a' }} />Hoạt động</Space>, value: 'active' },
                                { label: <Space><StopOutlined style={{ color: '#ff4d4f' }} />Bị khóa</Space>, value: 'inactive' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
// ===============================================================

const ACTION_COLOR = {
    create: 'green',
    update: 'blue',
    delete: 'red',
};

const ACTION_LABEL = {
    create: 'Thêm mới',
    update: 'Cập nhật',
    delete: 'Xóa',
};

const formatDate = (dateStr) => {
    if (!dateStr) return '---';
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
};

const AdminAuditLog = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const pageSize = 10;

    const [filterAction, setFilterAction] = useState(null);
    const [filterModule, setFilterModule] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const [filterDateRange, setFilterDateRange] = useState(null);

    const [detailVisible, setDetailVisible] = useState(false);
    const [detailRecord, setDetailRecord] = useState(null);

    const [moduleOptions, setModuleOptions] = useState([]);
    const [actionOptions, setActionOptions] = useState([]);

    const debounceRef = useRef(null);

    const fetchData = useCallback(async (page = 1, filters = {}) => {
        setLoading(true);
        try {
            const res = await getAllAuditLogs(page, pageSize, filters);
            setData((res.auditLogs || []).map(d => ({ ...d, key: d._id })));
            setTotalLogs(res.totalAuditLogs || 0);
            getModulFilter().then((res) => {
                setModuleOptions(res);
            });
            getActionFilter().then((res) => {
                setActionOptions(res);
            });
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        const filters = { search: searchUser, action: filterAction, module: filterModule };
        if (filterDateRange && filterDateRange.length === 2) {
            filters.startDate = filterDateRange[0].startOf('day').toISOString();
            filters.endDate = filterDateRange[1].endOf('day').toISOString();
        }
        fetchData(currentPage, filters);
    }, [currentPage]);

    const handleFilterChange = useCallback((newFilters) => {
        setCurrentPage(1);
        fetchData(1, newFilters);
    }, [fetchData]);

    const columns = [
        {
            title: '#',
            key: 'index',
            width: 52,
            render: (_, __, idx) => (currentPage - 1) * pageSize + idx + 1,
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            render: (action) => (
                <Tag color={ACTION_COLOR[action] || 'default'}>
                    {ACTION_LABEL[action] || action}
                </Tag>
            ),
        },
        {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
            width: 200,
            render: (m) => <Text code>{m}</Text>,
        },
        {
            title: 'Tên bản ghi',
            dataIndex: 'recordName',
            key: 'recordName',
            render: (name) => name || <Text type="secondary">---</Text>,
        },
        {
            title: 'Người thực hiện',
            key: 'userId',
            width: 150,
            render: (_, row) => row.userId?.name || <Text type="secondary">Ẩn danh</Text>,
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (d) => formatDate(d),
        },
        {
            title: 'Chi tiết',
            key: 'detail',
            width: 90,
            align: 'center',
            render: (_, row) => (
                <Button type="primary" ghost size="small" icon={<EyeOutlined />}
                    onClick={() => { setDetailRecord(row); setDetailVisible(true); }}>Xem
                </Button>
            ),
        },
    ];

    const renderValues = (values, moduleName) => {
        if (!values || typeof values !== 'object') return <Text type="secondary">Không có dữ liệu</Text>;
        return (
            <Descriptions bordered size="small" column={1}>
                {Object.entries(values).map(([k, v]) => (
                    <Descriptions.Item key={k} label={<Text strong>{getFieldTranslation(moduleName, k)}</Text>}>
                        {v === null || v === undefined || v === '' ? <Text type="secondary">(trống)</Text> : (
                            typeof v === 'object' ? <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(v, null, 2)}</pre> : String(v)
                        )}
                    </Descriptions.Item>
                ))}
            </Descriptions>
        );
    };

    const renderObjectAsTable = (obj, moduleName) => {
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
        const entries = Object.entries(obj).filter(([k]) => k !== '_id' && k !== '__v');
        if (entries.length === 0) return <Text type="secondary">(trống)</Text>;
        return (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <tbody>
                    {entries.map(([k, v]) => (
                        <tr key={k} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '4px 8px', fontWeight: 600, color: '#555', whiteSpace: 'nowrap', width: '40%' }}>
                                {getFieldTranslation(moduleName, k)}
                            </td>
                            <td style={{ padding: '4px 8px', wordBreak: 'break-word' }}>
                                {v === null || v === undefined || v === ''
                                    ? <Text type="secondary">(trống)</Text>
                                    : typeof v === 'object'
                                        ? renderObjectAsTable(v, moduleName)
                                        : String(v)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderDiffCell = (val, moduleName) => {
        if (val === null || val === undefined || val === '') return <Text type="secondary">(trống)</Text>;

        if (Array.isArray(val)) {
            if (val.length === 0) return <Text type="secondary">Bỏ trống</Text>;
            if (typeof val[0] === 'object') {
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {val.map((item, idx) => (
                            <div key={idx} style={{ background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 6, padding: '6px 10px' }}>
                                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>#{idx + 1}</Text>
                                {renderObjectAsTable(item, moduleName)}
                            </div>
                        ))}
                    </div>
                );
            }
            return (
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {val.map((item, idx) => (
                        <li key={idx} style={{ wordBreak: 'break-word' }}>{String(item)}</li>
                    ))}
                </ul>
            );
        }

        if (typeof val === 'object') {
            return renderObjectAsTable(val, moduleName);
        }

        const str = String(val);
        if (str.length > 100 && !str.includes('<') && !str.includes('>')) {
            return <div style={{ maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{str}</div>;
        } else if (str.includes('<') && str.includes('>')) {
            return <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#fff', padding: 8, border: '1px solid #d9d9d9', borderRadius: 4 }} dangerouslySetInnerHTML={{ __html: str }} />;
        }
        return <Text style={{ wordBreak: 'break-word' }}>{str}</Text>;
    };

    const getFieldTranslation = (moduleName, key) => {
        if (moduleName === 'Danh mục tin tức' || moduleName === 'Danh mục sản phẩm') {
            const dict = {
                name: 'Tên danh mục',
                name_en: 'Tên danh mục (Tiếng Anh)',
            };
            if (dict[key]) return dict[key];
        }
        if (moduleName === 'Sản phẩm') {
            const dict = {
                name: 'Tên sản phẩm',
                name_en: 'Tên sản phẩm (Tiếng Anh)',
                categoryId: 'Danh mục sản phẩm',
                technical: 'Thông số kỹ thuật',
                technical_en: 'Thông số kỹ thuật (Tiếng Anh)',
            };
            if (dict[key]) return dict[key];
        }
        if (moduleName === 'Tin tức') {
            const dict = {
                name: 'Tên bài viết',
                name_en: 'Tên bài viết (Tiếng Anh)',
                categoryNewsId: 'Danh mục tin tức',
            };
            if (dict[key]) return dict[key];
        }
        if (moduleName === 'Cấu hình hệ thống') {
            const dict = {
                name: 'Tên công ty',
                title: 'Tiêu đề',
                phone: 'Số điện thoại',
                address: 'Địa chỉ',
                email: 'Email liên hệ',
                timeWork: 'Giờ làm việc',
                backgroundImage: 'Banner Trang Chủ',
                logo: 'Logo Công Ty',
                favicon: 'Favicon Trang Web',
                name_en: 'Tên (Tiếng Anh)',
                name_vn: 'Tên (Tiếng Việt)',
                status: 'Trạng thái',
                show_home: 'Hiển thị UI Home',
                theme: 'Giao diện UI',
                text_size: 'Cỡ chữ',
                text_color: 'Màu chữ',
                background_color: 'Màu nền',
                text_title: 'Tiêu đề Cột',
                text_p: 'Đoạn văn ',
                text_a: 'Đường link',
                contact_text: 'Thông tin liên hệ',
                icon_color: 'Màu icon',
                enable: 'Hiển thị',
                imageChat: 'Hình Ảnh Chatbox',
                show_phone: 'Hiển thị Số Điện Thoại',
                socialLinks: 'Liên kết Mạng Xã Hội',
                chatConfig: 'Cấu hình Chatbox',
                'chatConfig.enable': 'Bật/Tắt Chatbox',
                'chatConfig.name': 'Tên Chatbox',
                'chatConfig.scriptUrl': 'Script URL Chat',
                'chatConfig.token': 'Token Chat',
                'chatConfig.imageChat': 'Icon Chat',
                'chatConfig.externalChatConfig.enable': 'Bật Chat Link Ngoài',
                'chatConfig.externalChatConfig.url': 'URL Chat Link Ngoài',
            };
            if (dict[key]) return dict[key];
        }
        if (moduleName === 'Dịch vụ') {
            const dict = {
                name: 'Tên dịch vụ',
                name_en: 'Tên dịch vụ (Tiếng Anh)',
            };
            if (dict[key]) return dict[key];
        }
        if (moduleName === 'Quản lý thiết bị') {
            const dict = {
                isActive: 'Trạng thái đăng nhập',
            };
            if (dict[key]) return dict[key];
        }
        if (moduleName === 'Giới thiệu') {
            const dict = {
                name: 'Tên công ty',
                'title.titleName': 'Tiêu đề',
                'title.titleName_en': 'Tiêu đề (Tiếng Anh)',
                'title.titleIcon': "Ảnh Tiêu đề",
                name_en: 'Tên công ty (Tiếng Anh)',
                'description.descriptionName': 'Mô tả',
                'description.descriptionName_en': 'Mô tả (Tiếng Anh)',
                'description.descriptionIcon': 'Ảnh Mô tả',

            }
            if (dict[key]) return dict[key];
        }
        const commonDict = {
            name: 'Tên',
            name_en: 'Tên (Tiếng Anh)',
            title: 'Tiêu đề',
            title_en: 'Tiêu đề (Tiếng Anh)',
            description: 'Mô tả',
            description_en: 'Mô tả (Tiếng Anh)',
            image: 'Hình ảnh',
            date: 'Ngày',
            status: 'Trạng thái',
            slug: 'Đường dẫn (Slug)',
            repliedMessage: 'Phản hồi',
            note: 'Ghi chú',
            requirements: 'Yêu cầu',
            timeWork: 'Giờ làm việc',
            backgroundImage: 'Banner Trang Chủ',
            logo: 'Logo Công Ty',
            favicon: 'Favicon Trang Web',
            socialLinks: 'Danh sách mạng xã hội',
            chatConfig: 'Chatbox',
            role : 'Chức vụ'
        };
        return commonDict[key] || key;
    };

    const renderUpdateDiff = (oldValues, newValues, moduleName) => {
        const allKeys = Array.from(new Set([...Object.keys(oldValues || {}), ...Object.keys(newValues || {})]));

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {allKeys.map(key => {
                    const oldVal = oldValues[key];
                    const newVal = newValues[key];
                    const displayKey = getFieldTranslation(moduleName, key);

                    const isArrayOfObjects = (arr) => Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object';

                    if (isArrayOfObjects(oldVal) || isArrayOfObjects(newVal)) {
                        const oldArr = Array.isArray(oldVal) ? oldVal : [];
                        const newArr = Array.isArray(newVal) ? newVal : [];
                        const isDiffFormat = (arr) => arr.length > 0 && arr[0].hasOwnProperty('_index');
                        let diffs = [];

                        if (isDiffFormat(oldArr) || isDiffFormat(newArr)) {
                            const indices = Array.from(new Set([...oldArr.map(x => x._index), ...newArr.map(x => x._index)])).sort((a, b) => a - b);
                            diffs = indices.map(idx => {
                                const o = oldArr.find(x => x._index === idx);
                                const n = newArr.find(x => x._index === idx);
                                const displayO = o ? { ...o } : null;
                                if (displayO) delete displayO._index;
                                const displayN = n ? { ...n } : null;
                                if (displayN) delete displayN._index;
                                return { index: idx, oldItem: displayO, newItem: displayN };
                            });
                        } else {
                            const maxLength = Math.max(oldArr.length, newArr.length);
                            for (let i = 0; i < maxLength; i++) {
                                const o = oldArr[i] ? { ...oldArr[i] } : null;
                                const n = newArr[i] ? { ...newArr[i] } : null;
                                if (o) { delete o._id; delete o.id; }
                                if (n) { delete n._id; delete n.id; }

                                if (JSON.stringify(o) !== JSON.stringify(n)) {
                                    diffs.push({ index: i, oldItem: o, newItem: n });
                                }
                            }
                        }

                        if (diffs.length === 0) return null;

                        return (
                            <div key={key} style={{ border: '1px solid #e8e8e8', borderRadius: '8px', overflow: 'hidden' }}>
                                <div style={{ background: '#fafafa', padding: '8px 16px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag color="blue">{displayKey}</Tag> <Text type="secondary" style={{ fontSize: 12 }}>(Chỉ hiển thị các mục thay đổi)</Text>
                                </div>
                                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {diffs.map(diff => (
                                        <div key={diff.index} style={{ border: '1px dashed #d9d9d9', borderRadius: '6px', padding: '12px' }}>
                                            <Text strong style={{ marginBottom: '8px', display: 'block', color: '#fa8c16' }}>Thay đổi ở Mục #{diff.index + 1}</Text>
                                            <div style={{ display: 'flex', gap: '16px' }}>
                                                <div style={{ flex: 1, padding: '8px', background: '#fff1f0', borderLeft: '3px solid #ffa39e', borderRadius: '0 4px 4px 0', overflowX: 'auto' }}>
                                                    <Text type="danger" strong>Cũ:</Text>
                                                    <pre style={{ margin: '8px 0 0 0', fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
                                                        {diff.oldItem ? JSON.stringify(diff.oldItem, null, 2) : '(trống)'}
                                                    </pre>
                                                </div>
                                                <div style={{ flex: 1, padding: '8px', background: '#f6ffed', borderLeft: '3px solid #b7eb8f', borderRadius: '0 4px 4px 0', overflowX: 'auto' }}>
                                                    <Text type="success" strong>Mới:</Text>
                                                    <pre style={{ margin: '8px 0 0 0', fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
                                                        {diff.newItem ? JSON.stringify(diff.newItem, null, 2) : '(trống)'}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={key} style={{ border: '1px solid #e8e8e8', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ background: '#fafafa', padding: '8px 16px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center' }}>
                                <Tag color="blue">{displayKey}</Tag>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: 1, padding: '12px 16px', background: '#fff1f0', borderRight: '1px solid #e8e8e8', overflowX: 'auto' }}>
                                    <Text type="danger" strong style={{ display: 'block', marginBottom: '8px' }}>Cũ:</Text>
                                    {renderDiffCell(oldVal, moduleName)}
                                </div>
                                <div style={{ flex: 1, padding: '12px 16px', background: '#f6ffed', overflowX: 'auto' }}>
                                    <Text type="success" strong style={{ display: 'block', marginBottom: '8px' }}>Mới:</Text>
                                    {renderDiffCell(newVal, moduleName)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />
            <main className="admin-main" style={{ padding: '24px 32px' }}>
                <Title level={2} style={{ color: '#1A237E', marginBottom: 24 }}>
                    Nhật ký hoạt động & Thiết bị
                </Title>

                <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minHeight: '80vh' }}>
                    <Tabs
                        defaultActiveKey="auditlog"
                        size="large"
                        type='card'
                        items={[
                            {
                                key: 'auditlog',
                                label: ' Nhật ký hoạt động',
                                children: (
                                    <>
                                        <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                                            <Select
                                                placeholder="Lọc hành động"
                                                allowClear
                                                style={{ width: 160 }}
                                                options={actionOptions.map(a => ({ label: ACTION_LABEL[a] || a, value: a }))}
                                                onChange={(v) => {
                                                    const newAction = v ?? null;
                                                    setFilterAction(newAction);
                                                    const currentFilters = { search: searchUser, action: newAction, module: filterModule };
                                                    if (filterDateRange && filterDateRange.length === 2) {
                                                        currentFilters.startDate = filterDateRange[0].startOf('day').toISOString();
                                                        currentFilters.endDate = filterDateRange[1].endOf('day').toISOString();
                                                    }
                                                    handleFilterChange(currentFilters);
                                                }}
                                            />
                                            <Select
                                                placeholder="Lọc module"
                                                allowClear
                                                style={{ width: 200 }}
                                                options={moduleOptions.map(m => ({ label: m, value: m }))}
                                                onChange={(v) => {
                                                    const newModule = v ?? null;
                                                    setFilterModule(newModule);
                                                    const currentFilters = { search: searchUser, action: filterAction, module: newModule };
                                                    if (filterDateRange && filterDateRange.length === 2) {
                                                        currentFilters.startDate = filterDateRange[0].startOf('day').toISOString();
                                                        currentFilters.endDate = filterDateRange[1].endOf('day').toISOString();
                                                    }
                                                    handleFilterChange(currentFilters);
                                                }}
                                            />
                                            <Input.Search
                                                placeholder="Tìm theo tên hoặc email người dùng..."
                                                allowClear
                                                style={{ width: 320 }}
                                                value={searchInput}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    setSearchInput(val);
                                                    if (debounceRef.current) clearTimeout(debounceRef.current);
                                                    debounceRef.current = setTimeout(() => {
                                                        setSearchUser(val);
                                                        const currentFilters = { search: val, action: filterAction, module: filterModule };
                                                        if (filterDateRange && filterDateRange.length === 2) {
                                                            currentFilters.startDate = filterDateRange[0].startOf('day').toISOString();
                                                            currentFilters.endDate = filterDateRange[1].endOf('day').toISOString();
                                                        }
                                                        handleFilterChange(currentFilters);
                                                    }, 500);
                                                }}
                                                onSearch={v => {
                                                    if (debounceRef.current) clearTimeout(debounceRef.current);
                                                    setSearchInput(v);
                                                    setSearchUser(v);
                                                    const currentFilters = { search: v, action: filterAction, module: filterModule };
                                                    if (filterDateRange && filterDateRange.length === 2) {
                                                        currentFilters.startDate = filterDateRange[0].startOf('day').toISOString();
                                                        currentFilters.endDate = filterDateRange[1].endOf('day').toISOString();
                                                    }
                                                    handleFilterChange(currentFilters);
                                                }}
                                                onClear={() => {
                                                    if (debounceRef.current) clearTimeout(debounceRef.current);
                                                    setSearchInput('');
                                                    setSearchUser('');
                                                    const currentFilters = { search: '', action: filterAction, module: filterModule };
                                                    if (filterDateRange && filterDateRange.length === 2) {
                                                        currentFilters.startDate = filterDateRange[0].startOf('day').toISOString();
                                                        currentFilters.endDate = filterDateRange[1].endOf('day').toISOString();
                                                    }
                                                    handleFilterChange(currentFilters);
                                                }}
                                            />
                                            <DatePicker.RangePicker
                                                placeholder={['Từ ngày', 'Đến ngày']}
                                                style={{ width: 260 }}
                                                value={filterDateRange}
                                                disabledDate={(current) => {
                                                    return current && (current > dayjs().endOf('day') || current < dayjs().subtract(30, 'days').startOf('day'));
                                                }}
                                                onChange={(dates) => {
                                                    setFilterDateRange(dates);
                                                    const currentFilters = { search: searchUser, action: filterAction, module: filterModule };
                                                    if (dates && dates.length === 2) {
                                                        currentFilters.startDate = dates[0].startOf('day').toISOString();
                                                        currentFilters.endDate = dates[1].endOf('day').toISOString();
                                                    }
                                                    handleFilterChange(currentFilters);
                                                }}
                                            />
                                            <Button
                                                icon={<ReloadOutlined />}
                                                loading={loading}
                                                onClick={() => { fetchData(currentPage, pageSize) }}
                                            >
                                                Tải lại danh sách
                                            </Button>
                                        </Space>

                                        <Table
                                            columns={columns}
                                            dataSource={data}
                                            loading={loading}
                                            bordered
                                            locale={{ emptyText: <Empty description="Chưa có nhật ký nào" /> }}
                                            pagination={{
                                                current: currentPage,
                                                pageSize,
                                                total: totalLogs,
                                                showLessItems: true,
                                                showSizeChanger: false,
                                                onChange: (page) => setCurrentPage(page),
                                                showTotal: t => `Tổng ${t} nhật ký`,
                                            }}
                                        />
                                    </>
                                ),
                            },
                            {
                                key: 'devices',
                                label: ' Quản lý Thiết bị',
                                children: <DeviceManagementTab />,
                            },
                            {
                                key: 'users',
                                label: ' Quản lý Người dùng',
                                children: <UserManagementTab />,
                            },
                        ]}
                    />
                </div>

                <Modal
                    title={
                        <Space>
                            <Tag color={ACTION_COLOR[detailRecord?.action]}>
                                {ACTION_LABEL[detailRecord?.action] || detailRecord?.action}
                            </Tag>
                            <Text>{detailRecord?.module} – {detailRecord?.recordName || detailRecord?.recordId}</Text>
                        </Space>
                    }
                    open={detailVisible}
                    onCancel={() => setDetailVisible(false)}
                    footer={null}
                    width={700}
                >
                    {detailRecord && (
                        <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            <div>
                                <Text strong style={{ marginBottom: 8, marginRight: 8 }}> Thời gian:</Text>
                                <Text>{formatDate(detailRecord.createdAt)}</Text>
                            </div>
                            <div>
                                <Text strong style={{ marginBottom: 8, marginRight: 8 }}> Người thực hiện:</Text>
                                <Text>{detailRecord.userId?.name || 'Ẩn danh'}</Text>
                            </div>
                            <div>
                                <Text strong style={{ marginBottom: 8, marginRight: 8 }}> Chức vụ:</Text>
                                <Text>{detailRecord.userId?.role == 'admin' ? 'Quản trị viên' : detailRecord.userId?.role == 'staff' ? 'Nhân viên' : 'Người dùng'}</Text>
                            </div>
                            <div>
                                <Text strong style={{ marginBottom: 8, marginRight: 8 }}>Email:</Text>
                                <Text>{detailRecord.userId?.email || 'Ẩn danh'}</Text>
                            </div>

                            {detailRecord.action === 'update' ? (
                                <div>
                                    <Text strong style={{ display: 'block', marginBottom: 16, fontSize: 16 }}>Chi tiết thay đổi:</Text>
                                    {renderUpdateDiff(detailRecord.oldValues, detailRecord.newValues, detailRecord.module)}
                                </div>
                            ) : (
                                <>
                                    {detailRecord.oldValues && Object.keys(detailRecord.oldValues).length > 0 && (
                                        <div>
                                            <Text strong style={{ display: 'block', marginBottom: 8, color: '#cf1322' }}> Giá trị cũ:</Text>
                                            {renderValues(detailRecord.oldValues, detailRecord.module)}
                                        </div>
                                    )}
                                    {detailRecord.newValues && Object.keys(detailRecord.newValues).length > 0 && (
                                        <div>
                                            <Text strong style={{ display: 'block', marginBottom: 8, color: '#389e0d' }}> Giá trị mới:</Text>
                                            {renderValues(detailRecord.newValues, detailRecord.module)}
                                        </div>
                                    )}
                                </>
                            )}
                        </Space>
                    )}
                </Modal>
            </main>
        </div>
    );
};

export default AdminAuditLog;
