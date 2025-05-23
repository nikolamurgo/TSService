import '../styles/RecordStyles.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

function ServiceRecord() {

    const [records, setRecords] = useState([])

    useEffect(() => {
        axios.get('http://88.200.63.148:6060/api/records/').then(response => {
            setRecords(response.data)
        })
        .catch(error => {
            console.error('error fetching records: ',error)
        })
    },[])

    return (
        <div className='d-flex justify-content-center mt-5'>
            <div className='record-container'>
                <h3>List of Repairs</h3>
                <table className="table table-hover table-bordered table-responsive">
                    <thead className='table-dark'>
                        <tr>
                            <th scope="col" className='cell'>Repair ID</th>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Phone Model</th>
                            <th scope="col">Date</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.repair_id}>
                                <th scope='row'>{record.repair_id}</th>
                                <td>{record.first_name} {record.last_name}</td>
                                <td>{record.model}</td>
                                <td>{record.start_date}</td>
                                <td>{record.status}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}

export default ServiceRecord