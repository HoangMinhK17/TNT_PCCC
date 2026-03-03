import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';

const { Title } = Typography;
const { TextArea } = Input;

// Dữ liệu giả định (Mock Data)
const initialData = [
    {
        key: '1',
        title: 'Giới thiệu về TNT Company',
        content: 'TNT là đơn vị hàng đầu trong lĩnh vực cung cấp thiết bị và giải pháp PCCC...',
        image: 'https://via.placeholder.com/100x60?text=Logo',
        createdAt: '2026-03-01',
    },
    {
        key: '2',
        title: 'Tầm nhìn và Sứ mệnh',
        content: 'Bảo vệ an toàn tính mạng và tài sản cho mọi khách hàng...',
        image: 'https://via.placeholder.com/100x60?text=Vision',
        createdAt: '2026-03-02',
    }
];

const AdminIntroduction = () => {
    const [data, setData] = useState(initialData);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    // Mở Modal (Cho cả Thêm mới và Sửa)
    const showModal = (record = null) => {
        setEditingRecord(record);
        if (record) {
            form.setFieldsValue(record); // Đổ dữ liệu cũ vào Form để sửa
        } else {
            form.resetFields(); // Làm sạch Form để thêm mới
        }
        setIsModalVisible(true);
    };

    // Đóng Modal
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    // Xử lý Lưu dữ liệu (Submit Form)
    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                if (editingRecord) {
                    // Cập nhật dữ liệu
                    const newData = data.map(item =>
                        item.key === editingRecord.key ? { ...item, ...values } : item
                    );
                    setData(newData);
                    message.success('Cập nhật thành công!');
                } else {
                    // Thêm mới
                    const newRecord = {
                        ...values,
                        key: Date.now().toString(),
                        createdAt: new Date().toISOString().split('T')[0],
                        image: 'https://via.placeholder.com/100x60?text=NewImage' // Giả mạo url ảnh mới
                    };
                    setData([...data, newRecord]);
                    message.success('Thêm mới bài viết thành công!');
                }
                setIsModalVisible(false);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    // Xóa bài viết
    const handleDelete = (key) => {
        const newData = data.filter(item => item.key !== key);
        setData(newData);
        message.success('Xóa bài viết thành công!');
    };

    // Cấu hình Cột cho Table `antd`
    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '25%',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <img src={text} alt="thumbnail" style={{ height: 50, objectFit: 'cover', borderRadius: '4px' }} />,
            width: '15%',
        },
        {
            title: 'Nội dung tóm tắt',
            dataIndex: 'content',
            key: 'content',
            ellipsis: true, // Tự động cắt chữ nếu quá dài
            width: '35%',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '10%',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa bài viết này không?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />
            <main className="admin-main" style={{ padding: '20px 30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Title level={2} style={{ margin: 0, color: '#1A237E' }}>Quản lý Bài viết Giới thiệu</Title>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                        style={{ backgroundColor: '#FF6B00', borderColor: '#FF6B00' }}
                    >
                        Thêm mới
                    </Button>
                </div>

                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={{ pageSize: 5 }}
                        bordered
                    />
                </div>

                {/* Modal Form */}
                <Modal
                    title={editingRecord ? "Chỉnh sửa Bài viết" : "Thêm mới Bài viết"}
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Lưu dữ liệu"
                    cancelText="Hủy bỏ"
                    width={800}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        name="introductionForm"
                    >
                        <Form.Item
                            name="title"
                            label="Tiêu đề bài viết"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                        >
                            <Input placeholder="Nhập tiêu đề giới thiệu..." size="large" />
                        </Form.Item>

                        <Form.Item
                            name="content"
                            label="Nội dung chi tiết"
                            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                        >
                            <TextArea rows={6} placeholder="Nhập nội dung đầy đủ..." size="large" />
                        </Form.Item>

                        <Form.Item
                            name="image"
                            label="Ảnh đại diện (URL / Tải lên)"
                            help="Trường này sẽ được tính năng Upload thay thế sau khi gọi API"
                        >
                            <Input placeholder="https://..." size="large" />
                        </Form.Item>
                    </Form>
                </Modal>
            </main>
        </div>
    );
};

export default AdminIntroduction;
