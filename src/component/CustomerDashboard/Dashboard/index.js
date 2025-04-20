import { useState, useEffect } from 'react';
import React from "react";
import cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './index.css'; // Import the CSS file for styles

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [vegiProducts, setVegiProducts] = useState([]);
  const [fruitProducts, setFruitProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const navigate = useNavigate();
  const token = cookie.get('token');

  const viewYourOrders = () => {
    navigate('/yourOrder');
  };

  const quantityEventHandle = (e, productId) => {
    setQuantity({ ...quantity, [productId]: e.target.value });
  };

  const orderProduct = async (id, productStock, price) => {
    const enteredQty = Number(quantity[id]);
    if (!enteredQty || enteredQty <= 0) {
      return alert("Enter a valid quantity");
    }

    if (enteredQty > productStock) {
      return alert("Quantity exceeds stock");
    }

    try {
      const response = await fetch("https://agro-zc8x.onrender.com/api/newOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: id,
          quantity: enteredQty,
          totalAmount: enteredQty * price,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return alert(data.message);
      }

      alert(data.message);
      getProducts(); // Refresh product stock
      setQuantity((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      alert("Failed to order product");
    }
  };

  const getProducts = async () => {
    try {
      const response = await fetch("https://agro-zc8x.onrender.com/api/getProducts", {
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

      setProducts(data.items);
      setLoaded(true);

    } catch (error) {
      alert("Error fetching products");
    }
  };

  useEffect(() => {
    const vegis = products.filter((item) => item.category === "vegetable");
    const fruits = products.filter((item) => item.category === "fruit");

    setVegiProducts(vegis);
    setFruitProducts(fruits);
  }, [products]);

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="dashboard-container">
      {!loaded && <h1>Loading...</h1>}

      {loaded && (
        <div>
          <h2 className="category-title">Vegetables</h2>
          <div className="product-grid">
            {vegiProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">Price: ₹{product.price}</p>
                  <p className="product-stock">Stock: {product.stock}</p>
                  <input
                    className="quantity-input"
                    name="quantity"
                    value={quantity[product._id] || ""}
                    placeholder="Enter quantity"
                    onChange={(e) => quantityEventHandle(e, product._id)}
                  />
                  <button
                    className="order-button"
                    onClick={() => orderProduct(product._id, product.stock, product.price)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="category-title">Fruits</h2>
          <div className="product-grid">
            {fruitProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">Price: ₹{product.price}</p>
                  <p className="product-stock">Stock: {product.stock}</p>
                  <input
                    className="quantity-input"
                    name="quantity"
                    value={quantity[product._id] || ""}
                    placeholder="Enter quantity"
                    onChange={(e) => quantityEventHandle(e, product._id)}
                  />
                  <button
                    className="order-button"
                    onClick={() => orderProduct(product._id, product.stock, product.price)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="view-orders-button" onClick={viewYourOrders}>Your Orders</button>
    </div>
  );
};

export default CustomerDashboard;
