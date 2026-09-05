import MetricCard from "../../components/common/MetricCard";
import { money, todayIso } from "../../lib/format";
import { readDb, setAppointmentStatus } from "../../lib/store";

export default function AdminDashboard() {
  const db = readDb();
  const today = todayIso();
  const todayAppointments = db.appointments.filter((item) => item.appointmentDate === today && item.status !== "cancelled");
  const revenueToday = db.payments.filter((item) => item.paidAt?.slice(0, 10) === today).reduce((sum, item) => sum + item.amount, 0);
  const revenueMonth = db.payments.reduce((sum, item) => item.paidAt?.slice(0, 7) === today.slice(0, 7) ? sum + item.amount : sum, 0);
  return <div className="grid"><div><div className="eyebrow">Painel admin</div><h1 className="font-display">Operação do dia</h1></div><div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}><MetricCard label="Agendamentos hoje" value={todayAppointments.length} /><MetricCard label="Clientes" value={db.profiles.filter((p) => p.role === "customer").length} /><MetricCard label="Faturamento hoje" value={money.format(revenueToday)} /><MetricCard label="Faturamento mês" value={money.format(revenueMonth)} /><MetricCard label="Ocupação" value={`${Math.min(100, Math.round(db.appointments.filter((a) => a.appointmentDate >= today && a.status !== "cancelled").length / 12 * 100))}%`} /></div><section className="card card-pad"><h2>Lista do dia</h2>{todayAppointments.map((item) => <p key={item.id}><strong>{item.startTime}</strong> · {db.profiles.find((p) => p.id === item.customerId)?.fullName} · {db.services.find((s) => s.id === item.serviceId)?.name} <button className="btn" onClick={() => setAppointmentStatus(item.id, "completed")}>Concluir</button></p>)}{!todayAppointments.length ? <p className="muted">Nenhum agendamento para hoje.</p> : null}</section></div>;
}
