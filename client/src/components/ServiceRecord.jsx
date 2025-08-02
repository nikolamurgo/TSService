import '../styles/RecordStyles.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { AiFillEdit } from "react-icons/ai";

function ServiceRecord() {

    const [records, setRecords] = useState([])
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        sort: 'newest'
    })

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const params = new URLSearchParams()
                if (filters.status) params.append('status', filters.status)
                if (filters.search) params.append('search', filters.search)
                if (filters.sort) params.append('sort', filters.sort)

                const response = await axios.get(`http://88.200.63.148:6060/api/records?${params.toString()}`)
                setRecords(response.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchRecords()
    }, [filters])

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    const navigate = useNavigate();


    return (
        <div className='d-flex justify-content-center mt-5'>
            <div className='record-container'>
                <h3>List of Repairs</h3>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <select className="form-select" name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Waiting for Parts">Waiting for Parts</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="col-md-5">
                        <input type="text" className="form-control" placeholder="Search..." name="search" value={filters.search} onChange={handleFilterChange}/>
                    </div>

                    <div className="col-md-4">
                        <select className="form-select" name="sort" value={filters.sort} onChange={handleFilterChange}>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>

                <table className="table table-hover table-bordered table-responsive">
                    <thead className='table-dark'>
                        <tr>
                            <th scope="col" className='cell'>Repair ID</th>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Phone Model</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.repair_id}>
                                <th scope='row'>TS2025-{record.repair_id}</th>
                                <td>{record.first_name} {record.last_name}</td>
                                <td>{record.model}</td>
                                <td>{record.start_date.split('T')[0]}</td>
                                <td> {record.end_date ? record.end_date.split('T')[0] : '/'} </td>
                                <td>{record.status}</td>
                                <td onClick={() => navigate(`/records/${record.repair_id}`)}>
                                    <AiFillEdit />
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}

export default ServiceRecord