import React, { useEffect, useState } from 'react';
import slugify from 'slugify';
import {
    Table, Button, Modal, Form, Input, Space,
    Popconfirm, message, Typography, Upload, Image, Tag, DatePicker, Select,
    Tabs, Tooltip
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';
import dayjs from 'dayjs';
import CustomQuillEditor from '../component/CustomQuillEditor';

import {
    createProject, updateProject, deleteProject, getProjectsForManage, getProjectByName
} from '../utils/projectApi';
import { uploadImageToCloudinary, processRichTextContent } from '../utils/imageApi';

const { Title } = Typography;
const { TextArea } = Input;

const resolveImageUrl = async (value, folder = "tnt_project") => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return await uploadImageToCloudinary(value, folder);
};

const MultiCloudinaryUpload = ({ value = [], onChange, maxCount = 1 }) => {
    const items = Array.isArray(value) ? value : (value ? [value] : []);

    const beforeUpload = (file) => {
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
                            <Image src={src} height={80} width={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
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


const AdminProject = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getProjectsForManage();
            setData(res?.projects ? res.projects.map(d => ({ ...d, key: d._id })) : []);
        } catch { message.error('Lấy dữ liệu dự án thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSearch = async (value) => {
        setSearchText(value);
        if (!value || !value.trim()) {
            fetchData();
            return;
        }
        setLoading(true);
        try {
            const res = await getProjectByName(value.trim(), 1, 1000);
            setData(res?.projects ? res.projects.map(d => ({ ...d, key: d._id })) : []);
        } catch {
            message.error('Tìm kiếm thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (record = null) => {
        setEditing(record);
        form.resetFields();
        setModalVisible(true);
        setTimeout(() => {
            if (record) {
                form.setFieldsValue({
                    name: record.name,
                    name_en: record.name_en,
                    title: record.title,
                    title_en: record.title_en,
                    description: record.description,
                    description_en: record.description_en,
                    slug: record.slug,
                    status: record.status || 'active',
                    date: record.date ? dayjs(record.date) : null,
                    images: record.image ? [record.image] : [],
                });
            } else {
                form.setFieldsValue({ status: 'active' });
            }
        }, 200);
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const values = await form.validateFields();

            const folder = "tnt_project";

            const imageItems = Array.isArray(values.images) ? values.images : [];
            const imageUrls = await Promise.all(imageItems.map(value => resolveImageUrl(value, folder)));
            const processedDescription = await processRichTextContent(values.description || '', folder);
            const processedDescriptionEn = await processRichTextContent(values.description_en || '', folder);
            const hasNewFile = imageItems.some(item => item instanceof File);
            let finalImage;
            if (hasNewFile) {
                finalImage = imageUrls.find(url => url) || (editing ? editing.image : '');
            } else {
                finalImage = editing ? editing.image : (imageUrls[0] || '');
            }

            const payload = {
                ...values,
                description: processedDescription,
                description_en: processedDescriptionEn,
                date: values.date ? values.date.toISOString() : null,
                image: finalImage
            };

            delete payload.images;

            if (editing) {
                await updateProject(editing._id, payload);
                message.success('Cập nhật dự án thành công!');
            } else {
                await createProject(payload);
                message.success('Thêm mới dự án thành công!');
            }
            setModalVisible(false);
            setSearchText('');
            fetchData();
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra!');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProject(id);
            message.success('Xóa dự án thành công!');
            fetchData();
        } catch { message.error('Xóa thất bại!'); }
    };

    const columns = [
        { title: 'Tên dự án', dataIndex: 'name', key: 'name', width: '25%' },
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        {
            title: 'Ngày dự án', dataIndex: 'date', key: 'date', width: '10%',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '---'
        },
        {
            title: 'Ảnh', dataIndex: 'image', key: 'image', width: '10%',
            render: (img) => img ? (
                <Image src={img} height={50} width={80} style={{ borderRadius: 4, objectFit: 'cover' }} />
            ) : <Tag>Chưa có</Tag>
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
                </Tag>
            )
        },
        {
            title: 'Thao tác', key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="primary" ghost size="small" icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
                    <Popconfirm title="Xác nhận xóa dự án?" onConfirm={() => handleDelete(record._id)} okText="Xóa" cancelText="Hủy">
                        <Button danger size="small" icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />
            <main className="admin-main" style={{ padding: '24px 32px' }}>
                <Title level={2} style={{ color: '#1A237E', marginBottom: 24 }}>Quản lý Dự án</Title>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minHeight: '80vh' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>Danh sách Dự án</Title>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm Dự án</Button>
                    </div>

                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                        <Input.Search
                            placeholder="Tìm kiếm dự án theo tên..."
                            allowClear
                            onSearch={handleSearch}
                            style={{ width: 300 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <Table columns={columns} dataSource={data} loading={loading} bordered pagination={{ pageSize: 5, showTotal: t => `Tổng ${t} dự án`, }} />

                    <Modal title={editing ? "Sửa Dự án" : "Thêm mới Dự án"} open={modalVisible}
                        onOk={handleSave} onCancel={() => setModalVisible(false)}
                        okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }} cancelText="Hủy" width={800}>
                        <Form form={form} layout="vertical">
                            <Tabs defaultActiveKey="1">
                                <Tabs.TabPane tab="Tiếng Việt" key="1">
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        <Form.Item name="name" label="Tên dự án" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]} style={{ flex: 1 }}>
                                            <Input onChange={(e) => {
                                                if (!editing) {
                                                    const slug = slugify(e.target.value, {
                                                        lower: true,
                                                        strict: true,
                                                        locale: "vi",
                                                    });
                                                    form.setFieldsValue({ slug });
                                                }
                                            }} />
                                        </Form.Item>
                                        <Form.Item name="slug" label="Slug" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]} style={{ flex: 1 }}>
                                            <Input
                                                addonAfter={
                                                    <Tooltip title="Tạo slug từ tên dự án">
                                                        <ReloadOutlined
                                                            onClick={() => {
                                                                const name = form.getFieldValue("name");

                                                                if (!name) return;

                                                                const slug = slugify(name, {
                                                                    lower: true,
                                                                    strict: true,
                                                                    locale: "vi",
                                                                });

                                                                form.setFieldsValue({ slug });
                                                            }}
                                                            style={{ cursor: "pointer" }}
                                                        />
                                                    </Tooltip>
                                                }
                                            />
                                        </Form.Item>
                                    </div>

                                    <div style={{ display: 'flex', gap: 16 }}>
                                        <Form.Item name="date" label="Ngày (hoặc Thời gian dự án)" style={{ flex: 1 }}>
                                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                                        </Form.Item>
                                        <Form.Item name="status" label="Trạng thái" style={{ flex: 1 }}>
                                            <Select>
                                                <Select.Option value="active">Hoạt động</Select.Option>
                                                <Select.Option value="inactive">Dừng hoạt động</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </div>

                                    <Form.Item name="title" label="Tiêu đề phụ" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng không để trống!' }]}>
                                        <CustomQuillEditor folder="tnt_project" style={{ height: '250px', marginBottom: '50px' }} />
                                    </Form.Item>

                                    <Form.Item name="images" label="Hình ảnh" rules={[{ required: true, message: 'Vui lòng không để trống!' }]}>
                                        <MultiCloudinaryUpload maxCount={1} />
                                    </Form.Item>
                                </Tabs.TabPane>

                                <Tabs.TabPane tab="Tiếng Anh(Tùy chọn)" key="2">
                                    <Form.Item name="name_en" label="Tên dự án (English)">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="title_en" label="Tiêu đề phụ (English)">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="description_en" label="Mô tả (English)">
                                        <CustomQuillEditor folder="tnt_project" style={{ height: '250px', marginBottom: '50px' }} />
                                    </Form.Item>
                                </Tabs.TabPane>
                            </Tabs>
                        </Form>
                    </Modal>
                </div>
            </main>
        </div>
    );
};

export default AdminProject;
