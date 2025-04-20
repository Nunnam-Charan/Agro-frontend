import { useEffect, useState } from "react";
import cookie from 'js-cookie';
import './index.css'; // Import the custom CSS file

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);
  const token = cookie.get('token');
  const [load,setLoad]=useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://agro-zc8x.onrender.com/api/getAllorders", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
      }); 
      const data = await response.json();
      if (!response.ok) {
        return alert(data.message);
      }

      setOrders(data.orders);
      setLoad(true);
    } catch (error) {
      alert(error);
    }
  };

  const updateStatus = async (id, orderStatus) => {
    try {
      const response = await fetch(`https://agro-zc8x.onrender.com/api/upateStatus/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus })
      });

      const d = await response.json();

      if (!response.ok) {
        return alert(d.message);
      }
      alert(d.message);

      fetchOrders();
    } catch (error) {
      alert(error);
    }
  };

  return (
    (!load) ?(<h1>Loading ...</h1>) :
    (
    <div className="view-order-container">
      <h1 className="title">All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-details">
              <p className="label">Order ID: {order._id}</p>
              
              <p><span className="label">Customer:</span> {order.customer}</p>
              <p><span className="label">Product ID:</span> {order.product}</p>
              <p><span className="label">Quantity:</span> {order.quantity}</p>
              <p><span className="label">Total Amount:</span> ₹{order.totalAmount}</p>
              <p><span className="label">Date:</span> {new Date(order.orderDate).toLocaleString()}</p>
              <p><span className="label">Status:</span> {order.orderStatus}</p>
            </div>
            <div className="order-actions">
              <button
                disabled={order.orderStatus === 'pending'}
                onClick={() => updateStatus(order._id, 'pending')}
                className="status-btn pending"
              >
                Pending
              </button>
              <button
                disabled={order.orderStatus === 'processing'}
                onClick={() => updateStatus(order._id, 'processing')}
                className="status-btn processing"
              >
                Processing
              </button>
              <button
                disabled={order.orderStatus === 'delivered'}
                onClick={() => updateStatus(order._id, 'delivered')}
                className="status-btn delivered"
              >
                Delivered
              </button>
            </div>
          </div>
        ))
      )}
    </div>
    )
  );
};

export default ViewOrder;
