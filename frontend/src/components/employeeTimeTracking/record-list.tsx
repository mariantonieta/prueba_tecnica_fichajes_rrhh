import { TimeTrackingOut } from "../../services/timeTrackingServices";
import { RecordItem } from "./record-item";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface PaginatedRecords {
  total: number;
  count: number;
  limit: number;
  offset: number;
  results: TimeTrackingOut[];
}

interface RecordsListProps {
  data?: PaginatedRecords;
  onPageChange?: (newOffset: number) => void;
}

export function RecordsList({ data, onPageChange }: RecordsListProps) {
  const { results = [], total = 0, limit = 10, offset = 0 } = data || {};

  const sortedRecords = [...results].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handlePrev = () => onPageChange?.(Math.max(offset - limit, 0));
  const handleNext = () => onPageChange?.(offset + limit);

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col gap-4">
      {results.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground text-center">
              No hay registros disponibles
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedRecords.map((record) => (
            <RecordItem key={record.id} record={record} />
          ))}
        </div>
      )}

      {total > limit && (
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={offset === 0}
              size="sm"
            >
              Anterior
            </Button>
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={offset + limit >= total}
              size="sm"
            >
              Siguiente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
