import React, { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Input, Space,
    Popconfirm, message, Typography, Upload, Image, Tag, Select, Rate
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';

import {
    getTestimonialsForManage, searchTestimonial, createTestimonial, updateTestimonial, deleteTestimonial
} from '../utils/testimonialApi';

import { uploadImageToCloudinary } from '../utils/imageApi';

const { Title } = Typography;

const resolveImageUrl = async (value, folder = "tnt_testimonials") => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return await uploadImageToCloudinary(value, folder);
};

const MultiCloudinaryUpload = ({ value = [], onChange, maxCount = 1 }) => {
    const items = Array.isArray(value) ? value : (value ? [value] : []);

    const beforeUpload = (file) => {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
            return false;
        }
        if (items.length >= maxCount) {
            message.warning(`Chỉ được chọn tối đa ${maxCount} ảnh!`);
            return false;
        }
        onChange([...items, file]);
        return false;
    };

    const removeItem = (idx) => {
        onChange(items.filter((_, i) => i !== idx));
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {items.length < maxCount && (
                <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
                    <Button icon={<UploadOutlined />}>Đính kèm ảnh ({items.length}/{maxCount})</Button>
                </Upload>
            )}
            <Space wrap>
                {items.map((item, idx) => {
                    const src = item instanceof File ? URL.createObjectURL(item) : item;
                    return (
                        <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                            <Image src={src} height={80} width={80} style={{ objectFit: 'contain', borderRadius: 4 }} />
                            <Button size="small" danger
                                style={{ position: 'absolute', top: 2, right: 2, padding: '0 4px', minWidth: 'auto' }}
                                onClick={() => removeItem(idx)}>✕</Button>
                        </div>
                    );
                })}
            </Space>
        </Space>
    );
};

const AdminTestimonial = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [form] = Form.useForm();

    const fetchData = async (page = 1, limit = 5) => {
        setLoading(true);
        try {
            const res = await getTestimonialsForManage(page, limit);
            setData(res?.testimonials ? res.testimonials.map(d => ({ ...d, key: d._id })) : []);
            setTotalPages(res?.totalPage || 1);
            setCurrentPage(res?.currentPage || 1);
        } catch { message.error('Lấy dữ liệu đánh giá thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(currentPage, pageSize); }, [currentPage, pageSize]);

    const handleSearch = async (value, page = 1, limit = 5) => {
        setSearchText(value);
        if (!value || !value.trim()) {
            fetchData(page, limit);
            return;
        }
        setLoading(true);
        try {
            const res = await searchTestimonial(value.trim(), page, limit);
            setData(res?.testimonials ? res.testimonials.map(d => ({ ...d, key: d._id })) : []);
            setTotalPages(res?.totalPage || 1);
            setCurrentPage(res?.currentPage || 1);
        } catch {
            message.error('Tìm kiếm thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (record = null) => {
        setEditing(record);
        form.resetFields();
        if (record) {
            form.setFieldsValue({
                name: record.name,
                role: record.role,
                company: record.company,
                content: record.content,
                rating: record.rating || 5,
                status: record.status || 'active',
                images: record.avatar ? [record.avatar] : [],
            });
        } else {
            form.setFieldsValue({ status: 'active', rating: 5 });
        }
        setModalVisible(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();

            const imageItems = Array.isArray(values.images) ? values.images : [];
            const imageUrls = await Promise.all(imageItems.map(value => resolveImageUrl(value, "tnt_testimonials")));

            const payload = {
                name: values.name,
                role: values.role,
                company: values.company,
                content: values.content,
                rating: values.rating,
                status: values.status,
                avatar: imageUrls.length > 0 ? imageUrls[0] : ""
            };

            if (editing) {
                await updateTestimonial(editing._id, payload);
                message.success('Cập nhật thành công!');
            } else {
                await createTestimonial(payload);
                message.success('Thêm mới thành công!');
            }
            window.location.reload();
            setModalVisible(false);
            setSearchText('');
            setCurrentPage(1);
            fetchData(1, pageSize);
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra!');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTestimonial(id);
            message.success('Xóa thành công!');
            fetchData(currentPage, pageSize);
        } catch { message.error('Xóa thất bại!'); }
    };

    const columns = [
        { title: '#', dataIndex: 'index', key: 'index', width: '50px', render: (_, __, i) => (currentPage - 1) * pageSize + i + 1, align: 'center' },
        { title: 'Tên người đánh giá', dataIndex: 'name', key: 'name', width: '20%', align: 'center' },
        {
            title: 'Avatar', dataIndex: 'avatar', key: 'avatar',
            render: (img) => img ? (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Image src={img} height={58} width={68} style={{ borderRadius: 4, objectFit: 'cover' }} />
                </div>
            ) : <Tag>Chưa có</Tag>
        },
        { title: 'Chức vụ', dataIndex: 'role', key: 'role' },
        { title: 'Công ty', dataIndex: 'company', key: 'company' },
        {
            title: 'Đánh giá', dataIndex: 'rating', key: 'rating',
            render: (rating) => <Rate disabled defaultValue={rating} />
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Hiển thị' : 'Ẩn'}
                </Tag>
            )
        },
        {
            title: 'Thao tác', key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="primary" ghost size="small" icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
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
                <Title level={2} style={{ color: '#1A237E', margin: '0 0 24px 0' }}>Quản lý Đánh giá</Title>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minHeight: '80vh' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>Danh sách đánh giá</Title>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm Lời đánh giá</Button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Input.Search
                            placeholder="Tìm kiếm đánh giá theo tên"
                            allowClear
                            onSearch={(val) => { setCurrentPage(1); handleSearch(val, 1, pageSize); }}
                            style={{ width: 250 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
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
                                } else {
                                    fetchData(page, size);
                                }
                            }
                        }}
                    />

                    <Modal title={editing ? "Sửa Lời đánh giá" : "Thêm mới Lời đánh giá"} open={modalVisible}
                        onOk={handleSave} onCancel={() => setModalVisible(false)}
                        okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }} cancelText="Hủy" width={700}>
                        <Form form={form} layout="vertical">
                            <Form.Item name="name" label="Tên người đánh giá" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="role" label="Chức vụ" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="company" label="Công ty" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="content" label="Nội dung" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <Form.Item name="rating" label="Số sao" rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}>
                                <Rate />
                            </Form.Item>

                            <Form.Item name="status" label="Trạng thái">
                                <Select>
                                    <Select.Option value="active">Hiển thị</Select.Option>
                                    <Select.Option value="inactive">Ẩn</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="images" label="Avatar" rules={[{ required: true, message: 'Vui lòng chọn ảnh đại diện!' }]}>
                                <MultiCloudinaryUpload maxCount={1} />
                            </Form.Item>
                        </Form>
                    </Modal>

                </div>
            </main>
        </div>
    );
};

export default AdminTestimonial;

