import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Image, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaTrash, FaInfoCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import confetti from "canvas-confetti";

declare const Razorpay: any;

interface CartItem {
  _id: string;
  name: string;
  image: string;
  original_price: number;
  discount_price: number;
  quantity: number;
  category: string;
  description: string;
}

const FoodNavbar: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [cartCount, setCartCount] = useState<number>(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [countdownValue, setCountdownValue] = useState<number>(10);

  const fetchCartItems = () => {
    setIsInitialLoading(true);
    fetch('https://fooddelight-back-end.onrender.com/cart/get_cart_items')
      .then(res => res.json())
      .then(data => {
        if (data && data.Cart_Items) {
          setCartItems(data.Cart_Items);
        }
      })
      .catch(error => {
        console.error('Failed to fetch cart items:', error);
      })
      .finally(() => {
        setIsInitialLoading(false);
      });
  };

  const clearCart = async () => {
    try {
      const response = await fetch('https://fooddelight-back-end.onrender.com/cart/clear_cart', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCartItems([]);
        setCartCount(0);
      } else {
        console.error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
    
    const handleCartUpdate = () => {
      fetchCartItems();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.discount_price * item.quantity, 0).toFixed(2);

  const handleCartToggle = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    setShowCart(!showCart);
  };

  const handleDeleteItem = (name: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.name !== name));

    fetch(`https://fooddelight-back-end.onrender.com/cart/delete_cart_item/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) {
          console.error('Failed to delete item from cart');
          fetchCartItems();
        }
      })
      .catch(error => {
        console.error('Error deleting item from cart:', error);
        fetchCartItems();
      });
  };

  const handleUpdateQuantity = (_id: string, quantity: number) => {
    if (quantity < 1) return;
    const updatedItems = cartItems.map(item =>
      item._id === _id ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);

    fetch('https://fooddelight-back-end.onrender.com/cart/update_cart_quantity', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id, quantity }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to update item quantity');
        }
        return res.json();
      })
      .catch(error => {
        console.error('Error updating item quantity:', error);
        fetchCartItems();
      });
  };

  const toggleItemDescription = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'appetizer':
        return 'primary';
      case 'main course':
        return 'danger';
      case 'dessert':
        return 'warning';
      case 'beverage':
        return 'info';
      default:
        return 'success';
    }
  };

  const triggerConfetti = () => {
    const duration = 10 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1060 };
    
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    
    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handleOrderSuccess = () => {
    clearCart();
    setShowCart(false);
    setShowSuccessMessage(true);
    setCountdownValue(10);
    triggerConfetti();
  };
  
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    
    if (showSuccessMessage && countdownValue > 0) {
      countdownInterval = setInterval(() => {
        setCountdownValue(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setShowSuccessMessage(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [showSuccessMessage, countdownValue]);

  const checkoutHandler = async (amount: number | string) => {
    try {
      const { data: keyData } = await axios.get("https://fooddelight-back-end.onrender.com/razorpay/getkey");
      const { key } = keyData;

      const { data: orderData } = await axios.post("https://fooddelight-back-end.onrender.com/razorpay/payment/process", {
        amount
      });
      const { order } = orderData;

      const options = {
        key,
        amount: amount,
        currency: 'INR',
        name: 'FoodDelights',
        description: 'Razorpay Payment',
        order_id: order.id,
        prefill: {
          name: 'Hari',
          email: 'Hari87@example.com',
          contact: '+91 9555003338'
        },
        theme: {
          color: '#5ced73'
        },
        handler: function(response: any) {
          if (response.razorpay_payment_id) {
            handleOrderSuccess();
          }
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg" expanded={expanded} sticky="top" className="shadow-sm py-2">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold text-success fs-3">FoodDelights</Navbar.Brand>

          <div className="d-flex order-lg-last">
            <Nav.Link onClick={handleCartToggle} className="position-relative me-2 me-lg-0">
              <FaShoppingCart size={28} />
              <div
                className="rounded-circle bg-danger d-flex justify-content-center align-items-center"
                style={{
                  color: "white",
                  width: "1.5rem",
                  height: "1.5rem",
                  position: "absolute",
                  top: 0,
                  right: 0,
                  transform: "translate(45%, -45%)",
                  fontSize: "0.75rem"
                }}
              >
                {cartCount}
              </div>
            </Nav.Link>

            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={() => setExpanded(!expanded)}
              className="ms-2"
            />
          </div>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" onClick={() => setExpanded(false)} className="fs-5 mx-2">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/menu-items" onClick={() => setExpanded(false)} className="fs-5 mx-2">Menu</Nav.Link>
              <Nav.Link as={NavLink} to="/contact" onClick={() => setExpanded(false)} className="fs-5 mx-2">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <div className={`cart-slider ${showCart ? 'show' : ''}`}>
        <div className="cart-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <h4 className="m-0">Your Cart</h4>
          <Button variant="link" className="close-btn" onClick={() => setShowCart(false)}>
            <FaTimes size={24} />
          </Button>
        </div>

        <div className="cart-body p-3">
          {isInitialLoading && (
            <div className="text-center my-3">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!isInitialLoading && cartItems.length === 0 ? (
            <div className="text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '30vh' }}>
              <div className="mb-3">
                <FaShoppingCart size={48} className="text-muted mb-3" />
                <h5 className="mb-3">Your cart is empty</h5>
                <Button variant="success" onClick={() => setShowCart(false)}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="cart-items" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {cartItems.map(item => (
                  <div key={item._id} className="card mb-3 border shadow-sm">
                    <div className="card-body p-3">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <Image src={item.image} alt={item.name} width="90" height="90" rounded className="shadow-sm" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="ms-3 flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <h6 className="mb-1 fw-bold">{item.name}</h6>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="border-0"
                              onClick={() => handleDeleteItem(item.name)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                          <Badge
                            bg={getCategoryColor(item.category)}
                            className="me-2 px-2 py-1"
                            style={{ fontSize: '0.8rem', borderRadius: '12px' }}
                          >
                            {item.category}
                          </Badge>
                          <Button
                            variant="link"
                            className="p-0 ms-1 text-decoration-none"
                            onClick={() => toggleItemDescription(item._id)}
                            aria-expanded={expandedItems[item._id]}
                          >
                            <small className="d-flex align-items-center">
                              <FaInfoCircle className="me-1" size={14} />
                              {expandedItems[item._id] ? 'Hide details' : 'Show details'}
                            </small>
                          </Button>
                          {expandedItems[item._id] && (
                            <div className="mt-2 mb-2 bg-light p-2 rounded" style={{ fontSize: '0.85rem' }}>
                              {item.description || "A delicious dish made with fresh ingredients and authentic spices."}
                            </div>
                          )}

                          <div className="mt-2">
                            <span className="text-decoration-line-through text-muted me-2">₹{item.original_price}</span>
                            <span className="text-success fw-bold">₹{item.discount_price.toFixed(2)}</span>
                          </div>
                          <div className="d-flex align-items-center mt-2">
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                              className="rounded-circle d-flex justify-content-center align-items-center"
                              style={{ width: '30px', height: '30px' }}
                            >
                              <FaMinus size={12} />
                            </Button>
                            <span className="mx-3 fw-bold">{item.quantity}</span>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              className="rounded-circle d-flex justify-content-center align-items-center"
                              style={{ width: '30px', height: '30px' }}
                            >
                              <FaPlus size={12} />
                            </Button>
                            <div className="ms-auto fw-bold">
                              ₹{(item.discount_price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {cartItems.length > 0 && (
                <div className="cart-footer mt-3 border-top pt-3">
                  <div className="d-flex justify-content-between mb-3">
                    <strong className="fs-5">Total:</strong>
                    <strong className="fs-5">₹{totalPrice}</strong>
                  </div>
                  <Button 
                    variant="success" 
                    className="w-100 py-2"
                    onClick={() => checkoutHandler(totalPrice)}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message-overlay">
          <div className="success-message-container">
            <div className="success-icon-wrapper mb-4">
              <div className="success-icon">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <h2 className="mb-3" style={{ fontWeight: 'bold', color: '#28a745' }}>Thank You For Your Purchase!</h2>
            <p className="mb-4" style={{ fontSize: '1.1rem' }}>Your delicious food will be prepared shortly. We appreciate your order!</p>
            <Button variant="success" onClick={() => setShowSuccessMessage(false)} className="glow-button">
              Continue Shopping
            </Button>
            <div className="mt-3">
              <small className="text-muted">This window will close in {countdownValue} seconds</small>
            </div>
          </div>
        </div>
      )}

      {showCart && <div className="cart-overlay" onClick={() => setShowCart(false)}></div>}
      <style>{`
        .cart-slider {
          position: fixed;
          top: 0;
          right: -400px;
          width: 100%;
          max-width: 400px;
          height: 100vh;
          background-color: white;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
          z-index: 1050;
          transition: right 0.3s ease-in-out;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .cart-slider.show {
          right: 0;
        }
        
        .cart-header {
          background-color: #f8f9fa;
        }
        
        .cart-body {
          flex: 1;
          overflow-y: auto;
        }
        
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1040;
        }
        
        .close-btn {
          color: #dc3545;
          padding: 0;
        }
        
        .close-btn:hover {
          color: #bb2d3b;
        }
        
        /* Success Message Styles */
        .success-message-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1060;
        }
        
        .success-message-container {
          background-color: white;
          border-radius: 10px;
          padding: 2rem;
          max-width: 550px;
          width: 90%;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.5s;
        }
        
        .success-icon-wrapper {
          display: flex;
          justify-content: center;
        }
        
        .success-icon {
          background-color: #28a745;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(40, 167, 69, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
          }
        }
        
        @keyframes glowing {
          0% { box-shadow: 0 0 5px #28a745; }
          50% { box-shadow: 0 0 20px #28a745; }
          100% { box-shadow: 0 0 5px #28a745; }
        }
        
        .glow-button {
          animation: glowing 1.5s infinite;
          transition: all 0.3s ease;
          font-weight: bold;
        }
        
        .glow-button:hover {
          transform: scale(1.05);
          animation: glowing 1s infinite;
        }
        
                  @media (max-width: 576px) {
          .cart-slider {
            max-width: 100%;
          }
          
          .success-message-container {
            width: 92%;
            padding: 1.5rem;
          }
          
          .success-icon {
            width: 70px;
            height: 70px;
          }
        }
        
        /* Animation for cart items */
        .cart-items .card {
          transition: all 0.2s ease-in-out;
        }
        
        .cart-items .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Button styling */
        .btn-outline-success {
          border-color: #28a745;
          color: #28a745;
        }
        
        .btn-outline-success:hover {
          background-color: #28a745;
          color: white;
        }
        
        /* Custom scrollbar for cart items */
        .cart-items::-webkit-scrollbar {
          width: 6px;
        }
        
        .cart-items::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .cart-items::-webkit-scrollbar-thumb {
          background: #28a745;
          border-radius: 10px;
        }
        
        .cart-items::-webkit-scrollbar-thumb:hover {
          background: #218838;
        }
      `}</style>
    </>
  );
};

export default FoodNavbar;