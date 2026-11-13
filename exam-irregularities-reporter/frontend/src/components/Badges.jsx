const STATUS_STYLES = {
  Submitted: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Assigned: 'bg-purple-100 text-purple-700',
  'In Progress': 'bg-orange-100 text-orange-700',
  Resolved: 'bg-green-100 text-green-700',
};

const PRIORITY_STYLES = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-blue-100 text-blue-700',
  Low: 'bg-gray-100 text-gray-600',
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  if (!priority) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
        Pending
      </span>
    );
  }
  const style = PRIORITY_STYLES[priority] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {priority}
    </span>
  );
}
