import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'
import ServiceRecord from '../components/ServiceRecord'
import '../styles/DashboardStyles.css'

function Dashboard() {
    return (
        <div className='dash-container'>
            <div className='right-side'>
                <Header />
                <main className='mainfield'>
                    <h2>Welcome to the Dashboard</h2>
                    <ServiceRecord />
                </main>
            </div>
        </div>
    )
}

export default Dashboard