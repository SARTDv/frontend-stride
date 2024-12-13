import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    useEffect(() => {
        const fetchCartItems = async () => {
            const token_key = localStorage.getItem('token');

            try {
                const response = await axios.post('https://backend-stride.onrender.com/api/cart/Showcart/', 
                    { token_key: token_key }
                );
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, []);

    const Remove = async (productId) => {
    
        try {
            const response = await axios.post('https://backend-stride.onrender.com/api/cart/Remove/', {
                product_id: productId,
            });
    
            if (response.data.success) {
                setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
                toast.success('Succesfully Removed!', { autoClose: true });
            } else {
                toast.error("Error deleting !",{autoclose:true})
                console.error("Error removing item from cart:", response.data.message);
            }
        } catch (error) {
            console.error("Error during remove request:", error);
        }
    };

    const handleCreateOrder = async () => {
        try {
            // Verificar si hay órdenes pendientes
            const checkResponse = await axios.get(
                "https://backend-stride.onrender.com/api/orders/check-pending/"
            );
    
            if (checkResponse.data.has_pending) {
                toast.warning("order pending payment. Complete or cancel your order before creating a new one.");
                return; // Salir si hay una orden pendiente
            }
    
            // Crear una nueva orden
            const createResponse = await axios.post(
                "https://backend-stride.onrender.com/api/orders/create/"
            );
    
            toast.success("Orden creada exitosamente: " + createResponse.data.message);
            navigate("/checkout");
        } catch (error) {
            console.error("Error creando la orden:", error.response ? error.response.data : error);
            toast.error("Error creando la orden: " + (error.response ? error.response.data : error.message));
        }
    };

    const totalSum = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="cart-table-area section-padding-100">
        
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-lg-8">
                        <div className="cart-title mt-50">
                            <h2>Shopping Cart</h2>
                        </div>

                        <div className="cart-table clearfix">
                            <table className="table table-responsive">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map(item => (
                                        <tr key={item.id}>
                                            <td className="cart_product_img">
                                                <a href="#"><img src={item.product.imageurl} alt="Product"/></a>
                                            </td>
                                            <td className="cart_product_desc">
                                                <h5>{item.product.name}</h5>
                                            </td>
                                            <td className="price">
                                                <span>${item.product.price}</span>
                                            </td>
                                            <td className="qty">
                                            <div className="qty-btn d-flex align-items-center">
                                                <p>Qty</p>
                                                <div className="quantity">
                                                    <input
                                                    type="number"
                                                    className="qty-text"
                                                    value={item.quantity}
                                                    readOnly
                                                    />
                                                </div>

                                                <div className="cart ms-3">
                                                    <a
                                                    data-toggle="tooltip"
                                                    data-placement="left"
                                                    title="Remove all"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        Remove(item.product.id); // Llama a la función remove pasando el id del producto
                                                      }}
                                                    >
                                                    <img src="img/core-img/papelera.png" alt="Remove " />
                                                    </a>
                                                </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4">
                        <div className="cart-summary">
                            <h5>Cart Total</h5>
                            <ul className="summary-table">
                                <li><span>subtotal:</span> <span>${totalSum}</span></li>
                                <li><span>delivery:</span> <span>Free</span></li>
                                <li><span>total:</span> <span>${totalSum}</span></li>
                            </ul>
                            <div className="cart-btn mt-100">
                                <button 
                                    className="btn amado-btn w-100" 
                                    onClick={handleCreateOrder}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default Cart;