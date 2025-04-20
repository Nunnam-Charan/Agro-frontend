import React, { useEffect, useState } from 'react';
import cookie from 'js-cookie';
import './index.css'; // Import the custom CSS file

const YourOrder = () => {
  const [orders, setOrders] = useState([]);
  const token = cookie.get('token');
  const [load,setLoad]=useState(false);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getYourOrders', {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return alert(data.message);
      setOrders(data.orders);
      setLoad(true)
    } catch (error) {
      alert('Failed to fetch your orders');
    }
  };

  return (
    (!load)?(<h1>loading...</h1>):(
    <div className="your-order-container">
      <h1 className="title">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-details">
              <div className="order-detail">
                <p><strong>Product ID:</strong> {order.product.name || order.product}</p>
              </div>
              <div className="order-detail">
                <p><strong>Quantity:</strong> {order.quantity}</p>
              </div>
              <div className="order-detail">
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              </div>
              <div className="order-detail">
                <p><strong>Status:</strong> {order.orderStatus}</p>
              </div>
              <div className="order-detail">
                <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
    )
  );
};

export default YourOrder;
