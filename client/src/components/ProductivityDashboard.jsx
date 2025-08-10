import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend} from 'chart.js'

// Register Chart.js components for use in charts
ChartJS.register( CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

function ProductivityDashboard() {
    const [stats, setStats] = useState(null)    //state for stats data
    const [range, setRange] = useState('all') // month, year ,all

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`http://88.200.63.148:6060/api/productivity/stats`)
                setStats(res.data)
            } catch (error) {
                console.error("error fetching stats")
            }
        }
        fetchStats()
    }, [range])


    if (!stats) {
        return <div>Could not load data. Please try again later</div>
    }

    // data for the barchart
    const technicianNames = [...new Set([...stats.completedPerTechnician.map(t => t.username), ...stats.inProgressPerTechnician.map(t => t.username)])]
    const barChartData = {
        labels: technicianNames,
        datasets: [
            {
                label: 'Repairs Completed',
                data: technicianNames.map(name => stats.completedPerTechnician.find(t => t.username === name)?.count || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Repairs In Progress',
                data: technicianNames.map(name => stats.inProgressPerTechnician.find(t => t.username === name)?.count || 0),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
            }
        ]
    }

    // Data for the line chharts
    const lineChartData = {
        labels: stats.completionsOverTime.map(item => item.month),
        datasets: [
            {
                label: 'Total Repairs Completed per Month',
                data: stats.completionsOverTime.map(item => item.count),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    }

    return (
        <div className="container-fluid">

            <div className="btn-group mb-4" role="group">
                <button type="button" className={`btn ${range === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setRange('all')}>All Time</button>
                <button type="button" className={`btn ${range === 'year' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setRange('year')}>This Year</button>
                <button type="button" className={`btn ${range === 'month' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setRange('month')}>This Month</button>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header">Technician Performance</div>
                        <div className="card-body">
                            <Bar data={barChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Completed vs. In-Progress Repairs' } } }} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header">Monthly Completions</div>
                        <div className="card-body">
                            <Line data={lineChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Completed Repairs (Last 6 Months)' } } }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <h4>Completed Repairs ({range})</h4>
                    <ul className="list-group">
                        {stats.completedPerTechnician.map(tech => (
                            <li key={tech.username} className="list-group-item d-flex justify-content-between align-items-center">
                                {tech.username}
                                <span className="badge bg-success rounded-pill">{tech.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-6">
                    <h4>In Progress Repairs</h4>
                    <ul className="list-group">
                        {stats.inProgressPerTechnician.map(tech => (
                            <li key={tech.username} className="list-group-item d-flex justify-content-between align-items-center">
                                {tech.username}
                                <span className="badge bg-warning rounded-pill">{tech.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ProductivityDashboard