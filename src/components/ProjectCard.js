// ProjectCard.jsx
import { Col } from "react-bootstrap";
import { Github, Globe } from 'lucide-react';  // Import icons

export const ProjectCard = ({ title, description, imgUrl, githubLink, deployLink }) => {
  return (
    <Col size={12} sm={6} md={4}>
      <div className="proj-imgbx">
        <img src={imgUrl} className="proj-img" />
        <div className="proj-txtx">
          <h4>{title}</h4>
          <span>{description}</span>
          <div className="proj-links">
            {githubLink && (
              <a href={githubLink} target="_blank" rel="noopener noreferrer">
                <Github size={20} />
              </a>
            )}
            {deployLink && (
              <a href={deployLink} target="_blank" rel="noopener noreferrer">
                <Globe size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </Col>
  )
}

// Projects.jsx - Update the projects array to include links
