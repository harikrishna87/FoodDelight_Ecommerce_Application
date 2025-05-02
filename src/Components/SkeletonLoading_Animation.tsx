import { Container, Row, Col } from 'react-bootstrap';
import { FaPercent } from 'react-icons/fa';

const SkeletonPulse = ({ height = '20px', width = '100%', className = '' }) => (
  <div 
    className={`skeleton-pulse ${className}`}
    style={{ 
      height, 
      width, 
      backgroundColor: '#e9ecef',
      borderRadius: '4px',
      animation: 'pulse 1.5s ease-in-out infinite'
    }}
  ></div>
);

const SkeletonLoadingState = () => {
  return (
    <div className="bg-light min-vh-100 position-relative overflow-hidden">
      <div className="header-ribbon text-white py-4 mb-5 bg-success bg-opacity-10 position-relative" style={{borderRadius: "10px" }}>
        <Container className="text-center py-4">
          <SkeletonPulse height="48px" width="70%" className="mx-auto mb-3" />
          <SkeletonPulse height="24px" width="50%" className="mx-auto mb-3" />
          <SkeletonPulse height="48px" width="150px" className="mx-auto" />
        </Container>
      </div>
      <Container className="py-4">
        <div className="category-discount-banner p-3 mb-4 bg-opacity-10 rounded-3 bg-success shadow-sm position-relative overflow-hidden">
          <div className="d-flex align-items-center mb-3">
            <FaPercent className="me-2 text-success" /> 
            <SkeletonPulse height="24px" width="200px" />
          </div>
          <div className="d-flex flex-wrap gap-2">
            {Array(6).fill(0).map((_, index) => (
              <SkeletonPulse 
                key={index} 
                height="32px" 
                width={`${Math.floor(Math.random() * 30) + 80}px`}
              />
            ))}
          </div>
        </div>
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <SkeletonPulse height="32px" width="200px" />
            <SkeletonPulse height="24px" width="100px" />
          </div>
          <Row>
            {Array(4).fill(0).map((_, index) => (
              <Col md={3} sm={6} key={index} className="mb-4">
                <div className="card h-100 shadow-sm border-0">
                  <SkeletonPulse height="180px" className="card-img-top" />
                  <div className="card-body">
                    <SkeletonPulse height="24px" width="80%" className="mb-2" />
                    <SkeletonPulse height="20px" width="40%" className="mb-2" />
                    <SkeletonPulse height="18px" width="60%" className="mb-3" />
                    <div className="d-flex justify-content-between">
                      <SkeletonPulse height="28px" width="40%" />
                      <SkeletonPulse height="28px" width="40%" />
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        <div className="mb-5">
          <SkeletonPulse height="32px" width="250px" className="mb-4" />
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {Array(6).fill(0).map((_, index) => (
              <SkeletonPulse 
                key={index} 
                height="150px" 
                width="400px" 
              />
            ))}
          </div>
        </div>
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <SkeletonPulse height="32px" width="200px" />
            <SkeletonPulse height="38px" width="120px" />
          </div>
          <Row>
            {Array(8).fill(0).map((_, index) => (
              <Col lg={3} md={4} sm={6} key={index} className="mb-4">
                <div className="card h-100 shadow-sm border-0">
                  <SkeletonPulse height="180px" className="card-img-top" />
                  <div className="card-body">
                    <SkeletonPulse height="24px" width="80%" className="mb-2" />
                    <SkeletonPulse height="20px" width="40%" className="mb-2" />
                    <SkeletonPulse height="18px" width="60%" className="mb-3" />
                    <div className="d-flex justify-content-between">
                      <SkeletonPulse height="28px" width="40%" />
                      <SkeletonPulse height="28px" width="40%" />
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          
          <div className="d-flex justify-content-center mt-4">
            {Array(3).fill(0).map((_, index) => (
              <SkeletonPulse 
                key={index} 
                height="38px" 
                width="38px"
                className="mx-1 rounded" 
              />
            ))}
          </div>
        </div>

        <div className="mb-5">
          <SkeletonPulse height="32px" width="200px" className="mb-4 mx-auto" />
          <Row>
            {Array(3).fill(0).map((_, index) => (
              <Col md={4} key={index} className="mb-4">
                <div className="card h-100 shadow-sm border-0 p-3">
                  <SkeletonPulse height="24px" width="40%" className="mb-3" />
                  <SkeletonPulse height="18px" className="mb-2" />
                  <SkeletonPulse height="18px" className="mb-2" />
                  <SkeletonPulse height="18px" width="80%" className="mb-3" />
                  <div className="d-flex align-items-center">
                    <SkeletonPulse height="48px" width="48px" className="rounded-circle me-3" />
                    <SkeletonPulse height="24px" width="120px" />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      <style>
        {`
          @keyframes pulse {
            0% {
              opacity: 0.6;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0.6;
            }
          }
          .skeleton-pulse {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: pulse-bg 1.8s ease-in-out infinite;
          }
          @keyframes pulse-bg {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: -200% 0%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default SkeletonLoadingState;