import React from 'react';
import { Container, Row, Col, Card, Breadcrumb, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col>
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Terms of Service</Breadcrumb.Item>
          </Breadcrumb>
          
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-success text-white py-3">
              <h1 className="mb-0 h3">Terms of Service</h1>
            </Card.Header>
            <Card.Body className="bg-white px-4 py-5">
              <p className="lead mb-4">
                These Terms of Service ("Terms") govern your use of the FoodDelights website and services. By accessing 
                or using our website, you agree to be bound by these Terms.
              </p>
              
              <div className="text-center my-4 py-2 border-top border-bottom border-success">
                <p className="mb-0">
                  <strong>Last Updated:</strong> April 15, 2025 | 
                  <Link to="/privacy" className="ms-2 text-success">View Privacy Policy</Link>
                </p>
              </div>
              
              <Accordion defaultActiveKey="0" className="mb-4">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>1. Account Registration and Security</Accordion.Header>
                  <Accordion.Body className="bg-light">
                    <p>To access certain features of our website, you may need to create an account. You are responsible for:</p>
                    <ul className="mb-0">
                      <li>Providing accurate and complete information when creating your account</li>
                      <li>Maintaining the confidentiality of your account credentials</li>
                      <li>All activities that occur under your account</li>
                      <li>Notifying us immediately of any unauthorized use of your account</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="1">
                  <Accordion.Header>2. Ordering and Payment</Accordion.Header>
                  <Accordion.Body className="bg-light">
                    <p>When placing an order through our website:</p>
                    <ul className="mb-0">
                      <li>You agree to provide current, complete, and accurate purchase information</li>
                      <li>We reserve the right to refuse or cancel your order at any time for reasons including, but not limited to: product availability, errors in product or pricing information, or suspected fraud</li>
                      <li>We charge your payment method when your order is processed</li>
                      <li>All payments are processed securely through our payment processors</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="2">
                  <Accordion.Header>3. Product Information</Accordion.Header>
                  <Accordion.Body className="bg-light">
                    <p>We strive to provide accurate product descriptions, prices, and availability information. However:</p>
                    <ul className="mb-0">
                      <li>We do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free</li>
                      <li>Images are for illustrative purposes only and may not exactly match the product</li>
                      <li>We reserve the right to limit quantities of products purchased</li>
                      <li>Product availability and pricing are subject to change without notice</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="3">
                  <Accordion.Header>4. Shipping and Delivery</Accordion.Header>
                  <Accordion.Body className="bg-light">
                    <p>When you place an order:</p>
                    <ul className="mb-0">
                      <li>Estimated delivery times are not guaranteed</li>
                      <li>Risk of loss and title for items purchased pass to you upon delivery</li>
                      <li>You are responsible for inspecting products upon receipt</li>
                      <li>We are not liable for delays in delivery due to carrier issues or events beyond our control</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="4">
                  <Accordion.Header>5. Returns and Refunds</Accordion.Header>
                  <Accordion.Body className="bg-light">
                    <p>Our return and refund policy:</p>
                    <ul className="mb-0">
                      <li>You may return products within 30 days of delivery</li>
                      <li>Products must be unused and in original packaging</li>
                      <li>Certain products may be non-returnable (perishable items, personalized items)</li>
                      <li>Refunds are processed within 5-7 business days after we receive the returned product</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              
              <section className="mb-5">
                <h2 className="h4 text-success mb-3">Intellectual Property</h2>
                <p>
                  The FoodDelights website and its original content, features, and functionality are owned by FoodDelights and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <div className="bg-light p-3 border-start border-success border-3 mt-3">
                  <h5 className="h6 mb-2">You may not:</h5>
                  <ul className="mb-0">
                    <li>Use our trademarks, logos, or other proprietary information without our express written permission</li>
                    <li>Reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website</li>
                    <li>Use any automated means to access our website or collect any information from the website</li>
                    <li>Use our website or content for any commercial purpose</li>
                  </ul>
                </div>
              </section>
              
              <section className="mb-5">
                <h2 className="h4 text-success mb-3">Limitation of Liability</h2>
                <p>
                  In no event shall FoodDelights, its officers, directors, employees, or agents, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul>
                  <li>Your access to or use of or inability to access or use the website</li>
                  <li>Any conduct or content of any third party on the website</li>
                  <li>Any content obtained from the website</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                </ul>
              </section>
              
              <section className="mb-5">
                <h2 className="h4 text-success mb-3">Termination</h2>
                <p>
                  We may terminate or suspend your account and bar access to the website immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </p>
              </section>
              
              <section>
                <h2 className="h4 text-success mb-3">Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at:</p>
                <div className="card bg-light border-0 p-3">
                  <address className="mb-0">
                    <div><strong>FoodDelights Legal Team</strong></div>
                    <div>1-23 Gourmet Street, Nellore</div>
                    <div>Email: legal@fooddelights.com</div>
                    <div>Phone: (+91) 99887 76655</div>
                  </address>
                </div>
              </section>
              
              <div className="mt-5 text-center">
                <p className="text-muted small">By using our website, you acknowledge that you have read and understood these Terms of Service.</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TermsOfService;