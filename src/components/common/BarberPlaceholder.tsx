export default function BarberPlaceholder({ name, size = 64 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((part) => part[0]).slice(0, 2).join("");
  return <div className="avatar" style={{ width: size }}>{initials}</div>;
}
