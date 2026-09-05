import { Link } from "react-router-dom";
import { AuthShell } from "./Login";

export default function ResetPassword() {
  return <AuthShell title="Redefinir senha" subtitle="Fluxo preparado para integrar ao recovery do Supabase.">
    <div className="grid">
      <label className="label">Nova senha<input className="input" type="password" /></label>
      <Link className="btn primary" to="/login">Salvar nova senha</Link>
    </div>
  </AuthShell>;
}
