import { Link } from 'react-router-dom'
import '../styles/SidebarStyles.css'
import Logo from '../assets/tss-PNG.png'

function Sidebar() {
    const userRole = localStorage.getItem('role')

    return (
        <div className='sidebar-container'>
            <img src={Logo} width='100px' alt='logo'/>
            <span>TSService</span>
            <nav>
                <ul>
                    <li className='nav-item'><Link to="/" className='nav-link text-white'>Dashboard</Link></li>
                    <li className='nav-item'><Link to="/add-record" className='nav-link text-white'>Add Repair Record</Link></li>
                    <li className='nav-item'><Link to="/my-repairs" className='nav-link text-white'>My Repairs</Link></li>
                    <li className='nav-item'><Link to="/customers" className='nav-link text-white'>My Customers</Link></li>
                    <li className='nav-item'><Link to="/inventory" className='nav-link text-white'>Inventory</Link></li>
                    <li className='nav-item'><Link to="/" className='nav-link text-white'>My Statistics</Link></li>
                    {userRole === 'administrator' &&(
                        <>
                        <hr className="text-white" />
                        <li className='nav-item'><Link to="/productivity" className='nav-link text-white'>Productivity</Link></li>
                        <li className='nav-item'><Link to="/add-new-user" className='nav-link text-white'>Add New User</Link></li>
                        <li className='nav-item'><Link to="/manageusers" className='nav-link text-white'>Manage Users</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar
