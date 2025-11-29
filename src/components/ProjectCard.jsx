import React, { memo } from "react";
import { Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export const ProjectCard = memo(({ title, description, imgUrl, githubLink, demoLink, tags }) => {
  return (
    <motion.article 
      className="project-card"
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.25)" 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="project-image-container">
        <img 
          src={imgUrl} 
          alt={`${title} project screenshot`} 
          className="project-image"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="project-content">
        <h3 className="project-title">{title}</h3>

        <div className="project-tags" role="list" aria-label="Technologies used">
          {tags.map((tag) => (
            <span key={tag} className="project-tag" role="listitem">{tag}</span>
          ))}
        </div>

        <p className="project-description">{description}</p>

        <div className="project-links">
          <a 
            href={githubLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="project-link code-link"
            aria-label={`View ${title} source code on GitHub`}
          >
            <Github size={18} aria-hidden="true" />
            <span>Code</span>
          </a>
          {demoLink && (
            <a 
              href={demoLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="project-link demo-link"
              aria-label={`View ${title} live demo`}
            >
              <ExternalLink size={18} aria-hidden="true" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
});

ProjectCard.displayName = 'ProjectCard';