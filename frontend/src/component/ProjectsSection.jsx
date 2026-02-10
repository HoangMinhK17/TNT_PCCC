import React, { useState } from 'react';
import '../styles/ProjectsSection.css';

const ProjectsSection = () => {
  const [projects] = useState([
    {
      id: 1,
      name: 'Dự án thi công trụ sơ công an',
      image: 'src/uploads/project/prj1.jpg',
      category: 'Thi công',
      description: 'Thi công hệ thống pccc cho trụ sở công an xã',
      year: 2024
    },
    {
      id: 2,
      name: 'Lắp đặt pccc cho gara ô tô ',
      image: 'src/uploads/project/prj2.jpg',
      category: 'Lắp đặt',
      description: 'Thi công hệ thống pccc cho gara ô tô',
      year: 2024
    },
    {
      id: 3,
      name: 'Thi công pccc',
      image: 'src/uploads/project/prj3.jpg',
      category: 'Chủ thầu',
      description: 'Chủ thầu thi công hệ thống pccc',
      year: 2023
    },
    {
      id: 4,
      name: 'Xây dựng pccc cho nhà xưởng',
      image: 'src/uploads/project/prj4.jpg',
      category: 'Xây dựng',
      description: 'Thi công cho nhà xưởng',
      year: 2023
    }
  ]);

  return (
    <section id="projects" className="projects-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Các dự án nổi bật</h2>

        <div className="projects-carousel-container">
          <div className="projects-carousel">
            {[...projects, ...projects].map((project, index) => (
              <div key={index} className="project-card carousel-card">
                <div className="project-image-wrapper">
                  <img src={project.image} alt={project.name} className="project-image" />
                </div>
                <div className="project-info">
                  <span className="project-category">{project.category}</span>
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <p className="project-year">Năm: {project.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default ProjectsSection;
