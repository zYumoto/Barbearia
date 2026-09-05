export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "34px 0", background: "#080808" }}>
      <div className="container grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        <div>
          <strong className="font-display" style={{ color: "var(--gold-2)" }}>Mt Barbearia</strong>
          <p className="muted">© 2026 Mt Barbearia. Todos os direitos reservados.</p>
        </div>
        <div className="grid" style={{ gap: 8 }}>
          <a className="muted" href="#servicos">Serviços</a>
          <a className="muted" href="/app/agendamento/novo">Agendamento</a>
          <a className="muted" href="#barbeiros">Barbeiros</a>
          <a className="muted" href="#sobre">Sobre</a>
          <a className="muted" href="#contato">Contato</a>
        </div>
        <div>
          <p>Av. Eng. Manoel Ferramenta Júnior, 10 — Areia Branca, Santos - SP</p>
          <p className="muted">Segunda a Sexta · 09:00 — 20:00</p>
          <p className="muted">Sábado · 09:00 — 18:00</p>
        </div>
        <div>
          <p><a href="tel:+5513988592508">(13) 98859-2508</a></p>
          <p className="muted"><a href="https://www.instagram.com/mtbarbearia__/" target="_blank" rel="noreferrer">@mtbarbearia__</a></p>
        </div>
      </div>
    </footer>
  );
}
