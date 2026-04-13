import React, { useEffect, useState } from 'react';
import {
    Tabs, Table, Button, Modal, Form, Input, Space,
    Popconfirm, message, Typography, Upload, Image, Spin, Tag, Select
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    UploadOutlined, LoadingOutlined
} from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';
import {
    getAllIntroduction,
    updateIntroductionCompany,
    getMissionVision,
    updateMissionVision,
    getCoreValues,
    addCoreValues,
    deleteCoreValues,
    updateCoreValues,

} from '../utils/introductApi';
import { uploadImageToCloudinary } from '../utils/imageApi';
import {
    getAllLeadersForManagement,
    createLeader,
    updateLeader,
    deleteLeader,
    findLeaderByName
} from '../utils/leaderApi';

const { Title, Text } = Typography;
const { TextArea } = Input;
// ───────────── HELPER: upload file lên Cloudinary khi cần ───────────
// Nhận value là string URL hoặc File object.
// Nếu là File → upload lên Cloudinary và trả về URL.
// Nếu là string → trả về ngay.
const resolveImageUrl = async (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return await uploadImageToCloudinary(value, "tnt_introduct");
};

// ───────────── UPLOAD COMPONENT (defer – không upload ngay) ──────────
// value: string URL (ảnh cũ) hoặc File object (ảnh mới chưa upload)
// onChange: hàm antd Form truyền vào để cập nhật giá trị form
const CloudinaryUpload = ({ value, onChange }) => {
    // Tạo preview URL cục bộ nếu value là File 
    const previewSrc = value instanceof File
        ? URL.createObjectURL(value)
        : (typeof value === 'string' ? value : null);

    const beforeUpload = (file) => {
        onChange(file);
        return false;
    };

    const handleClearFile = () => onChange('');

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
                <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
                    <Button icon={<UploadOutlined />}>
                        {value instanceof File ? '✓ Đã chọn: ' + value.name : 'Chọn ảnh'}
                    </Button>
                </Upload>
                {value instanceof File && (
                    <Button size="small" danger onClick={handleClearFile}>Bỏ chọn</Button>
                )}
            </Space>
            {previewSrc && (
                <Image src={previewSrc} height={80} style={{ borderRadius: 6, objectFit: 'cover' }} />
            )}
            <Input
                placeholder="Hoặc nhập URL ảnh trực tiếp..."
                value={typeof value === 'string' ? value : ''}
                onChange={e => onChange(e.target.value)}
                size="small"
            />
        </Space>
    );
};


const MultiCloudinaryUpload = ({ value = [], onChange, maxCount = 2 }) => {
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
        const next = items.filter((_, i) => i !== idx);
        onChange(next);
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {items.length < maxCount && (
                <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
                    <Button icon={<UploadOutlined />}>
                        Chọn ảnh ({items.length}/{maxCount})
                    </Button>
                </Upload>
            )}
            <Space wrap>
                {items.map((item, idx) => {
                    const src = item instanceof File ? URL.createObjectURL(item) : item;
                    return (
                        <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                            <Image src={src} height={80} width={120}
                                style={{ objectFit: 'cover', borderRadius: 6 }} />
                            <Button
                                size="small" danger
                                style={{ position: 'absolute', top: 2, right: 2, padding: '0 4px', minWidth: 'auto' }}
                                onClick={() => removeItem(idx)}
                            >✕</Button>
                        </div>
                    );
                })}
            </Space>
        </Space>
    );
};
const TabIntroduct = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllIntroduction();
            setData(res.map(d => ({ ...d, key: d._id })));
        } catch { message.error('Lấy dữ liệu thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openModal = (record = null) => {
        setEditing(record);
        form.resetFields();
        if (record) {
            form.setFieldsValue({
                name: record.name,
                name_en: record.name_en,
                'title.titleName': record.title?.titleName,
                'title.titleName_en': record.title?.titleName_en,
                'title.titleIcon': record.title?.titleIcon || '',
                'description.descriptionName': record.description?.descriptionName,
                'description.descriptionName_en': record.description?.descriptionName_en,
                'description.descriptionIcon': record.description?.descriptionIcon || '',
                images: record.image || [],
            });
        }
        setModalVisible(true);
    };

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();

            const titleIconUrl = await resolveImageUrl(values['title.titleIcon']);
            const descIconUrl = await resolveImageUrl(values['description.descriptionIcon']);

            const imageItems = Array.isArray(values.images) ? values.images : [];
            const imageUrls = await Promise.all(imageItems.map(resolveImageUrl));

            const payload = {
                name: values.name,
                name_en: values.name_en,
                title: { titleName: values['title.titleName'], titleName_en: values['title.titleName_en'], titleIcon: titleIconUrl },
                description: { descriptionName: values['description.descriptionName'], descriptionName_en: values['description.descriptionName_en'], descriptionIcon: descIconUrl },
                image: imageUrls.filter(Boolean),
            };
            await updateIntroductionCompany(editing._id, payload);
            message.success('Cập nhật thành công!');
            setModalVisible(false);
            fetchData();
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra!');
        } finally { setSaving(false); }
    };



    const columns = [
        { title: 'Tên công ty', dataIndex: 'name', key: 'name' },
        {
            title: 'Tiêu đề', width: '30%',
            key: 'title',
            render: (_, r) => <Text>{r.title?.titleName}</Text>,
        },

        {
            title: 'Icon',
            key: 'icon',
            render: (_, r) => (
                <Space>
                    {r.title?.titleIcon && (
                        <img src={r.title.titleIcon} alt="Title Icon" width={40} height={40} />
                    )}
                    {r.description?.descriptionIcon && (
                        <img src={r.description.descriptionIcon} alt="Desc Icon" width={40} height={40} />
                    )}
                </Space>
            ),

        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (imgs) =>
                Array.isArray(imgs) && imgs.length > 0 ? (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {imgs.map((img, index) => (
                            <Image
                                key={index}
                                src={img}
                                height={58}
                                width={58}
                                style={{ borderRadius: 4, objectFit: 'cover' }}
                            />
                        ))}
                    </div>
                ) : (
                    <Tag>Chưa có ảnh</Tag>
                ),
            width: '15%',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}> Giới thiệu</Title>
            </div>
            <Table columns={columns} dataSource={data} loading={loading} bordered pagination={{ pageSize: 5 }} />

            <Modal title="Chỉnh sửa Giới thiệu" open={modalVisible}
                onOk={handleSave} onCancel={() => setModalVisible(false)}
                okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }}
                cancelText="Hủy" width={750}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên công ty" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name_en" label="Tên công ty (Tiếng Anh)">
                        <Input />
                    </Form.Item>
                    <Form.Item name="title.titleName" label="Tiêu đề" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="title.titleName_en" label="Tiêu đề (Tiếng Anh)">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="title.titleIcon" label="Icon tiêu đề (upload ảnh)">
                        <CloudinaryUpload />
                    </Form.Item>
                    <Form.Item name="description.descriptionName" label="Mô tả" rules={[{ whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="description.descriptionName_en" label="Mô tả (Tiếng Anh)">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="description.descriptionIcon" label="Icon mô tả (upload ảnh)">
                        <CloudinaryUpload />
                    </Form.Item>
                    <Form.Item
                        name="images"
                        label="Ảnh đại diện (tối đa 2 ảnh)"
                    >
                        <MultiCloudinaryUpload maxCount={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

// ═══════════════════════ TAB 2: SỨ MỆNH - TẦM NHÌN ══════════════════
const TabMissionVision = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [editType, setEditType] = useState('mission');
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getMissionVision();
            setData(res.map(d => ({ ...d, key: d._id })));
        } catch { message.error('Lấy dữ liệu thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openModal = (record, type) => {
        setEditing(record);
        setEditType(type);
        const src = type === 'mission' ? record.mission : record.vision;
        form.resetFields();
        form.setFieldsValue({ title: src?.title, title_en: src?.title_en, description: src?.description, description_en: src?.description_en, image: src?.image || '' });
        setModalVisible(true);
    };

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();
            const imageUrl = await resolveImageUrl(values.image);
            const payload = {
                [editType]: { title: values.title, title_en: values.title_en, description: values.description, description_en: values.description_en, image: imageUrl }
            };
            await updateMissionVision(editing._id, payload);
            message.success('Cập nhật thành công!');
            setModalVisible(false);
            fetchData();
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra!');
        } finally { setSaving(false); }
    };

    const flatData = data.flatMap(doc => [
        { key: `${doc._id}_mission`, docId: doc._id, type: 'mission', ...(doc.mission || {}) },
        { key: `${doc._id}_vision`, docId: doc._id, type: 'vision', ...(doc.vision || {}) },
    ]);

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '38%',
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (img) => img
                ? <Image src={img} height={48} style={{ borderRadius: 4, objectFit: 'cover' }} />
                : <Tag>Chưa có</Tag>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, row) => {
                const record = data.find(d => d._id === row.docId);
                return (
                    <Button type="primary" ghost size="small" icon={<EditOutlined />}
                        onClick={() => openModal(record, row.type)}>
                        Sửa
                    </Button>
                );
            },
        },
    ];

    return (
        <div>
            <Title level={4} style={{ marginBottom: 16 }}>Sứ mệnh & Tầm nhìn</Title>
            <Table columns={columns} dataSource={flatData} loading={loading} bordered pagination={{ pageSize: 6 }} />

            <Modal
                title={`Chỉnh sửa ${editType === 'mission' ? 'Sứ mệnh' : 'Tầm nhìn'}`}
                open={modalVisible} onOk={handleSave}
                onCancel={() => setModalVisible(false)} okText="Lưu" cancelText="Hủy" width={650}>
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="title_en" label="Tiêu đề (Tiếng Anh)">
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="description_en" label="Mô tả (Tiếng Anh)">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="image" label="Ảnh đại diện">
                        <CloudinaryUpload />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

// ═══════════════════════ TAB 3: THÀNH TỰ ═════════════════════
const TabCoreValues = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [parentId, setParentId] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getCoreValues();
            const flattened = [];
            res.forEach(doc => {
                (doc.coreValues || []).forEach(cv => {
                    flattened.push({ ...cv, key: cv._id, parentId: doc._id });
                });
            });
            setData(flattened);
            if (res.length > 0) setParentId(res[0]._id);
        } catch { message.error('Lấy dữ liệu thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openModal = (record = null) => {
        setEditing(record);
        form.resetFields();
        if (record) {
            form.setFieldsValue({ title: record.title, title_en: record.title_en, description: record.description, description_en: record.description_en, image: record.image || '', date: record.date });
        }
        setModalVisible(true);
    };

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();
            const imageUrl = await resolveImageUrl(values.image);
            const payload = { title: values.title, title_en: values.title_en, description: values.description, description_en: values.description_en, image: imageUrl || '', date: values.date || 0 };
            if (editing) {
                await updateCoreValues(editing.key, payload);
                message.success('Cập nhật thành công!');
            } else {
                if (!parentId) return message.error('Không tìm thấy document cha!');
                await addCoreValues({ ...payload, parentId });
                message.success('Thêm mới thành công!');
            }
            setModalVisible(false);
            fetchData();
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra!');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCoreValues(id);
            message.success('Xóa thành công!');
            fetchData();
        } catch { message.error('Xóa thất bại!'); }
    };

    const columns = [
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },

        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (img) => img ? <Image src={img} height={68} width={68} style={{ borderRadius: 4, objectFit: 'cover' }} /> : <Tag>Chưa có</Tag>,
        },
        { title: 'Năm', dataIndex: 'date', key: 'date' },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
                    <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.key)} okText="Xóa" cancelText="Hủy">
                        <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Danh sách thành tựu</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}
                >
                    Thêm mới
                </Button>
            </div>
            <Table columns={columns} dataSource={data} loading={loading} bordered pagination={{ pageSize: 6 }} />

            <Modal title={editing ? 'Chỉnh sửa Thành tựu' : 'Thêm mới Thành tựu'}
                open={modalVisible} onOk={handleSave}
                onCancel={() => setModalVisible(false)} okText="Lưu" cancelText="Hủy" width={650}>
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="title_en" label="Tiêu đề (Tiếng Anh)">
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="description_en" label="Mô tả (Tiếng Anh)">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="date" label="Năm (số)" rules={[{ required: true, message: 'Bắt buộc!' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="image" label="Ảnh">
                        <CloudinaryUpload />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

// ═══════════════════════ TAB 4: LÃNH ĐẠO ═════════════════════
const TabLeaders = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

    const fetchData = async (page = 1, limit = 5, search = '') => {
        setLoading(true);
        try {
            let res;
            if (search) {
                res = await findLeaderByName(search, page, limit);
            } else {
                res = await getAllLeadersForManagement(page, limit);
            }
            setData((res.leaders || []).map(d => ({ ...d, key: d._id })));
            setPagination({ current: res.currentPage, pageSize: limit, total: res.totalPages * limit });
        } catch { message.error('Lấy dữ liệu thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(pagination.current, pagination.pageSize, searchText); }, []);

    const handleSearch = (value) => {
        setSearchText(value);
        fetchData(1, pagination.pageSize, value);
    };

    const openModal = (record = null) => {
        setEditing(record);
        form.resetFields();
        if (record) {
            form.setFieldsValue({
                name: record.name,
                name_en: record.name_en,
                position: record.position,
                position_en: record.position_en,
                description: record.description,
                description_en: record.description_en,
                image: record.image || '',
                status: record.status || 'active'
            });
        }
        setModalVisible(true);
    };

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();
            const imageUrl = await resolveImageUrl(values.image);
            const payload = {
                name: values.name,
                name_en: values.name_en,
                position: values.position,
                position_en: values.position_en,
                description: values.description,
                description_en: values.description_en,
                image: imageUrl || '',
                status: values.status || 'active'
            };
            if (editing) {
                await updateLeader(editing.key, payload);
                message.success('Cập nhật thành công!');
            } else {
                await createLeader(payload);
                message.success('Thêm mới thành công!');
            }
            setModalVisible(false);
            fetchData(pagination.current, pagination.pageSize, searchText);
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra!');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteLeader(id);
            message.success('Xóa thành công!');
            fetchData(pagination.current, pagination.pageSize, searchText);
        } catch { message.error('Xóa thất bại!'); }
    };

    const handleTableChange = (pag) => {
        fetchData(pag.current, pag.pageSize, searchText);
    };

    const columns = [
        { title: 'Họ tên', dataIndex: 'name', key: 'name', width: '15%' },
        { title: 'Chức vụ', dataIndex: 'position', key: 'position' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (img) => img ? <Image src={img} height={68} width={68} style={{ borderRadius: 4, objectFit: 'cover' }} /> : <Tag>Chưa có</Tag>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status === 'active' ? 'Hoạt động' : 'Tạm ẩn'}</Tag>
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
                    <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.key)} okText="Xóa" cancelText="Hủy">
                        <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Danh sách lãnh đạo</Title>

                <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}
                    >
                        Thêm mới
                    </Button>
                </Space>

            </div>
            <Input.Search
                placeholder="Tìm kiếm theo tên..."
                onSearch={handleSearch}
                style={{ width: 250, marginBottom: 16 }}
                allowClear
            />
            <Table columns={columns} dataSource={data} loading={loading} bordered pagination={pagination} onChange={handleTableChange} />

            <Modal title={editing ? 'Chỉnh sửa Lãnh đạo' : 'Thêm mới Lãnh đạo'}
                open={modalVisible} onOk={handleSave}
                onCancel={() => setModalVisible(false)} okText="Lưu" cancelText="Hủy" width={650}>
                <Form form={form} layout="vertical" initialValues={{ status: 'active' }}>
                    <Form.Item name="name" label="Họ và tên" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name_en" label="Họ và tên (English)" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="position" label="Chức vụ" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="position_en" label="Chức vụ (English)" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="description_en" label="Mô tả (English)" >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="image" label="Ảnh chân dung (Bắt buộc)" rules={[{ required: true, message: 'Thiếu ảnh chân dung!' }]}>
                        <CloudinaryUpload />
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái">
                        <Select options={[{ value: 'active', label: 'Hoạt động' }, { value: 'inactive', label: 'Tạm ẩn' }]} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

// ═══════════════════════ MAIN COMPONENT ═══════════════════════════════
const AdminIntroduction = () => {
    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />
            <main className="admin-main" style={{ padding: '24px 32px' }}>
                <Title level={2} style={{ color: '#1A237E', marginBottom: 24 }}>Quản lý Giới thiệu</Title>

                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <Tabs
                        defaultActiveKey="introduct"
                        size="large"
                        type="card"
                        items={[
                            {
                                key: 'introduct',
                                label: 'Giới thiệu công ty',
                                children: <TabIntroduct />,
                            },
                            {
                                key: 'mission',
                                label: 'Sứ mệnh & Tầm nhìn',
                                children: <TabMissionVision />,
                            },
                            {
                                key: 'corevalues',
                                label: 'Thành tựu',
                                children: <TabCoreValues />,
                            },
                            {
                                key: 'leaders',
                                label: 'Lãnh đạo',
                                children: <TabLeaders />,
                            }
                        ]}
                    />
                </div>
            </main>
        </div>
    );
};

export default AdminIntroduction;
