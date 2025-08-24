import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import linkedin from '../assets/img/nav-icon1.svg';
import github from '../assets/img/github.svg';
import leetcode from '../assets/img/leetcode.svg';
import { HashLink } from 'react-router-hash-link';
import { BrowserRouter as Router } from "react-router-dom";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
    setExpanded(false); // Close mobile menu when a link is clicked
  }

  return (
    <Router>
      <Navbar 
        expand="md" 
        className={`modern-navbar ${scrolled ? "scrolled" : ""}`}
        expanded={expanded}
        fixed="top"
      >
        <Container>
          <Navbar.Brand href="/" className="logo-container">
            <div className="logo">
              <span className="logo-text">HP</span>
              <div className="logo-glow"></div>
            </div>
          </Navbar.Brand>
          
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
            className="modern-toggler"
          >
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {[
                ['home', 'Home'],
                ['skills', 'Skills'],
                ['experience', 'Experience'],
                ['projects', 'Projects'],
                ['education', 'Education']
              ].map(([value, text]) => (
                <Nav.Link
                  key={value}
                  href={`#${value}`}
                  className={`modern-nav-link ${activeLink === value ? 'active' : ''}`}
                  onClick={() => onUpdateActiveLink(value)}
                >
                  <span className="nav-text">{text}</span>
                </Nav.Link>
              ))}
            </Nav>
            
            <div className="navbar-text">
              <div className="social-icon">
                {[
                  ['https://www.linkedin.com/in/hariprasaadh-k-a5430a287', linkedin, 'LinkedIn'],
                  ['https://github.com/Hariprasaadh', github, 'GitHub'],
                  ['https://leetcode.com/u/Hariprasaadh_K/', leetcode, 'LeetCode']
                ].map(([href, src, alt]) => (
                  <a 
                    key={alt} 
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <img src={src} alt={alt} />
                  </a>
                ))}
              </div>
              
              <HashLink to='#connect' className="connect-btn-wrapper">
                <button className="vvd">
                  <span>Let's Connect</span>
                </button>
              </HashLink>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Router>
  )
}