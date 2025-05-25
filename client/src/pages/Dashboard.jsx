import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'
import ServiceRecord from '../components/ServiceRecord'
import '../styles/DashboardStyles.css'

function Dashboard({setAuth}) {
    const [username, setUsername] = useState('')

    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        setUsername(storedUsername)
    }, [])

    return (
        <div className='dash-container'>
            <div className='right-side'>
                <Header setAuth={setAuth} />
                <main className='mainfield'>
                    <h2>Welcome, {username}👋</h2>
                    <ServiceRecord />
                </main>
            </div>
        </div>
    )
}

export default Dashboard