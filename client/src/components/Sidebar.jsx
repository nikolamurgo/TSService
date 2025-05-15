import { Link } from 'react-router-dom'
import './styles/SidebarStyles.css'

function Sidebar() {
  return (
    <div className='sidebar-container'>
      <h3>TSService</h3>
      <nav>
        <ul>
          <li className='nav-item'><Link to="/" className='nav-link text-white'>Dashboard</Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
