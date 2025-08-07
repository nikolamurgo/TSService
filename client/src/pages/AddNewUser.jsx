import { React, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AddNewUser(){

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'technician'
    })

     const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        // check if user is logged in to prevent if for ex someone
        // using postman cant add a new useer !!!!
        const token = localStorage.getItem('token')

        try {
            const response = await axios.post('http://88.200.63.148:6060/api/users/add-user', formData,
                {
                    headers: {'Authorization': `Bearer ${token}`}
                }
            )
            alert("successfully added user")
            // Clear form on success
            setFormData({ username: '', email: '', password: '', role: 'technician' })
            navigate('/')
        } catch (err) {
            alert('failed to add user')
            console.log(err)
        }
    }

    return(
         <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <div className="card p-4">
                <h2 className="text-center mb-4">Add New User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Username</label>
                        <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Password</label>
                        <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Role</label>
                        <select name="role" className="form-select" value={formData.role} onChange={handleChange} >
                            <option value="technician">Technician</option>
                            <option value="administrator">Administrator</option>
                        </select>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Add User</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddNewUser