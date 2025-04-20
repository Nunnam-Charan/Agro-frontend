import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';
import './index.css';  // Importing the CSS file

const AddProduct = () => {
  const [product, setProduct] = useState({
    image: '',
    name: '',
    category: '',
    price: '',
    stock: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = cookie.get('token');
    try {
      const response = await fetch('http://localhost:5000/api/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...product,
          stock: parseInt(product.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to add product');
        return;
      }

      alert('Product added successfully!');
      navigate('/adminDashboard');
    } catch (error) {
      alert('Something went wrong!');
      console.error(error);
    }
  };

  return (
    <div className='dashboard'>
    <form className="add-product-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={product.image}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Category (fruit or vegetable)"
        value={product.category}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={product.stock}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Product</button>
    </form>
    </div>
  );
};

export default AddProduct;
