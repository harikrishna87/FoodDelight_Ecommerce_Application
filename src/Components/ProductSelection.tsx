import React, { useState } from 'react';
import { Row, Col, Card, Button, Alert, Badge, Pagination } from 'react-bootstrap';
import { FaSearch, FaShoppingBasket } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  rating?: number;
}

interface ProductSelectionProps {
  selectedProducts: Product[];
  selectedCategory: string | null;
  resetCategoryFilter: () => void;
  categoryDiscounts: { [key: string]: number };
  currentPage: number;
  paginate: (pageNumber: number) => void;
  filteredProducts: Product[];
  productsPerPage: number;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({
  selectedProducts,
  selectedCategory,
  resetCategoryFilter,
  categoryDiscounts,
  currentPage,
  paginate,
  filteredProducts,
  productsPerPage
}) => {
  const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});

  const calculateDiscountedPrice = (originalPrice: number, category: string) => {
    const discountPercentage = categoryDiscounts[category];
    if (!discountPercentage) return originalPrice;
    return originalPrice - (originalPrice * (discountPercentage / 100));
  };
  
  const addToCart = async (product: Product) => {
    try {
      setAddingToCart(prev => ({ ...prev, [product.id]: true }));
      
      const cartItem = {
        name: product.name,
        image: product.image,
        category: product.category,
        quantity: 1,
        original_price: product.price,
        discount_price: calculateDiscountedPrice(product.price, product.category),
      };

      const response = await axios.post('https://fooddelight-back-end.onrender.com/cart/add_item', cartItem);
      toast.success(response.data.message || "Item added to cart successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.info(error.response.data || "Item already exists in cart", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
      } else {
        toast.error("Failed to add item to cart", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
      }
      console.error("Error adding item to cart:", error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const renderStarRating = (rating: number) => {
    const safeRating = Math.min(5, Math.max(0, rating || 0));
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = (safeRating % 1) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="text-warning mb-2">
        {Array.from({ length: fullStars }, (_, i) => (
          <i key={`full-${i}`} className="fas fa-star"></i>
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
        {Array.from({ length: emptyStars }, (_, i) => (
          <i key={`empty-${i}`} className="far fa-star"></i>
        ))}
        <span className="text-muted ms-1">({safeRating.toFixed(1)})</span>
      </div>
    );
  };
  
  const truncateDescription = (description: string | undefined | null) => {
    if (!description) return "";
    
    const maxLength = 80;
    if (description.length <= maxLength) {
      return description;
    }
    return `${description.substring(0, maxLength)}...`;
  };

  const renderPaginationItems = () => {
    if (!selectedCategory || filteredProducts.length <= productsPerPage) return null;

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (totalPages <= 1) return null;

    const items = [];

    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      />
    );

    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => paginate(1)}
      >
        1
      </Pagination.Item>
    );

    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis-1" disabled />);
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(
          <Pagination.Item
            key={i}
            active={currentPage === i}
            onClick={() => paginate(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-2" disabled />);
    }

    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => paginate(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      />
    );

    return items;
  };

  return (
    <div className="mb-5">
      <ToastContainer />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">
          {selectedCategory ? `${selectedCategory} Products` : 'Our Selection'}
        </h2>
        {selectedCategory && (
          <div className="d-flex align-items-center">
            <Button variant="outline-success" size="sm" onClick={resetCategoryFilter}>
              <i className="fas fa-times me-1"></i> Clear Filter
            </Button>
          </div>
        )}
      </div>

      {selectedProducts.length > 0 ? (
        <>
          <Row xs={1} md={2} lg={4} className="g-4">
            {selectedProducts.map(product => (
              <Col key={product.id}>
                <Card className="h-100 shadow-sm product-card border-0" style={{ borderRadius: "10px" }}>
                  <div className="position-relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="img-fluid"
                      style={{ height: '180px', width: "100%", objectFit: "cover", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                      }}
                    />
                    {categoryDiscounts[product.category] && (
                      <div className="position-absolute" style={{
                        top: '10px',
                        right: '-8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '5px 15px 5px 10px',
                        fontWeight: 'bold',
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 50%)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}>
                        {categoryDiscounts[product.category]}% OFF
                      </div>
                    )}
                  </div>
                  <Card.Body>
                    <Badge bg="success" className="mb-2">{product.category}</Badge>
                    <Card.Title className="text-truncate">{product.name || 'Unnamed Product'}</Card.Title>
                    {renderStarRating(product.rating || 0)}
                    <Card.Text className="small text-muted mb-3">
                      {truncateDescription(product.description)}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      {categoryDiscounts[product.category] ? (
                        <div>
                          <span className="fw-bold text-success me-2">
                            ₹ {calculateDiscountedPrice(product.price, product.category).toFixed(2)}
                          </span>
                          <span className="text-muted text-decoration-line-through small">
                            ₹ {product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="fw-bold text-success">₹ {product.price.toFixed(2)}</span>
                      )}
                      <Button
                        variant="success"
                        size="sm"
                        className="d-flex align-items-center"
                        onClick={() => addToCart(product)}
                        disabled={addingToCart[product.id]}
                      >
                        {addingToCart[product.id] ? (
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        ) : (
                          <FaShoppingBasket className="me-1" />
                        )}
                        <span>{addingToCart[product.id] ? 'Adding...' : 'Add Item'}</span>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {renderPaginationItems() && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>{renderPaginationItems()}</Pagination>
            </div>
          )}
        </>
      ) : (
        <Alert variant="info" className="bg-success bg-opacity-10 border-success border-opacity-25">
          <div className="d-flex align-items-center">
            <FaSearch className="text-success me-3 fs-3" />
            <div>
              <p className="mb-0">No products found in this category. Please try another category or check back later.</p>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default ProductSelection;