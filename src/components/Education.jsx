import React, { useState, useEffect, memo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Calendar, GraduationCap, Award } from "lucide-react";
import { education } from "../data/constants";

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
  hidden: { opacity: 0, x: 50, scale: 0.9 },
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

// Memoized Education Card component
const EducationCard = memo(({ edu, index }) => (
  <motion.div
    className="timeline-item education-item"
    variants={CARD_VARIANTS}
    whileHover={{ 
      y: -8, 
      transition: { duration: 0.3 }
    }}
  >
    <div className="timeline-marker education-marker">
      <div className="marker-inner">
        <GraduationCap size={16} aria-hidden="true" />
      </div>
      <div className="marker-pulse"></div>
    </div>
    
    <div className="timeline-content">
      <article className="education-card">
        <div className="card-header">
          <div className="institution-info">
            {edu.img && (
              <img 
                src={edu.img} 
                alt={`${edu.school} logo`}
                className="institution-logo"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="institution-details">
              <h3 
                className="degree-title" 
                dangerouslySetInnerHTML={{ __html: edu.degree }}
              />
              <h4 className="institution-name">{edu.school}</h4>
            </div>
          </div>
          <div className="education-meta">
            <div className="meta-item">
              <Calendar size={14} aria-hidden="true" />
              <span>{edu.date}</span>
            </div>
            {edu.grade && (
              <div className="meta-item grade-item">
                <Award size={14} aria-hidden="true" />
                <span>{edu.grade}</span>
              </div>
            )}
          </div>
        </div>
        
        {edu.desc && (
          <div className="education-description">
            <p>{edu.desc}</p>
          </div>
        )}
        
        <div className="card-glow education-glow"></div>
      </article>
    </div>
  </motion.div>
));

EducationCard.displayName = 'EducationCard';

export const Education = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const educationSection = document.getElementById('education');
    if (!educationSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { threshold: 0.15, rootMargin: '50px' }
    );

    observer.observe(educationSection);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="education modern-education" id="education">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <motion.div
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="education-wrapper"
            >
              <motion.header 
                className="education-header"
                variants={HEADER_VARIANTS}
              >
                <h2 className="education-title">
                  Academic <span className="title-accent">Journey</span>
                </h2>
                <p className="education-subtitle">
                  My educational foundation has been a path of continuous learning and exploration, 
                  shaping my passion for technology and innovation.
                </p>
              </motion.header>

              <motion.div 
                className="modern-timeline education-timeline"
                variants={TIMELINE_VARIANTS}
              >
                <div className="timeline-line" aria-hidden="true"></div>
                {education.map((edu, index) => (
                  <EducationCard
                    key={`education-${edu.school}-${index}`}
                    edu={edu}
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

Education.displayName = 'Education';

export default Education;