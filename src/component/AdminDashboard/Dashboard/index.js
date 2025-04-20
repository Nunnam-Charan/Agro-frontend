import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from 'js-cookie';
import './index.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [vegiProducts, setVegiProducts] = useState([]);
  const [fruitProducts, setFruitProducts] = useState([]);
  const [updatePrice, setUpdatePrice] = useState({});
  const [updateStock, setUpdateStock] = useState({});
  const navigate = useNavigate();
  const token = cookie.get('token');

  const updatePriceEvent = (e,productId) => setUpdatePrice({...updatePrice,[productId]:e.target.value});
  const updateStockEvent = (e,productId) => setUpdateStock({...updateStock,[productId]:e.target.value});

  const viewOrder = () => navigate('/viewOrders');
  const addVegetables = () => navigate('/addProduct');

  const updateEventHandle = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/updateProduct/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ price: updatePrice[id], stock: updateStock[id] })
      });

      const data = await response.json();
      if (!response.ok) return alert(data.message);

      alert("Product updated successfully");
      getProducts();
      setUpdatePrice('');
      setUpdateStock('');
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const deleteEventHandle = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/deleteProduct/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
      });

      const data = await response.json();
      if (!response.ok) return alert(data.message);

      alert("Product deleted");
      getProducts();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/getProducts", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();
      if (!response.ok) return alert(data.message);

      setProducts(data.items);
      setLoaded(true);
    } catch (error) {
      alert("Error fetching products");
    }
  };

  useEffect(() => {
    setVegiProducts(products.filter((item) => item.category === "vegetable"));
    setFruitProducts(products.filter((item) => item.category === "fruit"));
  }, [products]);

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="admin-dashboard">
      {!loaded ? <h1 className="loading">Loading ...</h1> : (
        <div>
          <h2 className="category-title">Vegetables</h2>
          <div className="product-grid">
            {vegiProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <h1 className="product-name">{product.name}</h1>
                <p className="product-detail">Price: {product.price}</p>
                <p className="product-detail">Stock: {product.stock}</p>
                <div className="product-buttons">
                <div className="update-fields">
                  <input
                    type="number"
                    className="input-field"
                    name="updatePrice"
                    value={updatePrice[product._id] || ''}
                    placeholder='Update Price'
                    onChange={(e)=>updatePriceEvent(e,product._id)}
                  />
                  <input
                    type="number"
                    className="input-field"
                    name="updateStock"
                    value={updateStock[product._id] || ''}
                    placeholder='Update Stock'
                    onChange={(e)=>updateStockEvent(e,product._id)}
                  />
                  <button className="update-btn" onClick={() => updateEventHandle(product._id)}>Update</button>
                </div>
                  <button className="delete-btn" onClick={() => deleteEventHandle(product._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <button className="add-product-btn" onClick={addVegetables}>Add Vegetables</button>

          <h2 className="category-title">Fruits</h2>
          <div className="product-grid">
            {fruitProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <h1 className="product-name">{product.name}</h1>
                <p className="product-detail">Price: {product.price}</p>
                <p className="product-detail">Stock: {product.stock}</p>
                <div className="update-fields">
                  <input
                    type="number"
                    className="input-field"
                    name="updatePrice"
                    value={updatePrice[product._id] || ''}
                    placeholder='Update Price'
                    onChange={(e)=>updatePriceEvent(e,product._id)}
                  />
                  <input
                    type="number"
                    className="input-field"
                    name="updateStock"
                    value={updateStock[product._id] || ''}
                    placeholder='Update Stock'
                    onChange={(e)=>updateStockEvent(e,product._id)}
                  />
                  <button className="update-btn" onClick={() => updateEventHandle(product._id)}>Update</button>
                </div>
                <button className="delete-btn" onClick={() => deleteEventHandle(product._id)}>Delete</button>
              </div>
            ))}
          </div>
          <button className="add-product-btn" onClick={addVegetables}>Add Fruits</button>
        </div>
      )}

      <button className="view-orders-btn" onClick={viewOrder}>View Orders</button>
    </div>
  );
};

export default AdminDashboard;