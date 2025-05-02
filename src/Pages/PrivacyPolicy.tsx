import React from 'react';
import { Container, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col>
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Privacy Policy</Breadcrumb.Item>
          </Breadcrumb>
          
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-success text-white py-3">
              <h1 className="mb-0 h3">Privacy Policy</h1>
            </Card.Header>
            <Card.Body className="bg-white px-4 py-5">
              <p className="lead mb-4">At FoodDelights, we value your privacy and are committed to protecting your personal information.</p>
              
              <section className="mb-5">
                <h2 className="h4 text-success mb-3">Information We Collect</h2>
                <p>We collect information that you provide directly to us, such as when you create an account, make a purchase, sign up for our newsletter, or contact customer service. This may include:</p>
                <ul className="text-dark">
                  <li>Contact information (name, email, phone number, shipping and billing address)</li>
                  <li>Account credentials (username and password)</li>
                  <li>Payment information (credit card details, billing address)</li>
                  <li>Order history and preferences</li>
                  <li>Demographic information</li>
                  <li>Communication preferences</li>
                </ul>
              </section>
              
              <section className="mb-5">
                <h2 className="h4 text-success mb-3">How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="text-dark">
                  <li>Process and fulfill your orders</li>
                  <li>Manage your account</li>
                  <li>Send transactional emails and order updates</li>
                  <li>Provide customer service</li>
                  <li>Send marketing communications if you've opted in</li>
                  <li>Improve our website and services</li>
                  <li>Detect and prevent fraud</li>
                </ul>
              </section>
              
              <section className="mb-5">
                <h2 className="h4 text-success mb-3">Cookie Policy</h2>
                <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.</p>
                <div className="bg-light p-3 border-start border-success border-3 mt-3">
                  <h5 className="h6 mb-2">Types of Cookies We Use:</h5>
                  <ul className="mb-0 text-dark">
                    <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
                    <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
                    <li><strong>Analytical cookies:</strong> Help us understand how visitors interact with our website</li>
                    <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements and track campaign performance</li>
                  </ul>
                </div>
              </section>
              
              <section className="mb-5">
                <h2 className="h4 text-success mb-3">Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include internal reviews of our data collection, storage, and processing practices and security measures, encryption of data, and physical security measures to guard against unauthorized access to systems where we store personal data.</p>
              </section>
              
              <section className="mb-5">
                <h2 className="h4 text-success mb-3">Your Rights</h2>
                <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                <ul className="text-dark">
                  <li>Access and receive a copy of your personal information</li>
                  <li>Rectify inaccurate or incomplete information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Restrict or object to certain processing activities</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>
              
              <section className="mb-5">
                <h2 className="h4 text-success mb-3">Updates to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.</p>
              </section>
              
              <section>
                <h2 className="h4 text-success mb-3">Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <div className="card bg-light border-0 p-3">
                  <address className="mb-0">
                    <div><strong>FoodDelights Privacy Team</strong></div>
                    <div>1-23 Gourmet Street, Nellore</div>
                    <div>Email: privacy@fooddelights.com</div>
                    <div>Phone: (+91) 99887 76655</div>
                  </address>
                </div>
              </section>
              
              <div className="mt-5 text-center">
                <p className="text-muted small">Last Updated: April 15, 2025</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PrivacyPolicy;