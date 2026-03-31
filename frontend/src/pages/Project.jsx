import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../utils/projectApi';
import '../styles/ProjectsSection.css';
import SEO from '../component/SEO';

const Project = () => {
    const [projectsData, setProjectsData] = useState({
        projects: [],
        currentPage: 1,
        totalPages: 0,
        totalProjects: 0
    });
    const [loading, setLoading] = useState(true);
    const projectsPerPage = 6;

    useEffect(() => {
        fetchProjects(projectsData.currentPage);
    }, [projectsData.currentPage]);

    const fetchProjects = async (page) => {
        setLoading(true);
        try {
            const data = await getProjects(page, projectsPerPage);
            setProjectsData(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const paginate = (pageNumber) => {
        setProjectsData(prev => ({ ...prev, currentPage: pageNumber }));
        window.scrollTo(0, 0);
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": projectsData.projects.map((project, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${window.location.origin}/projects/${project.slug}`,
            "name": project.name
        }))
    };

    return (
        <section className="projects-section">
            <SEO
                title="Dự án tiêu biểu"
                description="Các dự án  tiêu biểu đã được thực hiện."
                keywords="dự án , thi công , lắp đặt hệ thống "
                url="/projects"
                schema={structuredData}
            />
            <div className="container">
                <h1 className="section-title">Dự án tiêu biểu</h1>

                <div className="projects-layout">



                    <div className="projects-content">
                        <div className="projects-grid">
                            {!loading ? (
                                projectsData.projects.length > 0 ? (
                                    projectsData.projects.map((project) => (
                                        <div key={project._id} className="project-card" data-aos="fade-up">               
                                            <Link
                                                to={`/projects/${project.slug}`}
                                                style={{ textDecoration: "none", color: "inherit", display: 'flex', flexDirection: 'column', height: '100%' }}
                                            >
                                                <div className="project-image-wrapper">
                                                    <img src={project.image} alt={project.name} className="project-image" />
                                                </div>
                                                <div className="project-info">
                                                    <h3 className="project-name">{project.name}</h3>
                                                    <p className="project-description">{project.title}</p>
                                                    <p className="project-year">  Năm: {new Date(project.date).getFullYear()}
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-products">Không tìm thấy dự án phù hợp.</p>
                                )
                            ) : (
                                <div className="loading" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải...</div>
                            )}
                        </div>

                        {projectsData.totalPages > 1 && (
                            <div className="pagination">
                                {Array.from({ length: projectsData.totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={projectsData.currentPage === i + 1 ? 'active' : ''}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Project;