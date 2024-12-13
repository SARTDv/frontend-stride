import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, CircleX } from 'lucide-react';
import axios from 'axios';
import styles from '../css/orders.module.css'; // Importar el archivo CSS modular

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar las órdenes desde el backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://backend-stride.onrender.com/api/orders/orders/');
        setOrders(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.detail : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Marcar como entregada
  const handleMarkAsDelivered = async (orderId) => {
    try {
      const response = await axios.patch(`https://backend-stride.onrender.com/api/orders/orders/${orderId}/`, {
        status: 'completed',
      });
      // Actualiza el estado local de la orden
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: 'completed' } : order
        )
      );
    } catch (err) {
      setError(err.response ? err.response.data.detail : 'Failed to update order status');
    }
  };
  
  const handleMarkAsCanceled = async (orderId) => {
    try {
      const response = await axios.patch(`https://backend-stride.onrender.com/api/orders/orders/${orderId}/`, {
        status: 'cancelled',
      });
      // Actualiza el estado local de la orden
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
    } catch (err) {
      setError(err.response ? err.response.data.detail : 'Failed to update order status');
    }
  };
  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles["orders-container"]}>
      <div className={styles["orders-content"]}>
        <div className={styles["orders-header"]}>
          <Package size={32} className={styles["orders-icon"]} />
          <h1 className={styles["orders-title"]}>My Orders</h1>
        </div>

        <div className={styles["orders-list"]}>
          {orders.map((order) => (
            <div key={order.id} className={styles["order-card"]}>
              <div className={styles["order-content"]}>
                <div className={styles["order-image-container"]}>
                  <img
                    src={order.FirstProductImageUrl}
                    alt=""
                    className={styles["order-image"]}
                  />
                </div>

                <div className={styles["order-details"]}>
                  <div className={styles["order-title"]}>
                    <h3 className={styles["order-name"]}>
                      Order Date: {new Date(order.orderDate).toLocaleDateString()}
                    </h3>
                  </div>

                  <div className={styles["order-info"]}>
                    <div className={styles["order-date"]}>
                      <Package size={18} />
                      <span>Package quantity: {order.packageQty}</span>
                    </div>

                    <div className={styles["order-status"]}>
                      <span className={styles["status-label"]}>Status:</span>
                      <span
                        className={`${styles["status-value"]} ${styles[order.status]}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className={styles["order-id"]}>
                    <span>Order Id: {order.id}</span>
                  </div>

                  <div className={styles["order-actions"]}>
                    <div>
                      <span className={styles["order-price"]}>
                        Total amount: ${order.Totalprice}
                      </span>
                    </div>
                    <div className={styles["right-divs"]}>
                      {order.status === 'shipped' && (
                        <>
                          <button
                            onClick={() => handleMarkAsDelivered(order.id)}
                            className={styles["mark-received-btn"]}
                          >
                            <CheckCircle size={18} />
                            Mark as Received
                          </button>

                          <button
                            onClick={() => handleMarkAsCanceled(order.id)}
                            className={styles["mark-canceled-btn"]}
                          >
                            <CircleX size={18} />
                            Cancel this Order
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>



      
    </div>
  );
};

export default OrderPage;
