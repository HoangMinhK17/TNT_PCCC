import React from 'react';
import '../styles/Achievements.css';

const Achievements = () => {
    const achievements = [
        {
            year: "2023",
            title: "Top 10 Thương Hiệu Uy Tín",
            description: "Được bình chọn bởi Hiệp hội Doanh nghiệp Việt Nam.",
            icon: "🏆"
        },
        {
            year: "2022",
            title: "Chứng nhận ISO 9001:2015",
            description: "Hệ thống quản lý chất lượng đạt chuẩn quốc tế.",
            icon: "📜"
        },
        {
            year: "2021",
            title: "Dự án PCCC Tiêu Biểu",
            description: "Hoàn thành xuất sắc dự án tại KCN VSIP.",
            icon: "🏗️"
        },
        {
            year: "2020",
            title: "Đối Tác Vàng",
            description: "Được vinh danh bởi tập đoàn Vingroup.",
            icon: "🤝"
        }
    ];

    return (
        <section className="achievements-section">
            <div className="container">
                <h2 className="section-title text-center" data-aos="fade-up">Thành Tựu Của Chúng Tôi</h2>

                <div className="achievements-grid">
                    {achievements.map((item, index) => (
                        <div key={index} className="achievement-card" data-aos="fade-up" data-aos-delay={index * 100}>
                            <div className="achievement-icon">{item.icon}</div>
                            <div className="achievement-year">{item.year}</div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
