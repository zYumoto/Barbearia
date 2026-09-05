import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAdmin, RequireAuth } from "./lib/auth";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ClientLayout from "./components/layout/ClientLayout";
import ClientDashboard from "./pages/client/Dashboard";
import Booking from "./pages/client/Booking";
import Appointments from "./pages/client/Appointments";
import MyCuts from "./pages/client/MyCuts";
import Profile from "./pages/client/Profile";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAgenda from "./pages/admin/Agenda";
import AdminCustomers from "./pages/admin/Customers";
import AdminBarbers from "./pages/admin/Barbers";
import AdminServices from "./pages/admin/Services";
import AdminFinance from "./pages/admin/Finance";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />
      <Route path="/redefinir-senha" element={<ResetPassword />} />
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="agendamento/novo" element={<Booking />} />
          <Route path="agendamentos" element={<Appointments />} />
          <Route path="meus-cortes" element={<MyCuts />} />
          <Route path="perfil" element={<Profile />} />
        </Route>
      </Route>
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="agenda" element={<AdminAgenda />} />
          <Route path="clientes" element={<AdminCustomers />} />
          <Route path="barbeiros" element={<AdminBarbers />} />
          <Route path="servicos" element={<AdminServices />} />
          <Route path="financeiro" element={<AdminFinance />} />
          <Route path="configuracoes" element={<AdminSettings />} />
        </Route>
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
