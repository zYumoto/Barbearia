import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { formatDate, money } from "../../lib/format";
import { readDb } from "../../lib/store";

export default function MyCuts() {
  const { user } = useAuth();
  const cuts = readDb().customerHistory.filter((item) => item.customerId === user?.id).reverse();
  return <div className="grid"><h1 className="font-display">Meus cortes</h1>{cuts.map((item) => <article className="card card-pad" key={item.id}><h3>{item.serviceName}</h3><p className="muted">{formatDate(item.appointmentDate)} · {item.barberName} · {money.format(item.price)}</p><span className="badge">★ {item.rating ?? "sem avaliação"}</span> <Link className="btn" to="/app/agendamento/novo">Agendar novamente</Link></article>)}{!cuts.length ? <p className="muted">Quando você concluir um atendimento, ele aparecerá aqui.</p> : null}</div>;
}
