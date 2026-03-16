import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById } from '../utils/projectApi';
import '../styles/ProjectDetail.css';
import SEO from '../component/SEO';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProjectById(id);
                setProject(data);
                window.scrollTo(0, 0);
            } catch (error) {
                console.error("Error fetching project detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Đang tải...</div>;

    if (!project) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2>Không tìm thấy dự án</h2>
                <Link to="/projects" className="btn-back">Quay lại danh sách</Link>
            </div>
        );
    }

    const plainDescription = project.description ? project.description.replace(/<[^>]*>?/gm, "") : "";

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": project.name,
        "description": plainDescription,
        "image": project.image,
        "dateCreated": project.year,
        "author": { "@type": "Organization", "name": "TNT PCCC" }
    };

    return (
        <section className="project-detail-section">
            <SEO
                title={project.name}
                description={plainDescription}
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
                        <h1 className="project-detail-title">{project.name}</h1>
                        <p className="project-detail-year">Năm thực hiện: {new Date(project.date).getFullYear()}
                        </p>

                        <div className="project-detail-content">
                            <p className="project-detail-description">{project.title}</p>
                            <h3>Chi tiết dự án</h3>
                            <div dangerouslySetInnerHTML={{ __html: project.description }}></div>
                        </div>

                        <Link to="/contact" className="contact-btn">Liên hệ tư vấn dự án tương tự</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectDetail;
