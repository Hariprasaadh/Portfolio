import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Calendar, MapPin, GraduationCap, Award } from "lucide-react";
import { education } from "../data/constants";

export const Education = () => {
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

    const educationSection = document.getElementById('education');
    if (educationSection) {
      observer.observe(educationSection);
    }

    return () => {
      if (educationSection) {
        observer.unobserve(educationSection);
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

  return (
    <section className="education modern-education" id="education">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="education-wrapper"
            >
              <motion.div 
                className="education-header"
                variants={headerVariants}
              >
                <h2 className="education-title">
                  Academic <span className="title-accent">Journey</span>
                </h2>
                <p className="education-subtitle">
                  My educational foundation has been a path of continuous learning and exploration, 
                  shaping my passion for technology and innovation.
                </p>
              </motion.div>

              <motion.div 
                className="modern-timeline education-timeline"
                variants={timelineVariants}
              >
                <div className="timeline-line"></div>
                {education.map((edu, index) => (
                  <motion.div
                    key={`education-${index}`}
                    className="timeline-item education-item"
                    variants={cardVariants}
                    whileHover={{ 
                      y: -8, 
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="timeline-marker education-marker">
                      <div className="marker-inner">
                        <GraduationCap size={16} />
                      </div>
                      <div className="marker-pulse"></div>
                    </div>
                    
                    <div className="timeline-content">
                      <div className="education-card">
                        <div className="card-header">
                          <div className="institution-info">
                            {edu.img && (
                              <img 
                                src={edu.img} 
                                alt={edu.school}
                                className="institution-logo"
                              />
                            )}
                            <div className="institution-details">
                              <h3 className="degree-title" dangerouslySetInnerHTML={{ __html: edu.degree }}></h3>
                              <h4 className="institution-name">{edu.school}</h4>
                            </div>
                          </div>
                          <div className="education-meta">
                            <div className="meta-item">
                              <Calendar size={14} />
                              <span>{edu.date}</span>
                            </div>
                            {edu.grade && (
                              <div className="meta-item grade-item">
                                <Award size={14} />
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

export default Education;