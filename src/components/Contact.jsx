import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Contact = () => {
  const formInitialDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  }
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState('Send');
  const [status, setStatus] = useState({});

  const onFormUpdate = (category, value) => {
      setFormDetails({
        ...formDetails,
        [category]: value
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Sending...");
    let response = await fetch("http://localhost:5000/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(formDetails),
    });
    setButtonText("Send");
    let result = await response.json();
    setFormDetails(formInitialDetails);
    if (result.code == 200) {
      setStatus({ success: true, message: 'Message sent successfully' });
    } else {
      setStatus({ success: false, message: 'Something went wrong, please try again later.' });
    }
  };

  return (
    <section className="contact" id="connect" style={{
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh", 
      color: "white"
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="contact-form" style={{
              background: "rgba(255, 255, 255, 0.1)", 
              padding: "30px", 
              borderRadius: "15px", 
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
              textAlign: "center"
            }}>
              <h2 style={{ marginBottom: "20px" }}>Get In Touch</h2>
              <form onSubmit={handleSubmit}>
                <Row>
                  <Col xs={12} sm={6} className="mb-3">
                    <input className="form-control" type="text" value={formDetails.firstName} placeholder="First Name" onChange={(e) => onFormUpdate('firstName', e.target.value)} />
                  </Col>
                  <Col xs={12} sm={6} className="mb-3">
                    <input className="form-control" type="text" value={formDetails.lastName} placeholder="Last Name" onChange={(e) => onFormUpdate('lastName', e.target.value)} />
                  </Col>
                  <Col xs={12} className="mb-3">
                    <input className="form-control" type="email" value={formDetails.email} placeholder="Email Address" onChange={(e) => onFormUpdate('email', e.target.value)} />
                  </Col>
                  <Col xs={12} className="mb-3">
                    <input className="form-control" type="tel" value={formDetails.phone} placeholder="Phone No." onChange={(e) => onFormUpdate('phone', e.target.value)} />
                  </Col>
                  <Col xs={12} className="mb-3">
                    <textarea className="form-control" rows="4" value={formDetails.message} placeholder="Message" onChange={(e) => onFormUpdate('message', e.target.value)}></textarea>
                  </Col>
                  <Col xs={12}>
                    <button type="submit" className="btn btn-primary w-100" style={{ background: "#00bcd4", border: "none", padding: "10px", fontSize: "18px" }}>
                      {buttonText}
                    </button>
                  </Col>
                  {status.message && (
                    <Col className="mt-3">
                      <p className={status.success ? "text-success" : "text-danger"}>{status.message}</p>
                    </Col>
                  )}
                </Row>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};