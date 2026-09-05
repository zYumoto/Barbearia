import { FormEvent } from "react";
import { readDb, resetSeed, updateWorkingHour } from "../../lib/store";

export default function AdminSettings() {
  const db = readDb();
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    db.workingHours.forEach((hour) => updateWorkingHour(hour.weekday, String(data.get(`open-${hour.weekday}`)), String(data.get(`close-${hour.weekday}`)), data.get(`active-${hour.weekday}`) === "on"));
  }
  return <div className="grid" style={{ maxWidth: 760 }}><h1 className="font-display">Configurações</h1><form className="card card-pad grid" onSubmit={save}>{db.workingHours.map((hour) => <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr auto", alignItems: "end" }} key={hour.id}><strong>{["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][hour.weekday]}</strong><label className="label">Abre<input className="input" type="time" name={`open-${hour.weekday}`} defaultValue={hour.open} /></label><label className="label">Fecha<input className="input" type="time" name={`close-${hour.weekday}`} defaultValue={hour.close} /></label><label><input type="checkbox" name={`active-${hour.weekday}`} defaultChecked={hour.active} /> Ativo</label></div>)}<button className="btn primary">Salvar horários</button></form><button className="btn danger" onClick={() => confirm("Restaurar o seed local?") && resetSeed()}>Restaurar seed local</button></div>;
}
