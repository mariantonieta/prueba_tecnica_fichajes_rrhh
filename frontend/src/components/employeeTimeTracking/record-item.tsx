import { TimeTrackingOut } from "../../services/timeTrackingServices";

interface RecordItemProps {
  record: TimeTrackingOut;
}

export function RecordItem({ record }: RecordItemProps) {
  return (
    <li className="p-4 border rounded-lg flex justify-between items-center">
      <span className="font-medium">{record.record_type}</span>
      <span className="text-gray-600">
        {new Date(record.timestamp).toLocaleString()}
      </span>
    </li>
  );
}