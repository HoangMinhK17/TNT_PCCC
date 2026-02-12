import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import '../styles/ProjectsSection.css';

const ProjectsSection = () => {

  return (
    <section id="projects" className="projects-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Các dự án nổi bật</h2>

        <div className="projects-carousel-container">
          <div className="projects-carousel">
            {[...projects, ...projects].map((project, index) => (


              <div key={index} className="project-card carousel-card">
                <Link
                  key={index}
                  to={`/projects/${project.id}`}>
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


            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default ProjectsSection;
