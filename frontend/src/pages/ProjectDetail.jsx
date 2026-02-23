import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import '../styles/ProjectDetail.css';
import SEO from '../component/SEO';

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

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": project.name,
        "description": project.description,
        "image": project.image,
        "dateCreated": project.year,
        "author": { "@type": "Organization", "name": "TNT PCCC" }
    };

    return (
        <section className="project-detail-section">
            <SEO
                title={project.name}
                description={project.description}
                keywords={`${project.name}, dự án pccc, ${project.category}, TNT PCCC`}
                image={project.image}
                url={`/projects/${project.id}`}
                schema={structuredData}
            />
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
