import { FormEvent, useState } from "react";
import ServiceIcon from "../../components/common/ServiceIcon";
import { money } from "../../lib/format";
import { createServiceDraft, deleteService, readDb, upsertService } from "../../lib/store";

export default function AdminServices() {
  const db = readDb();
  const [editing, setEditing] = useState(db.services[0]);
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    upsertService({ ...editing, name: String(data.get("name")), description: String(data.get("description")), price: Number(data.get("price")), durationMinutes: Number(data.get("duration")), active: data.get("active") === "on" });
  }
  return <div className="grid"><div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}><h1 className="font-display">Serviços</h1><button className="btn primary" onClick={() => setEditing(createServiceDraft(db.services.length + 1))}>Cadastrar serviço</button></div><div className="split" style={{ alignItems: "start" }}><div className="grid">{db.services.map((service) => <button className="card card-pad" key={service.id} onClick={() => setEditing(service)}><ServiceIcon iconKey={service.iconKey} /><h3>{service.name}</h3><p>{money.format(service.price)} · {service.durationMinutes} min</p></button>)}</div><form className="card card-pad grid" onSubmit={save}><label className="label">Nome<input className="input" name="name" defaultValue={editing.name} /></label><label className="label">Descrição<textarea className="textarea" name="description" defaultValue={editing.description} /></label><label className="label">Preço<input className="input" name="price" type="number" defaultValue={editing.price} /></label><label className="label">Tempo médio<input className="input" name="duration" type="number" defaultValue={editing.durationMinutes} /></label><label className="label">Imagem<input className="input" type="file" accept="image/*" /></label><label><input type="checkbox" name="active" defaultChecked={editing.active} /> Ativo</label><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button className="btn primary">Salvar serviço</button><button className="btn danger" type="button" onClick={() => confirm("Excluir este serviço?") && deleteService(editing.id)}>Excluir</button></div></form></div></div>;
}
