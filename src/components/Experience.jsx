import React, { useState, useEffect, memo, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Calendar, MapPin, Briefcase } from "lucide-react";
import { experiences } from "../data/constants";

// Memoized animation variants - static objects outside component
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2
    }
  }
};

const HEADER_VARIANTS = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const TIMELINE_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, x: -50, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Memoized Experience Card component
const ExperienceCard = memo(({ experience, index }) => (
  <motion.div
    className="timeline-item"
    variants={CARD_VARIANTS}
    whileHover={{ 
      y: -8, 
      transition: { duration: 0.3 }
    }}
  >
    <div className="timeline-marker">
      <div className="marker-inner">
        <Briefcase size={16} aria-hidden="true" />
      </div>
      <div className="marker-pulse"></div>
    </div>
    
    <div className="timeline-content">
      <article className="experience-card">
        <div className="card-header">
          <div className="company-info">
            {experience.img && (
              <img 
                src={experience.img} 
                alt={`${experience.company} logo`}
                className="company-logo"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="company-details">
              <h3 className="role-title">{experience.role}</h3>
              <h4 className="company-name">{experience.company}</h4>
            </div>
          </div>
          <div className="experience-meta">
            <div className="meta-item">
              <Calendar size={14} aria-hidden="true" />
              <span>{experience.date}</span>
            </div>
            {experience.location && (
              <div className="meta-item">
                <MapPin size={14} aria-hidden="true" />
                <span>{experience.location}</span>
              </div>
            )}
          </div>
        </div>
        
        {experience.desc && (
          <div className="experience-description">
            <p>{experience.desc}</p>
          </div>
        )}
        
        {experience.skills && experience.skills.length > 0 && (
          <div className="skills-tags" role="list" aria-label="Skills used">
            {experience.skills.map((skill) => (
              <span key={skill} className="skill-tag" role="listitem">
                {skill}
              </span>
            ))}
          </div>
        )}
        
        <div className="card-glow"></div>
      </article>
    </div>
  </motion.div>
));

ExperienceCard.displayName = 'ExperienceCard';

export const Experience = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const experienceSection = document.getElementById('experience');
    if (!experienceSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { threshold: 0.15, rootMargin: '50px' }
    );

    observer.observe(experienceSection);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="experience modern-experience" id="experience">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <motion.div
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="experience-wrapper"
            >
              <motion.header 
                className="experience-header"
                variants={HEADER_VARIANTS}
              >
                <h2 className="experience-title">
                  Professional <span className="title-accent">Experience</span>
                </h2>
                <p className="experience-subtitle">
                  My journey through various roles and projects, where I've contributed to innovative solutions 
                  and continuously refined my technical expertise.
                </p>
              </motion.header>

              <motion.div 
                className="modern-timeline"
                variants={TIMELINE_VARIANTS}
              >
                <div className="timeline-line" aria-hidden="true"></div>
                {experiences.map((experience, index) => (
                  <ExperienceCard
                    key={`experience-${experience.company}-${index}`}
                    experience={experience}
                    index={index}
                  />
                ))}
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
});

Experience.displayName = 'Experience';

export default Experience;