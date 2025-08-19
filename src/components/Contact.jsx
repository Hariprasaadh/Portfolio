import { useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Mail, Phone, MapPin } from "lucide-react";
import emailjs from '@emailjs/browser';
import 'animate.css';

export const Contact = () => {
  const form = useRef();
  const formInitialDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  }
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState('Send Message');
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onFormUpdate = (category, value) => {
      setFormDetails({
        ...formDetails,
        [category]: value
      })
  }

  const validateForm = () => {
    const { firstName, lastName, email, message } = formDetails;
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      return { isValid: false, message: "Please fill in all required fields." };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address." };
    }
    
    return { isValid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) {
      setStatus({ success: false, message: validation.message });
      return;
    }

    setIsLoading(true);
    setButtonText("Sending...");
    
    try {
      const result = await emailjs.send(
        'service_st6rkc6', 
        'template_0gyif1o', 
        {
          from_name: `${formDetails.firstName} ${formDetails.lastName}`,
          from_email: formDetails.email,
          phone: formDetails.phone,
          message: formDetails.message,
          to_name: 'Hariprasaadh',
        },
        'YzCE_cIzWhmnMzFT1' 
      );
      
      if (result.text === 'OK') {
        setStatus({ 
          success: true, 
          message: 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.' 
        });
        setFormDetails(formInitialDetails);
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus({ 
        success: false, 
        message: 'Something went wrong. Please try again or contact me directly via email.' 
      });
    } finally {
      setIsLoading(false);
      setButtonText("Send Message");
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setStatus({});
      }, 5000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="contact modern-contact" id="connect">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="contact-wrapper"
            >
              <Row className="align-items-center">
                {/* Contact Info Section */}
                <Col md={6} className="contact-info-section">
                  <motion.div variants={itemVariants} className="contact-info">
                    <h2>Let's Connect</h2>
                    <p className="contact-intro">
                      Ready to collaborate on your next project? I'd love to hear from you! 
                      Whether it's about AI, machine learning, or web development, let's create something amazing together.
                    </p>
                    
                    <div className="contact-details">
                      <motion.div 
                        className="contact-item"
                        variants={itemVariants}
                        whileHover={{ x: 10, transition: { duration: 0.2 } }}
                      >
                        <Mail className="contact-icon" />
                        <div>
                          <h4>Email</h4>
                          <p>hari.kdh7376@gmail.com</p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="contact-item"
                        variants={itemVariants}
                        whileHover={{ x: 10, transition: { duration: 0.2 } }}
                      >
                        <Phone className="contact-icon" />
                        <div>
                          <h4>Phone</h4>
                          <p>+91 9342856540</p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="contact-item"
                        variants={itemVariants}
                        whileHover={{ x: 10, transition: { duration: 0.2 } }}
                      >
                        <MapPin className="contact-icon" />
                        <div>
                          <h4>Location</h4>
                          <p>Chennai</p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </Col>

                {/* Contact Form Section */}
                <Col md={6}>
                  <motion.div variants={itemVariants} className="contact-form-container">
                    <div className="modern-contact-form">
                      <h3>Send Message</h3>
                      <form ref={form} onSubmit={handleSubmit}>
                        <Row>
                          <Col xs={12} sm={6} className="mb-3">
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              className="form-group"
                            >
                              <input 
                                className="modern-input" 
                                type="text" 
                                value={formDetails.firstName} 
                                placeholder="First Name*" 
                                onChange={(e) => onFormUpdate('firstName', e.target.value)}
                                required
                              />
                            </motion.div>
                          </Col>
                          <Col xs={12} sm={6} className="mb-3">
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              className="form-group"
                            >
                              <input 
                                className="modern-input" 
                                type="text" 
                                value={formDetails.lastName} 
                                placeholder="Last Name*" 
                                onChange={(e) => onFormUpdate('lastName', e.target.value)}
                                required
                              />
                            </motion.div>
                          </Col>
                          <Col xs={12} className="mb-3">
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              className="form-group"
                            >
                              <input 
                                className="modern-input" 
                                type="email" 
                                value={formDetails.email} 
                                placeholder="Email Address*" 
                                onChange={(e) => onFormUpdate('email', e.target.value)}
                                required
                              />
                            </motion.div>
                          </Col>
                          <Col xs={12} className="mb-3">
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              className="form-group"
                            >
                              <input 
                                className="modern-input" 
                                type="tel" 
                                value={formDetails.phone} 
                                placeholder="Phone No. (Optional)" 
                                onChange={(e) => onFormUpdate('phone', e.target.value)}
                              />
                            </motion.div>
                          </Col>
                          <Col xs={12} className="mb-3">
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              className="form-group"
                            >
                              <textarea 
                                className="modern-input modern-textarea" 
                                rows="5" 
                                value={formDetails.message} 
                                placeholder="Your Message*" 
                                onChange={(e) => onFormUpdate('message', e.target.value)}
                                required
                              />
                            </motion.div>
                          </Col>
                          <Col xs={12}>
                            <motion.button 
                              type="submit" 
                              className="modern-submit-btn"
                              disabled={isLoading}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {isLoading ? (
                                <div className="btn-loading">
                                  <div className="spinner"></div>
                                  Sending...
                                </div>
                              ) : (
                                <>
                                  <Send size={18} />
                                  {buttonText}
                                </>
                              )}
                            </motion.button>
                          </Col>
                          
                          {status.message && (
                            <Col xs={12} className="mt-3">
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`status-message ${status.success ? 'success' : 'error'}`}
                              >
                                {status.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                <p>{status.message}</p>
                              </motion.div>
                            </Col>
                          )}
                        </Row>
                      </form>
                    </div>
                  </motion.div>
                </Col>
              </Row>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};