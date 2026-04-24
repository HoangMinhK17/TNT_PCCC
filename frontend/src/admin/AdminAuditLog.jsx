import React, { useEffect, useState } from 'react';
import {
    Table, Tag, Typography, Space, Select, Input, Modal, Descriptions, Empty, Button
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import AdminSidebar from './AdminSidebar';
import '../styles/Dashboard.css';
import { getAllAuditLogs } from '../utils/auditLog';

const { Title, Text } = Typography;

const ACTION_COLOR = {
    create: 'green',
    update: 'blue',
    delete: 'red',
};

const ACTION_LABEL = {
    create: 'Thêm mới',
    update: 'Cập nhật',
    delete: 'Xóa',
};

const formatDate = (dateStr) => {
    if (!dateStr) return '---';
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
};

const AdminAuditLog = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const pageSize = 10;

    const [filterAction, setFilterAction] = useState(null);
    const [filterModule, setFilterModule] = useState(null);
    const [searchUser, setSearchUser] = useState('');

    const [detailVisible, setDetailVisible] = useState(false);
    const [detailRecord, setDetailRecord] = useState(null);

    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            const res = await getAllAuditLogs(page, pageSize);
            setData((res.auditLogs || []).map(d => ({ ...d, key: d._id })));
            setTotalLogs(res.totalAuditLogs || 0);
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(currentPage); }, [currentPage]);

    const filteredData = data.filter(row => {
        if (filterAction && row.action !== filterAction) return false;
        if (filterModule && row.module !== filterModule) return false;
        if (searchUser) {
            const name = row.userId?.name || '';
            if (!name.toLowerCase().includes(searchUser.toLowerCase())) return false;
        }
        return true;
    });

    const moduleOptions = [...new Set(data.map(d => d.module).filter(Boolean))].map(m => ({ label: m, value: m }));

    const columns = [
        {
            title: '#',
            key: 'index',
            width: 52,
            render: (_, __, idx) => (currentPage - 1) * pageSize + idx + 1,
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            render: (action) => (
                <Tag color={ACTION_COLOR[action] || 'default'}>
                    {ACTION_LABEL[action] || action}
                </Tag>
            ),
        },
        {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
            width: 160,
            render: (m) => <Text code>{m}</Text>,
        },
        {
            title: 'Tên bản ghi',
            dataIndex: 'recordName',
            key: 'recordName',
            render: (name) => name || <Text type="secondary">---</Text>,
        },
        {
            title: 'Người thực hiện',
            key: 'userId',
            width: 150,
            render: (_, row) => row.userId?.name || <Text type="secondary">Ẩn danh</Text>,
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (d) => formatDate(d),
        },
        {
            title: 'Chi tiết',
            key: 'detail',
            width: 90,
            align: 'center',
            render: (_, row) => (
                <Button type="primary" ghost size="small" icon={<EyeOutlined />} onClick={() => { setDetailRecord(row); setDetailVisible(true); }}>Xem</Button>
            ),
        },
    ];

    const renderValues = (values, moduleName) => {
        if (!values || typeof values !== 'object') return <Text type="secondary">Không có dữ liệu</Text>;
        return (
            <Descriptions bordered size="small" column={1}>
                {Object.entries(values).map(([k, v]) => (
                    <Descriptions.Item key={k} label={<Text strong>{getFieldTranslation(moduleName, k)}</Text>}>
                        {v === null || v === undefined || v === '' ? <Text type="secondary">(trống)</Text> : (
                            typeof v === 'object' ? <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(v, null, 2)}</pre> : String(v)
                        )}
                    </Descriptions.Item>
                ))}
            </Descriptions>
        );
    };

    const renderDiffCell = (val) => {
        if (val === null || val === undefined || val === '') return <Text type="secondary">(trống)</Text>;
        
        if (Array.isArray(val)) {
            if (val.length === 0) return <Text type="secondary">Bỏ trống</Text>;
            return (
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {val.map((item, idx) => (
                        <li key={idx} style={{ wordBreak: 'break-word' }}>
                            {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                        </li>
                    ))}
                </ul>
            );
        }
        
        if (typeof val === 'object') {
            return (
                <pre style={{ margin: 0, fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
                    {JSON.stringify(val, null, 2)}
                </pre>
            );
        }

        const str = String(val);
        if (str.length > 100 && !str.includes('<') && !str.includes('>')) {
            return <div style={{ maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{str}</div>;
        } else if (str.includes('<') && str.includes('>')) {
            return <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#fff', padding: 8, border: '1px solid #d9d9d9', borderRadius: 4 }} dangerouslySetInnerHTML={{ __html: str }} />
        }
        return <Text style={{ wordBreak: 'break-word' }}>{str}</Text>;
    };

    const getFieldTranslation = (moduleName, key) => {
        if (moduleName === 'Danh mục tin tức' || moduleName === 'Danh mục sản phẩm') {
            const dict = {
                name: 'Tên danh mục',
                name_en: 'Tên danh mục (Tiếng Anh)',
            };
            if (dict[key]) return dict[key];
        }
        if (moduleName === 'Sản phẩm') {
            const dict = {
                name: 'Tên sản phẩm',
                name_en: 'Tên sản phẩm (Tiếng Anh)',
                categoryId: 'Danh mục sản phẩm',
                technical: 'Thông số kỹ thuật',
                technical_en: 'Thông số kỹ thuật (Tiếng Anh)',
            };
            if (dict[key]) return dict[key];
        }
        if (moduleName === 'Tin tức') {
            const dict = {
                name: 'Tên bài viết',
                name_en: 'Tên bài viết (Tiếng Anh)',
                categoryNewsId: 'Danh mục tin tức',
            };
            if (dict[key]) return dict[key];
        }
        if (moduleName === 'Thông tin chung') {
            const dict = {
                name: 'Tên công ty',
                title: 'Tiêu đề',
                phone: 'Số điện thoại',
                address: 'Địa chỉ',
                email: 'Email liên hệ',
                timeWork: 'Giờ làm việc',
                backgroundImage: 'Banner Trang Chủ',
                logo: 'Logo Công Ty',
                favicon: 'Favicon Trang Web',
            };
            if (dict[key]) return dict[key];
        }
        if (moduleName === 'Dịch vụ'){
            const dict = {
                name: 'Tên dịch vụ',
                name_en: 'Tên dịch vụ (Tiếng Anh)',
            };
            if (dict[key]) return dict[key];
        }

        const commonDict = {
            name: 'Tên',
            name_en: 'Tên (Tiếng Anh)',
            title: 'Tiêu đề',
            title_en: 'Tiêu đề (Tiếng Anh)',
            description: 'Mô tả',
            description_en: 'Mô tả (Tiếng Anh)',
            image: 'Hình ảnh',
            date: 'Ngày',
            status: 'Trạng thái',
            slug: 'Đường dẫn (Slug)',
            repliedMessage : 'Phản hồi',
            note : 'Ghi chú',
            requirements : 'Yêu cầu',
        };
        return commonDict[key] || key;
    };

    const renderUpdateDiff = (oldValues, newValues, moduleName) => {
        const allKeys = Array.from(new Set([...Object.keys(oldValues || {}), ...Object.keys(newValues || {})]));
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {allKeys.map(key => {
                    const oldVal = oldValues[key];
                    const newVal = newValues[key];
                    const displayKey = getFieldTranslation(moduleName, key);
                    
                    const isArrayOfObjects = (arr) => Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object';
                    
                    if (isArrayOfObjects(oldVal) || isArrayOfObjects(newVal)) {
                        const oldArr = Array.isArray(oldVal) ? oldVal : [];
                        const newArr = Array.isArray(newVal) ? newVal : [];
                        const isDiffFormat = (arr) => arr.length > 0 && arr[0].hasOwnProperty('_index');
                        let diffs = [];
                        
                        if (isDiffFormat(oldArr) || isDiffFormat(newArr)) {
                            const indices = Array.from(new Set([...oldArr.map(x => x._index), ...newArr.map(x => x._index)])).sort((a, b) => a - b);
                            diffs = indices.map(idx => {
                                const o = oldArr.find(x => x._index === idx);
                                const n = newArr.find(x => x._index === idx);
                                const displayO = o ? { ...o } : null;
                                if (displayO) delete displayO._index;
                                const displayN = n ? { ...n } : null;
                                if (displayN) delete displayN._index;
                                return { index: idx, oldItem: displayO, newItem: displayN };
                            });
                        } else {
                            const maxLength = Math.max(oldArr.length, newArr.length);
                            for (let i = 0; i < maxLength; i++) {
                                const o = oldArr[i] ? { ...oldArr[i] } : null;
                                const n = newArr[i] ? { ...newArr[i] } : null;
                                if (o) { delete o._id; delete o.id; }
                                if (n) { delete n._id; delete n.id; }
                                
                                if (JSON.stringify(o) !== JSON.stringify(n)) {
                                    diffs.push({ index: i, oldItem: o, newItem: n });
                                }
                            }
                        }

                        if (diffs.length === 0) return null;

                        return (
                            <div key={key} style={{ border: '1px solid #e8e8e8', borderRadius: '8px', overflow: 'hidden' }}>
                                <div style={{ background: '#fafafa', padding: '8px 16px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag color="blue">{displayKey}</Tag> <Text type="secondary" style={{ fontSize: 12 }}>(Chỉ hiển thị các mục thay đổi)</Text>
                                </div>
                                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {diffs.map(diff => (
                                        <div key={diff.index} style={{ border: '1px dashed #d9d9d9', borderRadius: '6px', padding: '12px' }}>
                                            <Text strong style={{ marginBottom: '8px', display: 'block', color: '#fa8c16' }}>Thay đổi ở Mục #{diff.index + 1}</Text>
                                            <div style={{ display: 'flex', gap: '16px' }}>
                                                <div style={{ flex: 1, padding: '8px', background: '#fff1f0', borderLeft: '3px solid #ffa39e', borderRadius: '0 4px 4px 0', overflowX: 'auto' }}>
                                                    <Text type="danger" strong>Cũ:</Text>
                                                    <pre style={{ margin: '8px 0 0 0', fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
                                                        {diff.oldItem ? JSON.stringify(diff.oldItem, null, 2) : '(trống)'}
                                                    </pre>
                                                </div>
                                                <div style={{ flex: 1, padding: '8px', background: '#f6ffed', borderLeft: '3px solid #b7eb8f', borderRadius: '0 4px 4px 0', overflowX: 'auto' }}>
                                                    <Text type="success" strong>Mới:</Text>
                                                    <pre style={{ margin: '8px 0 0 0', fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
                                                        {diff.newItem ? JSON.stringify(diff.newItem, null, 2) : '(trống)'}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={key} style={{ border: '1px solid #e8e8e8', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ background: '#fafafa', padding: '8px 16px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center' }}>
                                <Tag color="blue">{displayKey}</Tag>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: 1, padding: '12px 16px', background: '#fff1f0', borderRight: '1px solid #e8e8e8', overflowX: 'auto' }}>
                                    <Text type="danger" strong style={{ display: 'block', marginBottom: '8px' }}>Cũ:</Text>
                                    {renderDiffCell(oldVal)}
                                </div>
                                <div style={{ flex: 1, padding: '12px 16px', background: '#f6ffed', overflowX: 'auto' }}>
                                    <Text type="success" strong style={{ display: 'block', marginBottom: '8px' }}>Mới:</Text>
                                    {renderDiffCell(newVal)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="admin-dashboard-layout">
            <AdminSidebar />
            <main className="admin-main" style={{ padding: '24px 32px' }}>
                <Title level={2} style={{ color: '#1A237E', marginBottom: 24 }}>
                    Nhật ký hoạt động (Audit Log)
                </Title>

                <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minHeight: '80vh' }}>

                    <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                        <Select
                            placeholder="Lọc hành động"
                            allowClear
                            style={{ width: 160 }}
                            options={[
                                { label: 'Thêm mới', value: 'create' },
                                { label: 'Cập nhật', value: 'update' },
                                { label: 'Xóa', value: 'delete' },
                            ]}
                            onChange={(v) => setFilterAction(v ?? null)}
                        />
                        <Select
                            placeholder="Lọc module"
                            allowClear
                            style={{ width: 200 }}
                            options={moduleOptions}
                            onChange={(v) => setFilterModule(v ?? null)}
                        />
                        <Input.Search
                            placeholder="Tìm theo tên người dùng..."
                            allowClear
                            style={{ width: 260 }}
                            value={searchUser}
                            onChange={e => setSearchUser(e.target.value)}
                            onSearch={v => setSearchUser(v)}
                        />
                    </Space>

                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        loading={loading}
                        bordered
                        locale={{ emptyText: <Empty description="Chưa có nhật ký nào" /> }}
                        pagination={{
                            current: currentPage,
                            pageSize,
                            total: totalLogs,
                            showLessItems: true,
                            showSizeChanger: false,
                            onChange: (page) => setCurrentPage(page),
                        }}
                    />
                </div>

                <Modal
                    title={
                        <Space>
                            <Tag color={ACTION_COLOR[detailRecord?.action]}>
                                {ACTION_LABEL[detailRecord?.action] || detailRecord?.action}
                            </Tag>
                            <Text>{detailRecord?.module} – {detailRecord?.recordName || detailRecord?.recordId}</Text>
                        </Space>
                    }
                    open={detailVisible}
                    onCancel={() => setDetailVisible(false)}
                    footer={null}
                    width={700}
                >
                    {detailRecord && (
                        <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            <div>
                                <Text strong style={{ marginBottom: 8, marginRight: 8 }}> Thời gian:</Text>
                                <Text>{formatDate(detailRecord.createdAt)}</Text>
                            </div>
                            <div>
                                <Text strong style={{ marginBottom: 8, marginRight: 8 }}> Người thực hiện:</Text>
                                <Text>{detailRecord.userId?.name || 'Ẩn danh'}</Text>
                            </div>
                            <div>
                                <Text strong style={{ marginBottom: 8, marginRight: 8 }}>Email:</Text>
                                <Text>{detailRecord.userId?.email || 'Ẩn danh'}</Text>
                            </div>

                            {detailRecord.action === 'update' ? (
                                <div>
                                    <Text strong style={{ display: 'block', marginBottom: 16, fontSize: 16 }}>Chi tiết thay đổi:</Text>
                                    {renderUpdateDiff(detailRecord.oldValues, detailRecord.newValues, detailRecord.module)}
                                </div>
                            ) : (
                                <>
                                    {detailRecord.oldValues && Object.keys(detailRecord.oldValues).length > 0 && (
                                        <div>
                                            <Text strong style={{ display: 'block', marginBottom: 8, color: '#cf1322' }}> Giá trị cũ:</Text>
                                            {renderValues(detailRecord.oldValues, detailRecord.module)}
                                        </div>
                                    )}

                                    {detailRecord.newValues && Object.keys(detailRecord.newValues).length > 0 && (
                                        <div>
                                            <Text strong style={{ display: 'block', marginBottom: 8, color: '#389e0d' }}> Giá trị mới:</Text>
                                            {renderValues(detailRecord.newValues, detailRecord.module)}
                                        </div>
                                    )}
                                </>
                            )}
                        </Space>
                    )}
                </Modal>
            </main>
        </div>
    );
};

export default AdminAuditLog;
