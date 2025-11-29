import { useState, useEffect, useCallback, memo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import resume from "../assets/resume.pdf";
import { ArrowRightCircle } from "react-bootstrap-icons";

export const Banner = memo(() => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300);
  const toRotate = ["ML Engineer", "GenAI Enthusiast", "Web Developer"];
  const period = 2000;

  // Memoized tick function
  const tick = useCallback(() => {
    const i = loopNum % toRotate.length;
    const fullText = toRotate[i];
    const updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(100);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(prev => prev + 1);
      setDelta(300);
    }
  }, [loopNum, isDeleting, text, toRotate, period]);

  useEffect(() => {
    const ticker = setInterval(tick, delta);
    return () => clearInterval(ticker);
  }, [tick, delta]);

  // Memoized click handler
  const handleResumeClick = useCallback(() => {
    window.open(resume, "_blank");
  }, []);

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} xl={7}>
            <div className="banner-content">
              <span className="tagline">Welcome to my Portfolio</span>
              <h1>
                {`Hi! I'm K. Hariprasaadh`}{" "}
                <span
                  className="txt-rotate"
                  data-period="1000"
                  data-rotate='["ML Engineer", "GenAI Enthusiast"]'
                >
                  <br />
                  <span className="wrap">{text}</span>
                </span>
              </h1>
              <p>
                I am a highly motivated and adaptable individual with a deep passion
                for AI, machine learning, and computer vision. Always eager to learn,
                innovate, and solve complex problems, I thrive in challenging
                environments that push me to grow. With a strong analytical mindset
                and a commitment to excellence, I continuously seek opportunities to
                make a meaningful impact through technology and innovation.
              </p>
              <button onClick={handleResumeClick} aria-label="View Resume">
                Check my Resume <ArrowRightCircle />
              </button>
            </div>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <div className="banner-img-container">
              <img
                src="/hari.jpg"
                alt="Hariprasaadh K - ML Engineer and GenAI Enthusiast"
                className="img-fluid rounded-circle shadow-lg banner-img"
                loading="eager"
                decoding="async"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
});

Banner.displayName = 'Banner';