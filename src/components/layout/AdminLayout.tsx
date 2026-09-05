import { Banknote, CalendarRange, Home, LogOut, Menu, Scissors, Settings, UserRound, Users, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["/admin", "Dashboard", Home],
    ["/admin/agenda", "Agenda", CalendarRange],
    ["/admin/clientes", "Clientes", Users],
    ["/admin/barbeiros", "Barbeiros", UserRound],
    ["/admin/servicos", "Serviços", Scissors],
    ["/admin/financeiro", "Financeiro", Banknote],
    ["/admin/configuracoes", "Configurações", Settings]
  ] as const;
  return (
    <div className={`app-shell ${menuOpen ? "menu-open" : ""}`}>
      <aside className="sidebar app-sidebar">
        <div className="app-topbar">
          <strong className="font-display" style={{ color: "var(--gold-2)", fontSize: "1.25rem" }}>Mt Barbearia Admin</strong>
          <button className="btn icon-btn app-menu-button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="nav-list app-nav">
          {links.map(([to, label, Icon]) => <NavLink end={to === "/admin"} className="nav-link" to={to} key={to} onClick={() => setMenuOpen(false)}><Icon size={18} /> {label}</NavLink>)}
          <button className="nav-link" style={{ border: 0, background: "transparent" }} onClick={() => { signOut(); navigate("/"); }}><LogOut size={18} /> Sair</button>
        </nav>
      </aside>
      <main className="main"><Outlet /></main>
    </div>
  );
}
