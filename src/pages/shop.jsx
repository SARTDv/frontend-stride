import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slider';
import { toast, ToastContainer } from 'react-toastify';

const Shop = () => {
    
    const [activeCategory, setActiveCategory] = useState("Ninguna");
    const [keyword, setKeyword] = useState("");
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //Slider
    const MIN = 10;
    const MAX = 1000;
    const [values, setValues] = useState([MIN,MAX])
    
    // Función para obtener productos al cargar la página
    const fetchProducts = async (page = 1) => {
        setLoading(true);
        setError(null); // Resetea el estado de error antes de realizar la solicitud
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/products/search/?category=${activeCategory}&keyword=${keyword}&min_price=${values[0]}&max_price=${values[1]}&page=${page}`
            );
            if (!response.ok) {
                throw new Error("Error al obtener productos");
            }
            const data = await response.json();
            setProducts(data.products);
            setTotalPages(data.total_pages);
            setCurrentPage(page);
        } catch (error) {
            setError(error.message);
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };   

    
    useEffect(() => {
        fetchProducts();
    }, []); 

    // Función para manejar la búsqueda
    const handleSearch = async (palabra) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/products/search/?category=${activeCategory}&keyword=${palabra}&min_price=${values[0]}&max_price=${values[1]}`
            );
            if (!response.ok) {
                throw new Error("Error al realizar la búsqueda");
            }
            const data = await response.json();
            setProducts(data.products);
            setTotalPages(data.total_pages); 
            setCurrentPage(1);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    // Función para buscar por categoría
    const searchCategory = async (category) => {
        setActiveCategory(category);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/products/search/?category=${category}&keyword=${keyword}&min_price=${values[0]}&max_price=${values[1]}`
            );
            if (!response.ok) {
                throw new Error("Error al realizar la búsqueda");
            }
            const data = await response.json();
            setProducts(data.products);
            setTotalPages(data.total_pages);
            setCurrentPage(1);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (Id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to add products to your cart', { autoClose: true });
            return;
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/cart/addToCart/', 
                { token_key: token, product_id: Id }
            );
            toast.success('Succesfully added!', { autoClose: true });
        } catch (error) {
            console.error('Error al añadir al carrito:', error);
            toast.error('There is an issue with adding items to the cart.', { autoClose: true });
        }
    };

    const navigate = useNavigate();

    const handleProductClick = (id) => {
        // Guardar el ID del producto en localStorage
        localStorage.setItem('selectedProductId', id);
        // Navegar a la página de detalles
        navigate('/productDetails');
    };

    const categories = [
        "Ninguna",
        "tripleA",
        "tripleB",
        "Original",
        "Edicion Especial",
        "Premium",
        "Eco-friendly",
    ];


  return (
    <>
        <div>
            {/* Alertas de las mas alta calidddddaa */}
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
        </div>

        <div className="shop_sidebar_area">
        <div className="widget catagory mb-50">
            <h6 className="widget-title mb-30">Catagories</h6>
            <div className="catagories-menu">
                <ul style={{ paddingLeft: "0px" }}>
                    {categories.map((category) => (
                        <li
                            key={category}
                            onClick={() => searchCategory(category)}
                            className={activeCategory === category ? "active" : ""}                    
                        >
                            <a>{category}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        
            <div className="widget price mb-50">
                <h6 className="widget-title mb-30">Price</h6>

                <div className="widget-desc">
                    <div className="slider-range">
                        <Slider className={"slider"}
                                onChange={setValues}
                                value={values}
                                min={MIN}
                                max={MAX}
                        />
                        <div className="range-price">${values[0]} - ${values[1]}</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="amado_product_area section-padding-100">
                <div className="container-fluid">
                {/* Barra de búsqueda */}
                <div className="search-wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="search-content">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault(); 
                                            handleSearch(keyword); 
                                        }}
                                    >
                                        <input
                                            type="search"
                                            name="search"
                                            id="search"
                                            placeholder="Type your keyword..."
                                            value={keyword} 
                                            onChange={(e) => setKeyword(e.target.value)} 
                                        />
                                        <button type="submit">
                                            <img src="img/core-img/search.png" alt="Search" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {products.map((product) => (
                    <div className="col-12 col-sm-6 col-md-12 col-xl-6" key={product.id}>
                        <div className="single-product-wrapper" onClick={(e) => { e.stopPropagation(); handleProductClick(product.id);}}>
                        <div className="product-img">
                            <img src={product.imageurl} alt={product.name} />
                        </div>
                        <div className="product-description d-flex align-items-center justify-content-between">
                            <div className="product-meta-data">
                            <div className="line"></div>
                            <p className="product-price">${product.price}</p>
                            <h6>{product.name}</h6>
                            </div>
                            <div className="ratings-cart text-right">
                            <div className="ratings">
                                <i className="fa fa-star" aria-hidden="true"></i>
                            </div>
                            <div className="cart">
                                <a onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id);}} data-toggle="tooltip" data-placement="left" title="Add to Cart"><img src="img/core-img/cart.png" alt=""/></a>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-12">
                    <nav aria-label="navigation">
                        <ul className="pagination justify-content-end mt-50">
                        {[...Array(totalPages)].map((_, index) => (
                            <li
                            key={index}
                            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                            <button className="page-link" onClick={() => fetchProducts(index + 1)}>
                                {index + 1}
                            </button>
                            </li>
                        ))}
                        </ul>
                    </nav>
                    </div>
                </div>
            </div>
        </div>
    </>    
    
  );
};

export default Shop;