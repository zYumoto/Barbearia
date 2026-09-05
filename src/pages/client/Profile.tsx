import { FormEvent, useState } from "react";
import { useAuth } from "../../lib/auth";
import { readDb, updateProfile } from "../../lib/store";

export default function Profile() {
  const { user, refresh } = useAuth();
  const db = readDb();
  const [saved, setSaved] = useState(false);
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    updateProfile({ ...user!, fullName: String(data.get("fullName")), phone: String(data.get("phone")), birthDate: String(data.get("birthDate")), password: String(data.get("password")) || user!.password, favoriteBarberId: String(data.get("favoriteBarberId")), favoriteServiceId: String(data.get("favoriteServiceId")) });
    refresh();
    setSaved(true);
  }
  return <div className="grid" style={{ maxWidth: 760 }}><h1 className="font-display">Perfil</h1><form className="card card-pad grid" onSubmit={onSubmit}><label className="label">Foto de perfil<input className="input" type="file" accept="image/*" /></label><label className="label">Nome<input className="input" name="fullName" defaultValue={user?.fullName} /></label><label className="label">E-mail<input className="input" value={user?.email} disabled /></label><label className="label">Telefone<input className="input" name="phone" defaultValue={user?.phone} /></label><label className="label">Nascimento<input className="input" type="date" name="birthDate" defaultValue={user?.birthDate} /></label><label className="label">Nova senha<input className="input" type="password" name="password" placeholder="Deixe vazio para manter" /></label><label className="label">Barbeiro favorito<select className="select" name="favoriteBarberId" defaultValue={user?.favoriteBarberId}>{db.barbers.map((barber) => <option value={barber.id} key={barber.id}>{barber.name}</option>)}</select></label><label className="label">Corte favorito<select className="select" name="favoriteServiceId" defaultValue={user?.favoriteServiceId}>{db.services.map((service) => <option value={service.id} key={service.id}>{service.name}</option>)}</select></label>{saved ? <div className="toast">Perfil atualizado.</div> : null}<button className="btn primary">Salvar alterações</button></form></div>;
}
