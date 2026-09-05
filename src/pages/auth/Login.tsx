import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const user = signIn(String(data.get("email")), String(data.get("password")));
      navigate(user.role === "admin" ? "/admin" : (location.state?.from ?? "/app"), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    }
  }
  return <AuthShell title="Entrar" subtitle="Acesse sua agenda e histórico.">
    <form className="grid" onSubmit={onSubmit}>
      <label className="label">E-mail<input className="input" name="email" type="email" defaultValue="cliente@mtbarbearia.com" required /></label>
      <label className="label">Senha<input className="input" name="password" type="password" defaultValue="Cliente@123" required /></label>
      <label style={{ display: "flex", gap: 10, alignItems: "center" }}><input name="remember" type="checkbox" defaultChecked /> Lembrar de mim</label>
      {error ? <div className="badge status-cancelled">{error}</div> : null}
      <button className="btn primary"><LockKeyhole size={18} /> Entrar</button>
      <Link className="muted" to="/esqueci-senha">Esqueci minha senha</Link>
      <Link className="muted" to="/cadastro">Criar uma nova conta</Link>
    </form>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="page" style={{ display: "grid", placeItems: "center", padding: 18 }}>
      <div className="card card-pad" style={{ width: "min(440px, 100%)" }}>
        <Link to="/" className="eyebrow">Mt Barbearia</Link>
        <h1 className="font-display" style={{ fontSize: "2.6rem", margin: "10px 0 4px" }}>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
      </div>
    </main>
  );
}
