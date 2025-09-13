import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-2 flex-wrap">
      <StatusBadge status="not_started" />
      <StatusBadge status="in_progress" />
      <StatusBadge status="completed" />
      <StatusBadge status="failed" />
    </div>
  );
}