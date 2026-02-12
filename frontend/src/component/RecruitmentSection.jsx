import React, { useState } from 'react';
import '../styles/RecruitmentSection.css';

const RecruitmentSection = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      id: 1,
      title: 'Kỹ sư PCCC',
      location: 'TP. Hồ Chí Minh',
      level: 'Senior',
      salary: '15 - 20 triệu',
      type: 'Toàn thời gian',
      requirements: [
        'Tốt nghiệp Đại học chuyên ngành PCCC hoặc điện tử',
        'Có kinh nghiệm từ 3 năm trở lên',
        'Có chứng chỉ PCCC cấp II',
        'Kỹ năng lãnh đạo và quản lý dự án'
      ]
    },
    {
      id: 2,
      title: 'Nhân viên lắp đặt',
      location: 'TP. Hồ Chí Minh, Hà Nội',
      level: 'Junior - Middle',
      salary: '8 - 12 triệu',
      type: 'Toàn thời gian',
      requirements: [
        'Có kinh nghiệm lắp đặt hệ thống PCCC',
        'Chứng chỉ PCCC cấp III trở lên',
        'Kỹ năng giao tiếp tốt',
        'Khỏe mạnh, có khả năng làm việc cao'
      ]
    },
    {
      id: 3,
      title: 'Nhân viên bảo dưỡng',
      location: 'TP. Hồ Chí Minh',
      level: 'Middle',
      salary: '10 - 15 triệu',
      type: 'Toàn thời gian',
      requirements: [
        'Có kinh nghiệm bảo dưỡng thiết bị PCCC',
        'Kiến thức kỹ thuật vững chắc',
        'Chứng chỉ PCCC cấp II trở lên',
        'Trách nhiệm cao, chuyên nghiệp'
      ]
    },
    {
      id: 4,
      title: 'Chuyên viên kinh doanh',
      location: 'TP. Hồ Chí Minh',
      level: 'Middle',
      salary: '10 - 18 triệu',
      type: 'Toàn thời gian',
      requirements: [
        'Có kinh nghiệm bán hàng B2B từ 2 năm',
        'Kiến thức về sản phẩm PCCC',
        'Kỹ năng thuyết trình, đàm phán',
        'Có mạng lưới khách hàng là lợi thế'
      ]
    },
    {
      id: 5,
      title: 'Nhân viên kỹ thuật hỗ trợ',
      location: 'Hà Nội',
      level: 'Senior',
      salary: '12 - 16 triệu',
      type: 'Toàn thời gian',
      requirements: [
        'Có kinh nghiệm 5+ năm về PCCC',
        'Khả năng hỗ trợ kỹ thuật cho khách hàng',
        'Chứng chỉ PCCC cấp I hoặc II',
        'Tiếng Anh sơ cấp là lợi thế'
      ]
    },
    {
      id: 6,
      title: 'Thực tập sinh PCCC',
      location: 'TP. Hồ Chí Minh',
      level: 'Thực tập',
      salary: '5 - 7 triệu',
      type: 'Toàn thời gian (6 tháng)',
      requirements: [
        'Sinh viên năm cuối các ngành liên quan',
        'Nhiệt tình, sẵn sàng học hỏi',
        'Kỹ năng giao tiếp tốt',
        'Không bắt buộc có kinh nghiệm'
      ]
    }
  ];

  const benefits = [
    { icon: '💰', title: 'Lương cạnh tranh', desc: 'Lương thưởng xứng đáng với năng lực' },
    { icon: '🏥', title: 'Bảo hiểm đầy đủ', desc: 'BHXH, BHYT, BHTN' },
    { icon: '🎓', title: 'Đào tạo liên tục', desc: 'Cơ hội nâng cao kiến thức chuyên môn' },
    { icon: '🚗', title: 'Cấp xe công', desc: 'Cho các vị trí quản lý' },
    { icon: '⏰', title: 'Công việc linh hoạt', desc: 'Thời gian làm việc hợp lý' },
    { icon: '🎁', title: 'Phúc lợi hấp dẫn', desc: 'Thưởng lễ, du lịch, team building' }
  ];

  return (
    <section id="recruitment" className="recruitment-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Tuyển dụng - Gia nhập đội ngũ chúng tôi</h2>
        <p className="section-subtitle">Chúng tôi luôn tìm kiếm những nhân tài giỏi để cùng phát triển công ty</p>

        <div className="recruitment-content" >
          <div className="jobs-list">
            <h3>Các vị trí đang tuyển</h3>
            <div className="jobs-container">
              {jobs.map(job => (
                <div
                  key={job.id}
                  className={`job-item ${selectedJob?.id === job.id ? 'active' : ''}`}
                  onClick={() => setSelectedJob(job)}
                >
                  <h4>{job.title}</h4>
                  <div className="job-info">
                    <span className="job-level">{job.level}</span>
                    <span className="job-salary">{job.salary}</span>
                  </div>
                  <p className="job-location"> {job.location}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="job-details">
            {selectedJob ? (
              <div className="job-detail-card">
                <h3>{selectedJob.title}</h3>

                <div className="detail-info">
                  <div className="info-row">
                    <span className="label">Địa điểm:</span>
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Cấp độ:</span>
                    <span>{selectedJob.level}</span>
                  </div>
                  <div className="info-row">
                    <span className="label"> Mức lương:</span>
                    <span className="salary">{selectedJob.salary}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Loại hình:</span>
                    <span>{selectedJob.type}</span>
                  </div>
                </div>

                <div className="requirements-section">
                  <h4>Yêu cầu công việc</h4>
                  <ul className="requirements-list">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx}>
                        <span className="check">✓</span> {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="btn-apply">Ứng tuyển ngay</button>
              </div>
            ) : (
              <div className="no-selection">
                <p>👈 Chọn một vị trí để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>

        <div className="benefits-section">
          <h3>Quyền lợi & Phúc lợi</h3>
          <div className="benefits-grid">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h4>{benefit.title}</h4>
                <p>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="why-join">
          <h3>Tại sao bạn nên gia nhập chúng tôi?</h3>
          <p>
            Tại TNT Company, chúng tôi tin rằng nhân viên là tài sản quý giá nhất.
            Chúng tôi tạo điều kiện làm việc chuyên nghiệp, cơ hội phát triển sự nghiệp,
            và môi trường làm việc thân thiện. Nếu bạn có đam mê với ngành PCCC và muốn
            đóng góp cho an toàn cộng đồng, hãy gia nhập đội ngũ chúng tôi!
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecruitmentSection;
