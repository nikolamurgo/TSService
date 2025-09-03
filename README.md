# Mobile Phone Repair Information System

This project is an **information system** for managing a mobile phone service shop.  
It provides features for admins and technicians to manage repair workflows.
  
---

## Features

- **Authentication**
  - Secure login system with roles (Admin / Technician)
  - Only admins can create technician accounts

- **Repair Management**
  - Add and update repair records
  - Track status, costs, and technician assignments
  - View detailed repair history
    
- **Notify via e-mail**
  - Send automated mails to customer on repair status change
  - Inform the customer about pickup

- **Customer & Device Management**
  - Store customer details
  - Track customer devices and related repairs

- **Repair Agreements**
  - Generate agreements for repairs
  - Store agreement information for reference

- **Stock & Parts Management**
  - Track stock items (parts, components, accessories)
  - Assign parts to repairs and manage usage

- **Productivity Dashboard**
  - View technician productivity
  - See number of phones repaired per month
  - Track total earnings per technician

---

## Technology Stack

- **Frontend**: React.js, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MySQL (MariaDB)
- **Other**: CORS, dotenv, mysql2
