import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import '../styles/ProjectsSection.css';

const Project = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 4; // Adjusted for grid view

    // Extract unique categories from projects
    const allCategories = ['Tất cả', ...new Set(projects.map(item => item.category))];
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');

    const filteredProjects = projects.filter(project => {
        const matchCategory = selectedCategory === 'Tất cả' || project.category === selectedCategory;
        const matchSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <section className="projects-section">
            <div className="container" data-aos="fade-up">
                <h2 className="section-title">Dự án tiêu biểu</h2>

                <div className="projects-layout">
                    
                    <aside className="projects-sidebar">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Tìm kiếm dự án..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="sidebar-search-input" 
                                style={{
                                    width: '80%',
                                    padding: '12px 20px',
                                    border: '1px solid #ddd',
                                    borderRadius: '50px',
                                    fontSize: '15px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </aside>

                    <div className="projects-content">
                        <div className="projects-grid">
                            {currentProjects.length > 0 ? (
                                currentProjects.map((project) => (
                                    <div key={project.id} className="project-card">
                                        <Link
                                            to={`/projects/${project.id}`}
                                            style={{ textDecoration: "none", color: "inherit", display: 'flex', flexDirection: 'column', height: '100%' }}
                                        >
                                            <div className="project-image-wrapper">
                                                <img src={project.image} alt={project.name} className="project-image" />
                                        
                                            </div>
                                            <div className="project-info">
                                         
                                                <h3 className="project-name">{project.name}</h3>
                                                <p className="project-description">{project.description}</p>
                                                <p className="project-year">Năm: {project.year}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p className="no-products">Không tìm thấy dự án phù hợp.</p>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={currentPage === i + 1 ? 'active' : ''}
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