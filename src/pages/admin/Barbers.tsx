import { FormEvent, useState } from "react";
import BarberPlaceholder from "../../components/common/BarberPlaceholder";
import { createBarberDraft, deleteBarber, readDb, upsertBarber } from "../../lib/store";

export default function AdminBarbers() {
  const db = readDb();
  const [editing, setEditing] = useState(db.barbers[0]);
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    upsertBarber({ ...editing, name: String(data.get("name")), bio: String(data.get("bio")), specialties: String(data.get("specialties")).split(",").map((item) => item.trim()).filter(Boolean), active: data.get("active") === "on" });
  }
  return <div className="grid"><div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}><h1 className="font-display">Barbeiros</h1><button className="btn primary" onClick={() => setEditing(createBarberDraft())}>Cadastrar barbeiro</button></div><div className="split" style={{ alignItems: "start" }}><div className="grid">{db.barbers.map((barber) => <button className="card card-pad" key={barber.id} onClick={() => setEditing(barber)}><BarberPlaceholder name={barber.name} /><h3>{barber.name}</h3><p className="muted">{barber.specialties.join(", ")}</p></button>)}</div><form className="card card-pad grid" onSubmit={save}><label className="label">Nome<input className="input" name="name" defaultValue={editing.name} /></label><label className="label">Bio<textarea className="textarea" name="bio" defaultValue={editing.bio} /></label><label className="label">Especialidades<input className="input" name="specialties" defaultValue={editing.specialties.join(", ")} /></label><label className="label">Foto<input className="input" type="file" accept="image/*" /></label><label className="label">Dia de folga<input className="input" type="date" /></label><label><input type="checkbox" name="active" defaultChecked={editing.active} /> Ativo</label><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button className="btn primary">Salvar barbeiro</button><button className="btn danger" type="button" onClick={() => confirm("Excluir este barbeiro?") && deleteBarber(editing.id)}>Excluir</button></div></form></div></div>;
}
