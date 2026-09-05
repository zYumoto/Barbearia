import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="page" style={{ display: "grid", placeItems: "center", textAlign: "center" }}>
      <div>
        <div className="eyebrow">404</div>
        <h1 className="font-display">Página não encontrada</h1>
        <Link className="btn primary" to="/">Voltar ao início</Link>
      </div>
    </main>
  );
}
