import { useState, useRef, useCallback, memo, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Mail, Phone, MapPin } from "lucide-react";
import emailjs from '@emailjs/browser';
import 'animate.css';

// Memoized animation variants - static objects outside component
const CONTAINER_VARIANTS = {
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

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

// Static form initial state
const FORM_INITIAL_DETAILS = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: ''
};

// Memoized ContactItem component
const ContactItem = memo(({ icon: Icon, title, content }) => (
  <motion.div 
    className="contact-item"
    variants={ITEM_VARIANTS}
    whileHover={{ x: 10, transition: { duration: 0.2 } }}
  >
    <Icon className="contact-icon" aria-hidden="true" />
    <div>
      <h4>{title}</h4>
      <p>{content}</p>
    </div>
  </motion.div>
));

ContactItem.displayName = 'ContactItem';

export const Contact = memo(() => {
  const form = useRef();
  const [formDetails, setFormDetails] = useState(FORM_INITIAL_DETAILS);
  const [buttonText, setButtonText] = useState('Send Message');
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Memoized form update handler
  const onFormUpdate = useCallback((category, value) => {
    setFormDetails(prev => ({
      ...prev,
      [category]: value
    }));
  }, []);

  // Memoized validation
  const validateForm = useCallback(() => {
    const { firstName, lastName, email, message } = formDetails;
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      return { isValid: false, message: "Please fill in all required fields." };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address." };
    }
    
    return { isValid: true };
  }, [formDetails]);

  // Memoized submit handler
  const handleSubmit = useCallback(async (e) => {
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
        setFormDetails(FORM_INITIAL_DETAILS);
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
      setTimeout(() => setStatus({}), 5000);
    }
  }, [formDetails, validateForm]);

  // Contact info items - static data
  const contactItems = useMemo(() => [
    { icon: Mail, title: 'Email', content: 'hari.kdh7376@gmail.com' },
    { icon: Phone, title: 'Phone', content: '+91 9342856540' },
    { icon: MapPin, title: 'Location', content: 'Chennai' }
  ], []);

  return (
    <section className="contact modern-contact" id="connect">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <motion.div
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="contact-wrapper"
            >
              <Row className="align-items-center">
                {/* Contact Info Section */}
                <Col md={6} className="contact-info-section">
                  <motion.div variants={ITEM_VARIANTS} className="contact-info">
                    <h2>Let's Connect</h2>
                    <p className="contact-intro">
                      Ready to collaborate on your next project? I'd love to hear from you! 
                      Whether it's about AI, machine learning, or web development, let's create something amazing together.
                    </p>
                    
                    <div className="contact-details">
                      {contactItems.map((item) => (
                        <ContactItem key={item.title} {...item} />
                      ))}
                    </div>
                  </motion.div>
                </Col>

                {/* Contact Form Section */}
                <Col md={6}>
                  <motion.div variants={ITEM_VARIANTS} className="contact-form-container">
                    <div className="modern-contact-form">
                      <h3>Send Message</h3>
                      <form ref={form} onSubmit={handleSubmit}>
                        <Row>
                          <Col xs={12} sm={6} className="mb-3">
                            <div className="form-group">
                              <input 
                                className="modern-input" 
                                type="text" 
                                value={formDetails.firstName} 
                                placeholder="First Name*" 
                                onChange={(e) => onFormUpdate('firstName', e.target.value)}
                                required
                                aria-label="First Name"
                                autoComplete="given-name"
                              />
                            </div>
                          </Col>
                          <Col xs={12} sm={6} className="mb-3">
                            <div className="form-group">
                              <input 
                                className="modern-input" 
                                type="text" 
                                value={formDetails.lastName} 
                                placeholder="Last Name*" 
                                onChange={(e) => onFormUpdate('lastName', e.target.value)}
                                required
                                aria-label="Last Name"
                                autoComplete="family-name"
                              />
                            </div>
                          </Col>
                          <Col xs={12} className="mb-3">
                            <div className="form-group">
                              <input 
                                className="modern-input" 
                                type="email" 
                                value={formDetails.email} 
                                placeholder="Email Address*" 
                                onChange={(e) => onFormUpdate('email', e.target.value)}
                                required
                                aria-label="Email Address"
                                autoComplete="email"
                              />
                            </div>
                          </Col>
                          <Col xs={12} className="mb-3">
                            <div className="form-group">
                              <input 
                                className="modern-input" 
                                type="tel" 
                                value={formDetails.phone} 
                                placeholder="Phone No. (Optional)" 
                                onChange={(e) => onFormUpdate('phone', e.target.value)}
                                aria-label="Phone Number"
                                autoComplete="tel"
                              />
                            </div>
                          </Col>
                          <Col xs={12} className="mb-3">
                            <div className="form-group">
                              <textarea 
                                className="modern-input modern-textarea" 
                                rows="5" 
                                value={formDetails.message} 
                                placeholder="Your Message*" 
                                onChange={(e) => onFormUpdate('message', e.target.value)}
                                required
                                aria-label="Your Message"
                              />
                            </div>
                          </Col>
                          <Col xs={12}>
                            <motion.button 
                              type="submit" 
                              className="modern-submit-btn"
                              disabled={isLoading}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {isLoading ? (
                                <div className="btn-loading">
                                  <div className="spinner" aria-hidden="true"></div>
                                  <span>Sending...</span>
                                </div>
                              ) : (
                                <>
                                  <Send size={18} aria-hidden="true" />
                                  <span>{buttonText}</span>
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
                                role="alert"
                              >
                                {status.success ? (
                                  <CheckCircle size={20} aria-hidden="true" />
                                ) : (
                                  <AlertCircle size={20} aria-hidden="true" />
                                )}
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
});

Contact.displayName = 'Contact';