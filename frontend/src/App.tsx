import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./features/home/Home"
import Layout from "./common/components/layout/Layout"
import Login from "./features/login/Login"
import NotFound from "./features/notfound/NotFound"
import SignUp from "./features/signup/SignUp"
import Dashboard from "./features/dashboard/Dashboard"
import Appointments from "./features/appointments/Appointments"
import Appointment from "./features/appointment/Appointment"
import NewAppointment from "./features/create-appointment/NewAppointment"

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home title="Arkham Hospital - Home"/>} />
        <Route path="sign-up" element={<SignUp title="Arkham Hospital - Sign up"/>} />
        <Route path="login" element={<Login title="Arkham Hospital - Log In" />} />
        <Route path="dashboard" element={<Dashboard title="Arkham Hospital - Dashboard" />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="appointments/:id" element={<Appointment />}/>
        <Route path="appointments/new" element={<NewAppointment />} />
        <Route path="*" element={<NotFound title="Arkham Hospital - Page not found"/>} />
      </Route>
    </Routes>
  </BrowserRouter>
  )
}