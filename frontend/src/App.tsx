import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./features/home/Home";
import Layout from "./common/components/layout/Layout";
import Login from "./features/login/Login";
import NotFound from "./features/notfound/NotFound";
import SignUp from "./features/signup/SignUp";
import Appointments from "./features/appointments/Appointments";
import NewAppointment from "./features/create-appointment/NewAppointment";
import Users from "./features/users/Users";
import NewDoctor from "./features/new-doctor/NewDoctor";
import DeleteAccount from "./features/delete-account/DeleteAccount";
import EditAppointment from "./features/edit-appointment/EditAppointment";
import CreateMessage from "./features/contact/CreateMessage";
import Messages from "./features/messages/Messages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home title="Arkham Hospital - Home" />} />
          <Route
            path="/home"
            element={<Home title="Arkham Hospital - Home" />}
          />
          <Route
            path="sign-up"
            element={<SignUp title="Arkham Hospital - Sign up" />}
          />
          <Route
            path="login"
            element={<Login title="Arkham Hospital - Log In" />}
          />
          <Route
            path="appointments"
            element={<Appointments title={"Arkham Hospital - Appointments"} />}
          />
          <Route
            path="appointments/new"
            element={
              <NewAppointment title="Arkham Hospital - New Appointment" />
            }
          />
          <Route
            path="users"
            element={<Users title={"Arkham Hospital - Users"} />}
          />
          <Route
            path="users/new-doctor"
            element={<NewDoctor title={"Arkham Hospital - New Doctor"} />}
          />
          <Route
            path="delete-account"
            element={
              <DeleteAccount title={"Arkham Hospital - Delete account"} />
            }
          />
          <Route
            path="edit-appointment/:id"
            element={
              <EditAppointment
                title={"Arkham Hospital - Edit Appointment Date"}
              />
            }
          />
          <Route
            path="/message"
            element={<CreateMessage title="Arkham Hospital - Contact" />}
          />
          <Route
            path="/messages"
            element={<Messages title="Arkham Hospital - User Messages" />}
          />
          <Route
            path="*"
            element={<NotFound title="Arkham Hospital - Page not found" />}
          />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
