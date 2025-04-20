import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './component/Login'
import Register from './component/Register';
import AdminDashborad from './component/AdminDashboard/Dashboard';
import CustomerDashborad from './component/CustomerDashboard/Dashboard';
import AddProduct from './component/AdminDashboard/AddProduct';
import ViewOrder from './component/AdminDashboard/ViewOrders';
import YourOrder from './component/CustomerDashboard/YourOrders';
import ProtectedRoute from './component/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>




        <Route path='/adminDashboard' element={
          <ProtectedRoute roles={['admin']}>
          <AdminDashborad/>
          </ProtectedRoute>}/>
        <Route path='/addProduct' element={
          <ProtectedRoute roles={['admin']}>
          <AddProduct/>
          </ProtectedRoute>}/>
        <Route path='/viewOrders' element={
          <ProtectedRoute roles={['admin']}>
          <ViewOrder/>
          </ProtectedRoute>}/>




        <Route path='/customerDashboard' element={
          <ProtectedRoute roles={['customer']}>
          <CustomerDashborad/>
          </ProtectedRoute>}/>

        <Route path='/yourOrder' element={
          <ProtectedRoute roles={['customer']}>
          <YourOrder/>
          </ProtectedRoute>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
