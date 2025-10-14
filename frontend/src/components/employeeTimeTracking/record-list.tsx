import { TimeTrackingOut } from "../../services/timeTrackingServices";
import { RecordItem } from "./record-item";

interface RecordsListProps {
  records: TimeTrackingOut[];
}

export function RecordsList({ records }: RecordsListProps) {
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <ul className="space-y-4 max-h-96 overflow-y-auto">
      {sortedRecords.map((record) => (
        <RecordItem key={record.id} record={record} />
      ))}
    </ul>
  );
}