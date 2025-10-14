export function LoadingState() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 border rounded-lg animate-pulse"
        >
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}