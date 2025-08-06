import { useState, useEffect } from 'react'
import axios from 'axios'
import profilePic from '../assets/profilepicdefault.jpg'

function Account() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: ''
    })

    const [isEditing, setIsEditing] = useState(false)

    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [message, setMessage] = useState({ type: '', text: '' })

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

     const handlePasswordInputChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value })
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

    const handlePasswordChangeSubmit = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' })
            return
        }

        const userId = localStorage.getItem('user_id')
        try {
            const response = await axios.put(`http://88.200.63.148:6060/api/account/${userId}/password`, {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            })
            setMessage({ type: 'success', text: response.data.message })
            setShowPasswordForm(false)
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'An error occurred.' })
        }
    }

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div className="card p-4 my-5">
                <div className="text-center mb-4">
                    <img src={profilePic} alt="Profile" className="img-fluid rounded-circle mb-3"  style={{ width: '150px', height: '150px', objectFit: 'cover' }}/>
                    <h2>Account Information</h2>
                </div>
                {message.text && (
                    <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
                        {message.text}
                    </div>
                )}

                {!showPasswordForm ? (
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
                            <>
                            <button type="button" className="btn btn-success me-2" onClick={handleSaveClick}>Save Changes</button>
                                    <button type="button" className="btn btn-secondary me-2" onClick={() => setIsEditing(false)}>Cancel</button>

                            </>
                        )}
                            <button type="button" className="btn btn-primary" onClick={() => setShowPasswordForm(true)}>Change Password</button>
                    </div>
                </form>
                ) : (
                    <form onSubmit={handlePasswordChangeSubmit}>
                        <h4 className="mb-3">Change Password</h4>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Current Password</label>
                            <input type="password" name="oldPassword" className="form-control" value={passwords.oldPassword} onChange={handlePasswordInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">New Password</label>
                            <input type="password" name="newPassword" className="form-control" value={passwords.newPassword} onChange={handlePasswordInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Confirm New Password</label>
                            <input type="password" name="confirmPassword" className="form-control" value={passwords.confirmPassword} onChange={handlePasswordInputChange} required />
                        </div>
                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-success me-2">Update Password</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordForm(false)}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Account