import { useState } from "react"
import axios from 'axios'

function AddRecordForm() {

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
        model: '',
        imei: '',
        description: '',
        severity_level: 'None',
        diagnosed_by: '',
        status: 'Pending',
        repair_cost: '',
        start_date: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post('http://88.200.63.148:6060/api/records/add-record', formData);
            alert('Record added!');
        } catch (err) {
            console.error(err);
            alert('Something went wrong.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add New Repair Record</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-1">
                    <label className="form-label">Customer Name</label>
                    <input type="text" className="form-control" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div className="mb-1">
                    <label className="form-label">Customer Surname</label>
                    <input type="text" className="form-control" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </div>
                <div className="mb-1">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-1">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-control" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                </div>
                <div className="mb-1">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="mb-1">
                    <label className="form-label">Phone Brand and Model</label>
                    <input type="text" className="form-control" name="model" value={formData.model} onChange={handleChange} />
                </div>
                <div className="mb-1">
                    <label className="form-label">Phone IMEI</label>
                    <input type="text" className="form-control" name="imei" value={formData.imei} onChange={handleChange} />
                </div>
                <div className="mb-1">
                    <label className="form-label">Reported Issue Description</label>
                    <input type="text" className="form-control" name="description" value={formData.description} onChange={handleChange} />
                </div>
                <div className="mb-1">
                    <label className="form-label">Severity Level</label>
                    <select className="form-select" name="severity_level" value={formData.severity_level} onChange={handleChange}>
                        <option>None</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
                <div className="mb-1">
                    <label className="form-label">Diagnosed by</label>
                    <input type="text" className="form-control" name="diagnosed_by" value={formData.diagnosed_by} onChange={handleChange} />
                </div>
                <div className="mb-1">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </select>
                </div>
                <div className="mb-1">
                    <label className="form-label">Estimated Cost</label>
                    <input type="text" className="form-control" name="repair_cost" value={formData.repair_cost} onChange={handleChange} />
                </div>
                <div className="mb-1">
                    <label className="form-label">Date of Reported Issue</label>
                    <input type="date" className="form-control" name="start_date" value={formData.start_date} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary">Add Record</button>
            </form>
        </div>
    );
}

export default AddRecordForm