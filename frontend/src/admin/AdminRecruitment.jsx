import React, { useEffect, useState } from 'react';
import slugify from 'slugify';
import {
    Tabs, Table, Button, Modal, Form, Input, Space,
    Popconfirm, message, Typography, Tag, Select, InputNumber, Upload, Image, Descriptions
} from 'antd';
import { EyeOutlined, PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';
import dayjs from 'dayjs';

import {
    getRecruitmentForManage, createRecruitment, updateRecruitment, deleteRecruitment, getRecruimentsByName
} from '../utils/recruitmentApi';

import {
    getWhyChooseCompanyForManage, createWhyChooseCompany, updateWhyChooseCompany, deleteWhyChooseCompany
} from '../utils/whyChooseCompanyApi';
import {
    getContactRecruitment, getContactRecruitmentByNameOrPhone, getContactRecruitmentByStatus, updateContactRecruitment, deleteContactRecruitment
} from '../utils/contactRecruitmentApi';
import { uploadImageToCloudinary } from '../utils/imageApi';

const resolveImageUrl = async (value, folder = "tnt_company") => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return await uploadImageToCloudinary(value, folder);
};

const SingleCloudinaryUpload = ({ value, onChange }) => {
    const beforeUpload = (file) => {
        const isLt5M = file.size / 1024 / 1024 <= 5;
        if (!isLt5M) {
            message.error('Ảnh tải lên phải nhỏ hơn 5MB!');
            return Upload.LIST_IGNORE;
        }
        onChange(file);
        return false;
    };

    const src = value && typeof value === 'object' ? URL.createObjectURL(value) : value;

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {!value && (
                <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
                    <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
            )}
            {value && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Image src={src} height={60} width={60} style={{ objectFit: 'contain', borderRadius: 4, backgroundColor: '#f0f2f5', padding: 4 }} />
                    <Button size="small" danger
                        style={{ position: 'absolute', top: -8, right: -8, padding: '0 4px', minWidth: 'auto', borderRadius: '50%' }}
                        onClick={() => onChange(null)}>✕</Button>
                </div>
            )}
        </Space>
    );
};

const { Title, Text } = Typography;
const { TextArea } = Input;

// ═══════════════════════ TAB 1: TUYỂN DỤNG ══════════════════════════
const TabRecruitment = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 6, total: 0 });

    const fetchData = async (page = pagination.current, limit = pagination.pageSize, search = searchText) => {
        setLoading(true);
        try {
            let res;
            if (search && search.trim()) {
                res = await getRecruimentsByName(search.trim(), page, limit);
            } else {
                res = await getRecruitmentForManage(page, limit);
            }
            const dataToSet = res.recruiments ? res.recruiments : (res.recruitments ? res.recruitments : res);
            if (Array.isArray(dataToSet)) {
                setData(dataToSet.map(d => ({ ...d, key: d._id })));
            } else {
                setData([]);
            }
            setPagination({ current: res.currentPage || page, pageSize: limit, total: res.totalRecruiments || res.total || 0 });
        } catch { message.error('Lấy dữ liệu tuyển dụng thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleTableChange = (pag) => {
        fetchData(pag.current, pag.pageSize, searchText);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value || !value.trim()) {
            fetchData(1, pagination.pageSize, '');
        } else {
            fetchData(1, pagination.pageSize, value.trim());
        }
    };

    const openModal = (record = null) => {
        setEditing(record);
        form.resetFields();
        if (record) {
            form.setFieldsValue({
                ...record,
                status: record.status || 'active',
                requirements: record.requirements?.length > 0 ? record.requirements : [''],
            });
        } else {
            form.setFieldsValue({ status: 'active', requirements: [''] });
        }
        setModalVisible(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();

            if (values.requirements) {
                values.requirements = values.requirements.filter(req => req && req.trim() !== '');
            }

            if (editing) {
                await updateRecruitment(editing._id, values);
                message.success('Cập nhật thành công!');
            } else {
                await createRecruitment(values);
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
            await deleteRecruitment(id);
            message.success('Xóa thành công!');
            const newPage = data.length === 1 && pagination.current > 1 ? pagination.current - 1 : pagination.current;
            fetchData(newPage, pagination.pageSize, searchText);
        } catch { message.error('Xóa thất bại!'); }
    };

    const columns = [
        { title: 'Tên công việc', dataIndex: 'name', key: 'name' },
        { title: 'Cấp bậc', dataIndex: 'level', key: 'level' },
        { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
        { title: 'Mức lương', dataIndex: 'salary', key: 'salary' },
        { title: 'Thời gian', dataIndex: 'time', key: 'time' },
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
                <Title level={4} style={{ margin: 0 }}>Danh sách Tuyển dụng</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm Tuyển dụng</Button>
            </div>

            <div style={{ marginBottom: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm công việc theo tên..."
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
                pagination={pagination}
                onChange={handleTableChange}
            />

            <Modal title={editing ? "Sửa Tuyển dụng" : "Thêm mới Tuyển dụng"} open={modalVisible}
                onOk={handleSave} onCancel={() => setModalVisible(false)}
                okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }} cancelText="Hủy" width={800}>
                <Form form={form} layout="vertical">
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item name="name" label="Tên công việc" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]} style={{ flex: 1 }}>
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
                        <Form.Item name="level" label="Cấp bậc (Level)" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]} style={{ flex: 1 }}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="location" label="Địa điểm" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]} style={{ flex: 1 }}>
                            <Input />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item name="salary" label="Mức lương" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]} style={{ flex: 1 }}>
                            <Input placeholder="Vd: Thỏa thuận, 10-15 triệu" />
                        </Form.Item>
                        <Form.Item name="time" label="Thời gian" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]} style={{ flex: 1 }}>
                            <Input placeholder="Vd: Full-time, Part-time" />
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái" style={{ flex: 1 }}>
                            <Select>
                                <Select.Option value="active">Hoạt động</Select.Option>
                                <Select.Option value="inactive">Dừng hoạt động</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Title level={5}>Yêu cầu công việc (Requirements)</Title>
                    <Form.List name="requirements">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        {...field}
                                        label={index === 0 ? '' : ''}
                                        required={false}
                                        key={field.key}
                                        style={{ marginBottom: 8 }}
                                    >
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Form.Item
                                                {...field}
                                                noStyle
                                                rules={[{ required: true, whitespace: true, message: 'Nhập nội dung yêu cầu hoặc xóa dòng trống' }]}
                                            >
                                                <Input style={{ flex: 1 }} />
                                            </Form.Item>
                                            {fields.length > 1 ? (
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(field.name)}
                                                    style={{ color: 'red', marginTop: 8 }}
                                                />
                                            ) : null}
                                        </div>
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm yêu cầu
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


// ═══════════════════════ TAB 2: TẠI SAO CHỌN CHÚNG TÔI ══════════════════════════
const TabWhyChooseCompany = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getWhyChooseCompanyForManage();
            const dataToSet = Array.isArray(res) ? res : [];
            setData(dataToSet.map(d => ({ ...d, key: d._id })));
        } catch { message.error('Lấy dữ liệu Why Choose Company thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openModal = (record = null) => {
        setEditing(record);
        form.resetFields();
        if (record) {
            form.setFieldsValue({
                title: record.whyChooseUs?.title,
                description: record.whyChooseUs?.description,
                status: record.status || 'active',
                benefits: record.benefits?.length > 0 ? record.benefits : [{}],
            });
        } else {
            form.setFieldsValue({ status: 'active', benefits: [{}] });
        }
        setModalVisible(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();

            const benefitsWithUpload = await Promise.all(
                (values.benefits || []).map(async (b) => {
                    const iconUrl = await resolveImageUrl(b.icon, "tnt_why_choose_us");
                    return { ...b, icon: iconUrl };
                })
            );

            const payload = {
                whyChooseUs: {
                    title: values.title.trim(),
                    description: values.description.trim()
                },
                benefits: benefitsWithUpload,
                status: values.status
            };

            if (editing) {
                await updateWhyChooseCompany(editing._id, payload);
                message.success('Cập nhật thành công!');
            } else {
                await createWhyChooseCompany(payload);
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
            await deleteWhyChooseCompany(id);
            message.success('Xóa thành công!');
            fetchData();
        } catch { message.error('Xóa thất bại!'); }
    };

    const columns = [
        {
            title: 'Tiêu đề chính',
            dataIndex: 'whyChooseUs',
            key: 'title',
            render: (whyChooseUs) => whyChooseUs?.title || '---'
        },
        {
            title: 'Số lượng Lợi ích',
            dataIndex: 'benefits',
            key: 'benefitsCount',
            render: (benefits) => <Tag color="blue">{benefits?.length || 0} Lợi ích</Tag>
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
                <Title level={4} style={{ margin: 0 }}>Danh sách - Tại sao chọn chúng tôi</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm mới</Button>
            </div>

            <Table columns={columns} dataSource={data} loading={loading} bordered pagination={{ pageSize: 5 }} />

            <Modal title={editing ? "Sửa bản ghi" : "Thêm mới bản ghi"} open={modalVisible}
                onOk={handleSave} onCancel={() => setModalVisible(false)}
                okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }} cancelText="Hủy" width={850}>
                <Form form={form} layout="vertical">

                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item name="title" label="Tiêu đề chính (Bỏ trống tiêu đề sẽ không hiển thị phần này)" style={{ flex: 2 }} >
                            <Input placeholder='Tiêu đề'/>
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái" style={{ flex: 1 }}>
                            <Select>
                                <Select.Option value="active">Hoạt động</Select.Option>
                                <Select.Option value="inactive">Dừng hoạt động</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item name="description" label="Mô tả chính" rules={[{ required: true, whitespace: true, message: 'Vui lòng không để trống!' }]}>
                        <TextArea rows={3} />
                    </Form.Item>

                    <Title level={5}>Lợi ích (Benefits)</Title>
                    <Form.List name="benefits">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 16, gap: 12, alignItems: 'center' }} align="center">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'title']}
                                            rules={[{ required: true, whitespace: true, message: 'Nhập tiêu đề' }]}
                                            style={{ flex: 1, minWidth: 150, marginBottom: 0 }}
                                        >
                                            <Input placeholder="Tiêu đề lợi ích" style={{ width: '100%' }} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'description']}
                                            rules={[{ required: true, whitespace: true, message: 'Nhập mô tả' }]}
                                            style={{ flex: 2, minWidth: 400, marginBottom: 0 }}
                                        >
                                            <Input placeholder="Mô tả lợi ích" style={{ width: '100%' }} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'icon']}
                                            rules={[{ required: true, message: 'Vui lòng tải ảnh lên' }]}
                                            style={{ flex: 'none', width: 90, marginBottom: 0, display: 'flex', justifyContent: 'center' }}
                                        >
                                            <SingleCloudinaryUpload />
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} style={{ marginLeft: 30 }} />
                                        ) : <div style={{ width: 32 }}></div>}
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm Lợi ích
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


// ═══════════════════════ TAB 3: QUẢN LÝ ỨNG VIÊN ══════════════════════════
const TabContactRecruitment = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 6, total: 0 });

    const fetchData = async (page = pagination.current, limit = pagination.pageSize, search = searchText, status = statusFilter) => {
        setLoading(true);
        try {
            let res;
            if (search && search.trim()) {
                res = await getContactRecruitmentByNameOrPhone(search.trim(), page, limit);
            } else if (status) {
                res = await getContactRecruitmentByStatus(status, page, limit);
            } else {
                res = await getContactRecruitment(page, limit);
            }
            const dataList = res.contactRecruitment || res.contactRecruitments || [];
            setData(dataList?.map(d => ({ ...d, key: d._id })));
            setPagination({ current: res.currentPage || page, pageSize: limit, total: res.total || 0 });
        } catch { message.error('Lấy dữ liệu ứng viên thất bại!'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleTableChange = (pag) => {
        fetchData(pag.current, pag.pageSize, searchText, statusFilter);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value) {
            fetchData(1, pagination.pageSize, '', statusFilter);
        } else {
            fetchData(1, pagination.pageSize, value, statusFilter);
        }
    };

    const handleFilterStatus = (value) => {
        const newStatus = value === undefined ? null : value;
        setStatusFilter(newStatus);
        fetchData(1, pagination.pageSize, searchText, newStatus);
    };

    const openEditModal = (record) => {
        setEditing(record);
        form.resetFields();
        form.setFieldsValue({
            status: record.status || 'pending',
            note: record.note || ''
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
            await updateContactRecruitment(editing._id, { ...editing, ...values });
            message.success('Cập nhật trạng thái thành công!');
            setModalVisible(false);
            fetchData(pagination.current, pagination.pageSize, searchText, statusFilter);
        } catch (err) {
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra!');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteContactRecruitment(id);
            message.success('Xóa ứng viên thành công!');
            fetchData(pagination.current, pagination.pageSize, searchText, statusFilter);
        } catch { message.error('Xóa thất bại!'); }
    };

    const columns = [
        { title: 'Tên Ứng viên', dataIndex: 'name', key: 'name' },
        { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Vị trí Ứng tuyển', dataIndex: 'recruitmentId', key: 'recruitmentId',
            render: (recruitment) => recruitment?.name || '---'
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (status) => {
                let color = 'blue';
                let text = 'Chờ xử lý';
                if (status === 'approved') { color = 'green'; text = 'Đã duyệt'; }
                if (status === 'rejected') { color = 'red'; text = 'Từ chối'; }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Ngày nộp', dataIndex: 'createdAt', key: 'createdAt',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Thao tác', key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="default" size="small" icon={<EyeOutlined />} onClick={() => openViewModal(record)}>Xem</Button>
                    <Button type="primary" size="small" ghost icon={<EditOutlined />} onClick={() => openEditModal(record)} disabled={record.status !== 'pending'}>Cập nhật</Button>
                    <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record._id)}>
                        <Button danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Danh sách Ứng viên</Title>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <Input.Search
                    placeholder="Tìm theo tên hoặc SĐT..."
                    allowClear
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Select
                    placeholder="Lọc theo trạng thái"
                    allowClear
                    style={{ width: 200 }}
                    value={statusFilter}
                    onChange={handleFilterStatus}
                >
                    <Select.Option value="pending">Chờ xử lý</Select.Option>
                    <Select.Option value="approved">Đã duyệt (Chấp nhận)</Select.Option>
                    <Select.Option value="rejected">Từ chối</Select.Option>
                </Select>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                bordered
                pagination={pagination}
                onChange={handleTableChange}
            />

            <Modal title="Cập nhật Ứng viên" open={modalVisible}
                onOk={handleSave} onCancel={() => setModalVisible(false)}
                okText={saving ? 'Đang lưu...' : 'Lưu'} okButtonProps={{ loading: saving }} cancelText="Hủy">
                <Form form={form} layout="vertical">
                    <p><b>Ứng viên:</b> {editing?.name}</p>
                    <p><b>Vị trí:</b> {editing?.recruitmentId?.name}</p>
                    <p style={{ marginBottom: 16 }}><b>CV:</b> <a href={editing?.cv} target="_blank" rel="noopener noreferrer">Mở CV</a></p>

                    <Form.Item name="status" label="Trạng thái">
                        <Select>
                            <Select.Option value="pending">Chờ xử lý</Select.Option>
                            <Select.Option value="approved">Đã duyệt (Chấp nhận)</Select.Option>
                            <Select.Option value="rejected">Từ chối</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="note" label="Ghi chú nội bộ">
                        <TextArea rows={3} placeholder="Ghi chú thêm về buổi phỏng vấn (nếu có)..." />
                    </Form.Item>
                </Form>
            </Modal>


            <Modal title="Chi tiết Ứng viên" open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)} footer={<Button onClick={() => setViewModalVisible(false)}>Đóng</Button>} width={700}>
                {currentRecord && (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Họ và tên">{currentRecord.name}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{currentRecord.phone}</Descriptions.Item>
                        <Descriptions.Item label="Email">{currentRecord.email}</Descriptions.Item>
                        <Descriptions.Item label="Vị trí ứng tuyển">{currentRecord.recruitmentId?.name}</Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ">{currentRecord.address}</Descriptions.Item>
                        <Descriptions.Item label="Ngày nộp">{dayjs(currentRecord.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                        <Descriptions.Item label="CV Đính kèm">
                            {currentRecord.cv ? (
                                <div>
                                    <a href={currentRecord.cv} target="_blank" rel="noopener noreferrer">
                                        Tải CV về máy
                                    </a>

                                    <div style={{ marginTop: 12, border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
                                        {currentRecord.cv.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                            <div style={{ textAlign: 'center', backgroundColor: '#f5f5f5', padding: '10px' }}>
                                                <Image src={currentRecord.cv} alt="CV" style={{ width: '100%', height: '500px', objectFit: 'contain' }} />
                                            </div>
                                        ) : (
                                            <iframe
                                                src={currentRecord.cv.endsWith('.pdf') ? currentRecord.cv : `https://docs.google.com/gview?url=${encodeURIComponent(currentRecord.cv)}&embedded=true`}
                                                title="CV Viewer"
                                                width="100%"
                                                height="400px"
                                                style={{ border: 'none' }}
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <span>Không có CV</span>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {currentRecord.status === 'approved' ? <Tag color="green">Đã duyệt</Tag> : currentRecord.status === 'rejected' ? <Tag color="red">Từ chối</Tag> : <Tag color="blue">Chờ xử lý</Tag>}
                        </Descriptions.Item>
                        {currentRecord.status !== 'pending' && (
                            <Descriptions.Item label="Ghi chú xử lý">
                                <div style={{ whiteSpace: 'pre-wrap' }}>{currentRecord.note || "(Không có)"}</div>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};


// ═══════════════════════ ROOT COMPONENT ══════════════════════════
const AdminRecruitment = () => {
    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />
            <main className="admin-main" style={{ padding: '24px 32px' }}>
                <Title level={2} style={{ color: '#1A237E', marginBottom: 24 }}>Quản lý Tuyển dụng</Title>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minHeight: '80vh' }}>
                    <Tabs
                        defaultActiveKey="1"
                        size="large"
                        type="card"
                        items={[
                            {
                                key: '1',
                                label: 'Tuyển dụng',
                                children: <TabRecruitment />,
                            },
                            {
                                key: '2',
                                label: 'Tại sao chọn chúng tôi',
                                children: <TabWhyChooseCompany />,
                            },
                            {
                                key: '3',
                                label: 'Quản lý ứng viên',
                                children: <TabContactRecruitment />,
                            }
                        ]}
                    />
                </div>
            </main>
        </div>
    );
};

export default AdminRecruitment;
