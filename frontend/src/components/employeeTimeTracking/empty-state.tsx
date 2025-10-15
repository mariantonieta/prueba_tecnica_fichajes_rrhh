import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="text-center py-12 px-4">
        <Icon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">{description}</p>
      </CardContent>
    </Card>
  );
}
