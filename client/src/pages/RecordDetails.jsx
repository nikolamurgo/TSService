import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function RecordDetails() {

    const { id } = useParams()
    const [record, setRecord] = useState(null)
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({})
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recordRes, usersRes] = await Promise.all([
                    axios.get(`http://88.200.63.148:6060/api/records/${id}`),
                    axios.get('http://88.200.63.148:6060/api/records/users/list')
                ])
                setRecord(recordRes.data)
                setFormData(recordRes.data)
                setUsers(usersRes.data)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }   

    const handleUpdate = async () => {
        try {
            await axios.put(`http://88.200.63.148:6060/api/records/${id}`, formData)
            setRecord(formData)
            setIsEditing(false)
            alert('Record updated successfully!')
        } catch (error) {
            alert('Failed to update record')
        }
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await axios.delete(`http://88.200.63.148:6060/api/records/${id}`)
                alert('Record deleted successfully!')
                navigate('/')
            } catch (error) {
                alert('Failed to delete record')
            }
        }
    }
    if (!record) return <div>Loading...</div>

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Repair Details</h3>
                <div>
                    {!isEditing ? (
                        <>
                            <button className="btn btn-primary me-2" onClick={() => setIsEditing(true)}>Edit</button>
                            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                        </>
                    ) : (
                        <> <button className="btn btn-success me-2" onClick={handleUpdate}>Save</button>
                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                        </>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="card p-4">
                    <div className="mb-3">
                        <label className="form-label">Customer First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="first_name"
                            value={formData.first_name || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Customer Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="last_name"
                            value={formData.last_name || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Customer Email</label>
                        <input
                            type="text"
                            className="form-control"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phone_number"
                            value={formData.phone_number || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone Model</label>
                        <input
                            type="text"
                            className="form-control"
                            name="model"
                            value={formData.model || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">IMEI</label>
                        <input
                            type="text"
                            className="form-control"
                            name="imei"
                            value={formData.imei || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Problem Description</label>
                        <input
                            type="text"
                            className="form-control"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Severity Level</label>
                        <select
                            className="form-select"
                            name="severity_level"
                            value={formData.severity_level || 'None'}
                            onChange={handleChange}
                        >
                            <option value="None">None</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                            className="form-select"
                            name="status"
                            value={formData.status || 'Pending'}
                            onChange={handleChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Waiting for Parts">Waiting for Parts</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Assigned To</label>
                        <select
                            className="form-select"
                            name="assigned_to"
                            value={formData.assigned_to || ''}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select Technician</option>
                            {users.map(user => (
                                <option key={user.user_id} value={user.user_id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Repair Cost</label>
                        <input
                            type="number"
                            className="form-control"
                            name="repair_cost"
                            value={formData.repair_cost || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <br></br>
                    <div className="mb-3">
                        <label className="form-label">Repair Notes</label>
                        <textarea 
                            className="form-control" 
                            name="repair_notes" 
                            value={formData.repair_notes || ''} 
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>                    
                </div>
            ) : (
                <ul className="list-group">
                    <li className="list-group-item"><strong>Customer:</strong> {record.first_name} {record.last_name}</li>
                    <li className="list-group-item"><strong>Email:</strong> {record.email} </li>
                    <li className="list-group-item"><strong>Phone Number:</strong> +386 {record.phone_number} </li>
                    <li className="list-group-item"><strong>Address:</strong> {record.address} </li>
                    <li className="list-group-item"><strong>Phone Model:</strong> {record.model}</li>
                    <li className="list-group-item"><strong>IMEI:</strong> {record.imei}</li>
                    <li className="list-group-item"><strong>Problem Description:</strong> {record.description}</li>
                    <li className="list-group-item"><strong>Severity:</strong> {record.severity_level}</li>
                    <li className="list-group-item"><strong>Diagnosed By:</strong> {record.diagnosed_by}</li>
                    <li className="list-group-item"><strong>Assigned To:</strong> {record.username}</li>
                    <li className="list-group-item"><strong>Status:</strong> {record.status}</li>
                    <li className="list-group-item"><strong>Start Date:</strong> {record.start_date.split('T')[0]}</li>
                    <li className="list-group-item"><strong>End Date:</strong> {record.end_date ? record.end_date.split('T')[0] : '/'}</li>
                    <li className="list-group-item"><strong>Repair Notes:</strong><div className="mt-2 p-2 bg- light rounded">{record.repair_notes || 'No notes available'}</div></li>                   
                    <li className="list-group-item"><strong>Cost:</strong> {record.repair_cost}€</li>
                </ul>
            )}
        </div>
    )
}

export default RecordDetails