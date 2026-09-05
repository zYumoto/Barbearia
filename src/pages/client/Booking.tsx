import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BarberPlaceholder from "../../components/common/BarberPlaceholder";
import ServiceIcon from "../../components/common/ServiceIcon";
import { useAuth } from "../../lib/auth";
import { getAvailableSlots } from "../../lib/availability";
import { addMinutes, money, nextBusinessDayIso, nextBusinessDaysIso } from "../../lib/format";
import { createAppointment, readDb } from "../../lib/store";

export default function Booking() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const db = readDb();
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState(params.get("service") ?? user?.favoriteServiceId ?? db.services[0]?.id);
  const [barberId, setBarberId] = useState<string | null>(params.get("barber") ?? user?.favoriteBarberId ?? null);
  const [date, setDate] = useState(nextBusinessDayIso());
  const [time, setTime] = useState("");
  const [done, setDone] = useState(false);
  const service = db.services.find((item) => item.id === serviceId)!;
  const barber = barberId ? db.barbers.find((item) => item.id === barberId) : null;
  const slots = useMemo(() => getAvailableSlots({ date, barberId, duration: service.durationMinutes, workingHours: db.workingHours, appointments: db.appointments, daysOff: db.barberDaysOff }), [date, barberId, service.durationMinutes]);
  const dates = nextBusinessDaysIso(12);
  function confirmBooking() {
    createAppointment({ customerId: user!.id, barberId: barberId ?? db.barbers[0].id, serviceId: service.id, appointmentDate: date, startTime: time, endTime: addMinutes(time, service.durationMinutes), price: service.price, status: "confirmed" });
    setDone(true);
  }
  if (done) return <div className="card card-pad" style={{ maxWidth: 680 }}><CheckCircle2 color="var(--ok)" size={44} /><h1 className="font-display">Agendamento confirmado!</h1><p className="muted">{service.name} em {date} às {time}.</p><button className="btn" onClick={() => downloadIcs(service.name, date, time, service.durationMinutes)}>Adicionar ao calendário</button> <Link className="btn primary" to="/app">Voltar ao dashboard</Link></div>;
  return (
    <div className="grid">
      <div><div className="eyebrow">Novo agendamento</div><h1 className="font-display">Escolha seu horário</h1></div>
      <div className="badge">Etapa {step} de 5</div>
      {step === 1 && <Picker items={db.services.filter((item) => item.active)} selected={serviceId} onSelect={(id) => { setServiceId(id); setTime(""); }} render={(item) => <><ServiceIcon iconKey={item.iconKey} /><h3>{item.name}</h3><p className="muted">{item.description}</p><strong>{money.format(item.price)} · {item.durationMinutes} min</strong></>} />}
      {step === 2 && <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}><button className={`card card-pad ${barberId === null ? "selected-card" : ""}`} onClick={() => setBarberId(null)}><h3>Qualquer profissional disponível</h3><p className="muted">A equipe escolhe o melhor encaixe.</p></button>{db.barbers.filter((item) => item.active).map((item) => <button className={`card card-pad ${barberId === item.id ? "selected-card" : ""}`} key={item.id} onClick={() => setBarberId(item.id)}><BarberPlaceholder name={item.name} /><h3>{item.name}</h3><p className="muted">{item.specialties.join(", ")}</p></button>)}</div>}
      {step === 3 && <Picker className="date-picker-grid" itemClassName="date-choice" items={dates.map((item) => ({ id: item, name: new Date(`${item}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" }) }))} selected={date} onSelect={(id) => { setDate(id); setTime(""); }} render={(item) => <h3>{item.name}</h3>} />}
      {step === 4 && <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}>{slots.map((slot) => <button className={`btn ${time === slot.time ? "primary" : ""}`} disabled={slot.disabled} key={slot.time} onClick={() => setTime(slot.time)}>{slot.time}</button>)}</div>}
      {step === 5 && <div className="card card-pad"><h2>Resumo</h2><p><strong>{service.name}</strong> com {barber?.name ?? "qualquer profissional"}</p><p className="muted">{date} às {time} · {money.format(service.price)}</p></div>}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button className="btn" disabled={step === 1} onClick={() => setStep(step - 1)}>Voltar</button>{step < 5 ? <button className="btn primary" disabled={(step === 4 && !time)} onClick={() => setStep(step + 1)}>Continuar</button> : <button className="btn primary" onClick={confirmBooking}>Confirmar agendamento</button>}</div>
    </div>
  );
}

function Picker<T extends { id: string }>({ items, selected, onSelect, render, className = "", itemClassName = "" }: { items: T[]; selected?: string; onSelect: (id: string) => void; render: (item: T) => ReactNode; className?: string; itemClassName?: string }) {
  return <div className={`grid ${className}`} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>{items.map((item) => <button className={`card card-pad lift-card ${itemClassName} ${selected === item.id ? "selected-card" : ""}`} key={item.id} onClick={() => onSelect(item.id)}>{render(item)}</button>)}</div>;
}

function downloadIcs(title: string, date: string, time: string, duration: number) {
  const start = `${date.replaceAll("-", "")}T${time.replace(":", "")}00`;
  const endTime = addMinutes(time, duration).replace(":", "");
  const body = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${title} - Mt Barbearia\nLOCATION:Av. Eng. Manoel Ferramenta Junior, 10 - Areia Branca, Santos - SP\nDTSTART:${start}\nDTEND:${date.replaceAll("-", "")}T${endTime}00\nEND:VEVENT\nEND:VCALENDAR`;
  const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "barber-club-agendamento.ics";
  link.click();
  URL.revokeObjectURL(url);
}
