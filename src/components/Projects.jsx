// Projects.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import cropcore from "../assets/img/Banner.jpg";
import dronedetect from "../assets/img/dronedetect.jpg";
import career from "../assets/img/careertrack.png";
import ariaai from "../assets/img/aria.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {
  const projects = [
    {
      title: "Crop Core Tech",
      description: "An AI-driven platform revolutionizing modern agriculture.",
      imgUrl: cropcore,
      githubLink: "https://github.com/Hariprasaadh/Crop-Core_Tech",
      demoLink: "https://devfolio.co/projects/crop-core-tech-5028",
      tags: ["React Native", "FastAPI", "YOLOv8", "Tensorflow"]
    },
    {
      title: "CareerTrack",
      description: "An all-in-one platform empowering students in their career journey.",
      imgUrl: career,
      githubLink: "https://github.com/Hariprasaadh/careertrack-new",
      demoLink: "https://careertrack-one.vercel.app/",
      tags: ["Next.js", "FastAPI", "Langchain","LLMs"]
    },
    {
      title: "DroneDetect",
      description: "An AI-powered system for real-time drone threat classification.",
      imgUrl: dronedetect,
      githubLink: "https://github.com/Hariprasaadh/drone_threat",
      demoLink: "",
      tags: ["Next.js", "Computer Vision", "DeepSort","Threat Classification"]
    },
    {
      title: "Aria Chatbot",
      description: "An AI-driven conversational agent for student counseling and ethical decision-making.",
      imgUrl: ariaai,
      githubLink: "https://github.com/Hariprasaadh/Aria-Chatbot",
      demoLink: "https://aria-chat.streamlit.app/",
      tags: ["Streamlit", "LangChain", "Sentiment Analysis","Chatbot"]
    },
  ];

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <h2>Projects</h2>
                  <p>With expertise in AI/ML, and computer vision, I have worked on a diverse range of projects, demonstrating my ability to solve real-world problems through innovative and effective solutions.</p>
                  
                  <Row>
                    {projects.map((project, index) => (
                      <Col key={index} sm={12} md={6} className="mb-4">
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
      <img className="background-image-right" src={colorSharp2} alt="background" />
    </section>
  );
};