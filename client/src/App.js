import { Routes, Route, Router, BrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AddRecord from './pages/AddRecord'
import Layout from './components/Layout'

function App() {
  return (

    <Routes>

      <Route path="/" element={<Layout />}>

        <Route index element={<Dashboard />} />
        <Route path="add-record" element={<AddRecord />} />

      </Route>

    </Routes>

  );
}

export default App;
