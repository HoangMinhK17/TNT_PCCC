import React from 'react';
import '../styles/VisionMission.css';

const VisionMission = () => {
    return (
        <section className="vision-mission-section">
            <div className="container">
                <div className="vm-grid">
                    <div className="vm-card vision" data-aos="fade-up">
                        <div className="vm-icon">👁️</div>
                        <h3>Tầm Nhìn</h3>
                        <p>
                            Trở thành tổng thầu EPC hàng đầu Việt Nam trong lĩnh vực Phòng cháy chữa cháy và Cơ điện (M&E).
                            Chúng tôi phấn đấu xây dựng một thương hiệu quốc gia, mang lại sự an tâm tuyệt đối cho khách hàng
                            thông qua các giải pháp an toàn, hiện đại và bền vững.
                        </p>
                    </div>

                    <div className="vm-card mission" data-aos="fade-up">
                        <div className="vm-icon">🎯</div>
                        <h3>Sứ Mệnh</h3>
                        <p>
                            <strong>Đối với khách hàng:</strong> Cung cấp sản phẩm, dịch vụ chất lượng cao, tối ưu chi phí và tiến độ.<br />
                            <strong>Đối với xã hội:</strong> Góp phần giảm thiểu rủi ro cháy nổ, bảo vệ tính mạng và tài sản cộng đồng.<br />
                            <strong>Đối với nhân viên:</strong> Xây dựng môi trường làm việc chuyên nghiệp, sáng tạo và nhân văn.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisionMission;
