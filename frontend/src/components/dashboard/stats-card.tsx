import { Card, CardContent } from "../ui/card";

interface StatsCardProps {
  label: string;
  value: string | number;
  maxValue?: string | number;
}

export function StatsCard({ label, value, maxValue }: StatsCardProps) {
  return (
    <Card className="p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0 space-y-2 sm:space-y-3">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          {label}
        </p>
        <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
            {value}
          </span>
          {maxValue && (
            <span className="text-lg sm:text-xl lg:text-2xl font-normal text-muted-foreground">
              / {maxValue}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
