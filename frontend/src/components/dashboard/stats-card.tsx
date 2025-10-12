import React from "react";
import { Card, CardContent } from "../ui/card";

interface StatsCardProps {
  label: string;
  value: string | number;
  maxValue?: string | number;
}

export function StatsCard({ label, value, maxValue }: StatsCardProps) {
  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <p className="text-sm text-gray-500 mb-2">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-blue-600">{value}</span>
          {maxValue && (
            <span className="text-2xl font-normal text-gray-500">
              / {maxValue}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
