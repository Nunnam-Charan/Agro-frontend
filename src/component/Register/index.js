import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'; // Import the CSS file

const Register = (props) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        password,
        mail,
        mobile_number: mobileNumber,
        role,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert(data.message);
    navigate('/');
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleFormSubmission}>
        <h2 className="register-title">Register</h2>
        <input
          className="register-input"
          name="name"
          value={name}
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="register-input"
          name="password"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="register-input"
          name="email"
          type='email'
          value={mail}
          placeholder="Email"
          onChange={(e) => setMail(e.target.value)}
          required
        />
        <input
          className="register-input"
          name="number"
          type='tel'
          value={mobileNumber}
          placeholder="Mobile Number"
           pattern="[6-9]{1}[0-9]{9}"
          maxLength="10"
          onChange={(e) => setMobileNumber(e.target.value)}
          required
        />
        <select
          className="register-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="register-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
