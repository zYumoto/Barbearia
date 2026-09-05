import { Brush, Crown, Eye, Scissors, Sparkles, Wand2 } from "lucide-react";

const icons = { scissors: Scissors, razor: Wand2, sparkles: Sparkles, crown: Crown, eye: Eye, brush: Brush };

export default function ServiceIcon({ iconKey }: { iconKey: string }) {
  const Icon = icons[iconKey as keyof typeof icons] ?? Scissors;
  return (
    <div className="avatar" style={{ width: 48 }}>
      <Icon size={22} />
    </div>
  );
}
