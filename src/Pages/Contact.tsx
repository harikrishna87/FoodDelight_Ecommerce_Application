import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import emailjs from 'emailjs-com';
import { FaPaperPlane, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

interface FormDataType {
  [key: string]: string;
  fullname: string;
  email: string;
  phone: string;
  preferredDish: string;
  dietaryRestrictions: string;
  orderType: string;
  message: string;
}

const LeafDecoration: React.FC<{ position: 'left' | 'right' | 'top-left' | 'top-right' }> = ({ position }) => {
  const isTop = position.includes('top');
  const isLeft = position.includes('left');
  
  const style: React.CSSProperties = {
    position: 'absolute',
    [isTop ? 'top' : 'bottom']: 0,
    [isLeft ? 'left' : 'right']: 0,
    width: '150px',
    height: 'auto',
    opacity: 0.15,
    pointerEvents: 'none',
    zIndex: 0,
    transform: `${isTop ? 'scaleY(-1)' : ''} ${!isLeft ? 'scaleX(-1)' : ''}`,
  };

  return (
    <div style={style}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M80,40 Q120,20 160,30 Q180,60 170,100 Q160,130 120,150 Q80,130 70,100 Q60,60 80,40 Z"
          fill="#e8f5e9"
          stroke="#28a745"
          strokeWidth="1.5"
        />
        <path
          d="M120,150 Q120,170 130,200"
          stroke="#28a745"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M120,150 Q100,120 110,80 Q120,50 160,30"
          stroke="#28a745"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M110,80 Q130,85 150,70 M110,110 Q130,115 160,90"
          stroke="#28a745"
          strokeWidth="0.8"
          fill="none"
        />
        <path
          d="M50,90 Q60,70 80,65 Q90,80 85,100 Q70,110 50,90 Z"
          fill="#e8f5e9"
          stroke="#28a745"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    fullname: '',
    email: '',
    phone: '',
    preferredDish: '',
    dietaryRestrictions: '',
    orderType: '',
    message: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        'service_cypqzag',
        'template_smi2b6v',
        formData as Record<string, unknown>,
        '78l0nLUglTZmz0VAp'
      )
      .then(
        (_response) => {
          toast.success('Your message has been sent! We will get back to you soon.', {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setFormData({
            fullname: '',
            email: '',
            phone: '',
            preferredDish: '',
            dietaryRestrictions: '',
            orderType: '',
            message: '',
          });
          setLoading(false);
        },
        (error) => {
          toast.error('Unable to send your message. Please try again later.', {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          console.error('EmailJS Error:', error);
          setLoading(false);
        }
      );
  };

  return (
    <section className="contact-section py-5" style={{ position: 'relative', overflow: 'hidden' }}>
      <LeafDecoration position="left" />
      <LeafDecoration position="right" />
      <LeafDecoration position="top-left" />
      <LeafDecoration position="top-right" />
      
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="section-title">Contact Food Delights</h2>
            <p className="text-muted lead">
              <q>
                Have a question about our menu, catering services, or want to place a special order?
                Fill out the form below and our culinary team will be in touch shortly!
              </q>
            </p>
          </Col>
        </Row>

        <Row>
          <Col lg={5} className="mb-4 mb-lg-0">
            <Card className="contact-info-card h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="card-title mb-4">Reach Out To Us</h3>

                <div className="contact-info-item d-flex align-items-center mb-4">
                  <div className="icon-box me-3">
                    <FaMapMarkerAlt size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0">Our Location</h5>
                    <p className="mb-0 text-muted">123 Foodie Street, Nellore, Andhra Pradesh</p>
                  </div>
                </div>

                <div className="contact-info-item d-flex align-items-center mb-4">
                  <div className="icon-box me-3">
                    <FaPhone size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0">Order Hotline</h5>
                    <p className="mb-0 text-muted">+91 98765 43210</p>
                  </div>
                </div>

                <div className="contact-info-item d-flex align-items-center mb-4">
                  <div className="icon-box me-3">
                    <FaEnvelope size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0">Email Us</h5>
                    <p className="mb-0 text-muted">orders@fooddelights.com</p>
                  </div>
                </div>

                <div className="contact-info-item d-flex align-items-center mb-4">
                  <div className="icon-box me-3">
                    <FaUtensils size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0">Operating Hours</h5>
                    <p className="mb-0 text-muted">Mon-Sat: 10:00 AM - 10:00 PM</p>
                    <p className="mb-0 text-muted">Sunday: 11:00 AM - 9:00 PM</p>
                  </div>
                </div>

                <div className="map-container mt-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d45513.21203261365!2d79.96275383651195!3d14.437234694343417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4c8cca0e958771%3A0xd3036c2025161f55!2sNellore%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1743406326746!5m2!1sen!2sin"
                    style={{ border: 0, width: '100%', height: '250px', borderRadius: '8px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Food Delights Location"
                  ></iframe>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={7}>
            <Card className="contact-form-card border-0 shadow-sm">
              <Card.Body className="p-5">
                <h3 className="card-title mb-4">Send a Message</h3>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                          className="form-control-lg"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Your email"
                          required
                          className="form-control-lg"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                          className="form-control-lg"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Preferred Dish</Form.Label>
                        <Form.Control
                          type="text"
                          name="preferredDish"
                          value={formData.preferredDish}
                          onChange={handleChange}
                          placeholder="Your favorite dish"
                          className="form-control-lg"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Dietary Restrictions</Form.Label>
                        <Form.Select
                          name="dietaryRestrictions"
                          value={formData.dietaryRestrictions}
                          onChange={handleChange}
                          className="food-select custom-select"
                          style={{
                            border: '1px solid #cfe8cf',
                            borderColor: formData.dietaryRestrictions ? '#2e7d32' : '#cfe8cf'
                          }}
                        >
                          <option value="">None</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="vegan">Non-Vegetarian</option>
                          <option value="gluten-free">Gluten Free</option>
                          <option value="dairy-free">Dairy Free</option>
                          <option value="nut-allergy">Nut Allergy</option>
                          <option value="other">Other (Please specify in message)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Order Type</Form.Label>
                        <Form.Select
                          name="orderType"
                          value={formData.orderType}
                          onChange={handleChange}
                          className="food-select custom-select"
                          style={{
                            border: '1px solid #cfe8cf',
                            borderColor: formData.orderType ? '#2e7d32' : '#cfe8cf'
                          }}
                        >
                          <option value="">Select an option</option>
                          <option value="takeaway">Takeaway Order</option>
                          <option value="delivery">Home Delivery</option>
                          <option value="catering">Catering Service</option>
                          <option value="party-orders">Party Orders</option>
                          <option value="bulk-ordering">Bulk Ordering</option>
                          <option value="inquiry">General Inquiry</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Your Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements or questions"
                      required
                      style={{ height: '150px' }}
                      className="form-control-lg"
                    />
                  </Form.Group>
                  <Button
                    variant="success"
                    type="submit"
                    size="lg"
                    className="submit-btn w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <FaPaperPlane className="me-2" /> Send Message
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </section>
  );
};

export default Contact;