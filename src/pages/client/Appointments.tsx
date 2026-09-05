import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { formatDate, money, statusLabel, todayIso } from "../../lib/format";
import { readDb, setAppointmentStatus } from "../../lib/store";

export default function Appointments() {
  const { user } = useAuth();
  const db = readDb();
  const [tab, setTab] = useState("upcoming");
  const items = db.appointments.filter((item) => item.customerId === user?.id).filter((item) => tab === "upcoming" ? item.appointmentDate >= todayIso() && item.status !== "cancelled" : tab === "cancelled" ? item.status === "cancelled" : item.status === "completed" || item.appointmentDate < todayIso());
  return <div className="grid"><h1 className="font-display">Agendamentos</h1><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{[["upcoming","Próximos"],["history","Histórico"],["cancelled","Cancelados"]].map(([id,label]) => <button className={`btn ${tab === id ? "primary" : ""}`} key={id} onClick={() => setTab(id)}>{label}</button>)}</div>{items.map((item) => <article className="card card-pad" key={item.id}><span className={`badge status-${item.status}`}>{statusLabel(item.status)}</span><h3>{db.services.find((service) => service.id === item.serviceId)?.name}</h3><p className="muted">{formatDate(item.appointmentDate)} às {item.startTime} · {db.barbers.find((barber) => barber.id === item.barberId)?.name} · {money.format(item.price)}</p><div style={{ display: "flex", gap: 8 }}>{item.status !== "cancelled" && item.status !== "completed" ? <button className="btn danger" onClick={() => confirm("Cancelar este agendamento?") && setAppointmentStatus(item.id, "cancelled")}>Cancelar</button> : null}<Link className="btn" to="/app/agendamento/novo">Reagendar</Link></div></article>)}{!items.length ? <p className="muted">Nenhum agendamento nesta aba.</p> : null}</div>;
}
