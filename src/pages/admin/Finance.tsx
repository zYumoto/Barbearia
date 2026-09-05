import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MetricCard from "../../components/common/MetricCard";
import { money } from "../../lib/format";
import { readDb } from "../../lib/store";

export default function AdminFinance() {
  const db = readDb();
  const total = db.payments.reduce((sum, item) => sum + item.amount, 0);
  const chart = Object.values(db.payments.reduce<Record<string, { date: string; valor: number }>>((acc, item) => {
    const date = item.paidAt?.slice(5, 10) ?? "sem data";
    acc[date] = acc[date] ?? { date, valor: 0 };
    acc[date].valor += item.amount;
    return acc;
  }, {}));
  const ticket = db.payments.length ? total / db.payments.length : 0;
  return <div className="grid"><h1 className="font-display">Financeiro</h1><div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}><MetricCard label="Faturamento total" value={money.format(total)} /><MetricCard label="Ticket médio" value={money.format(ticket)} /><MetricCard label="Quantidade de cortes" value={db.customerHistory.length} /></div><section className="card card-pad"><h2>Faturamento diário</h2><div style={{ width: "100%", height: 320 }}><ResponsiveContainer><BarChart data={chart}><CartesianGrid stroke="#292929" /><XAxis dataKey="date" stroke="#a3a3a3" /><YAxis stroke="#a3a3a3" /><Tooltip formatter={(value) => money.format(Number(value))} contentStyle={{ background: "#151515", border: "1px solid #292929" }} /><Bar dataKey="valor" fill="#c8a45d" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div></section></div>;
}
