import React, { useEffect, useState } from 'react';
import slugify from 'slugify';
import {
    Tabs, Table, Button, Modal, Form, Input, Space,
    Popconfirm, message, Typography, Upload, Image, Tag, Select, DatePicker
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';
import dayjs from 'dayjs';
import CustomQuillEditor from '../component/CustomQuillEditor';

import {
    getCategoryNewsForManage, createCategoryNews, updateCategoryNews, deleteCategoryNews, searchCategoryNews, getCategoryNews
} from '../utils/categoryNewsApi';

import {
    getNewsForManage, createNews, updateNews, deleteNews, getNewsByName, getNewsByCategoryIdAdmin
} from '../utils/newsApi';

import { uploadImageToCloudinary, processRichTextContent } from '../utils/imageApi';

const { Title, Text } = Typography;
const { TextArea } = Input;

const resolveImageUrl = async (value, folder = "tnt_news") => {
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

// ═══════════════════════ TAB 1: DANH MỤC TIN TỨC ══════════════════════════
const TabCategoryNews = () => {
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
            const res = await getCategoryNewsForManage(page, limit);
            setData(res?.categoryNew ? res.categoryNew.map(d => ({ ...d, key: d._id })) : []);
            setTotalPages(res?.totalPages || 1);
            setCurrentPage(res?.currentPage || 1);
        } catch { message.error('Lấy dữ liệu danh mục thất bại!'); }
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
            const res = await searchCategoryNews(value.trim(), page, limit);
            setData(res?.categoryNew ? res.categoryNew.map(d => ({ ...d, key: d._id })) : []);
            setTotalPages(res?.totalPages || 1);
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
                slug: record.slug,
                status: record.status || 'active',
            });
        } else {
            form.setFieldsValue({ status: 'active' });
        }
        setModalVisible(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();
            if (editing) {
                await updateCategoryNews(editing._id, values);
                message.success('Cập nhật thành công!');
            } else {
                await createCategoryNews(values);
                message.success('Thêm mới thành công!');
            }
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
            await deleteCategoryNews(id);
            message.success('Xóa thành công!');
            setSearchText('');
            fetchData(currentPage, pageSize);
        } catch { message.error('Xóa thất bại!'); }
    };

    const columns = [
        { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
        { title: 'Slug', dataIndex: 'slug', key: 'slug' },
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
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Danh mục Tin tức</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm danh mục</Button>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm danh mục theo tên..."
                    allowClear
                    onSearch={(val) => { setCurrentPage(1); handleSearch(val, 1, pageSize); }}
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
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalPages * pageSize,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                        if (searchText) {
                            handleSearch(searchText, page, size);
                        }
                    }
                }}
            />

            <Modal title={editing ? "Sửa danh mục" : "Thêm mới danh mục"} open={modalVisible}
                onOk={handleSave} onCancel={() => setModalVisible(false)} destroyOnClose
                okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }} cancelText="Hủy">
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <Input onChange={(e) => {
                            if (!editing && form.getFieldValue('name')) {
                                const slug = slugify(e.target.value, {
                                    lower: true,
                                    strict: true,
                                    locale: "vi",
                                });
                                form.setFieldsValue({ slug });
                            }
                        }} />
                    </Form.Item>
                    <Form.Item name="slug" label="Slug" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái">
                        <Select>
                            <Select.Option value="active">Hoạt động</Select.Option>
                            <Select.Option value="inactive">Dừng hoạt động</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

// ═══════════════════════ TAB 2: TIN TỨC ══════════════════════════
const TabNews = () => {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [filterCategory, setFilterCategory] = useState(null);
    const [form] = Form.useForm();
    const currentCategoryId = Form.useWatch('categoryNewsId', form);

    const getFolder = React.useMemo(() => {
        const cate = categories.find(c => c._id === currentCategoryId);
        return cate ? `tnt_news/${cate.slug}` : "tnt_news";
    }, [currentCategoryId, categories]);


    const fetchData = async (page = 1, limit = 5, name = searchText, categoryNewsId = filterCategory) => {
        setLoading(true);
        try {
            const [newsRes, catRes] = await Promise.all([
                getNewsForManage({ page, limit, name, categoryNewsId }),
                getCategoryNewsForManage()
            ]);
            setData(newsRes?.news ? newsRes.news.map(d => ({ ...d, key: d._id })) : []);
            setTotalPages(newsRes?.totalPages || 1);
            setCurrentPage(newsRes?.currentPage || 1);
            setCategories(Array.isArray(catRes) ? catRes : (catRes?.categoryNew || []));
        } catch { message.error('Lấy dữ liệu thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(currentPage, pageSize); }, [currentPage, pageSize]);

    const handleSearch = (value) => {
        const trimmedValue = value?.trim() || "";
        setSearchText(trimmedValue);
        setCurrentPage(1);
        fetchData(1, pageSize, trimmedValue, filterCategory);
    };

    const handleFilterCategory = (categoryId) => {
        setFilterCategory(categoryId);
        setCurrentPage(1);
        fetchData(1, pageSize, searchText, categoryId);
    };

    const openModal = (record = null) => {
        setEditing(record);
        form.resetFields();
        setModalVisible(true);
        setTimeout(() => {
            if (record) {
                form.setFieldsValue({
                    name: record.name,
                    title: record.title,
                    description: record.description,
                    categoryNewsId: record.categoryNewsId?._id || record.categoryNewsId,
                    slug: record.slug,
                    status: record.status || 'active',
                    date: record.date ? dayjs(record.date) : null,
                    images: record.image ? [record.image] : [],
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
            const cate = categories.find(c => c._id === values.categoryNewsId);
            const folder = cate ? `tnt_news/${cate.slug}` : "tnt_news";


            const imageItems = Array.isArray(values.images) ? values.images : [];
            const imageUrls = await Promise.all(imageItems.map(value => resolveImageUrl(value, folder)));

            const processedDescription = await processRichTextContent(values.description, folder);

            const payload = {
                ...values,
                description: processedDescription,
                date: values.date ? values.date.toISOString() : null,
                image: imageUrls.length > 0 ? imageUrls[0] : ""
            };

            delete payload.images;

            if (editing) {
                await updateNews(editing._id, payload);
                message.success('Cập nhật thành công!');
            } else {
                await createNews(payload);
                message.success('Thêm mới thành công!');
            }
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
            await deleteNews(id);
            message.success('Xóa thành công!');
            setSearchText('');
            setFilterCategory(null);
            fetchData(currentPage, pageSize);
        } catch { message.error('Xóa thất bại!'); }
    };

    const columns = [
        { title: 'Tên bài viết', dataIndex: 'name', key: 'name', width: '30%' },
        {
            title: 'Danh mục', dataIndex: 'categoryNewsId', key: 'categoryNewsId',
            render: (cat) => {
                if (!cat) return <Text>---</Text>;
                const category = typeof cat === 'object' ? cat : categories.find(c => c._id === cat);
                return <Text>{category?.name || '---'}</Text>;
            }
        },
        {
            title: 'Ngày đăng', dataIndex: 'date', key: 'date',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '---'
        },
        {
            title: 'Ảnh', dataIndex: 'image', key: 'image',
            render: (img) => img ? (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Image src={img} height={58} width={68} style={{ borderRadius: 4, objectFit: 'cover' }} />
                </div>
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
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Danh sách Tin tức</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm Tin tức</Button>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm tin tức theo tên..."
                    allowClear
                    onSearch={(val) => { setCurrentPage(1); handleSearch(val, 1, pageSize); }}
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Select
                    placeholder="Lọc theo danh mục"
                    allowClear
                    onChange={(val) => { setCurrentPage(1); handleFilterCategory(val, 1, pageSize); }}
                    style={{ width: 250 }}
                    value={filterCategory}
                >
                    {categories.map(c => (
                        <Select.Option key={c._id} value={c._id}>{c.name} {c.status !== "active" ? "(Tạm dừng)" : ""}  </Select.Option>
                    ))}
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
                    }
                }}
            />

            <Modal title={editing ? "Sửa Tin tức" : "Thêm mới Tin tức"} open={modalVisible}
                onOk={handleSave} onCancel={() => setModalVisible(false)} destroyOnClose
                okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }} cancelText="Hủy" width={850}>
                <Form form={form} layout="vertical">
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item name="name" label="Tên bài viết" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]} style={{ flex: 1 }}>
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

                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item name="categoryNewsId" label="Danh mục" rules={[{ required: true, message: 'Bắt buộc!' }]} style={{ flex: 1 }}>
                            <Select placeholder="Chọn danh mục">
                                {categories.map(c => <Select.Option key={c._id} value={c._id} disabled={c.status === "inactive"}>{c.name} </Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="date" label="Ngày đăng" rules={[{ required: true, message: 'Bắt buộc!' }]} style={{ flex: 1 }}>
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

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng không để trống!' }]}
                    >
                        <CustomQuillEditor folder="tnt_news" style={{ height: '250px', marginBottom: '50px' }} />
                    </Form.Item>

                    <Form.Item name="images" label="Hình ảnh">
                        <MultiCloudinaryUpload maxCount={1} />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};


// ═══════════════════════ ROOT COMPONENT ══════════════════════════
const AdminNews = () => {
    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />
            <main className="admin-main" style={{ padding: '24px 32px' }}>
                <Title level={2} style={{ color: '#1A237E', marginBottom: 24 }}>Quản lý Tin tức</Title>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minHeight: '80vh' }}>
                    <Tabs
                        defaultActiveKey="1"
                        size="large"
                        type="card"
                        items={[
                            {
                                key: '1',
                                label: 'Tin tức',
                                children: <TabNews />,
                            },
                            {
                                key: '2',
                                label: 'Danh mục',
                                children: <TabCategoryNews />,
                            }
                        ]}
                    />
                </div>
            </main>
        </div>
    );
};

export default AdminNews;
