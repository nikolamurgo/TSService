import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'

function Dashboard() {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                <Header />
                <main style={{ padding: '1rem' }}>
                    <h2>Welcome to the Dashboard</h2>
                </main>
            </div>
        </div>
    )
}

export default Dashboard