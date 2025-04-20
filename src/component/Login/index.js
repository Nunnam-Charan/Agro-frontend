import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const Login = (props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // loader state

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Enter the user');
      return;
    }
    if (!password) {
      alert('Enter the password');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        setLoading(false);
        return;
      }

      Cookies.set('token', data.token, { expires: 1 });

      if (data.getUser.role === 'customer') {
        navigate('/customerDashboard');
      } else {
        navigate('/adminDashboard');
      }
    } catch (error) {
      alert('Credentials are wroung');
    } finally {
      setLoading(false); // Stop loading after response
    }
  };

  return (
    (loading)?(<h1>laoding ...</h1>):(
    <div className="login-container">
      <form className="login-form" onSubmit={handleFormSubmission}>
        <h2 className="login-title">Login</h2>
        <input
          className="login-input"
          name="user"
          value={user}
          placeholder="Username"
          onChange={(e) => setUser(e.target.value)}
          disabled={loading}
        />
        <input
          className="login-input"
          name="password"
          value={password}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Submit'}
        </button>
        <div className="register-link-container">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="register-link">
              Register here
            </a>
          </p>
        </div>
      </form>
    </div>
    )
  );
};

export default Login;
