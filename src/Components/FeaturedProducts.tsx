import React, { JSX, useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaShoppingBasket } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
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

interface FeaturedProductsProps {
  featuredProducts: Product[];
  categoryDiscounts: { [key: string]: number };
  calculateDiscountedPrice: (originalPrice: number, category: string) => number;
  renderStarRating: (rating: number) => JSX.Element;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  featuredProducts,
  categoryDiscounts,
  calculateDiscountedPrice,
  renderStarRating
}) => {
  const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});

  const addToCart = async (product: Product) => {
    try {
      setAddingToCart(prev => ({ ...prev, [product.id]: true }));

      const cartItem = {
        name: product.name,
        image: product.image,
        category: product.category,
        description: product.description,
        quantity: 1,
        original_price: product.price,
        discount_price: calculateDiscountedPrice(product.price, product.category)
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

  return (
    <div className="mb-5">
      <div className="text-center mb-4">
        <h2 className="section-title">Featured Products</h2>
      </div>
      <div className="marquee-container overflow-hidden position-relative">
        <div className="marquee-content d-flex">
          {[...featuredProducts, ...featuredProducts].map((product, index) => (
            <Card
              key={`${product.id}-${index}`}
              className="mx-2 shadow-sm product-card border-0"
              style={{ minWidth: '260px', maxWidth: '260px', borderRadius: "10px" }}
            >
              <div className="position-relative">
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", height: "175px", borderRadius: "10px 10px 0px 0px", objectFit: "cover" }}
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
                <div className="position-absolute bottom-0 start-0 m-2">
                  <span className="badge bg-success text-white">
                    {product.category}
                  </span>
                </div>
              </div>
              <Card.Body>
                <h5 className="mb-1 text-truncate">{product.name}</h5>
                {renderStarRating(product.rating || 0)}
                <Card.Text className="text-truncate">{product.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  {categoryDiscounts[product.category] ? (
                    <>
                      <div className="d-flex align-items-center">
                        <span className="fw-bold text-success">
                          ₹ {calculateDiscountedPrice(product.price, product.category).toFixed(2)}
                        </span>
                        <span className="text-muted text-decoration-line-through small ms-1">
                          ₹ {product.price.toFixed(2)}
                        </span>
                      </div>
                    </>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;