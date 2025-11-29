import { useState, useEffect, useCallback, memo } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import linkedin from '../assets/img/nav-icon1.svg';
import github from '../assets/img/github.svg';
import leetcode from '../assets/img/leetcode.svg';
import { HashLink } from 'react-router-hash-link';
import { BrowserRouter as Router } from "react-router-dom";

// Static navigation items - extracted outside component
const NAV_ITEMS = [
  ['home', 'Home'],
  ['skills', 'Skills'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['education', 'Education']
];

// Static social links - extracted outside component
const SOCIAL_LINKS = [
  ['https://www.linkedin.com/in/hariprasaadh-k-a5430a287', linkedin, 'LinkedIn'],
  ['https://github.com/Hariprasaadh', github, 'GitHub'],
  ['https://leetcode.com/u/Hariprasaadh_K/', leetcode, 'LeetCode']
];

export const NavBar = memo(() => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);

          // Scroll Spy Logic with offset for navbar
          const scrollPos = window.scrollY + 200;
          
          for (const [section] of NAV_ITEMS) {
            const element = document.getElementById(section);
            if (element) {
              const offsetTop = element.offsetTop;
              const offsetHeight = element.offsetHeight;
              if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
                setActiveLink(section);
                break;
              }
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Memoized handlers to prevent re-renders
  const onUpdateActiveLink = useCallback((value) => {
    setActiveLink(value);
    setExpanded(false);
  }, []);

  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setExpanded(false);
  }, []);

  return (
    <Router>
      <Navbar 
        expand="md" 
        className={`modern-navbar ${scrolled ? "scrolled" : ""}`}
        expanded={expanded}
        fixed="top"
      >
        <Container>
          <Navbar.Brand href="/" className="logo-container" onClick={closeMenu}>
            <div className="logo">
              <span className="logo-text">HP</span>
              <div className="logo-glow"></div>
            </div>
          </Navbar.Brand>
          
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav"
            aria-label="Toggle navigation menu"
            onClick={toggleExpanded}
          >
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {NAV_ITEMS.map(([value, text]) => (
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
                {SOCIAL_LINKS.map(([href, src, alt]) => (
                  <a 
                    key={alt} 
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={`Visit ${alt} profile`}
                  >
                    <img src={src} alt={alt} loading="lazy" />
                  </a>
                ))}
              </div>
              
              <HashLink to='#connect' className="connect-btn-wrapper" onClick={closeMenu}>
                <button className="vvd" aria-label="Contact me">
                  <span>Let's Connect</span>
                </button>
              </HashLink>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Router>
  );
});

NavBar.displayName = 'NavBar';