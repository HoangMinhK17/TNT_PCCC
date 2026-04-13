import React, { useEffect, useState } from 'react';
import slugify from 'slugify';
import {
    Tabs, Table, Button, Modal, Form, Input, Space,
    Popconfirm, message, Typography, Upload, Image, Tag, Select
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';
import CustomQuillEditor from '../component/CustomQuillEditor';

import {
    createService, updateService, deleteService, getServicesForManage, searchService
} from '../utils/serviceApi';
import {
    createWhyChooseService, updateWhyChooseService, deleteWhyChooseService, getWhyChooseServiceForManage, searchWhyChooseService
} from '../utils/whyChooseServiceApi';
import { uploadImageToCloudinary, processRichTextContent } from '../utils/imageApi';

const { Title } = Typography;
const { TextArea } = Input;

const resolveImageUrl = async (value, folder = "tnt_service") => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return await uploadImageToCloudinary(value, folder);
};

const SingleCloudinaryUpload = ({ value, onChange }) => {
    const beforeUpload = (file) => {
        const isLt5M = file.size / 1024 / 1024 <= 5;
        if (!isLt5M) {
            message.error('Ảnh không được vượt quá 5MB!');
            return Upload.LIST_IGNORE;
        }
        onChange(file);
        return false;
    };

    const removeItem = () => {
        onChange(null);
    };

    const src = value instanceof File ? URL.createObjectURL(value) : value;

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {!value && (
                <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
                    <Button icon={<UploadOutlined />}>Đính kèm ảnh</Button>
                </Upload>
            )}
            {value && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Image src={src} height={80} width={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
                    <Button size="small" danger
                        style={{ position: 'absolute', top: 2, right: 2, padding: '0 4px', minWidth: 'auto' }}
                        onClick={removeItem}>✕</Button>
                </div>
            )}
        </Space>
    );
};


// ═══════════════════════ TAB 1: DỊCH VỤ (SERVICE) ══════════════════════════
const TabService = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [form] = Form.useForm();

    const fetchData = async (page = 1, limit = 5, search = '') => {
        setLoading(true);
        try {
            let res;
            if (search) {
                res = await searchService(search, page, limit);
            } else {
                res = await getServicesForManage(page, limit);
            }
            setData(res?.services ? res.services.map(d => ({ ...d, key: d._id })) : []);
            setPagination({
                current: res.currentPage || 1,
                pageSize: limit,
                total: res.totalServices || 0,
            });
        } catch { message.error('Lấy dữ liệu dịch vụ thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(1, pagination.pageSize, searchText); }, []);

    const handleTableChange = (pag) => {
        fetchData(pag.current, pag.pageSize, searchText);
    };

    const handleSearch = async (value) => {
        const val = value ? value.trim() : '';
        setSearchText(val);
        fetchData(1, pagination.pageSize, val);
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
                    image: record.image || null,
                });
            } else {
                form.setFieldsValue({ status: 'active' });
            }
        }, 100);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();
            const folder = "tnt_service";

            const imageUrl = await resolveImageUrl(values.image, folder);
            const processedDescription = await processRichTextContent(values.description, folder);
            const processedDescriptionEn = await processRichTextContent(values.description_en, folder);

            const payload = {
                ...values,
                image: imageUrl || "",
                description: processedDescription,
                description_en: processedDescriptionEn
            };

            if (editing) {
                await updateService(editing._id, payload);
                message.success('Cập nhật dịch vụ thành công!');
            } else {
                await createService(payload);
                message.success('Thêm mới dịch vụ thành công!');
            }
            setModalVisible(false);
            setSearchText('');
            fetchData(1, pagination.pageSize, '');
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra!');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteService(id);
            message.success('Xóa dịch vụ thành công!');
            fetchData(pagination.current, pagination.pageSize, searchText);
        } catch { message.error('Xóa thất bại!'); }
    };

    const columns = [
        { title: 'Tên dịch vụ', dataIndex: 'name', key: 'name', width: '25%' },
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title', width: '25%' },
        {
            title: 'Ảnh', dataIndex: 'image', key: 'image',
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
                    <Popconfirm title="Xác nhận xóa dịch vụ?" onConfirm={() => handleDelete(record._id)} okText="Xóa" cancelText="Hủy">
                        <Button danger size="small" icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Danh sách Dịch vụ</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm Dịch vụ</Button>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm dịch vụ theo tên..."
                    allowClear
                    onSearch={handleSearch}
                    style={{ width: 300 }}
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
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                }}
                onChange={handleTableChange}
            />

            <Modal title={editing ? "Sửa Dịch vụ" : "Thêm mới Dịch vụ"} open={modalVisible}
                onOk={handleSave} onCancel={() => setModalVisible(false)}
                okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }} cancelText="Hủy" width={800}>

                <Form form={form} layout="vertical">

                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Tiếng Việt (Mặc định)" key="1">
                            <div style={{ display: 'flex', gap: 16 }}>
                                <Form.Item name="name" label="Tên dịch vụ" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]} style={{ flex: 1 }}>
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
                                    <Input />
                                </Form.Item>
                            </div>

                            <Form.Item name="status" label="Trạng thái">
                                <Select>
                                    <Select.Option value="active">Hoạt động</Select.Option>
                                    <Select.Option value="inactive">Dừng hoạt động</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="title" label="Tiêu đề phụ" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng không để trống!' }]}>
                                <CustomQuillEditor folder="tnt_service" style={{ height: '250px', marginBottom: '50px' }} />
                            </Form.Item>

                            <Form.Item name="image" label="Hình ảnh">
                                <SingleCloudinaryUpload />
                            </Form.Item>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Tiếng Anh(Tùy chọn)" key="2">
                            <div style={{ display: 'flex', gap: 16 }}>
                                <Form.Item name="name_en" label="Tên dịch vụ(English)" style={{ flex: 1 }}>
                                    <Input />
                                </Form.Item>
                            </div>

                            <Form.Item name="title_en" label="Tiêu đề phụ(English)">
                                <Input />
                            </Form.Item>

                            <Form.Item name="description_en" label="Mô tả (English)">
                                <CustomQuillEditor folder="tnt_service" style={{ height: '250px', marginBottom: '50px' }} />
                            </Form.Item>
                        </Tabs.TabPane>
                    </Tabs>

                </Form>
            </Modal>
        </div>
    );
};


// ═══════════════════════ TAB 2: TẠI SAO CHỌN CHÚNG TÔI (WHY CHOOSE SERVICE) ══════════════════════════
const TabWhyChooseService = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [form] = Form.useForm();

    const fetchData = async (page = 1, limit = 5, search = '') => {
        setLoading(true);
        try {
            let res;
            if (search) {
                res = await searchWhyChooseService(search, page, limit);
            } else {
                res = await getWhyChooseServiceForManage(page, limit);
            }
            setData(res?.whyChooseService ? res.whyChooseService.map(d => ({ ...d, key: d._id })) : []);
            setPagination({
                current: res.currentPage || 1,
                pageSize: limit,
                total: res.totalWhyChooseService || 0,
            });
        } catch { message.error('Lấy dữ liệu thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(1, pagination.pageSize, searchText); }, []);

    const handleTableChange = (pag) => {
        fetchData(pag.current, pag.pageSize, searchText);
    };

    const handleSearch = async (value) => {
        const val = value ? value.trim() : '';
        setSearchText(val);
        fetchData(1, pagination.pageSize, val);
    };

    const openModal = (record = null) => {
        setEditing(record);
        form.resetFields();
        setModalVisible(true);
        setTimeout(() => {
            if (record) {
                form.setFieldsValue({
                    title: record.title,
                    title_en: record.title_en,
                    description: record.description,
                    description_en: record.description_en,
                    icon: record.icon || null,
                    status: record.status || 'active',
                });
            } else {
                form.setFieldsValue({ status: 'active' });
            }
        }, 100);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();
            const folder = "tnt_why_choose_service";

            const iconUrl = await resolveImageUrl(values.icon, folder);

            const payload = {
                ...values,
                icon: iconUrl || "",
            };

            if (editing) {
                await updateWhyChooseService(editing._id, payload);
                message.success('Cập nhật thành công!');
            } else {
                await createWhyChooseService(payload);
                message.success('Thêm mới thành công!');
            }
            setModalVisible(false);
            setSearchText('');
            fetchData(1, pagination.pageSize, '');
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra!');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteWhyChooseService(id);
            message.success('Xóa thành công!');
            fetchData(pagination.current, pagination.pageSize, searchText);
        } catch { message.error('Xóa thất bại!'); }
    };

    const columns = [
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Icon/Ảnh', dataIndex: 'icon', key: 'icon',
            render: (img) => img ? (
                <Image src={img} height={58} width={58} style={{ borderRadius: 4, objectFit: 'contain', background: '#f5f5f5' }} />
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
                    <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record._id)} okText="Xóa" cancelText="Hủy">
                        <Button danger size="small" icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Danh sách - Tại sao chọn dịch vụ của chúng tôi?</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm Lý do</Button>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm theo tiêu đề..."
                    allowClear
                    onSearch={handleSearch}
                    style={{ width: 300 }}
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
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                }}
                onChange={handleTableChange}
            />

            <Modal title={editing ? "Sửa Lý do" : "Thêm Lý do"} open={modalVisible}
                onOk={handleSave} onCancel={() => setModalVisible(false)}
                okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }} cancelText="Hủy" width={800}>
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Tiêu đề (Lý do)" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="title_en" label="Tiêu đề (Lý do) - Tiếng Anh">
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả chi tiết" rules={[{ required: true, message: 'Vui lòng không để trống!' }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="description_en" label="Mô tả chi tiết - Tiếng Anh">
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái">
                        <Select>
                            <Select.Option value="active">Hoạt động</Select.Option>
                            <Select.Option value="inactive">Dừng hoạt động</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="icon" label="Icon/Hình ảnh (Khuyên dùng PNG/SVG không nền)">
                        <SingleCloudinaryUpload />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};


// ═══════════════════════ ROOT COMPONENT ══════════════════════════
const AdminService = () => {
    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />
            <main className="admin-main" style={{ padding: '24px 32px' }}>
                <Title level={2} style={{ color: '#1A237E', marginBottom: 24 }}>Quản lý Dịch vụ</Title>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minHeight: '80vh' }}>
                    <Tabs
                        defaultActiveKey="1"
                        size="large"
                        type="card"
                        items={[
                            {
                                key: '1',
                                label: 'Dịch vụ cung cấp',
                                children: <TabService />,
                            },
                            {
                                key: '2',
                                label: 'Tại sao chọn chúng tôi?',
                                children: <TabWhyChooseService />,
                            }
                        ]}
                    />
                </div>
            </main>
        </div>
    );
};

export default AdminService;
