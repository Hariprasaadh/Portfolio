import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { VerticalTimeline } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import ExperienceCard from "../cards/ExperienceCard";
import { experiences } from "../data/constants";

export const Experience = () => {
  return (
    <section className="experience" id="experience">
      <Container>
        <Row className="align-items-center">
          <Col>
            <div className="experience-bx">
              <h2>Experience</h2>
              <p>My work experience spans various projects and roles, where I've contributed to innovative solutions 
                 and continuously refined my technical skills.</p>
              <VerticalTimeline>
                {experiences.map((experience, index) => (
                  <ExperienceCard
                    key={`experience-${index}`}
                    experience={experience}
                  />
                ))}
              </VerticalTimeline>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Experience;