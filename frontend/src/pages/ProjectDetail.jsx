import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import '../styles/ProjectDetail.css';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const foundProject = projects.find(p => p.id === parseInt(id));
        if (foundProject) {
            setProject(foundProject);
            window.scrollTo(0, 0);
        }
    }, [id]);

    if (!project) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2>Không tìm thấy dự án</h2>
                <Link to="/projects" className="btn-back">Quay lại danh sách</Link>
            </div>
        );
    }

    return (
        <section className="project-detail-section">
            <div className="container">
                <div className="project-detail-container">
                    <div className="project-detail-image-wrapper">
                        <img src={project.image} alt={project.name} className="project-detail-image" />
                    </div>

                    <div className="project-detail-info">
                        <span className="project-detail-category">{project.category}</span>
                        <h1 className="project-detail-title">{project.name}</h1>
                        <p className="project-detail-year">Năm thực hiện: {project.year}</p>

                        <div className="project-detail-content">
                            <p className="project-detail-description">{project.description}</p>
                            <h3>Chi tiết dự án</h3>
                            <p>{project.detail}</p>
                        </div>

                        <Link to="/contact" className="contact-btn">Liên hệ tư vấn dự án tương tự</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectDetail;
