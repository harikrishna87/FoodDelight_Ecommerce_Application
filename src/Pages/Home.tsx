import { useState, useEffect } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPercent, FaLeaf, FaShoppingBasket } from 'react-icons/fa';
import customStyles from "../styles/Styles";
import Testimonials from '../Components/Testimonials';
import ProductCategories from '../Components/ProductCategories';
import ProductSelection from '../Components/ProductSelection';
import FeaturedProducts from '../Components/FeaturedProducts';
import SkeletonLoadingState from '../Components/SkeletonLoading_Animation';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  rating?: number;
}

export default function Homepage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(12);
  const [categoryDiscounts, setCategoryDiscounts] = useState<{ [key: string]: number }>({});

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

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
        const response = await fetch('https://json-data-1-nrnj.onrender.com/products/');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        const typedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.title,
          description: item.description || 'No description available',
          image: item.image || '',
          price: typeof item.price === 'number' ? item.price : 0,
          category: item.category || 'Uncategorized',
          rating: typeof item.rating === 'number' ? item.rating : Math.round((3 + Math.random() * 2) * 10) / 10
        }));

        setProducts(typedProducts);
        const shuffledProducts = shuffleArray<Product>(typedProducts);
        setFeaturedProducts(shuffledProducts.slice(0, 8));
        setSelectedProducts(shuffleArray<Product>([...shuffledProducts]).slice(0, productsPerPage));

        const uniqueCategories = [...new Set(typedProducts.map(product => product.category))];
        const discounts: { [key: string]: number } = {};
        uniqueCategories.forEach(category => {
          discounts[category] = Math.floor(Math.random() * 30) + 5;
        });
        setCategoryDiscounts(discounts);

        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productsPerPage]);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter(product => product.category === selectedCategory);
      setFilteredProducts(filtered);
      setCurrentPage(1);
      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      setSelectedProducts(filtered.slice(indexOfFirstProduct, indexOfLastProduct));
    } else {
      setFilteredProducts([]);
      setSelectedProducts(shuffleArray<Product>([...products]).slice(0, productsPerPage));
    }
  }, [selectedCategory, products]);

  useEffect(() => {
    if (selectedCategory && filteredProducts.length > 0) {
      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      setSelectedProducts(filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct));
    }
  }, [currentPage, filteredProducts, productsPerPage, selectedCategory]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const resetCategoryFilter = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
    setSelectedProducts(shuffleArray<Product>([...products]).slice(0, productsPerPage));
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const calculateDiscountedPrice = (originalPrice: number, category: string) => {
    const discountPercentage = categoryDiscounts[category];
    if (!discountPercentage) return originalPrice;
    return originalPrice - (originalPrice * (discountPercentage / 100));
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

  if (loading) {
    return (
      <SkeletonLoadingState/>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100 position-relative overflow-hidden">
      <div className="decoration-left-bottom position-absolute d-none d-md-block" style={{
        left: -50,
        bottom: -50,
        width: '200px',
        height: '200px',
        opacity: 0.15,
        zIndex: -1
      }}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.61,5.51a15.2,15.2,0,0,1,12.7-1.21c4,1.72,6.3,5.66,8.38,9.47,4.33,7.94,8.64,16,15.73,21.37s17.48,7.35,25.25,2.57c3.8-2.34,6.6-6.07,9-10s4.36-8,7-11.53c10-13.78,32.33-14.35,47.68-5.77,7.56,4.22,14.33,10.86,17.35,19.18s1.79,18.61-5,24c-5.38,4.25-13.12,4.78-19.78,2.66s-12.45-6.59-17.53-11.46C87.86,31.17,71.53,16.84,51.22,13.15c-5.35-1-10.8-1.15-16.22-1.68A92.7,92.7,0,0,1,3.61,5.51Z" fill="#094c2e" />
          <path d="M134.89,8.5c6.54,5.11,9.42,14.15,7.46,22.28S133.9,44,126.23,47.52C118.47,51.1,109.52,52.32,101,53.5,79.36,56.59,57.52,59.67,35.81,54.47s-43.54-22.77-44.76-44.71C-10.16-12.32,14.5-28.59,39.5-28c11.75.27,23.43,4.58,30.45,14,8.33,11.18,8.21,27.6,18.61,36.83,7.51,6.67,18.9,7.17,28.16,3.59a31.84,31.84,0,0,0,18.17-17.88" fill="#094c2e" />
          <path d="M98,111.39a134.3,134.3,0,0,0-19.42-47C70.79,52.58,58.77,43.81,45.25,39.5,27.51,33.8,7.49,37.75-7.5,45.12" stroke="#094c2e" stroke-miterlimit="10" stroke-width="3" />
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
          <path d="M196.39,5.51a15.2,15.2,0,0,0-12.7-1.21c-4,1.72-6.3,5.66-8.38,9.47-4.33,7.94-8.64,16-15.73,21.37s-17.48,7.35-25.25,2.57c-3.8-2.34-6.6-6.07-9-10s-4.36-8-7-11.53c-10-13.78-32.33-14.35-47.68-5.77-7.56,4.22-14.33,10.86-17.35,19.18s-1.79,18.61,5,24c5.38,4.25,13.12,4.78,19.78,2.66s12.45-6.59,17.53-11.46c15.51-14.65,31.84-29,52.15-32.67,5.35-1,10.8-1.15,16.22-1.68A92.7,92.7,0,0,0,196.39,5.51Z" transform="translate(-100 0)" fill="#094c2e" />
          <path d="M65.11,8.5C58.57,13.61,55.69,22.65,57.65,30.78S66.1,44,73.77,47.52C81.53,51.1,90.48,52.32,99,53.5c21.64,3.09,43.48,6.17,65.19,1s43.54-22.77,44.76-44.71C210.16-12.32,185.5-28.59,160.5-28c-11.75.27-23.43,4.58-30.45,14-8.33,11.18-8.21,27.6-18.61,36.83-7.51,6.67-18.9,7.17-28.16,3.59A31.84,31.84,0,0,1,65.11,8.5" transform="translate(-100 0)" fill="#094c2e" />
          <path d="M102,111.39a134.3,134.3,0,0,1,19.42-47c7.79-11.81,19.81-20.58,33.33-24.89,17.74-5.7,37.76-1.75,52.75,5.62" transform="translate(-100 0)" stroke="#094c2e" stroke-miterlimit="10" stroke-width="3" />
        </svg>
      </div>

      <div className="header-ribbon text-white py-4 mb-5 bg-success bg-opacity-10 position-relative" style={{borderRadius: "10px" }}>
        <Container className="text-center py-4">
          <h1 className="display-4 fw-bold mb-3" style={{ color: "#1D8A60" }}>Dive into Delights Of Delectable Food</h1>
          <p className="lead mb-3" style={{ color: "#1D8A60" }}><q>Where Each Plate Weaves a Story of Culinary Mastery and Passionate Craftsmanship</q></p>
          <Button variant="light" size="lg">
            <Link to="/menu-items" className="text-success text-decoration-none">Shop Now</Link>
          </Button>
          <div className="position-absolute" style={{
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            <FaLeaf className="text-white opacity-50" size={24} />
          </div>
          <div className="position-absolute" style={{
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            <FaShoppingBasket className="text-white opacity-50" size={24} />
          </div>
        </Container>
      </div>
      <Container className="py-4">
        <div className="category-discount-banner p-3 mb-4 bg-opacity-10 rounded-3 bg-success shadow-sm position-relative overflow-hidden">
          <h5 className="text-success mb-3 fw-bold">
            <FaPercent className="me-2" /> Category Discounts
          </h5>
          <div className="d-flex flex-wrap gap-2">
            {Object.keys(categoryDiscounts).map((category, index) => (
              <div
                key={index}
                className="badge bg-white border border-success text-success p-2 d-flex align-items-center"
                style={{ fontSize: '0.9rem', cursor: 'pointer' }}
                onClick={() => handleCategoryClick(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <span className="ms-1 badge bg-danger">
                  {categoryDiscounts[category]}<FaPercent size={8} />  OFF
                </span>
              </div>
            ))}
          </div>
          <div className="position-absolute" style={{ right: '-15px', bottom: '-15px', opacity: 0.1 }}>
            <FaPercent size={80} className="text-success" />
          </div>
        </div>

        <FeaturedProducts 
          featuredProducts={featuredProducts}
          categoryDiscounts={categoryDiscounts}
          calculateDiscountedPrice={calculateDiscountedPrice}
          renderStarRating={renderStarRating}
        />

        <ProductCategories 
          products={products}
          categoryDiscounts={categoryDiscounts}
          selectedCategory={selectedCategory}
          handleCategoryClick={handleCategoryClick}
        />

        <ProductSelection 
          selectedProducts={selectedProducts}
          selectedCategory={selectedCategory}
          resetCategoryFilter={resetCategoryFilter}
          categoryDiscounts={categoryDiscounts}
          currentPage={currentPage}
          paginate={paginate}
          filteredProducts={filteredProducts}
          productsPerPage={productsPerPage}
        />

        <Testimonials />

      </Container>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}