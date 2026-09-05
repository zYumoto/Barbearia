import { CalendarCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import MetricCard from "../../components/common/MetricCard";
import { useAuth } from "../../lib/auth";
import { formatDate, money, todayIso } from "../../lib/format";
import { readDb, setAppointmentStatus } from "../../lib/store";

export default function ClientDashboard() {
  const { user } = useAuth();
  const db = readDb();
  const appointments = db.appointments.filter((item) => item.customerId === user?.id);
  const next = appointments.filter((item) => item.appointmentDate >= todayIso() && item.status !== "cancelled").sort((a, b) => `${a.appointmentDate}${a.startTime}`.localeCompare(`${b.appointmentDate}${b.startTime}`))[0];
  const history = db.customerHistory.filter((item) => item.customerId === user?.id).slice(-3).reverse();
  const favoriteBarber = db.barbers.find((item) => item.id === user?.favoriteBarberId)?.name ?? "Ainda não definido";
  return (
    <div className="grid">
      <div>
        <div className="eyebrow">Área do cliente</div>
        <h1 className="font-display" style={{ fontSize: "2.6rem", margin: "6px 0" }}>Olá, {user?.fullName.split(" ")[0]} 👋</h1>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
        <MetricCard label="Visitas" value={history.length} hint="registradas no histórico" />
        <MetricCard label="Barbeiro favorito" value={favoriteBarber} />
        <MetricCard label="Último corte" value={history[0] ? formatDate(history[0].appointmentDate) : "Sem registros"} />
      </div>
      <section className="card card-pad">
        <h2>Próximo agendamento</h2>
        {next ? (
          <div className="grid" style={{ gridTemplateColumns: "1fr auto", alignItems: "center" }}>
            <div>
              <strong>{db.services.find((service) => service.id === next.serviceId)?.name}</strong>
              <p className="muted">{formatDate(next.appointmentDate)} às {next.startTime} · {db.barbers.find((barber) => barber.id === next.barberId)?.name ?? "Qualquer profissional"} · {money.format(next.price)}</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn" to="/app/agendamento/novo">Reagendar</Link>
              <button className="btn danger" onClick={() => confirm("Cancelar este agendamento?") && setAppointmentStatus(next.id, "cancelled")}>Cancelar</button>
            </div>
          </div>
        ) : <Empty icon={<CalendarCheck />} text="Nenhum horário futuro. Escolha seu próximo atendimento." action="/app/agendamento/novo" />}
      </section>
      <section className="card card-pad">
        <h2>Últimos cortes</h2>
        {history.length ? history.map((item) => <p key={item.id}><strong>{item.serviceName}</strong> <span className="muted">com {item.barberName} · {formatDate(item.appointmentDate)}</span></p>) : <p className="muted">Seu histórico aparecerá aqui após o primeiro atendimento.</p>}
      </section>
    </div>
  );
}

function Empty({ icon, text, action }: { icon: ReactNode; text: string; action: string }) {
  return <div style={{ display: "grid", gap: 14, placeItems: "start" }}>{icon}<p className="muted">{text}</p><Link className="btn primary" to={action}>Agendar agora</Link></div>;
}
