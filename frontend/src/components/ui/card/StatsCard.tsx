import React from "react";

interface StatsCardProps {
  label: string;
  value: string;
  maxValue?: string;
}

export function StatsCard({ label, value, maxValue }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-blue-600">{value}</span>
        {maxValue && (
          <span className="text-2xl font-normal text-gray-500">
            / {maxValue}
          </span>
        )}
      </div>
    </div>
  );
}
