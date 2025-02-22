import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import aria from "../assets/img/aria.png";
import ariaai from "../assets/img/ariaai.webp";

import cropcore from "../assets/img/Banner.jpg"
import career from "../assets/img/careertrack.png"

import projImg3 from "../assets/img/project-img3.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {
  const projects = [
    {
      title: "Smart Farming Solutions",
      description: "Agri Intelligence",
      imgUrl: cropcore,
      githubLink: "https://github.com/mithilgirish/Crop-Core_Tech",
      deployLink: "https://devfolio.co/projects/crop-core-tech-5028"
    },
    {
      title: "Navigate Your Future",
      description: "Career Empowerment",
      imgUrl: career,
      githubLink: "https://github.com/Hariprasaadh/CareerTrack",
      deployLink: "https://navigate-future.com"
    },
    {
      title: "AI Mental Health Companion",
      description: "Adaptive Response Model",
      imgUrl: ariaai,
      githubLink: "https://github.com/hariprasaadh/careertrack/blob/main/AI/TherapistBot/chatbot.py",
      deployLink: "https://ariahealthbot.streamlit.app/"
    },
   
  ];

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div>
                <h2>Projects</h2>
                <p>With expertise in AI/ML, and computer vision, I have worked on a diverse range of projects, demonstrating my ability to solve real-world problems through innovative and effective solutions.</p>
                <Tab.Container id="projects-tabs" defaultActiveKey="first">
                  
                  <Tab.Content id="slideInUp">
                    <Tab.Pane eventKey="first">
                      <Row>
                        {
                          projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                                />
                            )
                          })
                        }
                      </Row>
                    </Tab.Pane>
                    
                  </Tab.Content>
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2}></img>
    </section>
  )
}
