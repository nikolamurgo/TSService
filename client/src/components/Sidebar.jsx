import { Link } from 'react-router-dom'
import '../styles/SidebarStyles.css'
import Logo from '../assets/tss-PNG.png'

function Sidebar() {
    const userRole = localStorage.getItem('role')

    return (
        <div className='sidebar-container'>
            <div className='sidebar-header'>
                <img src={Logo} width='100px' alt='logo'/>
                <span>TSService</span>
            </div>
            <nav className='sidebar-nav'>
                <ul>
                    <li className='nav-item'><Link to="/" className='nav-link'>Dashboard</Link></li>
                    <li className='nav-item'><Link to="/add-record" className='nav-link'>Add Repair Record</Link></li>
                    <li className='nav-item'><Link to="/my-repairs" className='nav-link'>My Repairs</Link></li>
                    <li className='nav-item'><Link to="/customers" className='nav-link'>My Customers</Link></li>
                    <li className='nav-item'><Link to="/inventory" className='nav-link'>Inventory</Link></li>
                    {userRole === 'administrator' &&(
                        <>
                        <hr/>
                        <li className='nav-item'><Link to="/productivity" className='nav-link'>Productivity</Link></li>
                        <li className='nav-item'><Link to="/add-new-user" className='nav-link'>Add New User</Link></li>
                        <li className='nav-item'><Link to="/manageusers" className='nav-link'>Manage Users</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar
