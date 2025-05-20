import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'
import '../styles/DashboardStyles.css'

function Dashboard() {
    return (
        <div className='dash-container'>
            <Sidebar />
            <div className='right-side'>
                <Header />
                <main className='mainfield'>
                    <h2>Welcome to the Dashboard</h2>
                </main>
            </div>
        </div>
    )
}

export default Dashboard