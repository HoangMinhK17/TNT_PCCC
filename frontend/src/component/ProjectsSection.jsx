import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../utils/projectApi';
import '../styles/ProjectsSection.css';

const ProjectsSection = () => {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects(1, 5); // Lấy 10 dự án đầu tiên cho section
        setProjectsList(data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return null;

  return (
    <section id="projects" className="projects-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Các dự án nổi bật</h2>

        <div className="projects-carousel-container">
          <div className="projects-carousel">
            {[...projectsList, ...projectsList].map((project, index) => (
              <div key={index} className="project-card carousel-card">
                <Link
                  to={`/projects/${project.slug}`}>
                  <div className="project-image-wrapper">
                    <img src={project.image} alt={project.name} className="project-image" />
                  </div>
                  <div className="project-info">
                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-description">{project.description}</p>
                    <p className="project-year">Năm: {new Date(project.date).getFullYear()}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
