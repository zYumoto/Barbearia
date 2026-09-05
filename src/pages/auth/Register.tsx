import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { AuthShell } from "./Login";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password"));
    const confirmPassword = String(data.get("confirmPassword"));
    if (password.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres.");
    if (password !== confirmPassword) return setError("As senhas precisam ser iguais.");
    if (!data.get("terms")) return setError("Aceite os termos para continuar.");
    try {
      signUp({ fullName: String(data.get("fullName")), email: String(data.get("email")), password, phone: String(data.get("phone")), birthDate: String(data.get("birthDate")), favoriteBarberId: undefined, favoriteServiceId: undefined });
      navigate("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível cadastrar.");
    }
  }
  return <AuthShell title="Crie sua conta" subtitle="Crie sua conta para agendar em poucos cliques.">
    <form className="grid" onSubmit={onSubmit}>
      <label className="label">Nome completo<input className="input" name="fullName" required minLength={3} /></label>
      <label className="label">E-mail<input className="input" name="email" type="email" required /></label>
      <label className="label">Telefone<input className="input" name="phone" placeholder="(13) 99999-9999" required /></label>
      <label className="label">Nascimento<input className="input" name="birthDate" type="date" required /></label>
      <label className="label">Senha<input className="input" name="password" type="password" required /></label>
      <label className="label">Confirmar senha<input className="input" name="confirmPassword" type="password" required /></label>
      <label style={{ display: "flex", gap: 10, alignItems: "center" }}><input name="terms" type="checkbox" /> Li e aceito os termos de uso e política de privacidade.</label>
      {error ? <div className="badge status-cancelled">{error}</div> : null}
      <button className="btn primary">Criar minha conta</button>
      <Link className="muted" to="/login">Já possui uma conta? Entrar</Link>
    </form>
  </AuthShell>;
}
