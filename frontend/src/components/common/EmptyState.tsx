interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="text-gray-500 mb-2">{title}</div>
      <div className="text-sm text-gray-400">{description}</div>
    </div>
  );
}
