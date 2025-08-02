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
            <button className="btn btn-dark navbuttons" onClick={handleLogout} >Logout</button>
            <button className="btn btn-primary navbuttons" type="submit">Account</button>
          </form>
        </div>
      </nav>
    </div>
  )
}

export default Header
