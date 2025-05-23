import { Link } from 'react-router-dom'
import '../styles/SidebarStyles.css'
import Logo from '../assets/tss-PNG.png'

function Sidebar() {
    return (
        <div className='sidebar-container'>
            <img src={Logo} width='100px' alt='logo'/>
            <span>TSService</span>
            <nav>
                <ul>
                    <li className='nav-item'><Link to="/" className='nav-link text-white'>Dashboard</Link></li>
                    <li className='nav-item'><Link to="/add-record" className='nav-link text-white'>Add Repair Record</Link></li>
                    <li className='nav-item'><Link to="/" className='nav-link text-white'>My Repairs</Link></li>
                    <li className='nav-item'><Link to="/" className='nav-link text-white'>My Statistics</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar
