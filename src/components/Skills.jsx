import { useEffect, useState, useMemo, memo } from "react";
import { motion } from "framer-motion";

// Static skills data - extracted outside component to prevent recreation
const SKILLS_DATA = [
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

// Memoized animation variants
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1
    }
  }
};

const ITEM_VARIANTS = {
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

const TITLE_VARIANTS = {
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

// Memoized Skill Card component
const SkillCard = memo(({ skill, index, isVisible }) => {
  return (
    <motion.div
      className="skill-card-v2"
      variants={ITEM_VARIANTS}
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
            <span className="emoji-icon" role="img" aria-label={skill.title}>
              {skill.icon}
            </span>
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
                delay: index * 0.15,
                ease: "easeOut"
              }}
            />
          </div>
        </div>

        <div className="skill-glow-v2"></div>
      </div>
    </motion.div>
  );
});

SkillCard.displayName = 'SkillCard';

export const Skills = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const skillSection = document.getElementById('skills');
    if (!skillSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    observer.observe(skillSection);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="modern-skills-v2" id="skills">
      <div className="container">
        <motion.div 
          className="skills-header"
          variants={TITLE_VARIANTS}
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
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <div className="skills-grid-v2">
            {SKILLS_DATA.map((skill, index) => (
              <SkillCard
                key={skill.title}
                skill={skill}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

Skills.displayName = 'Skills';