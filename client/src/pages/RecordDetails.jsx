import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function RecordDetails() {

    const { id } = useParams()
    const [record, setRecord] = useState(null)

    useEffect(() => {
        axios.get(`http://88.200.63.148:6060/api/records/${id}`).then(response =>
            setRecord(response.data))
            .catch(error => console.error("error fetching record res:", error))
    }, [id])

    if (!record) return <div>Loading...</div>

    return (
        <div className="container mt-5">
            <h3>Repair Details</h3>
            <ul className="list-group">
                <li className="list-group-item"><strong>Customer:</strong> {record.first_name} {record.last_name}</li>
                <li className="list-group-item"><strong>Phone Model:</strong> {record.model}</li>
                <li className="list-group-item"><strong>IMEI:</strong> {record.imei}</li>
                <li className="list-group-item"><strong>Problem:</strong> {record.description}</li>
                <li className="list-group-item"><strong>Severity:</strong> {record.severity_level}</li>
                <li className="list-group-item"><strong>Status:</strong> {record.status}</li>
                <li className="list-group-item"><strong>Start Date:</strong> {record.start_date}</li>
                <li className="list-group-item"><strong>Cost:</strong> {record.repair_cost}</li>
            </ul>
        </div>
    )
}

export default RecordDetails