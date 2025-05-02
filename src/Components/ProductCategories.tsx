import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';

interface ProductCategoriesProps {
  products: Array<{
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
    rating?: number;
  }>;
  categoryDiscounts: { [key: string]: number };
  selectedCategory: string | null;
  handleCategoryClick: (category: string) => void;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
  products,
  categoryDiscounts,
  selectedCategory,
  handleCategoryClick
}) => {
  return (
    <div className="mb-5">
      <div className="text-center mb-4">
        <h2 className="section-title">Product Categories</h2>
      </div>
      <Row xs={1} md={3} className="g-4">
        {Array.from(new Set(products.map(p => p.category))).map((category, index) => (
          <Col key={index}>
            <Card
              className={`h-100 shadow-sm category-card border-0 bg-success bg-opacity-10 ${selectedCategory === category ? 'border-success border-2' : ''}`}
              style={{
                cursor: "pointer",
                borderRadius: "12px",
                transition: "all 0.3s ease"
              }}
              onClick={() => handleCategoryClick(category)}
            >
              <Card.Body className="text-center p-4">
                <Card.Title as="h4" className="fw-bold text-success mb-3">{category}</Card.Title>
                <Card.Text>
                  {products.filter(p => p.category === category).length} items
                </Card.Text>
                <Button variant="success" className="px-4">
                  View All <i className="fas fa-arrow-right ms-1"></i>
                </Button>
                {categoryDiscounts[category] && (
                  <div className="position-absolute" style={{
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    -{categoryDiscounts[category]}%
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductCategories;