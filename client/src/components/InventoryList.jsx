import React, { useState, useEffect } from 'react'
import axios from 'axios'

function InventoryList() {
    const [inventory, setInventory] = useState([])
    const [newItem, setNewItem] = useState({ part_name: '', unit_price: '', quantity_available: '' })
    const [isEditing, setIsEditing] = useState(null)
    const [editForm, setEditForm] = useState({ part_id: '', part_name: '', unit_price: '', quantity_available: '' })

    const fetchInventory = async () => {
        try {
            const response = await axios.get('http://88.200.63.148:6060/api/inventory')
            setInventory(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchInventory()
    }, [])

    const handleNewItemChange = (e) => {
        const { name, value } = e.target
        setNewItem(prev => ({ ...prev, [name]: value }))
    }

    const handleAddItem = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://88.200.63.148:6060/api/inventory/add', newItem)
            setNewItem({ part_name: '', unit_price: '', quantity_available: '' })
            fetchInventory()
        } catch (err) {
            alert('Failed to add item.')
        }
    }

    const handleDelete = async (partId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`http://88.200.63.148:6060/api/inventory/${partId}`)
                fetchInventory()
            } catch (err) {
                alert('Failed to delete item.')
            }
        }
    }

    const handleEditClick = (item) => {
        setIsEditing(item.part_id)
        setEditForm(item)
    }

    const handleEditFormChange = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({ ...prev, [name]: value }))
    }

    const handleUpdateItem = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`http://88.200.63.148:6060/api/inventory/${editForm.part_id}`, editForm)
            setIsEditing(null)
            fetchInventory()
        } catch (error) {
            alert('Failed to update item')
        }
    }

    return (
        <div>
            <div className="card mb-4">
                <div className="card-header">Add New Item</div>
                <div className="card-body">
                    <form onSubmit={handleAddItem} className="row g-3 align-items-center">
                        <div className="col-md-4"><input type="text" className="form-control" name="part_name" value={newItem.part_name} onChange={handleNewItemChange} placeholder="Part Name" required /></div>
                        <div className="col-md-3"><input type="number" step="0.01" className="form-control" name="unit_price" value={newItem.unit_price} onChange={handleNewItemChange} placeholder="Unit Price" required /></div>
                        <div className="col-md-3"><input type="number" className="form-control" name="quantity_available" value={newItem.quantity_available} onChange={handleNewItemChange} placeholder="Quantity" required /></div>
                        <div className="col-md-2"><button type="submit" className="btn btn-primary w-100">Add Item</button></div>
                    </form>
                </div>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-light">
                    <tr>
                        <th>Part Name</th>
                        <th>Unit Price</th>
                        <th>Quantity Available</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map(item => (
                        <tr key={item.part_id}>
                            {isEditing === item.part_id ? (
                                <>
                                    <td><input type="text" name="part_name" value={editForm.part_name} onChange={handleEditFormChange} className="form-control" /></td>
                                    <td><input type="number" step="0.01" name="unit_price" value={editForm.unit_price} onChange={handleEditFormChange} className="form-control" /></td>
                                    <td><input type="number" name="quantity_available" value={editForm.quantity_available} onChange={handleEditFormChange} className="form-control" /></td>
                                    <td>
                                        <button onClick={handleUpdateItem} className="btn btn-success btn-sm me-2">Save</button>
                                        <button onClick={() => setIsEditing(null)} className="btn btn-secondary btn-sm">Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{item.part_name}</td>
                                    <td>{item.unit_price}€</td>
                                    <td>{item.quantity_available}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(item)} className="btn btn-warning btn-sm me-2">Edit</button>
                                        <button onClick={() => handleDelete(item.part_id)} className="btn btn-danger btn-sm">Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default InventoryList