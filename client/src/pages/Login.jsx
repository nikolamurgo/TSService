import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LoginStyles from '../styles/LoginStyles.css'

function Login({ setAuth, setRole }) {  // props setAuth and setRole

  const [formData, setFormData] = useState({ username: '', password: '' })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://88.200.63.148:6060/api/auth/login', formData)

      if (res.data.success) {
        setAuth(true)
        setRole(res.data.user.role)

        localStorage.setItem('token', 'dummyToken') // set actual token JWT later
        localStorage.setItem('username', res.data.user.username)

        navigate('/'); // after login successfull go to the dashboard

        // alert('Login successful!')
      } else {
        alert('Invalid credentials!!!')
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="logincard card p-4 shadow-sm">
        <h2 className="mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 inputs">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 inputs">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>

  );
}

export default Login
