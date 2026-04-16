import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getRecruitment } from '../utils/recruitmentApi';
import { createContactRecruitment } from '../utils/contactRecruitmentApi';
import { uploadCvToCloudinary } from '../utils/imageApi';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../styles/RecruitmentSection.css';
import {
  FaMoneyBillWave,
  FaMapMarkerAlt, FaUserTie, FaBriefcase, FaCheckCircle, FaSpinner
} from 'react-icons/fa';
import { getWhyChooseCompany } from '../utils/whyChooseCompanyApi';
import { useTranslation } from 'react-i18next';

const RecruitmentSection = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [whyChooseCompany, setWhyChooseCompany] = useState([]);
  const { t, i18n } = useTranslation();

  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchWhyChooseCompany = async () => {
      try {
        const data = await getWhyChooseCompany();
        setWhyChooseCompany(data[0]);
      } catch (error) {
        console.error("Error fetching why choose company:", error);
      }
    };
    fetchWhyChooseCompany();
  }, []);

  const handleApplyClick = () => {
    form.resetFields();
    setCvFile(null);
    setApplyModalVisible(true);
  };

  const handleApplySubmit = async (values) => {
    try {
      setSubmitting(true);
      let cvUrl = null;

      if (cvFile) {
        cvUrl = await uploadCvToCloudinary(cvFile, "tnt_cv_uploads");
      }

      const payload = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: values.address,
        recruitmentId: selectedJob._id,
        cv: cvUrl
      };

      const res = await createContactRecruitment(payload);
      if (res?.status === 200 || res?._id) {
        message.success('Ứng tuyển thành công! Cảm ơn bạn đã quan tâm.');
        setApplyModalVisible(false);
      } else if (res?.message) {
        message.error(res.message);
      } else {
        message.success('Ứng tuyển thành công! Cảm ơn bạn đã quan tâm.');
        setApplyModalVisible(false);
      }
    } catch (err) {
      console.log(err);
      message.error(err?.message || 'Có lỗi xảy ra khi nộp hồ sơ!');
    } finally {
      setSubmitting(false);
    }
  };

  const beforeUpload = (file) => {
    const isPdf = file.type === 'application/pdf';
    if (!isPdf) {
      message.error('Chỉ hỗ trợ dãn định .PDF cho CV!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 <= 5;
    if (!isLt5M) {
      message.error('Kích thước file PDF phải nhỏ hơn 5MB!');
      return Upload.LIST_IGNORE;
    }
    setCvFile(file);
    return false;
  };

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
        "validThrough": "",
        "employmentType": job.time === 'Toàn thời gian' ? "FULL_TIME" : "OTHER",
        "hiringOrganization": {
          "@type": "Organization",
          "name": "",
          "sameAs": ""
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
      <div className="container" data-aos="fade-up">
        <h1 className="section-title">{t('recruitment_title')}</h1>
        <p className="section-subtitle">{t('recruitment_subtitle')}</p>
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
                <h3>{t('recruitment_list_title')}</h3>
                <div className="jobs-container">
                  {jobs.map(job => (
                    <article
                      key={job._id}
                      className={`job-card-item ${selectedJob?._id === job._id ? 'active' : ''}`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <h4>{i18n.language === 'en' && job.name_en ? job.name_en : job.name}</h4>
                      <div className="job-meta">
                        <span className="job-level-pill">{i18n.language === 'en' && job.level_en ? job.level_en : job.level}</span>
                        <span className="job-salary-text">{i18n.language === 'en' && job.salary_en ? job.salary_en : job.salary}</span>
                      </div>
                      <p className="job-location-text">
                        <FaMapMarkerAlt className="icon-marker" /> {i18n.language === 'en' && job.location_en ? job.location_en : job.location}
                      </p>
                    </article>
                  ))}
                </div>
              </aside>

              <main className="job-details-view">
                {selectedJob ? (
                  <div className="job-detail-content glass-effect">
                    <h3>{i18n.language === 'en' && selectedJob.name_en ? selectedJob.name_en : selectedJob.name}</h3>

                    <div className="detail-grid">
                      <div className="detail-item">
                        <FaMapMarkerAlt className="detail-icon" />
                        <div>
                          <span className="detail-label">{t('recruitment_location')}</span>
                          <p>{i18n.language === 'en' && selectedJob.location_en ? selectedJob.location_en : selectedJob.location}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <FaUserTie className="detail-icon" />
                        <div>
                          <span className="detail-label">{t('recruitment_experience')}</span>
                          <p>{i18n.language === 'en' && selectedJob.level_en ? selectedJob.level_en : selectedJob.level}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <FaMoneyBillWave className="detail-icon" />
                        <div>
                          <span className="detail-label">{t('recruitment_salary')}</span>
                          <p className="highlight-salary">{i18n.language === 'en' && selectedJob.salary_en ? selectedJob.salary_en : selectedJob.salary}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <FaBriefcase className="detail-icon" />
                        <div>
                          <span className="detail-label">{t('recruitment_time')}</span>
                          <p>{i18n.language === 'en' && selectedJob.time_en ? selectedJob.time_en : selectedJob.time}</p>
                        </div>
                      </div>
                    </div>

                    <div className="requirements-box">
                      <h4>{t('recruitment_requirements')}</h4>
                      <ul className="requirements-list">
                        {selectedJob.requirements && Array.isArray(selectedJob.requirements) ? (
                          selectedJob.requirements.map((req, idx) => (
                            <li key={idx}>
                              <FaCheckCircle className="check-icon" />
                              <span>{i18n.language === 'en' && selectedJob.requirements_en && selectedJob.requirements_en[idx] ? selectedJob.requirements_en[idx] : req}</span>
                            </li>
                          ))
                        ) : (
                          <li>Thông tin yêu cầu đang được cập nhật.</li>
                        )}
                      </ul>
                    </div>

                    <button className="btn-primary-apply" onClick={handleApplyClick}>{t('recruitment_button_apply')}</button>
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

        {whyChooseCompany?.benefits?.length > 0 && (
          <section className="benefits-section">
            <header className="benefits-header">
              <h3>{t('recruitment_benefits')}</h3>
              <p>{t('recruitment_benefits_description')}</p>
            </header>
            <div className="benefits-grid">
              {whyChooseCompany?.benefits?.map((benefit, idx) => (
                <div key={idx} className="benefit-card-modern" data-aos="zoom-in" data-aos-delay={idx * 100}>
                  <div className="benefit-icon-wrapper">{
                    <img src={benefit?.icon} alt="" />
                  }</div>
                  <h4>{i18n.language === 'en' && benefit?.title_en ? benefit?.title_en : benefit?.title}</h4>
                  <p>{i18n.language === 'en' && benefit?.description_en ? benefit?.description_en : benefit?.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {whyChooseCompany?.whyChooseUs?.title && (
          <section className="why-join-modern glass-effect">
            <div className="why-join-content">
              <h3>{i18n.language === 'en' && whyChooseCompany?.whyChooseUs?.title_en ? whyChooseCompany?.whyChooseUs?.title_en : whyChooseCompany?.whyChooseUs?.title}</h3>
              <p>
                {i18n.language === 'en' && whyChooseCompany?.whyChooseUs?.description_en ? whyChooseCompany?.whyChooseUs?.description_en : whyChooseCompany?.whyChooseUs?.description}
              </p>

            </div>
          </section>
        )}
      </div>

      <Modal
        title={`${t('recruitment_modal_title')} ${i18n.language === 'en' && selectedJob?.name_en ? selectedJob?.name_en : selectedJob?.name}`}
        open={applyModalVisible}
        onCancel={() => setApplyModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleApplySubmit}>
          <Form.Item name="name" label={t('recruitment_modal_name')} rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <Input placeholder="Nhập họ và tên của bạn" />
          </Form.Item>
          <Form.Item name="phone" label={t('recruitment_modal_phone')} rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item name="email" label={t('recruitment_modal_email')} rules={[
            { required: true, message: 'Vui lòng nhập Email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}>
            <Input placeholder="Nhập địa chỉ Email" />
          </Form.Item>
          <Form.Item name="address" label={t('recruitment_modal_address')} rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <Input.TextArea rows={2} placeholder="Nhập địa chỉ của bạn" />
          </Form.Item>
          <Form.Item label={t('recruitment_modal_cv')} required>
            <Upload beforeUpload={beforeUpload} maxCount={1} accept=".pdf">
              <Button icon={<UploadOutlined />}>Tải lên CV (PDF)</Button>
            </Upload>
            {cvFile && <span style={{ marginLeft: 10, color: 'blue' }}>{cvFile.name}</span>}
          </Form.Item>
          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Button onClick={() => setApplyModalVisible(false)} style={{ marginRight: 8 }}>{t('recruitment_modal_button_cancel')}</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>{t('recruitment_modal_button_apply')}</Button>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default RecruitmentSection;
