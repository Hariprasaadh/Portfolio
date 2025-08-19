import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Calendar, MapPin, ExternalLink, Briefcase } from "lucide-react";
import { experiences } from "../data/constants";

export const Experience = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const experienceSection = document.getElementById('experience');
    if (experienceSection) {
      observer.observe(experienceSection);
    }

    return () => {
      if (experienceSection) {
        observer.unobserve(experienceSection);
      }
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const headerVariants = {
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

  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
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

  return (
    <section className="experience modern-experience" id="experience">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="experience-wrapper"
            >
              <motion.div 
                className="experience-header"
                variants={headerVariants}
              >
                <h2 className="experience-title">
                  Professional <span className="title-accent">Experience</span>
                </h2>
                <p className="experience-subtitle">
                  My journey through various roles and projects, where I've contributed to innovative solutions 
                  and continuously refined my technical expertise.
                </p>
              </motion.div>

              <motion.div 
                className="modern-timeline"
                variants={timelineVariants}
              >
                <div className="timeline-line"></div>
                {experiences.map((experience, index) => (
                  <motion.div
                    key={`experience-${index}`}
                    className="timeline-item"
                    variants={cardVariants}
                    whileHover={{ 
                      y: -8, 
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="timeline-marker">
                      <div className="marker-inner">
                        <Briefcase size={16} />
                      </div>
                      <div className="marker-pulse"></div>
                    </div>
                    
                    <div className="timeline-content">
                      <div className="experience-card">
                        <div className="card-header">
                          <div className="company-info">
                            {experience.img && (
                              <img 
                                src={experience.img} 
                                alt={experience.company}
                                className="company-logo"
                              />
                            )}
                            <div className="company-details">
                              <h3 className="role-title">{experience.role}</h3>
                              <h4 className="company-name">{experience.company}</h4>
                            </div>
                          </div>
                          <div className="experience-meta">
                            <div className="meta-item">
                              <Calendar size={14} />
                              <span>{experience.date}</span>
                            </div>
                            {experience.location && (
                              <div className="meta-item">
                                <MapPin size={14} />
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
                        
                        {experience.skills && (
                          <div className="skills-tags">
                            {experience.skills.map((skill, skillIndex) => (
                              <span key={skillIndex} className="skill-tag">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="card-glow"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Experience;