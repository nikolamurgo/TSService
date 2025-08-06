import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CustomersList(){
    const [customers, setCustomers] = useState([])
    const [records, setRecords] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const navigate = useNavigate()

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

    const handleCustomerClick = async (customer) => {
        setSelectedCustomer(customer)
        setRecords([])

        try{
            const response = await axios.get(`http://88.200.63.148:6060/api/customers/phone/${customer.phone_number}/records`)
            setRecords(response.data);
        }catch(err){
            console.error(err)
        }
    }

    const handleRecordClick = (recordId) => {
        navigate(`/records/${recordId}`)
    }

    return(
         <div className="container-fluid mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="list-group">
                        {customers.map(customer => (
                            <button key={customer.customer_id} type="button" className={`list-group-item list-group-item-action ${selectedCustomer?.customer_id === customer.customer_id ? 'active' : ''}`} onClick={() => handleCustomerClick(customer)}>
                                {customer.first_name} {customer.last_name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="col-md-8">
                    {selectedCustomer && (
                        <div>
                            <h4>Repairs for {selectedCustomer.first_name} {selectedCustomer.last_name}</h4>
                            {records.length > 0 ? (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Repair ID</th>
                                            <th>Model</th>
                                            <th>Status</th>
                                            <th>Start Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map(record => (
                                            <tr key={record.repair_id} onClick={() => handleRecordClick(record.repair_id)}>
                                                <td>{record.repair_id}</td>
                                                <td>{record.model}</td>
                                                <td>{record.status}</td>
                                                <td>{new Date(record.start_date).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No repairs found for this customer.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CustomersList