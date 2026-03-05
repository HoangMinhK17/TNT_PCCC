import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getRecruitment } from '../utils/recruitmentApi';
import '../styles/RecruitmentSection.css';
import {
  FaMoneyBillWave, FaHeartbeat, FaGraduationCap, FaGift,
  FaMapMarkerAlt, FaUserTie, FaBriefcase, FaCheckCircle, FaSpinner
} from 'react-icons/fa';
import { getWhyChooseCompany } from '../utils/whyChooseCompanyApi';
const RecruitmentSection = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [whyChooseCompany, setWhyChooseCompany] = useState([]);

  useEffect(() => {
    const fetchWhyChooseCompany = async () => {
      try {
        const data = await getWhyChooseCompany();
        setWhyChooseCompany(data[0]);
        console.log("data", data);
      } catch (error) {
        console.error("Error fetching why choose company:", error);
      }
    };
    fetchWhyChooseCompany();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getRecruitment();
        if (Array.isArray(data)) {
          setJobs(data);
          if (data.length > 0) {
            setSelectedJob(data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching recruitment:', err);
        setError('Không thể tải dữ liệu tuyển dụng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Schema.org JobPosting Structured Data
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org/",
    "@type": "ItemList",
    "numberOfItems": jobs.length,
    "itemListElement": jobs.map((job, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "JobPosting",
        "title": job.name,
        "description": job.description || job.name,
        "datePosted": job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        "validThrough": "2025-12-31",
        "employmentType": job.time === 'Toàn thời gian' ? "FULL_TIME" : "OTHER",
        "hiringOrganization": {
          "@type": "Organization",
          "name": "TNT Company",
          "sameAs": "https://tntpccc.com"
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": job.location,
            "addressCountry": "VN"
          }
        },
        "baseSalary": {
          "@type": "MonetaryAmount",
          "currency": "VND",
          "value": {
            "@type": "QuantitativeValue",
            "value": job.salary,
            "unitText": "MONTH"
          }
        }
      }
    }))
  }), [jobs]);

  return (
    <section id="recruitment" className="recruitment-section">
      <Helmet>
        <title>Tuyển dụng | TNT Company - Cơ hội nghề nghiệp ngành PCCC</title>
        <meta name="description" content="Gia nhập đội ngũ TNT Company. Chúng tôi đang tuyển dụng các vị trí kỹ sư PCCC, nhân viên lắp đặt, chuyên viên kinh doanh với mức lương hấp dẫn và môi trường chuyên nghiệp." />
        <meta name="keywords" content="tuyển dụng pccc, kỹ sư pccc, việc làm pccc hồ chí minh, tnt company tuyển dụng" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="container" data-aos="fade-up">
        <h1 className="section-title">Tuyển dụng - Gia nhập đội ngũ chúng tôi</h1>
        <p className="section-subtitle">Chúng tôi luôn tìm kiếm những nhân tài giỏi để cùng phát triển công ty</p>

        <div className="recruitment-content">
          {loading ? (
            <div className="loading-container">
              <FaSpinner className="spinner" />
              <p>Đang tải danh sách tuyển dụng...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="btn-retry">Thử lại</button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="no-jobs-container">
              <p>Hiện tại chưa có vị trí tuyển dụng nào.</p>
            </div>
          ) : (
            <>
              <aside className="jobs-sidebar">
                <h3>Các vị trí đang tuyển</h3>
                <div className="jobs-container">
                  {jobs.map(job => (
                    <article
                      key={job._id}
                      className={`job-card-item ${selectedJob?._id === job._id ? 'active' : ''}`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <h4>{job.name}</h4>
                      <div className="job-meta">
                        <span className="job-level-pill">{job.level}</span>
                        <span className="job-salary-text">{job.salary}</span>
                      </div>
                      <p className="job-location-text">
                        <FaMapMarkerAlt className="icon-marker" /> {job.location}
                      </p>
                    </article>
                  ))}
                </div>
              </aside>

              <main className="job-details-view">
                {selectedJob ? (
                  <div className="job-detail-content glass-effect">
                    <h3>{selectedJob.name}</h3>

                    <div className="detail-grid">
                      <div className="detail-item">
                        <FaMapMarkerAlt className="detail-icon" />
                        <div>
                          <span className="detail-label">Địa điểm</span>
                          <p>{selectedJob.location}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <FaUserTie className="detail-icon" />
                        <div>
                          <span className="detail-label">Cấp độ</span>
                          <p>{selectedJob.level}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <FaMoneyBillWave className="detail-icon" />
                        <div>
                          <span className="detail-label">Mức lương</span>
                          <p className="highlight-salary">{selectedJob.salary}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <FaBriefcase className="detail-icon" />
                        <div>
                          <span className="detail-label">Loại hình</span>
                          <p>{selectedJob.time}</p>
                        </div>
                      </div>
                    </div>

                    <div className="requirements-box">
                      <h4>Yêu cầu công việc</h4>
                      <ul className="requirements-list">
                        {selectedJob.requirements && Array.isArray(selectedJob.requirements) ? (
                          selectedJob.requirements.map((req, idx) => (
                            <li key={idx}>
                              <FaCheckCircle className="check-icon" />
                              <span>{req}</span>
                            </li>
                          ))
                        ) : (
                          <li>Thông tin yêu cầu đang được cập nhật.</li>
                        )}
                      </ul>
                    </div>

                    <button className="btn-primary-apply">Ứng tuyển ngay</button>
                  </div>
                ) : (
                  <div className="no-selection-placeholder">
                    <div className="placeholder-icon">
                      <FaBriefcase />
                    </div>
                    <p>Chọn một vị trí để xem chi tiết công việc</p>
                  </div>
                )}
              </main>
            </>
          )}
        </div>

        <section className="benefits-section">
          <header className="benefits-header">
            <h3>Quyền lợi & Phúc lợi</h3>
            <p>Chúng tôi mang đến môi trường làm việc tốt nhất cho bạn</p>
          </header>
          <div className="benefits-grid">
            {whyChooseCompany?.benefits?.map((benefit, idx) => (
              <div key={idx} className="benefit-card-modern" data-aos="zoom-in" data-aos-delay={idx * 100}>
                <div className="benefit-icon-wrapper">{
                <img src={benefit?.icon} alt="" />
                }</div>
                <h4>{benefit?.title}</h4>
                <p>{benefit?.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="why-join-modern glass-effect">
          <div className="why-join-content">
            <h3>{whyChooseCompany?.whyChooseUs?.title}</h3>
            <p>
              {whyChooseCompany?.whyChooseUs?.description}
            </p>
            
          </div>
        </section>
      </div>
    </section>
  );
};

export default RecruitmentSection;
