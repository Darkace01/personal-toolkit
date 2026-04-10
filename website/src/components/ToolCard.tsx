interface ToolCardProps {
  title: string;
  description: string;
  emoji: string;
  gradient: string;
}

export function ToolCard({ title, description, emoji, gradient }: ToolCardProps) {
  return (
    <div className="group relative rounded-2xl border border-gray-800 bg-gray-900 hover:border-gray-600 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl overflow-hidden cursor-pointer">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className="p-6">
        <div className="text-4xl mb-4">{emoji}</div>
        <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
      <div className={`h-1 bg-gradient-to-r ${gradient} opacity-70`} />
    </div>
  );
}
