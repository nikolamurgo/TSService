import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function MyRepairs() {
    const [repairs, setRepairs] = useState([])
    const userId = localStorage.getItem('user_id')

    useEffect(() => {

        const fetchMyRepairs = async () => {
            try {
                const res = await axios.get(`http://88.200.63.148:6060/api/records/my-repairs/${userId}`)
                setRepairs(res.data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchMyRepairs()
    }, [userId])


    return (
        <div className="container-fluid">
            <h2 className="mb-4">My Assigned Repairs</h2>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Phone Model</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {repairs.length > 0 ? (
                            repairs.map(record => (
                                <tr key={record.repair_id}>
                                    <td>{record.repair_id}</td>
                                    <td>{`${record.first_name} ${record.last_name}`}</td>
                                    <td>{record.model}</td>
                                    <td>{record.status}</td>
                                    <td>{new Date(record.start_date).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/records/${record.repair_id}`} className="btn btn-sm btn-outline-primary">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">You have no repairs assigned to you</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyRepairs