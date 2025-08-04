import { Routes, Route, Router, BrowserRouter, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AddRecord from './pages/AddRecord'
import Layout from './components/Layout'
import RecordDetails from './pages/RecordDetails'
import { useState } from 'react'
import Login from './pages/Login'
import Account from './pages/Account'
import Inventory from './pages/Inventory'

function App() {
  const [isAuthenticated, setAuth] = useState(!!localStorage.getItem('token'))
  const [role, setRole] = useState(null)

  return (

    <Routes>
      <Route path='/login' element={<Login setAuth={setAuth} setRole={setRole} />} />

      <Route path="/" element={isAuthenticated ? <Layout setAuth={setAuth} /> : <Navigate to='/login' />}>

        <Route index element={<Dashboard setAuth={setAuth} />} />
        <Route path="add-record" element={<AddRecord />} />
        <Route path="/records/:id" element={<RecordDetails />} />
        <Route path="/account" element={<Account/>} />
        <Route path="/inventory" element={<Inventory/>} />

      </Route>

      <Route path='*' element = {<Navigate to={isAuthenticated ? '/' : '/login'} />} />

    </Routes>

  )
}

export default App;
