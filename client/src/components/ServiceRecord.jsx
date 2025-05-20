import '../styles/RecordStyles.css'

function ServiceRecord() {
    return (
        <div className='d-flex justify-content-center mt-5'>
            <div className='record-container'>
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
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark Testovski</td>
                            <td>iPhone 13</td>
                            <td>2024-05-01</td>
                            <td>Pending</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob Reactovski</td>
                            <td>Samsung S21</td>
                            <td>2024-05-03</td>
                            <td>In Progress</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry Birdovcanec</td>
                            <td>Huawei P40</td>
                            <td>2024-05-04</td>
                            <td>Completed</td>
                        </tr>
                    </tbody>

                </table>
            </div>
        </div>
    )
}

export default ServiceRecord