
import {Outlet, Route, Routes } from 'react-router-dom'
import Home from '../../views/home/Home'
import EmpLogin from '../../employee/login/EmpLogin'
import Login from '../../company/login/Login'
import AdminLogin from '../../admin/login/AdminLogin'
import Gbis from '../../views/home/Components/Gbis'

export default function Common() {
   return (


         <Routes>

            <Route path='/' element={<Outlet />}>

               <Route path='/' element={<Home />} />
               <Route path='/gbis' element={<Gbis />} />

               <Route path="/employeeLogin" element={<EmpLogin  />} />

               <Route path="/admin/login" element={<AdminLogin   />} />
               {/* <Route path="/admin/login" element={<AdminSignup   />} /> */}

               <Route path="/client/login" element={<Login />} /> 



            </Route>
            

         
         </Routes>

   )
}
