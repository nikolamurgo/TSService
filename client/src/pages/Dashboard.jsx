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

        const token = localStorage.getItem('token')
    if (token) {
        fetch('http://88.200.63.148:6060/api/auth/protected', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) {
                setAuth(false)
                localStorage.removeItem('token')
                localStorage.removeItem('username')
            }
        })
    }
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