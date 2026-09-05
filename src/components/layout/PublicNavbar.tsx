import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["#top", "Início"],
    ["#servicos", "Serviços"],
    ["#barbeiros", "Barbeiros"],
    ["#sobre", "Sobre"],
    ["#avaliacoes", "Avaliações"],
    ["#contato", "Contato"]
  ];
  return (
    <header style={{ position: "fixed", inset: "0 0 auto", zIndex: 20, background: scrolled || open ? "rgba(10,10,10,.92)" : "linear-gradient(180deg, rgba(0,0,0,.55), transparent)", borderBottom: scrolled || open ? "1px solid var(--line)" : "1px solid transparent", backdropFilter: "blur(14px)" }}>
      <div className="container" style={{ height: 74, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
        <Link id="top" to="/" className="font-display brand-mark">Mt Barbearia</Link>
        <nav className="desktop-nav nav-center">
          {links.map(([href, label]) => <a key={href} className="muted" href={href}>{label}</a>)}
        </nav>
        <div className="desktop-nav nav-actions">
          <Link className="btn ghost" to="/login">Entrar</Link>
          <Link className="btn primary" to="/cadastro">Agendar horário</Link>
        </div>
        <button className="btn icon-btn mobile-only" aria-label="Abrir menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open ? (
        <div className="container mobile-only" style={{ padding: "0 0 16px", display: "grid", gap: 10 }}>
          {links.map(([href, label]) => <a key={href} className="btn ghost" href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <Link className="btn ghost" to="/login">Entrar</Link>
          <Link className="btn primary" to="/cadastro">Agendar horário</Link>
        </div>
      ) : null}
    </header>
  );
}
