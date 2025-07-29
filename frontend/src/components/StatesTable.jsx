import { states } from "@/data/states";

export default function StatesTable() {
  const visited = states.filter((s) => s.visited);
  const mid = Math.ceil(visited.length / 2);
  const left = visited.slice(0, mid);
  const right = visited.slice(mid);

  const renderRows = (list) =>
    list.map((s) => (
      <tr key={s.abbr} className="group hover:bg-gray-50">
        <td className="py-2 px-4 font-mono text-sm cursor-pointer">› {s.name}</td>
        <td className="py-2 px-4 text-sm tabular-nums">{s.days}</td>
        <td className="py-2 px-4 text-sm tabular-nums">{s.miles.toFixed(1)}</td>
      </tr>
    ));

  return (
    <div className="grid grid-cols-2 gap-4">
      <table className="w-full text-left">
        <thead className="border-b">
          <tr>
            <th className="px-4 py-2">STATE</th>
            <th className="px-4 py-2">DAYS</th>
            <th className="px-4 py-2">↓ MILES</th>
          </tr>
        </thead>
        <tbody>{renderRows(left)}</tbody>
      </table>
      <table className="w-full text-left">
        <thead className="border-b">
          <tr>
            <th className="px-4 py-2">STATE</th>
            <th className="px-4 py-2">DAYS</th>
            <th className="px-4 py-2">↓ MILES</th>
          </tr>
        </thead>
        <tbody>{renderRows(right)}</tbody>
      </table>
    </div>
  );
}
