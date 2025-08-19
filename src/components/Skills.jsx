import meter1 from "../assets/img/meter1.svg";
import meter2 from "../assets/img/meter2.svg";
import meter3 from "../assets/img/meter3.svg";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import colorSharp from "../assets/img/color-sharp.png"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const skillSection = document.getElementById('skills');
    if (skillSection) {
      observer.observe(skillSection);
    }

    return () => {
      if (skillSection) {
        observer.unobserve(skillSection);
      }
    };
  }, []);

  const skillsData = [
    { 
      title: "Machine Learning", 
      level: 70,
      description: "Model Building, Training, Deployment, Optimization",
      icon: "🤖",
      color: "from-blue-500 to-purple-600"
    },
    { 
      title: "Computer Vision", 
      level: 60,
      description: "Object Detection, Image Processing, Segmentation, Tracking",
      icon: "👁️",
      color: "from-purple-500 to-pink-600"
    },
    { 
      title: "Generative AI", 
      level: 75,
      description: "Chatbots, Multi-Modal, AI Agents, RAG Pipelines",
      icon: "✨",
      color: "from-pink-500 to-red-600"
    },
    { 
      title: "Web Development", 
      level: 60,
      description: "Full Stack Apps, API Integration, Real-Time Systems",
      icon: "💻",
      color: "from-green-500 to-blue-600"
    },
    { 
      title: "Data Science", 
      level: 65,
      description: "Data Cleaning, Analysis, Visualization, Predictive Insights",
      icon: "📊",
      color: "from-orange-500 to-yellow-600"
    },
    { 
      title: "Cloud & DevOps", 
      level: 50,
      description: "AWS, Docker, Scalable Deployment",
      icon: "☁️",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
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

  return (
    <section className="modern-skills-v2" id="skills">
        <div className="container">
            <motion.div 
              className="skills-header"
              variants={titleVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
            >
              <h2 className="skills-title">
                <span className="title-accent">Skills</span> & Expertise
              </h2>
              <p className="skills-subtitle">
                Crafting the future with cutting-edge technologies and innovative solutions
              </p>
            </motion.div>

            <motion.div 
              className="skills-container"
              variants={containerVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
            >
              <div className="skills-grid-v2">
                {skillsData.map((skill, index) => (
                  <motion.div
                    key={index}
                    className="skill-card-v2"
                    variants={itemVariants}
                    whileHover={{ 
                      y: -15, 
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="skill-card-inner">
                      <div className="skill-header">
                        <div className="skill-icon-v2">
                          <span className="emoji-icon">{skill.icon}</span>
                        </div>
                        <div className="skill-info">
                          <h3 className="skill-name">{skill.title}</h3>
                          <p className="skill-tech">{skill.description}</p>
                        </div>
                      </div>
                      
                      <div className="skill-progress-v2">
                        <div className="progress-label">
                          <span>Proficiency</span>
                          <span className="progress-percent">{skill.level}%</span>
                        </div>
                        <div className="progress-track">
                          <motion.div 
                            className={`progress-fill-v2 bg-gradient-to-r ${skill.color}`}
                            initial={{ width: 0 }}
                            animate={isVisible ? { width: `${skill.level}%` } : { width: 0 }}
                            transition={{ 
                              duration: 1.5, 
                              delay: index * 0.2,
                              ease: "easeOut"
                            }}
                          />
                        </div>
                      </div>

                      <div className="skill-glow-v2"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
        </div>
    </section>
  )
}