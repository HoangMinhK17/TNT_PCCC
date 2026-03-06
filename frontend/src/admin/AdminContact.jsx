import React, { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Input, Space,
    Popconfirm, message, Typography, Tag, Select, Descriptions
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';
import dayjs from 'dayjs';

import {
    getContactsForManage, updateContact, deleteContact, findContactByNameOrPhone, filterByStatus
} from '../utils/contactApi';

const { Title } = Typography;
const { TextArea } = Input;

const AdminContact = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [form] = Form.useForm();

    const fetchData = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const res = await getContactsForManage(page, limit);
            setData(res?.contacts ? res.contacts.map(d => ({ ...d, key: d._id })) : []);
            setTotalPages(res?.totalPage || 1);
            setCurrentPage(res?.currentPage || 1);
        } catch { message.error('Lấy dữ liệu liên hệ thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(currentPage, pageSize); }, [currentPage, pageSize]);

    const handleSearch = async (value, page = 1, limit = 10) => {
        setSearchText(value);
        if (!value || !value.trim()) {
            if (statusFilter) {
                handleFilterByStatus(statusFilter, page, limit);
            } else {
                fetchData(page, limit);
            }
            return;
        }
        setLoading(true);
        try {
            const res = await findContactByNameOrPhone(value.trim(), value.trim(), page, limit);
            setData(res?.contacts ? res.contacts.map(d => ({ ...d, key: d._id })) : []);
            setTotalPages(res?.totalPage || 1);
            setCurrentPage(res?.currentPage || 1);
        } catch {
            message.error('Tìm kiếm thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterByStatus = async (status, page = 1, limit = 10) => {
        setStatusFilter(status);
        if (!status) {
            if (searchText) {
                handleSearch(searchText, page, limit);
            } else {
                fetchData(page, limit);
            }
            return;
        }
        setLoading(true);
        try {
            const res = await filterByStatus(status, page, limit);
            setData(res?.contacts ? res.contacts.map(d => ({ ...d, key: d._id })) : []);
            setTotalPages(res?.totalPage || 1);
            setCurrentPage(res?.currentPage || 1);
        } catch {
            message.error('Lọc thất bại!');
        } finally {
            setLoading(false);
        }
    };


    const openEditModal = (record) => {
        setEditing(record);
        form.resetFields();
        form.setFieldsValue({
            status: record.status || 'pending',
            repliedMessage: record.repliedMessage || ''
        });
        setModalVisible(true);
    };

    const openViewModal = (record) => {
        setCurrentRecord(record);
        setViewModalVisible(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();

            const payload = {
                status: values.status,
                repliedMessage: values.repliedMessage
            };

            await updateContact(editing._id, payload);
            message.success('Cập nhật thành công!');

            setModalVisible(false);

            if (searchText) {
                handleSearch(searchText, currentPage, pageSize);
            } else if (statusFilter) {
                handleFilterByStatus(statusFilter, currentPage, pageSize);
            } else {
                fetchData(currentPage, pageSize);
            }
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra!');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteContact(id);
            message.success('Xóa thành công!');
            fetchData(currentPage, pageSize);
        } catch { message.error('Xóa thất bại!'); }
    };

    const renderStatus = (status) => {
        switch (status) {
            case 'replied': return <Tag color="green">Đã phản hồi</Tag>;
            case 'rejected': return <Tag color="red">Từ chối</Tag>;
            default: return <Tag color="blue">Chờ xử lý</Tag>;
        }
    };

    const columns = [
        { title: 'Họ và tên', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Ngày gửi', dataIndex: 'createdAt', key: 'createdAt',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: renderStatus
        },
        {
            title: 'Thao tác', key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="default" size="small" icon={<EyeOutlined />} onClick={() => openViewModal(record)}>Xem</Button>
                    <Button type="primary" ghost size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)} disabled={record.status !== 'pending'}>Xử lý</Button>
                    <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record._id)} okText="Xóa" cancelText="Hủy">
                        <Button danger size="small" icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />
            <main className="admin-main" style={{ padding: '24px 32px' }}>
                <Title level={2} style={{ color: '#1A237E', margin: '0 0 24px 0' }}>Quản lý Liên hệ</Title>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minHeight: '80vh' }}>

                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                        <Input.Search
                            placeholder="Tìm bằng tên hoặc SĐT..."
                            allowClear
                            onSearch={(val) => { setCurrentPage(1); handleSearch(val, 1, pageSize); }}
                            style={{ width: 300 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Select
                            placeholder="Lọc theo trạng thái"
                            allowClear
                            style={{ width: 200 }}
                            value={statusFilter}
                            onChange={(val) => { setCurrentPage(1); handleFilterByStatus(val, 1, pageSize); }}
                        >
                            <Select.Option value="pending">Chờ xử lý</Select.Option>
                            <Select.Option value="replied">Đã phản hồi</Select.Option>
                            <Select.Option value="rejected">Từ chối</Select.Option>
                        </Select>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        bordered
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: totalPages * pageSize,
                            onChange: (page, size) => {
                                setCurrentPage(page);
                                setPageSize(size);
                                if (searchText) {
                                    handleSearch(searchText, page, size);
                                } else if (statusFilter) {
                                    handleFilterByStatus(statusFilter, page, size);
                                } else {
                                    fetchData(page, size);
                                }
                            }
                        }}
                    />

                    <Modal title="Xử lý Liên hệ" open={modalVisible}
                        onOk={handleSave} onCancel={() => setModalVisible(false)}
                        okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }} cancelText="Hủy" width={600}>
                        <Form form={form} layout="vertical">
                            <Form.Item name="status" label="Trạng thái xử lý">
                                <Select>
                                    <Select.Option value="pending">Chờ xử lý</Select.Option>
                                    <Select.Option value="replied">Đã phản hồi (Duyệt)</Select.Option>
                                    <Select.Option value="rejected">Từ chối</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="repliedMessage" label="Nội dung phản hồi / Ghi chú (Nếu có)">
                                <TextArea rows={4} placeholder="Nhập tin nhắn phản hồi đã gửi cho khách hàng..." />
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* View Modal */}
                    <Modal title="Chi tiết liên hệ" open={viewModalVisible}
                        onCancel={() => setViewModalVisible(false)} footer={<Button onClick={() => setViewModalVisible(false)}>Đóng</Button>} width={700}>
                        {currentRecord && (
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Người gửi">{currentRecord.name}</Descriptions.Item>
                                <Descriptions.Item label="Email">{currentRecord.email}</Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại">{currentRecord.phone}</Descriptions.Item>
                                <Descriptions.Item label="Ngày gửi">{dayjs(currentRecord.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                                <Descriptions.Item label="Trạng thái">{renderStatus(currentRecord.status)}</Descriptions.Item>
                                <Descriptions.Item label="Tiêu đề">{currentRecord.title}</Descriptions.Item>
                                <Descriptions.Item label="Nội dung gửi"><div style={{ whiteSpace: 'pre-wrap' }}>{currentRecord.message}</div></Descriptions.Item>
                                {currentRecord.status !== 'pending' && (
                                    <Descriptions.Item label="Ghi chú xử lý / Nội dung phản hồi">
                                        <div style={{ whiteSpace: 'pre-wrap' }}>{currentRecord.repliedMessage || "(Không có)"}</div>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        )}
                    </Modal>

                </div>
            </main>
        </div>
    );
};

export default AdminContact;
