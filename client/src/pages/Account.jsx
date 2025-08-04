import { useState, useEffect} from 'react'
import axios from 'axios'

function Account(){
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    })

    useEffect(() => {
        const userId = localStorage.getItem('user_id')
        // console.log(userId) // debug
        axios.get(`http://88.200.63.148:6060/api/account/${userId}`)
            .then(res => {
                setFormData({
                    username: res.data.username,
                    email: res.data.email
                })
            })
            .catch(() => {
                setFormData({ username: '', email: '' })
            })
    }, [])

    return(
        <div>
            <div>Edit Account</div>
            <form>
                <label>Username:</label>
                <input type="text" value={formData.username} readOnly />
                <label>Email:</label>
                <input type="email" value={formData.email} readOnly />
            </form>
        </div>
    )
}

export default Account