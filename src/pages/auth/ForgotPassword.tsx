import { Link } from "react-router-dom";
import { AuthShell } from "./Login";

export default function ForgotPassword() {
  return <AuthShell title="Recuperar senha" subtitle="No modo local, o link aponta para a tela de redefinição.">
    <div className="grid">
      <label className="label">E-mail<input className="input" type="email" defaultValue="cliente@mtbarbearia.com" /></label>
      <Link className="btn primary" to="/redefinir-senha">Enviar link</Link>
    </div>
  </AuthShell>;
}
