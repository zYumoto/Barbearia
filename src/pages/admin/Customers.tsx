import { money } from "../../lib/format";
import { readDb } from "../../lib/store";

export default function AdminCustomers() {
  const db = readDb();
  const customers = db.profiles.filter((item) => item.role === "customer");
  return <div className="grid"><h1 className="font-display">Clientes</h1><div className="table-wrap"><table><thead><tr><th>Nome</th><th>Telefone</th><th>E-mail</th><th>Visitas</th><th>Último corte</th><th>Total gasto</th><th>Favorito</th></tr></thead><tbody>{customers.map((customer) => { const history = db.customerHistory.filter((item) => item.customerId === customer.id); const total = history.reduce((sum, item) => sum + item.price, 0); return <tr key={customer.id}><td>{customer.fullName}</td><td>{customer.phone}</td><td>{customer.email}</td><td>{history.length}</td><td>{history.at(-1)?.serviceName ?? "-"}</td><td>{money.format(total)}</td><td>{db.barbers.find((barber) => barber.id === customer.favoriteBarberId)?.name ?? "-"}</td></tr>; })}</tbody></table></div></div>;
}
