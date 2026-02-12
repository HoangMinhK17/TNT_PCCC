import React from 'react';
import '../styles/Achievements.css';

const Achievements = () => {
    const achievements = [
        {
            year: "2023",
            title: "Top 10 Thương Hiệu Uy Tín",
            description: "Được bình chọn bởi Hiệp hội Doanh nghiệp Việt Nam.",
            image: "src/uploads/information/achieve/tt1.jpg"
        },
        {
            year: "2022",
            title: "Chứng nhận ISO 9001:2015",
            description: "Hệ thống quản lý chất lượng đạt chuẩn quốc tế.",
            image: "src/uploads/information/achieve/tt2.jpg"
        },
        {
            year: "2021",
            title: "Dự án PCCC Tiêu Biểu",
            description: "Hoàn thành xuất sắc dự án tại KCN VSIP.",
            image: "src/uploads/information/achieve/tt3.jpg"
        },
        {
            year: "2020",
            title: "Đối Tác Vàng",
            description: "Được vinh danh bởi tập đoàn Vingroup.",
            image: "src/uploads/information/achieve/tt4.jpg"
        }
    ];

    return (
        <section className="achievements-section">
            <div className="container">
                <h2 className="section-title text-center" data-aos="fade-up">Thành Tựu Của Chúng Tôi</h2>

                <div className="achievements-grid">
                    {achievements.map((item, index) => (
                        <div key={index} className="achievement-card" data-aos="fade-up" data-aos-delay={index * 100}>
                            <div className="achievement-image-wrapper">
                                <img src={item.image} alt={item.title} className="achievement-image" />
                            </div>
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
