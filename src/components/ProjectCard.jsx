// ProjectCard.jsx
import React from "react";
import { Github, ExternalLink } from 'lucide-react';

export const ProjectCard = ({ title, description, imgUrl, githubLink, demoLink, tags, index, isVisible }) => {
  return (
    <div className="project-card">
      <div className="project-image-container">
        <img src={imgUrl} alt={title} className="project-image" />
      </div>
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        
        <div className="project-tags">
          {tags.map((tag, index) => (
            <span key={index} className="project-tag">{tag}</span>
          ))}
        </div>
        
        <p className="project-description">{description}</p>
        
        <div className="project-links">
          <a href={githubLink} target="_blank" rel="noopener noreferrer" className="project-link code-link">
            <Github size={18} />
            <span>Code</span>
          </a>
          <a href={demoLink} target="_blank" rel="noopener noreferrer" className="project-link demo-link">
            <ExternalLink size={18} />
            <span>Demo</span>
          </a>
        </div>
      </div>
    </div>
  );
};