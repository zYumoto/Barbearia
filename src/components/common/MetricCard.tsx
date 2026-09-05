export default function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="card card-pad">
      <div className="muted" style={{ fontWeight: 800, fontSize: ".85rem" }}>{label}</div>
      <div className="font-display" style={{ fontSize: "2rem", fontWeight: 800, marginTop: 8 }}>{value}</div>
      {hint ? <div className="muted" style={{ marginTop: 6 }}>{hint}</div> : null}
    </div>
  );
}
