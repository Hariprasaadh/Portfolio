import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { VerticalTimeline } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import EducationCard from "../cards/EducationCard";
import { education } from "../data/constants";

export const Education = () => {
  return (
    <section className="education" id="education">
      <Container>
        <Row className="align-items-center">
          <Col>
            <div className="education-bx">
              <h2>Education</h2>
              <p>
                My education has been a path of continuous learning and exploration, 
                shaping my passion for technology and innovation. 
                Here are the details of my academic journey.
              </p>
              <VerticalTimeline>
                {education.map((education, index) => (
                  <EducationCard 
                    key={`education-${index}`} 
                    education={education} 
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

export default Education;