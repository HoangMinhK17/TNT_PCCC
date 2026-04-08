import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../utils/projectApi';
import { useThemeSettings } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import '../styles/ProjectsSection.css';

const ProjectsSection = () => {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { themeLayout } = useThemeSettings();
  const variant = themeLayout?.project || 'masonry';
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects(1, 6);
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

  const renderCarousel = () => (
    <div className="projects-carousel-container">
      <div className="projects-carousel">
        {[...projectsList, ...projectsList].map((project, index) => (
          <div key={`${project.slug}-${index}`} className="project-card carousel-card">
            <Link to={`/projects/${project.slug}`}>
              <div className="project-image-wrapper">
                <img src={project.image} alt={project.name} className="project-image" />
              </div>
              <div className="project-info">
                <h3 className="project-name">{project.name}</h3>
                <p className="project-description" dangerouslySetInnerHTML={{ __html: project.description }}></p>
                <p className="project-year">Năm: {new Date(project.date).getFullYear()}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGrid = () => (
    <div className="projects-dynamic-grid">
      {projectsList.slice(0, 6).map((project, index) => (
        <div key={project._id || index} className={`project-card grid-card item-${index}`}>
          <Link to={`/projects/${project.slug}`}>
            <div className="project-image-wrapper">
              <img src={project.image} alt={project.name} className="project-image" />
            </div>
            <div className="project-info">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-description" dangerouslySetInnerHTML={{ __html: project.description }}></p>
              <p className="project-year">{new Date(project.date).getFullYear()}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <section id="projects" className={`projects-section variant-${variant}`}>
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">{t('section_projects')}</h2>
        {variant === 'slider-3d' || variant === 'carousel' ? renderCarousel() : renderGrid()}
      </div>
    </section>
  );
};

export default ProjectsSection;
