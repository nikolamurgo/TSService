import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {saveAs} from 'file-saver'

function RecordDetails() {

    const { id } = useParams()
    const [record, setRecord] = useState(null)
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({})
    const [users, setUsers] = useState([])
    const [agreement, setAgreement] = useState(null)

    // used for adding parts
    const [repairParts, setRepairParts] = useState([])
    const [stockItems, setStockItems] = useState([])
    const [selectedPart, setSelectedPart] = useState('')
    const [quantityUsed, setQuantityUsed] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recordRes, usersRes, repairPartsRes, stockItemsRes, agreementRes] = await Promise.all([
                    axios.get(`http://88.200.63.148:6060/api/records/${id}`),
                    axios.get('http://88.200.63.148:6060/api/records/users/list'),
                    axios.get(`http://88.200.63.148:6060/api/repair-parts/${id}/parts`),
                    axios.get('http://88.200.63.148:6060/api/inventory'),
                    axios.get(`http://88.200.63.148:6060/api/agreement/${id}`)
                ])
                setRecord(recordRes.data)
                setFormData(recordRes.data)
                setUsers(usersRes.data)
                setRepairParts(repairPartsRes.data)
                setStockItems(stockItemsRes.data)
                setAgreement(agreementRes.data)
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

    const handleDownloadAgreement = async () => {
        try {
            const response = await axios.get(`http://88.200.63.148:6060/api/agreement/${id}/download`, {
                responseType: 'blob',
            })
            saveAs(response.data, `RepairAgreement_${id}.pdf`)
        } catch (err) {
            alert('Failed to download agreement PDF.')
        }
    }

    const handleAddPart = async (e) =>{
        e.preventDefault()

        if (!selectedPart || quantityUsed <= 0) {
            alert('Please select a part and enter a valid quantity.')
            return
        }


        try{
            await axios.post(`http://88.200.63.148:6060/api/repair-parts/${id}/parts`,{
                part_id: selectedPart,
                quantity_used: quantityUsed,
            })
            
            // Refetch data on success
            const [repairPartsRes, stockItemsRes] = await Promise.all([
                axios.get(`http://88.200.63.148:6060/api/repair-parts/${id}/parts`),
                axios.get('http://88.200.63.148:6060/api/inventory')
            ]);
            setRepairParts(repairPartsRes.data)
            setStockItems(stockItemsRes.data)

            // Reset form
            setSelectedPart('')
            setQuantityUsed(1)
            setSearchTerm('')
            alert('Part added successfully!')
        }catch(err){

            console.error("Error adding part:", err)
            alert(`Failed to add part`)
        }
    }

    const filteredStockItems = searchTerm
        ? stockItems.filter(item =>
            item.part_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

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
                        <input type="text" className="form-control" name="first_name" value={formData.first_name || ''} onChange={handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Customer Last Name</label>
                        <input type="text" className="form-control" name="last_name" value={formData.last_name || ''} onChange={handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Customer Email</label>
                        <input type="text" className="form-control" name="email" value={formData.email || ''} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input type="text" className="form-control" name="phone_number" value={formData.phone_number || ''} onChange={handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input type="text" className="form-control" name="address" value={formData.address || ''} onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone Model</label>
                        <input type="text" className="form-control" name="model" value={formData.model || ''} onChange={handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">IMEI</label>
                        <input type="text" className="form-control" name="imei" value={formData.imei || ''} onChange={handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Problem Description</label>
                        <input type="text" className="form-control" name="description" value={formData.description || ''} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Severity Level</label>
                        <select className="form-select" name="severity_level" value={formData.severity_level || 'None'} onChange={handleChange}>
                            <option value="None">None</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select className="form-select" name="status" value={formData.status || 'Pending'} onChange={handleChange}>
                            <option value="Pending">Pending</option>
                            <option value="Waiting for Parts">Waiting for Parts</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Assigned To</label>
                        <select className="form-select" name="assigned_to" value={formData.assigned_to || ''} onChange={handleChange}>
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
                        <input type="number" className="form-control" name="repair_cost" value={formData.repair_cost || ''} onChange={handleChange}/>
                    </div>
                    <br></br>
                    <div className="mb-3">
                        <label className="form-label">Repair Notes</label>
                        <textarea className="form-control" name="repair_notes" value={formData.repair_notes || ''} onChange={handleChange}rows="4"/>
                    </div>

                    <div className="mt-4 p-4 border rounded">
                        <h4 className="mb-3">Add Repair Part</h4>
                        <form onSubmit={handleAddPart}>
                            <div className="mb-3">
                                <label htmlFor="partSearch" className="form-label">Search for a part</label>
                                <input type="text" id="partSearch" className="form-control" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Start typing to search..."/>
                                {searchTerm && (
                                    <select className="form-select mt-2" onChange={(e) => setSelectedPart(e.target.value)} value={selectedPart} size={filteredStockItems.length > 0 ? Math.min(filteredStockItems.length, 5) : 2}>
                                        <option value="" disabled>Select a part from search results</option>
                                        {filteredStockItems.map(item => (
                                            <option key={item.part_id} value={item.part_id}>
                                                {item.part_name} (Available: {item.quantity_available})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input type="number" id="quantity" className="form-control" value={quantityUsed} onChange={(e) => setQuantityUsed(parseInt(e.target.value, 10))} min="1" />
                            </div>
                            <button type="submit" className="btn btn-info">Add Part to Repair</button>
                        </form>
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
            )
            }

            <div className="mt-5">
                <h3>Parts Used in This Repair</h3>
                <table className="table">
                    <thead className="table-light">
                        <tr>
                            <th>Part Name</th>
                            <th>Quantity Used</th>
                            <th>Unit Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {repairParts.length > 0 ? (
                            repairParts.map(part => (
                                <tr key={part.rp_id}>
                                    <td>{part.part_name}</td>
                                    <td>{part.quantity_used}</td>
                                    <td>{part.unit_price}€</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No parts have been added to this repair yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-5">
                <h3>Repair Agreement</h3>
                {agreement ? (
                    <div className="card">
                        <div className="card-body">
                            <div className="p-3 bg-light border rounded mb-3" style={{ whiteSpace: 'pre-wrap' }}>{agreement.agreement_text}</div>
                            <p><strong>Status:</strong> {agreement.is_signed ? <span className="badge bg-success ms-2">Signed</span> : <span className="badge bg-warning ms-2">Not Signed</span>}</p>
                            <button className="btn btn-outline-primary" onClick={handleDownloadAgreement}>Download as PDF</button>
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-info">No repair agreement found for this record.</div>
                )}
            </div>

        </div>
    )
}

export default RecordDetails