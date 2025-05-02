import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Pagination } from 'react-bootstrap';
import { FaSearch, FaFilter, FaStar, FaPercent, FaLeaf, FaShoppingBasket } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

interface FilterOptions {
    category: string;
    minPrice: number;
    maxPrice: number;
    minRating: number;
}
interface CategoryDiscount {
    [key: string]: number;
}

const customStyles = `
.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(25, 135, 84, 0.1) !important;
    transition: all 0.3s ease;
}
.category-discount-banner {
    animation: fadeIn 0.5s ease-in-out;
}
.header-ribbon {
    position: relative;
    overflow: hidden;
}
.header-ribbon:before, .header-ribbon:after {
    content: '';
    position: absolute;
    bottom: -10px;
    width: 20px;
    height: 20px;
    z-index: -1;
    background: #198754;
    opacity: 0.7;
}
.header-ribbon:before {
    left: -10px;
    border-radius: 0 0 100% 0;
}
.header-ribbon:after {
    right: -10px;
    border-radius: 0 0 0 100%;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

const Store: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});
    const [filters, setFilters] = useState<FilterOptions>({
        category: '',
        minPrice: 0,
        maxPrice: 1000,
        minRating: 0
    });

    const [categoryDiscounts, setCategoryDiscounts] = useState<CategoryDiscount>({});

    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 8;

    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = customStyles;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://json-data-1-nrnj.onrender.com/products/');

                setProducts(response.data);
                setFilteredProducts(response.data);
                const uniqueCategories = [...new Set(response.data.map((product: Product) => product.category))] as string[];
                setCategories(uniqueCategories);

                const discounts: CategoryDiscount = {};
                uniqueCategories.forEach(category => {
                    discounts[category] = Math.floor(Math.random() * 30) + 5;
                });

                setCategoryDiscounts(discounts);

                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        let results = [...products];

        if (searchTerm) {
            results = results.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        if (filters.category) {
            results = results.filter(product => product.category === filters.category);
        }

        results = results.filter(product =>
            product.price >= filters.minPrice && product.price <= filters.maxPrice
        );

        results = results.filter(product => product.rating.rate >= filters.minRating);

        setFilteredProducts(results);
        setCurrentPage(1);
    }, [searchTerm, filters, products]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleFilterChange = (e: React.ChangeEvent<HTMLElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value } = target;

        if (name === 'minPrice' || name === 'maxPrice' || name === 'minRating') {
            const numValue = value === '' ? 0 : parseFloat(value);
            setFilters(prev => ({
                ...prev,
                [name]: numValue
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const addToCart = async (product: Product) => {
        try {
            setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
            const cartItem = {
                name: product.title,
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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchTerm(value);
    };

    const resetFilters = () => {
        setFilters({
            category: '',
            minPrice: 0,
            maxPrice: 1000,
            minRating: 0
        });
        setSearchTerm('');
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={i <= rating ? 'text-warning' : 'text-secondary'}
                    style={{ marginRight: '2px' }}
                />
            );
        }
        return stars;
    };

    const calculateDiscountedPrice = (originalPrice: number, category: string) => {
        const discountPercentage = categoryDiscounts[category];
        if (!discountPercentage) return originalPrice;
        return originalPrice - (originalPrice * (discountPercentage / 100));
    };

    const renderPaginationItems = () => {
        const items = [];

        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
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
            items.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
        }

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
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

        if (currentPage < totalPages - 2) {
            items.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
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
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            />
        );

        return items;
    };

    const renderSkeletonLoading = () => {
        return Array(8).fill(0).map((_, index) => (
            <Col lg={3} md={4} sm={6} className="mb-4" key={`skeleton-${index}`}>
                <Card className="h-100 shadow-sm">
                    <div className="position-relative" style={{ height: '180px', backgroundColor: '#e9ecef' }}></div>
                    <Card.Body>
                        <div className="placeholder-glow">
                            <div className="placeholder col-8 mb-3 p-2"></div>
                            <div className="placeholder col-8 mb-3 p-2"></div>
                            <div className="placeholder col-12 mb-3 p-2"></div>
                            <div className="d-flex justify-content-between">
                                <div className="placeholder col-4 p-2"></div>
                                <div className="placeholder col-3 p-2"></div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        ));
    };

    return (
        <div className="store-wrapper position-relative overflow-hidden">
            <div className="decoration-left-bottom position-absolute d-none d-md-block" style={{
                left: -50,
                bottom: -50,
                width: '200px',
                height: '200px',
                opacity: 0.15,
                zIndex: -1
            }}>
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.61,5.51a15.2,15.2,0,0,1,12.7-1.21c4,1.72,6.3,5.66,8.38,9.47,4.33,7.94,8.64,16,15.73,21.37s17.48,7.35,25.25,2.57c3.8-2.34,6.6-6.07,9-10s4.36-8,7-11.53c10-13.78,32.33-14.35,47.68-5.77,7.56,4.22,14.33,10.86,17.35,19.18s1.79,18.61-5,24c-5.38,4.25-13.12,4.78-19.78,2.66s-12.45-6.59-17.53-11.46C87.86,31.17,71.53,16.84,51.22,13.15c-5.35-1-10.8-1.15-16.22-1.68A92.7,92.7,0,0,1,3.61,5.51Z" transform="translate(6.5 55)" fill="#198754" />
                    <path d="M134.89,8.5c6.54,5.11,9.42,14.15,7.46,22.28S133.9,44,126.23,47.52C118.47,51.1,109.52,52.32,101,53.5,79.36,56.59,57.52,59.67,35.81,54.47s-43.54-22.77-44.76-44.71C-10.16-12.32,14.5-28.59,39.5-28c11.75.27,23.43,4.58,30.45,14,8.33,11.18,8.21,27.6,18.61,36.83,7.51,6.67,18.9,7.17,28.16,3.59a31.84,31.84,0,0,0,18.17-17.88" transform="translate(6.5 55)" fill="#198754" />
                    <path d="M98,111.39a134.3,134.3,0,0,0-19.42-47C70.79,52.58,58.77,43.81,45.25,39.5,27.51,33.8,7.49,37.75-7.5,45.12" transform="translate(6.5 55)" stroke="#198754" strokeMiterlimit="10" strokeWidth="2" />
                </svg>
            </div>

            <div className="decoration-right-bottom position-absolute d-none d-md-block" style={{
                right: -50,
                bottom: -50,
                width: '220px',
                height: '220px',
                opacity: 0.15,
                zIndex: -1
            }}>
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M196.39,5.51a15.2,15.2,0,0,0-12.7-1.21c-4,1.72-6.3,5.66-8.38,9.47-4.33,7.94-8.64,16-15.73,21.37s-17.48,7.35-25.25,2.57c-3.8-2.34-6.6-6.07-9-10s-4.36-8-7-11.53c-10-13.78-32.33-14.35-47.68-5.77-7.56,4.22-14.33,10.86-17.35,19.18s-1.79,18.61,5,24c5.38,4.25,13.12,4.78,19.78,2.66s12.45-6.59,17.53-11.46c15.51-14.65,31.84-29,52.15-32.67,5.35-1,10.8-1.15,16.22-1.68A92.7,92.7,0,0,0,196.39,5.51Z" transform="translate(-6.5 55)" fill="#198754" />
                    <path d="M65.11,8.5C58.57,13.61,55.69,22.65,57.65,30.78S66.1,44,73.77,47.52C81.53,51.1,90.48,52.32,99,53.5c21.64,3.09,43.48,6.17,65.19,1s43.54-22.77,44.76-44.71C210.16-12.32,185.5-28.59,160.5-28c-11.75.27-23.43,4.58-30.45,14-8.33,11.18-8.21,27.6-18.61,36.83-7.51,6.67-18.9,7.17-28.16,3.59A31.84,31.84,0,0,1,65.11,8.5" transform="translate(-6.5 55)" fill="#198754" />
                    <path d="M102,111.39a134.3,134.3,0,0,1,19.42-47c7.79-11.81,19.81-20.58,33.33-24.89,17.74-5.7,37.76-1.75,52.75,5.62" transform="translate(-6.5 55)" stroke="#198754" strokeMiterlimit="10" strokeWidth="2" />
                </svg>
            </div>

            <Container className="py-4 position-relative">
                <div className="text-center mb-5 position-relative">
                    <div className="header-ribbon position-relative py-3 bg-success bg-opacity-10 rounded-3 shadow-sm mb-4">
                        <h2 className="text-success mb-0 fw-bold" style={{ fontSize: "2em" }}>
                            For the Love of Delicious Food
                        </h2>
                        <div className="position-absolute" style={{
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}>
                            <FaLeaf className="text-success opacity-50" size={24} />
                        </div>
                        <div className="position-absolute" style={{
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}>
                            <FaShoppingBasket className="text-success opacity-50" size={24} />
                        </div>
                    </div>
                    <h5 className="text-center mb-0 fst-italic text-muted">
                        <q>Come with family & feel the joy of mouthwatering foods</q>
                    </h5>
                </div>

                <Row className="mb-4">
                    <Col md={6} className="mb-3 mb-md-0">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control border-success"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <Button variant="success">
                                <FaSearch />
                            </Button>
                        </div>
                    </Col>
                    <Col md={6} className="d-flex justify-content-md-end">
                        <Button
                            variant="outline-success"
                            className="d-flex align-items-center"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter className="me-2" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                    </Col>
                </Row>

                {!loading && categories.length > 0 && (
                    <div className="category-discount-banner p-3 mb-4 bg-success bg-opacity-10 rounded-3 shadow-sm position-relative overflow-hidden">
                        <h5 className="text-success mb-3 fw-bold">
                            <FaPercent className="me-2" /> Category Discounts
                        </h5>
                        <div className="d-flex flex-wrap gap-2">
                            {categories.map((category, index) => (
                                categoryDiscounts[category] && (
                                    <div
                                        key={index}
                                        className="badge bg-white border border-success text-success p-2 d-flex align-items-center"
                                        style={{ fontSize: '0.9rem', cursor: 'pointer' }}
                                        onClick={() => setFilters(prev => ({ ...prev, category }))}
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                        <span className="ms-1 badge bg-danger">
                                            {categoryDiscounts[category]}<FaPercent size={8} /> OFF
                                        </span>
                                    </div>
                                )
                            ))}
                        </div>
                        <div className="position-absolute" style={{ right: '-15px', bottom: '-15px', opacity: 0.1 }}>
                            <FaPercent size={80} className="text-success" />
                        </div>
                    </div>
                )}
                {showFilters && (
                    <Row className="mb-4 bg-success bg-opacity-10 p-3 rounded-3 shadow-sm filter-panel">
                        <Col md={3} className="mb-3 mb-md-0">
                            <Form.Group>
                                <Form.Label className="fw-bold text-success">Category</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    className="border-success"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                            {categoryDiscounts[category] ? ` (${categoryDiscounts[category]}% OFF)` : ''}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3} className="mb-3 mb-md-0">
                            <Form.Group>
                                <Form.Label className="fw-bold text-success">Min Price (₹)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="minPrice"
                                    min="0"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                    className="border-success"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3} className="mb-3 mb-md-0">
                            <Form.Group>
                                <Form.Label className="fw-bold text-success">Max Price (₹)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="maxPrice"
                                    min="0"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                    className="border-success"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="fw-bold text-success">Min Rating</Form.Label>
                                <Form.Select
                                    name="minRating"
                                    value={filters.minRating}
                                    onChange={handleFilterChange}
                                    className="border-success"
                                >
                                    <option value="0">Any Rating</option>
                                    <option value="1">1+ Stars</option>
                                    <option value="2">2+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="4.5">4.5+ Stars</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs={12} className="mt-3 d-flex justify-content-end">
                            <Button
                                variant="outline-success"
                                onClick={resetFilters}
                                className="reset-button"
                            >
                                Reset Filters
                            </Button>
                        </Col>
                    </Row>
                )}

                <div className="mb-4">
                    <p className="text-muted">
                        {loading ? (
                            <span className="placeholder-glow">
                                <span className="placeholder col-2"></span>
                            </span>
                        ) : (
                            `Showing ${indexOfFirstProduct + 1}-${Math.min(indexOfLastProduct, filteredProducts.length)} of ${filteredProducts.length} products`
                        )}
                    </p>
                </div>

                <Row>
                    {loading ? (
                        renderSkeletonLoading()
                    ) : (
                        currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <Col lg={3} md={4} sm={6} className="mb-4" key={product.id}>
                                    <Card className="h-100 shadow-sm product-card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="position-relative">
                                            <Card.Img
                                                variant="top"
                                                src={product.image}
                                                alt={product.title}
                                                style={{ height: '180px', objectFit: 'cover', borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
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

                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="mb-0 text-truncate">{product.title}</Card.Title>

                                            <div className="mb-2 d-flex align-items-center mt-2">
                                                {renderStars(product.rating.rate)}
                                                <span className="ms-1 small">({product.rating.count})</span>
                                            </div>

                                            <p className="mb-2 small text-muted">
                                                {product.description ? product.description.substring(0, 80) + '...' : 'No description available'}
                                            </p>

                                            <div className="mt-auto d-flex justify-content-between align-items-center">
                                                <div>
                                                    {categoryDiscounts[product.category] ? (
                                                        <>
                                                            <span className="fw-bold text-success me-2">
                                                                ₹ {calculateDiscountedPrice(product.price, product.category).toFixed(2)}
                                                            </span>
                                                            <span className="text-muted text-decoration-line-through small">
                                                                ₹ {product.price.toFixed(2)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="fw-bold text-success">₹ {product.price.toFixed(2)}</span>
                                                    )}
                                                </div>
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
                            ))
                        ) : (
                            <Col xs={12} className="text-center my-5">
                                <div className="py-5 bg-light rounded-3">
                                    <h3 className="text-muted">No products found</h3>
                                    <p>Try adjusting your filters or search term</p>
                                    <Button variant="success" onClick={resetFilters} className="mt-2">Reset All Filters</Button>
                                </div>
                            </Col>
                        )
                    )}
                </Row>

                {!loading && filteredProducts.length > productsPerPage && (
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination>{renderPaginationItems()}</Pagination>
                    </div>
                )}

                {loading && (
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination>
                            <Pagination.Prev disabled />
                            <Pagination.Item active>1</Pagination.Item>
                            <Pagination.Item disabled>2</Pagination.Item>
                            <Pagination.Item disabled>3</Pagination.Item>
                            <Pagination.Next disabled />
                        </Pagination>
                    </div>
                )}
            </Container>
            <ToastContainer />
        </div>
    );
};

export default Store;