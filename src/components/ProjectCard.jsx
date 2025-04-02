import React from "react";
import { Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export const ProjectCard = ({ title, description, imgUrl, githubLink, demoLink, tags }) => {
  return (
    <motion.div 
      className="project-card"
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
      transition={{ duration: 0.3 }}
    >
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
            <span>Live Demo</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};
