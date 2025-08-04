import { useState, useEffect } from 'react'
import axios from 'axios'
import profilePic from '../assets/profilepicdefault.jpg'
// import { AiFillEdit } from "react-icons/ai";


function Account() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: ''
    })

    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        const userId = localStorage.getItem('user_id')
        // console.log(userId) // debug
        axios.get(`http://88.200.63.148:6060/api/account/${userId}`)
            .then(res => {
                setFormData({
                    username: res.data.username,
                    email: res.data.email,
                    role: res.data.role
                })
            })
            .catch(() => {
                setFormData({ username: '', email: '', role: '' })
            })
    }, [])

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleEditClick = () => setIsEditing(true)

    const handleSaveClick = async () => {
        const userId = localStorage.getItem('user_id')

        try {
            await axios.put(`http://88.200.63.148:6060/api/account/${userId}`, {
                username: formData.username,
                email: formData.email
            })
            setIsEditing(false)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div className="card p-4 my-5">
                <div className="text-center mb-4">
                    <img src={profilePic} alt="Profile" className="img-fluid rounded-circle mb-3"  style={{ width: '150px', height: '150px', objectFit: 'cover' }}/>
                    <h2>Account Information</h2>
                </div>
                <form>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Username</label>
                        {isEditing ? (
                            <input type="text" name="username" className="form-control" value={formData.username} onChange={handleInputChange}/>
                        ) : (
                            <p className="form-control-plaintext ps-2">{formData.username}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        {isEditing ? (
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange}/>
                        ) : (
                            <p className="form-control-plaintext ps-2">{formData.email}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Role</label>
                        <p className="form-control-plaintext ps-2">{formData.role}</p>
                    </div>
                    <div className="text-center mt-4">
                        {!isEditing ? (
                            <button type="button" className="btn btn-dark me-2" onClick={handleEditClick}>Edit Information</button>
                        ) : (
                            <button type="button" className="btn btn-success me-2" onClick={handleSaveClick}>Save Changes</button>
                        )}
                        <button type="button" className="btn btn-primary">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Account