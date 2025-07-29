export default function Legend() {
  return (
    <div className="flex items-center gap-4 mt-4 text-sm">
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 bg-gray-200 border rounded-sm"></span>
        <span>Not visited</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 bg-foreground rounded-sm"></span>
        <span>Visited</span>
      </div>
    </div>
  );
}
