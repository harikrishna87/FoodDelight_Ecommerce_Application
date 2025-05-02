import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  companyName?: string;
  companyLogo?: string;
}

const LeafDecoration: React.FC<{ position: 'left' | 'right' }> = ({ position }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    [position]: 0,
    width: '120px',
    height: 'auto',
    opacity: 0.25,
    pointerEvents: 'none',
    zIndex: 0,
  };

  const svgPath = position === 'left' 
    ? "M10,50 C30,30 50,10 100,25 C80,40 80,50 90,80 C60,70 40,90 10,50" 
    : "M110,50 C90,30 70,10 20,25 C40,40 40,50 30,80 C60,70 80,90 110,50";

  return (
    <div style={style}>
      <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d={svgPath}
          fill="none"
          stroke="#28a745"
          strokeWidth="2"
        />
        <path
          d={position === 'left' 
            ? "M55,40 C60,30 70,25 85,30" 
            : "M65,40 C60,30 50,25 35,30"}
          fill="none"
          stroke="#28a745"
          strokeWidth="1.5"
        />
        <path
          d={position === 'left' 
            ? "M50,55 C55,45 65,40 80,45" 
            : "M70,55 C65,45 55,40 40,45"}
          fill="none"
          stroke="#28a745"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

const Footer: React.FC<FooterProps> = ({ 
  companyName = "FoodDelights", 
  companyLogo = "/logo.png" 
}) => {
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo(0, 0);
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-5 bg-white pt-5 pb-3 border-top" style={{ position: 'relative', overflow: 'hidden', borderRadius: "50px 50px 0px 0px" }}>
      <LeafDecoration position="left" />
      <LeafDecoration position="right" />
      
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="mb-4">
          <Col md={4} className="mb-4 mb-md-0">
            <div className="mb-4 d-flex align-items-center">
              <img 
                src={companyLogo} 
                alt={`${companyName} Logo`} 
                className="me-2" 
                width="40" 
                height="40"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }} 
              />
              <h4 className="mb-0 text-success">{companyName}</h4>
            </div>
            <p className="mb-3 text-dark">
              Bringing exceptional quality food products to your doorstep since 2005. We believe in sustainable sourcing and supporting local farmers.
            </p>
            <div className="mb-4">
              <h6 className="text-dark">Connect With Us</h6>
              <div className="d-flex social-icons">
                <a href="#" className="me-3 text-success" aria-label="Facebook" onClick={(e) => e.preventDefault()}>
                  <i className="fab fa-facebook-f fa-lg"></i>
                </a>
                <a href="#" className="me-3 text-success" aria-label="Instagram" onClick={(e) => e.preventDefault()}>
                  <i className="fab fa-instagram fa-lg"></i>
                </a>
                <a href="#" className="me-3 text-success" aria-label="Twitter" onClick={(e) => e.preventDefault()}>
                  <i className="fab fa-twitter fa-lg"></i>
                </a>
                <a href="#" className="me-3 text-success" aria-label="Pinterest" onClick={(e) => e.preventDefault()}>
                  <i className="fab fa-pinterest fa-lg"></i>
                </a>
                <a href="#" className="text-success" aria-label="YouTube" onClick={(e) => e.preventDefault()}>
                  <i className="fab fa-youtube fa-lg"></i>
                </a>
              </div>
            </div>
          </Col>
          
          <Col md={2} className="mb-4 mb-md-0">
            <h5 className="mb-3 text-success">Shop</h5>
            <Nav className="flex-column">
              <Nav.Link 
                href="/store" 
                className="text-dark px-0 py-1"
                onClick={handleNavigation('/menu-items')}
              >
                All Products
              </Nav.Link>
              <Nav.Link className="text-dark px-0 py-1">New Arrivals</Nav.Link>
              <Nav.Link className="text-dark px-0 py-1">Deals & Discounts</Nav.Link>
              <Nav.Link className="text-dark px-0 py-1">Gift Cards</Nav.Link>
            </Nav>
          </Col>
          
          <Col md={2} className="mb-4 mb-md-0">
            <h5 className="mb-3 text-success">Support</h5>
            <Nav className="flex-column">
              <Nav.Link 
                href="/contact" 
                className="text-dark px-0 py-1"
                onClick={handleNavigation('/contact')}
              >
                Contact Us
              </Nav.Link>
              <Nav.Link className="text-dark px-0 py-1">FAQ</Nav.Link>
              <Nav.Link className="text-dark px-0 py-1">Shipping Info</Nav.Link>
              <Nav.Link className="text-dark px-0 py-1">Returns & Exchanges</Nav.Link>
            </Nav>
          </Col>
          
          <Col md={4}>
            <h5 className="mb-3 text-success">Stay Updated</h5>
            <p className="text-dark">Subscribe to our newsletter for exclusive offers and updates on new products.</p>
            
            {subscribed ? (
              <div className="alert alert-success">
                <i className="fas fa-check-circle me-2"></i>
                Thank you for subscribing!
              </div>
            ) : (
              <Form onSubmit={handleSubscribe}>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Your email address"
                    aria-label="Your email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-success"
                  />
                  <Button variant="success" type="submit">
                    Subscribe
                  </Button>
                </InputGroup>
              </Form>
            )}
            
            <div className="mt-4">
              <h5 className="mb-3 text-success">Contact Info</h5>
              <address className="mb-0 text-dark">
                <div className="mb-2">
                  <i className="fas fa-map-marker-alt me-2 text-success"></i>
                  1-23 Gourmet Street, Nellore
                </div>
                <div className="mb-2">
                  <i className="fas fa-phone me-2 text-success"></i>
                  (+91) 99887 76655
                </div>
                <div>
                  <i className="fas fa-envelope me-2 text-success"></i>
                  support@fooddelights.com
                </div>
              </address>
            </div>
          </Col>
        </Row>
        
        <hr className="border-success" />
        
        <Row className="mt-4">
          <Col md={6} className="mb-3 mb-md-0">
            <div className="d-flex flex-wrap">
              <a 
                href="/privacy" 
                className="text-dark px-2 py-1 border-end border-success text-decoration-none"
                onClick={handleNavigation('/privacy')}
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-dark px-2 py-1 text-decoration-none"
                onClick={handleNavigation('/terms')}
              >
                Terms of Service
              </a>
            </div>
          </Col>
          
          <Col md={6} className="text-md-end">
            <p className="mb-0 text-muted small">
              &copy; {currentYear} {companyName}. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;