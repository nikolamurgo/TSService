import { useState, useEffect } from 'react'
import axios from 'axios'

function CustomersList(){
    const [customers, setCustomers] = useState([])
    const [error, setError] = useState(null)

    useEffect(() =>{
        const fetchCustomers = async () => {
            try{
                const response = await axios.get("http://88.200.63.148:6060/api/customers")
                setCustomers(response.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchCustomers()
    }, [])

    return(
        <div>
            <ul>
                {customers.map(customer => (
                <li key={customer.CustomerID}>
                    {customer.first_name} {customer.last_name} - {customer.email}
                </li>
                ))}
            </ul>
        </div>
    )
}

export default CustomersList