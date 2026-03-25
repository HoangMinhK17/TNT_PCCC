import React, { useEffect, useState } from 'react';
import slugify from "slugify";
import {
    Tabs, Table, Button, Modal, Form, Input, Space,
    Popconfirm, message, Typography, Upload, Image, Tag, Select
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';

import {
    createCategoryProduct, updateCategoryProduct, deleteCategoryProduct,
    getCategoryProductForManage
} from '../utils/categoryProductApi';
import {
    createProduct, updateProduct, deleteProduct, getProductForManage,
    getProductByCategoryIdForManage, getProductByNameForManage
} from '../utils/productApi';
import { uploadImageToCloudinary } from '../utils/imageApi';

const { Title, Text } = Typography;
const { TextArea } = Input;

const resolveImageUrl = async (value, folder = "tnt_product") => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return await uploadImageToCloudinary(value, folder);
};

const MultiCloudinaryUpload = ({ value = [], onChange, maxCount = 5 }) => {
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

// ═══════════════════════ TAB 1: DANH MỤC SẢN PHẨM ══════════════════════════
const TabCategoryProduct = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getCategoryProductForManage();
            setData(res.map(d => ({ ...d, key: d._id })));
        } catch { message.error('Lấy dữ liệu danh mục thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

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
                await updateCategoryProduct(editing._id, values);
                message.success('Cập nhật thành công!');
            } else {
                await createCategoryProduct(values);
                message.success('Thêm mới thành công!');
            }
            setModalVisible(false);
            fetchData();
            window.location.reload();
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra!');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCategoryProduct(id);
            message.success('Xóa thành công!');
            fetchData();
            window.location.reload();
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
                <Title level={4} style={{ margin: 0 }}>Danh mục Sản phẩm</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm danh mục</Button>
            </div>
            <Table columns={columns} dataSource={data} loading={loading} bordered pagination={{ pageSize: 5 }} />

            <Modal title={editing ? "Sửa danh mục" : "Thêm mới danh mục"} open={modalVisible}
                onOk={handleSave} onCancel={() => setModalVisible(false)}
                okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }} cancelText="Hủy">
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <Input onChange={(e) => {
                            if (!editing && form.getFieldValue('name')) {
                                const value = e.target.value;

                                const slug = slugify(value, {
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

// ═══════════════════════ TAB 2: SẢN PHẨM ══════════════════════════
const TabProduct = () => {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterCategory, setFilterCategory] = useState(null);
    const [form] = Form.useForm();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const fetchData = async (page = 1, limit = 5, name = searchText, categoryId = filterCategory) => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                getProductForManage({ page, limit, name, categoryId }),
                getCategoryProductForManage()
            ]);
            setData(prodRes.products.map(d => ({ ...d, key: d._id })));
            setTotalPages(prodRes.totalPages || 1);
            setCurrentPage(prodRes.currentPage || 1);
            setCategories(catRes);
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
        if (record) {
            form.setFieldsValue({
                name: record.name,
                title: record.title,
                description: record.description,
                categoryId: record.categoryId?._id || record.categoryId,
                slug: record.slug,
                status: record.status || 'active',
                technical: record.technical?.length > 0 ? record.technical : [{}],
                images: record.image || [],
            });
        } else {
            form.setFieldsValue({ status: 'active', technical: [{}] });
        }
        setModalVisible(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();
            const cate = categories.find(c => c._id === values.categoryId);
            const folder = cate ? `tnt_product/${cate.slug}` : "tnt_product";

            const imageItems = Array.isArray(values.images) ? values.images : [];
            const imageUrls = await Promise.all(imageItems.map(value => resolveImageUrl(value, folder)));

            const payload = {
                ...values,
                image: imageUrls.filter(Boolean)
            };

            delete payload.images;

            if (editing) {
                await updateProduct(editing._id, payload);
                message.success('Cập nhật thành công!');
            } else {
                await createProduct(payload);
                message.success('Thêm mới thành công!');
            }
            setModalVisible(false);
            setSearchText('');
            setFilterCategory(null);
            fetchData();
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra!');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);
            message.success('Xóa thành công!');
            setSearchText('');
            setFilterCategory(null);
            fetchData();
        } catch { message.error('Xóa thất bại!'); }
    };

    const columns = [
        { title: 'Tên sản phẩm ', dataIndex: 'name', key: 'name', width: '20%' },
        {
            title: 'Danh mục', dataIndex: 'categoryId', key: 'categoryId',
            render: (cat) => <Text>{cat?.name || '---'}</Text>
        },
        {
            title: 'Ảnh', dataIndex: 'image', key: 'image',
            render: (imgs) => Array.isArray(imgs) && imgs.length > 0 ? (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {imgs.slice(0, 3).map((img, index) => (
                        <Image key={index} src={img} height={40} width={40} style={{ borderRadius: 4, objectFit: 'cover' }} />
                    ))}
                    {imgs.length > 3 && <Tag>+{imgs.length - 3}</Tag>}
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
                <Title level={4} style={{ margin: 0 }}>Danh sách Sản phẩm</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm Sản phẩm</Button>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm sản phẩm theo tên..."
                    allowClear
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Select
                    placeholder="Lọc theo danh mục"
                    allowClear
                    onChange={handleFilterCategory}
                    style={{ width: 250 }}
                    value={filterCategory}
                >
                    {categories.map(c => (
                        <Select.Option key={c._id} value={c._id}>{c.name} {c.status !== 'active' ? '(Tạm dừng)' : ''}</Select.Option>
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

            <Modal title={editing ? "Sửa Sản phẩm" : "Thêm mới Sản phẩm"} open={modalVisible}
                onOk={handleSave} onCancel={() => setModalVisible(false)}
                okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }} cancelText="Hủy" width={850}>
                <Form form={form} layout="vertical">
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]} style={{ flex: 1 }}>
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
                        <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: 'Bắt buộc!' }]} style={{ flex: 1 }}>
                            <Select placeholder="Chọn danh mục">
                                {categories.map(c => <Select.Option key={c._id} value={c._id} disabled={c.status !== 'active'}>{c.name}</Select.Option>)}
                            </Select>
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

                    <Form.Item name="description" label="Mô tả chi tiết" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item name="images" label="Hình ảnh (Tối đa 5 ảnh)">
                        <MultiCloudinaryUpload maxCount={5} />
                    </Form.Item>

                    <Title level={5}>Thông số kỹ thuật</Title>
                    <Form.List name="technical">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'title']}
                                            rules={[{ required: true, whitespace: true, message: 'Nhập tiêu đề' }]}
                                        >
                                            <Input placeholder="Tên thông số (Vd: Khối lượng)" style={{ width: 250 }} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'description']}
                                            rules={[{ required: true, whitespace: true, message: 'Nhập giá trị' }]}
                                        >
                                            <Input placeholder="Giá trị (Vd: 3kg)" style={{ width: 350 }} />
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                            <DeleteOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                                        ) : null}
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm thông số kỹ thuật
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                </Form>
            </Modal>
        </div>
    );
};


// ═══════════════════════ ROOT COMPONENT ══════════════════════════
const AdminProduct = () => {
    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />
            <main className="admin-main" style={{ padding: '24px 32px' }}>
                <Title level={2} style={{ color: '#1A237E', marginBottom: 24 }}>Quản lý Sản phẩm</Title>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minHeight: '80vh' }}>
                    <Tabs
                        defaultActiveKey="1"
                        size="large"
                        type="card"
                        items={[
                            {
                                key: '1',
                                label: 'Sản phẩm',
                                children: <TabProduct />,
                            },
                            {
                                key: '2',
                                label: 'Danh mục',
                                children: <TabCategoryProduct />,
                            }
                        ]}
                    />
                </div>
            </main>
        </div>
    );
};

export default AdminProduct;
