import React, { useEffect, useState } from 'react';
import {
    Tabs, Button, Form, Input, Space, message, Typography, Upload, Image, Card, Row, Col, Divider, Table, Modal, Select, Pagination, Tag, ColorPicker
} from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';

import {
    updateInformation, updateImageInformation, updateContactInformation, getAllInformation
} from '../utils/informationApi';
import { uploadImageToCloudinary } from '../utils/imageApi';
import { getAllHeaderForManagement, updateHeader, findHeaderByName } from '../utils/headerApi';
import { getThemeHeader, updateThemeHeader, createThemeHeader } from '../utils/themeHeaderApi';
import { getThemeFooter, updateThemeFooter, createThemeFooter } from '../utils/themeFooterApi';
import { updateThemeAPI } from '../utils/userApi';
import { useThemeSettings } from '../context/ThemeContext';

const { Title } = Typography;
const { TextArea } = Input;

const resolveImageUrl = async (value, folder = "tnt_info") => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return await uploadImageToCloudinary(value, folder);
};

const MultiCloudinaryUpload = ({ value = [], onChange, maxCount = 1, ratioDesc }) => {
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
                    {ratioDesc && <span style={{ marginLeft: 8, fontSize: 12, color: 'gray' }}>{ratioDesc}</span>}
                </Upload>
            )}
            <Space wrap>
                {items.map((item, idx) => {
                    const src = item instanceof File ? URL.createObjectURL(item) : item;
                    return (
                        <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                            <Image src={src} height={80} width={item instanceof File ? 'auto' : 80} style={{ objectFit: 'contain', borderRadius: 4, minWidth: 80, background: '#f0f0f0' }} />
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

const AdminInformation = () => {
    const [infoData, setInfoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savingGen, setSavingGen] = useState(false);
    const [savingImg, setSavingImg] = useState(false);
    const [savingContact, setSavingContact] = useState(false);

    const [formGen] = Form.useForm();
    const [formImg] = Form.useForm();
    const [formContact] = Form.useForm();

    const [headerData, setHeaderData] = useState([]);
    const [headerLoading, setHeaderLoading] = useState(false);
    const [headerSearchText, setHeaderSearchText] = useState('');
    const [headerPage, setHeaderPage] = useState(1);
    const [headerTotal, setHeaderTotal] = useState(0);
    const headerLimit = 5;
    const [isHeaderModalVisible, setIsHeaderModalVisible] = useState(false);
    const [editingHeader, setEditingHeader] = useState(null);
    const [formHeader] = Form.useForm();
    const [savingHeader, setSavingHeader] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);

    const [themeHeaderData, setThemeHeaderData] = useState(null);
    const [loadingThemeHeader, setLoadingThemeHeader] = useState(false);
    const [savingThemeHeader, setSavingThemeHeader] = useState(false);
    const [formThemeHeader] = Form.useForm();

    const [themeFooterData, setThemeFooterData] = useState(null);
    const [loadingThemeFooter, setLoadingThemeFooter] = useState(false);
    const [savingThemeFooter, setSavingThemeFooter] = useState(false);
    const [formThemeFooter] = Form.useForm();

    const { userTheme, updateThemeState } = useThemeSettings();
    const [savingUserTheme, setSavingUserTheme] = useState(false);

    const fetchHeaders = async (page = 1, search = '') => {
        setHeaderLoading(true);
        try {
            let res;
            if (search.trim()) {
                res = await findHeaderByName(search, page, headerLimit);
            } else {
                res = await getAllHeaderForManagement(page, headerLimit);
            }
            if (res && res.header) {
                setHeaderData(res.header);
                setHeaderTotal(res.total || 0);
                setHeaderPage(res.currentPage || page);
            }
        } catch (error) {
            message.error("Lỗi khi tải danh sách Header!");
        } finally {
            setHeaderLoading(false);
        }
    };

    const handleHeaderSearch = (e) => {
        const value = e.target.value;
        setHeaderSearchText(value);
        if (searchTimeout) clearTimeout(searchTimeout);
        setSearchTimeout(setTimeout(() => {
            fetchHeaders(1, value);
        }, 500));
    };

    const handleHeaderPageChange = (page) => {
        fetchHeaders(page, headerSearchText);
    };

    const openHeaderModal = (record) => {
        setEditingHeader(record);
        formHeader.setFieldsValue({
            name_en: record.name_en,
            name_vn: record.name_vn,
            status: record.status,
            show_home: record.show_home
        });
        setIsHeaderModalVisible(true);
    };

    const handleUpdateHeader = async () => {
        try {
            const values = await formHeader.validateFields();
            setSavingHeader(true);
            await updateHeader(editingHeader._id, values);
            message.success("Cập nhật Header thành công!");
            setIsHeaderModalVisible(false);
            fetchHeaders(headerPage, headerSearchText);
        } catch (error) {
            message.error("Cập nhật Header thất bại!");
        } finally {
            setSavingHeader(false);
        }
    };

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await getAllInformation();
            const data = Array.isArray(res) ? res[0] : res;
            if (data) {
                setInfoData(data);
                formGen.setFieldsValue({
                    name: data.name,
                    title: data.title,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    timeWork: data.timeWork?.join('\n') || ''
                });

                formImg.setFieldsValue({
                    logo: data.logo ? [data.logo] : [],
                    favicon: data.favicon ? [data.favicon] : [],
                    backgroundImage: data.backgroundImage || []
                });

                formContact.resetFields();
                formContact.setFieldsValue({
                    socialLinks: data.socialLinks || []
                });
            }
        } catch {
            message.error("Lỗi khi tải thông tin công ty!");
        } finally {
            setLoading(false);
        }
    };

    const fetchThemeHeader = async () => {
        setLoadingThemeHeader(true);
        try {
            const res = await getThemeHeader();
            if (res) {
                setThemeHeaderData(res);
                formThemeHeader.setFieldsValue({
                    background_color: res.background_color,
                    text_color: res.text_color,
                    text_size: res.text_size
                });
            }
        } catch (error) {
            message.error("Lỗi khi tải cấu hình Theme Header!");
        } finally {
            setLoadingThemeHeader(false);
        }
    };

    const fetchThemeFooter = async () => {
        setLoadingThemeFooter(true);
        try {
            const res = await getThemeFooter();
            if (res) {
                setThemeFooterData(res);
                formThemeFooter.setFieldsValue({
                    background_color: res.background_color,
                    icon_color: res.icon_color,
                    text_title_color: res.text_title?.text_color,
                    text_title_size: res.text_title?.text_size,
                    text_p_color: res.text_p?.text_color,
                    text_p_size: res.text_p?.text_size,
                    text_a_color: res.text_a?.text_color,
                    text_a_size: res.text_a?.text_size,
                    contact_text_color: res.contact_text?.text_color,
                    contact_text_size: res.contact_text?.text_size,
                });
            }
        } catch (error) {
            message.error("Lỗi khi tải cấu hình Theme Footer!");
        } finally {
            setLoadingThemeFooter(false);
        }
    };

    useEffect(() => {
        fetchDetail();
        fetchHeaders(1, '');
        fetchThemeHeader();
        fetchThemeFooter();
    }, []);

    const handleSaveUserTheme = async () => {
        try {
            setSavingUserTheme(true);
            await updateThemeAPI(userTheme);
            
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userObj = JSON.parse(userStr);
                userObj.theme = userTheme;
                localStorage.setItem('user', JSON.stringify(userObj));
            }
            updateThemeState(userTheme);
            
            message.success("Cập nhật Theme UI thành công!");
        } catch (err) {
            message.error("Cập nhật Theme UI thất bại!");
        } finally {
            setSavingUserTheme(false);
        }
    };

    const handleSaveGeneral = async () => {
        try {
            if (!infoData) return message.warning("Không tìm thấy ID dữ liệu thiết lập ban đầu, vui lòng liên hệ dev.");
            setSavingGen(true);
            const values = await formGen.validateFields();

            const payload = {
                ...values,
                timeWork: values.timeWork.split('\n').filter(line => line.trim() !== '')
            };

            await updateInformation(infoData._id, payload);
            message.success("Cập nhật thông tin chung thành công!");
            fetchDetail();
        } catch (err) {
            message.error("Cập nhật thất bại!");
        } finally {
            setSavingGen(false);
        }
    };

    const handleSaveThemeHeader = async () => {
        try {
            setSavingThemeHeader(true);
            const values = await formThemeHeader.validateFields();
            
            if (!themeHeaderData) {
                await createThemeHeader(values);
            } else {
                await updateThemeHeader(themeHeaderData._id, values);
            }
            message.success("Cập nhật Theme Header thành công!");
            fetchThemeHeader();
        } catch (err) {
            message.error("Cập nhật Theme Header thất bại!");
        } finally {
            setSavingThemeHeader(false);
        }
    };

    const handleSaveThemeFooter = async () => {
        try {
            setSavingThemeFooter(true);
            const values = await formThemeFooter.validateFields();

            const payload = {
                background_color: values.background_color,
                icon_color: values.icon_color,
                text_title: { text_color: values.text_title_color, text_size: values.text_title_size },
                text_p: { text_color: values.text_p_color, text_size: values.text_p_size },
                text_a: { text_color: values.text_a_color, text_size: values.text_a_size },
                contact_text: { text_color: values.contact_text_color, text_size: values.contact_text_size },
            };

            if (!themeFooterData) {
                await createThemeFooter(payload);
            } else {
                await updateThemeFooter(themeFooterData._id, payload);
            }
            message.success("Cập nhật Theme Footer thành công!");
            fetchThemeFooter();
        } catch (err) {
            message.error("Cập nhật Theme Footer thất bại!");
        } finally {
            setSavingThemeFooter(false);
        }
    };

    const handleSaveImages = async () => {
        try {
            if (!infoData) return;
            setSavingImg(true);
            const values = await formImg.validateFields();

            const logoItems = Array.isArray(values.logo) ? values.logo : [];
            const faviconItems = Array.isArray(values.favicon) ? values.favicon : [];
            const bgItems = Array.isArray(values.backgroundImage) ? values.backgroundImage : [];

            const logoUrls = await Promise.all(logoItems.map(item => resolveImageUrl(item, "tnt_info/logo")));
            const faviconUrls = await Promise.all(faviconItems.map(item => resolveImageUrl(item, "tnt_info/favicon")));
            const bgUrls = await Promise.all(bgItems.map(item => resolveImageUrl(item, "tnt_info/banners")));

            const payload = {
                logo: logoUrls.length > 0 ? logoUrls[0] : "",
                favicon: faviconUrls.length > 0 ? faviconUrls[0] : "",
                backgroundImage: bgUrls
            };

            await updateImageInformation(infoData._id, payload);
            message.success("Cập nhật hình ảnh thành công!");
            fetchDetail();
        } catch (err) {
            message.error("Cập nhật hình ảnh thất bại!");
        } finally {
            setSavingImg(false);
        }
    };

    const handleSaveContactLinks = async () => {
        try {
            if (!infoData) return;
            setSavingContact(true);
            const values = await formContact.validateFields();

            const updatedLinks = [];
            if (values.socialLinks) {
                for (let link of values.socialLinks) {
                    let iconVal = link.icon;
                    let iconItems = Array.isArray(iconVal) ? iconVal : (iconVal ? [iconVal] : []);
                    let resolvedIconUrls = await Promise.all(iconItems.map(item => resolveImageUrl(item, "tnt_info/social")));
                    updatedLinks.push({
                        ...link,
                        icon: resolvedIconUrls.length > 0 ? resolvedIconUrls[0] : ""
                    });
                }
            }

            const payload = {
                socialLinks: updatedLinks
            };

            await updateContactInformation(infoData._id, payload);
            message.success("Cập nhật liên kết xã hội thành công!");
            fetchDetail();
        } catch (err) {
            message.error("Cập nhật liên kết thất bại!");
        } finally {
            setSavingContact(false);
        }
    };

    if (loading) return <div style={{ padding: 50, textAlign: 'center' }}>Đang tải thông tin...</div>;

    const headerColumns = [
        {
            title: 'Tiếng Anh (EN)',
            dataIndex: 'name_en',
            key: 'name_en',
        },
        {
            title: 'Tiếng Việt (VN)',
            dataIndex: 'name_vn',
            key: 'name_vn',
        },
        {
            title: 'Hiển thị trên Header',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Hiển thị' : 'Tạm ẩn'}
                </Tag>
            )
        },
        {
            title: 'Hiển thị trên UI Home',
            dataIndex: 'show_home',
            key: 'show_home',
            render: (show_home) => (
                <Tag color={show_home === 'active' ? 'green' : 'red'}>
                    {show_home === 'active' ? 'Hiển thị' : 'Tạm ẩn'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="primary" ghost size="small" icon={<EditOutlined />} onClick={() => openHeaderModal(record)}>
                        Sửa
                    </Button>
                </Space>
            )
        }
    ];

    const items = [
        {
            key: '1',
            label: 'Thông tin chung',
            children: (
                <Form form={formGen} layout="vertical" onFinish={handleSaveGeneral}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Tên công ty" rules={[{ required: true, message: 'Bắt buộc!' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="email" label="Email liên hệ" rules={[{ required: true, whitespace: true, message: 'Bắt buộc!' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="title" label="Tiêu đề (Slogan)" rules={[{ required: true, whitespace: true, message: 'Bắt buộc!' }]}>
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="timeWork" label="Giờ làm việc (Mỗi dòng là một mục)" rules={[{ required: true, whitespace: true, message: 'Bắt buộc!' }]}>
                                <TextArea rows={4} placeholder="Ví dụ:\nThứ 2 - Thứ 6: 08:00 - 17:00\nThứ 7: 08:00 - 12:00" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, whitespace: true, message: 'Bắt buộc!' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, whitespace: true, message: 'Bắt buộc!' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={savingGen}>Lưu Thông Tin</Button>
                    </Form.Item>
                </Form>
            )
        },
        {
            key: '2',
            label: 'Logo & Banner',
            children: (
                <Form form={formImg} layout="vertical" onFinish={handleSaveImages}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card title="Logo Công Ty" size="small" style={{ marginBottom: 16 }}>
                                <Form.Item name="logo" rules={[{ required: true, message: 'Chọn ít nhất 1 ảnh!' }]}>
                                    <MultiCloudinaryUpload maxCount={1} />
                                </Form.Item>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Favicon Trang Web (Icon Tab Trình Duyệt)" size="small" style={{ marginBottom: 16 }}>
                                <Form.Item name="favicon" rules={[{ required: true, message: 'Chọn ít nhất 1 ảnh!' }]}>
                                    <MultiCloudinaryUpload maxCount={1} ratioDesc="(Tỷ lệ 1:1, dung lượng nhỏ gọn)" />
                                </Form.Item>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card title="Banner Trang Chủ (Background Images)" size="small">
                                <Form.Item name="backgroundImage" rules={[{ required: true, message: 'Chọn ít nhất 1 ảnh!' }]}>
                                    <MultiCloudinaryUpload maxCount={5} ratioDesc="(Khuyến nghị ảnh ngang 1920x1080, tối đa 5 ảnh slide)" />
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>
                    <Divider />
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={savingImg}>Lưu Hình Ảnh</Button>
                    </Form.Item>
                </Form>
            )
        },
        {
            key: '3',
            label: 'Mạng Xã Hội',
            children: (
                <Form form={formContact} layout="vertical" onFinish={handleSaveContactLinks} initialValues={{ socialLinks: [] }}>
                    <Form.List name="socialLinks">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 16 }} align="start">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            label="Tên MXH"
                                            rules={[{ required: true, message: 'Thiếu tên MXH' }]}
                                        >
                                            <Input placeholder="Tên (VD: Facebook)" style={{ width: 150 }} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'url']}
                                            label="Đường dẫn"
                                            rules={[{ required: true, message: 'Thiếu link' }]}
                                        >
                                            <Input placeholder="URL Link" style={{ width: 250 }} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'icon']}
                                            label="Icon (Ảnh)"
                                            rules={[{ required: true, message: 'Thiếu ảnh icon' }]}
                                        >
                                            <MultiCloudinaryUpload maxCount={1} />
                                        </Form.Item>
                                        <Button type="text" danger onClick={() => remove(name)} style={{ marginTop: 32 }} icon={<DeleteOutlined />} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm Mạng Xã Hội
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={savingContact}>Lưu Liên Kết</Button>
                    </Form.Item>
                </Form>
            )
        },
        {
            key: '4',
            label: 'Quản lý Header',
            children: (
                <div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                        <Input.Search
                            placeholder="Tìm kiếm Header..."
                            allowClear
                            onChange={handleHeaderSearch}
                            style={{ width: 300 }}
                        />
                    </div>
                    <Table
                        columns={headerColumns}
                        dataSource={headerData}
                        rowKey="_id"
                        loading={headerLoading}
                        pagination={false}
                    />
                    {headerTotal > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                            <Pagination
                                current={headerPage}
                                total={headerTotal}
                                pageSize={headerLimit}
                                onChange={handleHeaderPageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    )}

                    <Modal
                        title="Cập nhật Header"
                        open={isHeaderModalVisible}
                        onCancel={() => setIsHeaderModalVisible(false)}
                        onOk={handleUpdateHeader}
                        confirmLoading={savingHeader}
                        okText="Lưu"
                        cancelText="Hủy"
                    >
                        <Form form={formHeader} layout="vertical">
                            <Form.Item name="name_en" label="Tên Tiếng Anh (EN)" rules={[{ required: true, message: 'Vui lòng nhập tên tiếng Anh!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="name_vn" label="Tên Tiếng Việt (VN)" rules={[{ required: true, message: 'Vui lòng nhập tên tiếng Việt!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="status" label="Hiển thị trên Header" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                                <Select>
                                    <Select.Option value="active">Hiển thị</Select.Option>
                                    <Select.Option value="inactive">Tạm ẩn</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="show_home" label="Hiển thị UI Home" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                                <Select>
                                    <Select.Option value="active">Hiển thị</Select.Option>
                                    <Select.Option value="inactive">Tạm ẩn</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            )
        },
        {
            key: '5',
            label: 'Cấu Hình Theme (Header & Footer)',
            children: (
                <div>
                    <Title level={4} style={{ color: '#1A237E' }}>CẤU HÌNH HEADER</Title>
                    <Form form={formThemeHeader} layout="vertical" onFinish={handleSaveThemeHeader}>
                        {loadingThemeHeader ? (
                            <div style={{ padding: 20, textAlign: 'center' }}>Đang tải cấu hình Header...</div>
                        ) : (
                            <>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item
                                            name="background_color"
                                            label="Màu nền (Background Color)"
                                            rules={[{ required: true, message: 'Bắt buộc!' }]}
                                            getValueFromEvent={(color) => typeof color === 'string' ? color : color.toHexString()}
                                        >
                                            <ColorPicker format="hex" showText />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="text_color"
                                            label="Màu chữ (Text Color)"
                                            rules={[{ required: true, message: 'Bắt buộc!' }]}
                                            getValueFromEvent={(color) => typeof color === 'string' ? color : color.toHexString()}
                                        >
                                            <ColorPicker format="hex" showText />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="text_size" label="Cỡ chữ (Text Size)" rules={[{ required: true, message: 'Bắt buộc!' }]}>
                                            <Select placeholder="Chọn cỡ chữ">
                                                <Select.Option value="12px">12px (Nhỏ)</Select.Option>
                                                <Select.Option value="14px">14px (Thường)</Select.Option>
                                                <Select.Option value="16px">16px (Vừa)</Select.Option>
                                                <Select.Option value="18px">18px (Lớn)</Select.Option>
                                                <Select.Option value="20px">20px (Rất lớn)</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={savingThemeHeader}>Lưu Cấu Hình Header</Button>
                                </Form.Item>
                            </>
                        )}
                    </Form>

                    <Divider />

                    <Title level={4} style={{ color: '#1A237E' }}>CẤU HÌNH FOOTER</Title>
                    <Form form={formThemeFooter} layout="vertical" onFinish={handleSaveThemeFooter}>
                        {loadingThemeFooter ? (
                            <div style={{ padding: 20, textAlign: 'center' }}>Đang tải cấu hình Footer...</div>
                        ) : (
                            <>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item
                                            name="background_color"
                                            label="Màu nền (Background Color)"
                                            rules={[{ required: true, message: 'Bắt buộc!' }]}
                                            getValueFromEvent={(color) => typeof color === 'string' ? color : color.toHexString()}
                                        >
                                            <ColorPicker format="hex" showText />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="icon_color"
                                            label="Màu sắc Icon (Icon Color)"
                                            rules={[{ required: true, message: 'Bắt buộc!' }]}
                                            getValueFromEvent={(color) => typeof color === 'string' ? color : color.toHexString()}
                                        >
                                            <ColorPicker format="hex" showText />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider dashed orientation="left">Màu & Kích thước Chữ Footer</Divider>

                                <Row gutter={16}>
                                    <Col span={6}>
                                        <Card size="small" title="Tiêu đề Cột (Title)" bordered={false} style={{ background: '#fafafa' }}>
                                            <Form.Item name="text_title_color" label="Màu chữ" rules={[{ required: true }]} getValueFromEvent={(color) => typeof color === 'string' ? color : color.toHexString()}>
                                                <ColorPicker format="hex" showText />
                                            </Form.Item>
                                            <Form.Item name="text_title_size" label="Cỡ chữ" rules={[{ required: true }]}>
                                                <Select placeholder="Cỡ chữ"><Select.Option value="14px">14px</Select.Option><Select.Option value="16px">16px</Select.Option><Select.Option value="18px">18px</Select.Option><Select.Option value="20px">20px</Select.Option><Select.Option value="24px">24px</Select.Option></Select>
                                            </Form.Item>
                                        </Card>
                                    </Col>
                                    <Col span={6}>
                                        <Card size="small" title="Đoạn văn (Paragraph)" bordered={false} style={{ background: '#fafafa' }}>
                                            <Form.Item name="text_p_color" label="Màu chữ" rules={[{ required: true }]} getValueFromEvent={(color) => typeof color === 'string' ? color : color.toHexString()}>
                                                <ColorPicker format="hex" showText />
                                            </Form.Item>
                                            <Form.Item name="text_p_size" label="Cỡ chữ" rules={[{ required: true }]}>
                                                <Select placeholder="Cỡ chữ"><Select.Option value="12px">12px</Select.Option><Select.Option value="14px">14px</Select.Option><Select.Option value="16px">16px</Select.Option><Select.Option value="18px">18px</Select.Option></Select>
                                            </Form.Item>
                                        </Card>
                                    </Col>
                                    <Col span={6}>
                                        <Card size="small" title="Đường dẫn (Links)" bordered={false} style={{ background: '#fafafa' }}>
                                            <Form.Item name="text_a_color" label="Màu chữ" rules={[{ required: true }]} getValueFromEvent={(color) => typeof color === 'string' ? color : color.toHexString()}>
                                                <ColorPicker format="hex" showText />
                                            </Form.Item>
                                            <Form.Item name="text_a_size" label="Cỡ chữ" rules={[{ required: true }]}>
                                                <Select placeholder="Cỡ chữ"><Select.Option value="12px">12px</Select.Option><Select.Option value="14px">14px</Select.Option><Select.Option value="16px">16px</Select.Option><Select.Option value="18px">18px</Select.Option></Select>
                                            </Form.Item>
                                        </Card>
                                    </Col>
                                    <Col span={6}>
                                        <Card size="small" title="Thông tin Liên hệ" bordered={false} style={{ background: '#fafafa' }}>
                                            <Form.Item name="contact_text_color" label="Màu chữ" rules={[{ required: true }]} getValueFromEvent={(color) => typeof color === 'string' ? color : color.toHexString()}>
                                                <ColorPicker format="hex" showText />
                                            </Form.Item>
                                            <Form.Item name="contact_text_size" label="Cỡ chữ" rules={[{ required: true }]}>
                                                <Select placeholder="Cỡ chữ"><Select.Option value="12px">12px</Select.Option><Select.Option value="14px">14px</Select.Option><Select.Option value="16px">16px</Select.Option><Select.Option value="18px">18px</Select.Option></Select>
                                            </Form.Item>
                                        </Card>
                                    </Col>
                                </Row>

                                <Form.Item style={{ marginTop: 24 }}>
                                    <Button type="primary" htmlType="submit" loading={savingThemeFooter}>Lưu Cấu Hình Footer</Button>
                                </Form.Item>
                            </>
                        )}
                    </Form>
                </div>
            )
        },
        {
            key: '6',
            label: 'Cấu hình Theme UI',
            children: (
                <div>
                     <Title level={4} style={{ color: '#1A237E' }}>CHỌN GIAO DIỆN THEME (GLOBAL)</Title>
                     <Card bordered={false} style={{ background: '#fafafa' }}>
                         <div style={{ marginBottom: 16 }}>
                             Vui lòng chọn 1 trong 4 màu sắc chủ đạo bên dưới để đổi giao diện Website:
                         </div>
                         <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                             {[
                                 { id: 'light', label: 'Light', color: '#ffffff', textColor: '#333' },
                                 { id: 'dark', label: 'Dark', color: '#121212', textColor: '#fff' },
                                 { id: 'blue', label: 'Blue', color: '#e6f4ff', textColor: '#003a8c' },
                                 { id: 'green', label: 'Green', color: '#d9f7be', textColor: '#135200' },
                             ].map((t) => (
                                 <div
                                     key={t.id}
                                     onClick={() => updateThemeState(t.id)}
                                     style={{
                                         width: '120px',
                                         height: '120px',
                                         background: t.color,
                                         border: userTheme === t.id ? '4px solid #1677ff' : '1px solid #d9d9d9',
                                         borderRadius: '8px',
                                         display: 'flex',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         cursor: 'pointer',
                                         fontSize: '16px',
                                         fontWeight: 'bold',
                                         color: t.textColor,
                                         boxShadow: userTheme === t.id ? '0 0 10px rgba(0,0,0,0.1)' : 'none',
                                         position: 'relative'
                                     }}
                                 >
                                     {t.label}
                                     {userTheme === t.id && <span style={{position:'absolute', top: 5, right: 10, fontSize: '18px', color: '#1677ff'}}>✓</span>}
                                 </div>
                             ))}
                         </div>
                         <Button type="primary" onClick={handleSaveUserTheme} loading={savingUserTheme} style={{ marginTop: 24 }}>
                              Lưu Giao Diện
                         </Button>
                     </Card>
                </div>
            )
        }
    ];

    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />
            <main className="admin-main" style={{ padding: '24px 32px' }}>
                <Title level={2} style={{ color: '#1A237E', margin: '0 0 24px 0' }}>Cấu Hình Hệ Thống</Title>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minHeight: '80vh' }}>
                    <Tabs
                        defaultActiveKey="1"
                        size="large"
                        type="card"
                        items={items}
                    />
                </div>
            </main>
        </div>
    );
};

export default AdminInformation;
