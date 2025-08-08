import React, { useState, useEffect } from 'react'
import axios from 'axios'

function UsersList(){

    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const token = localStorage.getItem('token')
                const response = await axios.get("http://88.200.63.148:6060/api/users",{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setUsers(response.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchUsers()
    }, [])

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try{
                const token = localStorage.getItem('token')
                const response = await axios.delete(`http://88.200.63.148:6060/api/users/${userId}`,{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setUsers(users.filter(user => user.user_id !== userId))
            } catch(err){
                console.log(err)
            }
        }
    }

    return(
        <div className='container mt-4'>
            <ul className='list-group'>
                {users.map(user =>(
                    <li key={user.user_id} className='list-group-item d-flex justify-content-between align-items-center'>
                        <div>
                            <strong>{user.username}</strong>({user.email})
                            <br />
                            <small className="text-muted">Role: {user.role}</small>
                        </div>
                        <button onClick={() => handleDelete(user.user_id)} className="btn btn-danger btn-sm">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UsersList