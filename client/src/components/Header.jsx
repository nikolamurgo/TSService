import '../styles/HeaderStyles.css'
import { useNavigate } from 'react-router-dom'

function Header({setAuth}) {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setAuth(false)
    navigate('/login')
  }


  return (
    <div className="header-container">
      <nav className="navbar">
        <div className="container-fluid">
          <a className="navbar-brand" href='#'>Dashboard</a>
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
            <button className="btn btn-dark navbuttons" onClick={handleLogout} >Logout</button>
            <button className="btn btn-dark navbuttons" type="submit">Account</button>
          </form>
        </div>
      </nav>
    </div>
  )
}

export default Header
