import { CalendarDays, Home, LogOut, Menu, Scissors, User, WandSparkles, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";

export default function ClientLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["/app", "Dashboard", Home],
    ["/app/agendamento/novo", "Novo agendamento", WandSparkles],
    ["/app/agendamentos", "Agendamentos", CalendarDays],
    ["/app/meus-cortes", "Meus cortes", Scissors],
    ["/app/perfil", "Perfil", User]
  ] as const;
  return (
    <div className={`app-shell ${menuOpen ? "menu-open" : ""}`}>
      <aside className="sidebar app-sidebar">
        <div className="app-topbar">
          <div>
            <strong className="font-display" style={{ color: "var(--gold-2)", fontSize: "1.25rem" }}>Mt Barbearia</strong>
            <p className="muted">{user?.fullName}</p>
          </div>
          <button className="btn icon-btn app-menu-button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="nav-list app-nav">
          {links.map(([to, label, Icon]) => <NavLink key={to} end={to === "/app"} className="nav-link" to={to} onClick={() => setMenuOpen(false)}><Icon size={18} /> {label}</NavLink>)}
          <button className="nav-link" style={{ border: 0, background: "transparent" }} onClick={() => { signOut(); navigate("/"); }}><LogOut size={18} /> Sair</button>
        </nav>
      </aside>
      <main className="main"><Outlet /></main>
    </div>
  );
}
