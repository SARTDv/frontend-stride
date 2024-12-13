import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../css/admin.module.css';

export function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null); // Orden seleccionada
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/orders/users_orders/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Token de autenticación
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      }
    };

    fetchOrders();
  }, []);

  const toggleDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div>
      <h2>Orders</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles["table-container"]}>
        <table className={styles["data-table"]}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Username</th>
              <th>Total</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td>{order.id}</td>
                    <td>{order.user || 'N/A'}</td>
                    <td>${order.total_price.toFixed(2)}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className={`${styles.btn} ${styles["btn-primary"]}`} onClick={() => toggleDetails(order.id)}>
                        {expandedOrder === order.id ? 'Hide' : 'Show'}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan="5">
                        <div className={styles["details-container"]}>
                          <h4>Shipping Information</h4>
                          {order.ship_info ? (
                            <>
                              <p><strong>Name:</strong> {order.ship_info.first_name} {order.ship_info.last_name}</p>
                              <p><strong>Address:</strong> {order.ship_info.address}, {order.ship_info.town}</p>
                              <p><strong>ZIP Code:</strong> {order.ship_info.zip_code}</p>
                              <p><strong>Phone:</strong> {order.ship_info.phone_num}</p>
                              <p><strong>Comments:</strong> {order.ship_info.com || 'None'}</p>
                            </>
                          ) : (
                            <p>No shipping information available.</p>
                          )}

                          <h4>Order Items</h4>
                          {order.order_items.length > 0 ? (
                            order.order_items.map(item => (
                            <p key={item.product}>
                              {item.quantity} x {item.product_name} 
                            </p>
                            ))
                          ) : (
                            <p>No items in this order.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5">No orders available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
