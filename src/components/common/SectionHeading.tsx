export default function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div style={{ maxWidth: 680, marginBottom: 28 }}>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="section-title">{title}</h2>
      {text ? <p className="muted" style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>{text}</p> : null}
    </div>
  );
}
