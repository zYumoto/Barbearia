import { useState } from "react";
import { addDaysIso, formatShortDate, todayIso } from "../../lib/format";
import { readDb, setAppointmentStatus } from "../../lib/store";

export default function AdminAgenda() {
  const db = readDb();
  const [mode, setMode] = useState("day");
  const days = mode === "day" ? [todayIso()] : mode === "week" ? Array.from({ length: 7 }, (_, i) => addDaysIso(i)) : Array.from({ length: 30 }, (_, i) => addDaysIso(i));
  return <div className="grid"><h1 className="font-display">Agenda</h1><div style={{ display: "flex", gap: 8 }}>{["day","week","month"].map((item) => <button className={`btn ${mode === item ? "primary" : ""}`} key={item} onClick={() => setMode(item)}>{item === "day" ? "Dia" : item === "week" ? "Semana" : "Mês"}</button>)}</div><div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>{db.barbers.map((barber) => <section className="card card-pad" key={barber.id}><h2>{barber.name}</h2>{days.flatMap((day) => db.appointments.filter((apt) => apt.barberId === barber.id && apt.appointmentDate === day)).sort((a,b)=>`${a.appointmentDate}${a.startTime}`.localeCompare(`${b.appointmentDate}${b.startTime}`)).map((apt) => <div className="card card-pad" style={{ marginBottom: 10 }} key={apt.id}><span className={`badge status-${apt.status}`}>{apt.status}</span><p><strong>{formatShortDate(apt.appointmentDate)} {apt.startTime}</strong></p><p className="muted">{db.profiles.find((p) => p.id === apt.customerId)?.fullName} · {db.services.find((s) => s.id === apt.serviceId)?.name}</p><button className="btn" onClick={() => setAppointmentStatus(apt.id, "confirmed")}>Confirmar</button> <button className="btn" onClick={() => setAppointmentStatus(apt.id, "completed")}>Concluir</button> <button className="btn danger" onClick={() => setAppointmentStatus(apt.id, "cancelled")}>Cancelar</button></div>)} </section>)}</div></div>;
}
