// Projects.jsx
import React, { memo, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import cropcore from "../assets/img/Banner.jpg";
import deepretrieve from "../assets/img/deepretrieve.jpg";
import glucozap from "../assets/img/glucozap.png";
import career from "../assets/img/careertrack.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

// Static project data - extracted outside component
const PROJECTS_DATA = [
  {
    title: "DeepRetrieve",
    description: "Agentic multimodal RAG with CLIP embeddings, MCP orchestration, and intelligent web fallback.",
    imgUrl: deepretrieve,
    githubLink: "https://github.com/Hariprasaadh/DeepRetrieve",
    demoLink: "https://deep-retrieve.vercel.app/",
    tags: ["Agentic RAG", "Multimodal AI", "CLIP", "MCP", "Qdrant"]
  },
  {
    title: "CareerTrack",
    description: "An all-in-one platform empowering students in their career journey.",
    imgUrl: career,
    githubLink: "https://github.com/Hariprasaadh/careertrack-new",
    demoLink: "https://careertrack-one.vercel.app/",
    tags: ["Next.js", "FastAPI", "Langchain", "LLMs"]
  },
  {
    title: "Glucozap",
    description: "An AI-powered health platform using computer vision, machine learning, and LLM for comprehensive health assessments.",
    imgUrl: glucozap,
    githubLink: "https://github.com/Hariprasaadh/GlucoZap",
    demoLink: "https://glucozap.vercel.app/",
    tags: ["Next.js", "Supabase", "Yolo", "TypeScript", "Langchain"]
  },
  {
    title: "Crop Core Tech",
    description: "An AI-driven platform revolutionizing modern agriculture.",
    imgUrl: cropcore,
    githubLink: "https://github.com/Hariprasaadh/Crop-Core_Tech",
    demoLink: "https://devfolio.co/projects/crop-core-tech-5028",
    tags: ["React Native", "FastAPI", "YOLOv8", "Tensorflow"]
  },
];

export const Projects = memo(() => {
  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility partialVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <h2>Projects</h2>
                  <p>
                    With expertise in AI/ML, and computer vision, I have worked on a diverse 
                    range of projects, demonstrating my ability to solve real-world problems 
                    through innovative and effective solutions.
                  </p>
                  
                  <Row className="g-4">
                    {PROJECTS_DATA.map((project, index) => (
                      <Col key={project.title} xs={12} md={6}>
                        <ProjectCard
                          {...project}
                          index={index}
                          isVisible={isVisible}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img 
        className="background-image-right" 
        src={colorSharp2} 
        alt="" 
        aria-hidden="true"
        loading="lazy"
      />
    </section>
  );
});

Projects.displayName = 'Projects';