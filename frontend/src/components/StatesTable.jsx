import { states } from "@/data/states";
import { getCities } from "@/data/stateCities";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/Table";
import React from "react";

export default function StatesTable({ selected }) {
  const [sortField, setSortField] = React.useState("miles");
  const [sortDir, setSortDir] = React.useState("desc");

  const visited = React.useMemo(() => states.filter((s) => s.visited), []);

  const sorted = React.useMemo(() => {
    const arr = [...visited];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") {
        cmp = a.name.localeCompare(b.name);
      } else {
        cmp = a[sortField] - b[sortField];
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [visited, sortField, sortDir]);

  const mid = Math.ceil(sorted.length / 2);
  const left = sorted.slice(0, mid);
  const right = sorted.slice(mid);

  const handleSort = (field) => {
    setSortDir((dir) => (field === sortField ? (dir === "asc" ? "desc" : "asc") : "desc"));
    setSortField(field);
  };

  const indicator = (field) => {
    if (field !== sortField) return null;
    return sortDir === "asc" ? "↑" : "↓";
  };

  const renderRows = (list) =>
    list.map((s) => (
      <React.Fragment key={s.abbr}>
        <TableRow
          className="group"
          data-state={s.abbr === selected ? "selected" : undefined}
        >
          <TableCell className="cursor-pointer">› {s.name}</TableCell>
          <TableCell className="tabular-nums">{s.days}</TableCell>
          <TableCell className="tabular-nums">{s.miles.toFixed(1)}</TableCell>
        </TableRow>
        {s.abbr === selected && (
          <TableRow className="bg-muted/50">
            <TableCell colSpan={3} className="p-2 pl-8">
              <ul className="space-y-1">
                {getCities(s.abbr).map((c) => (
                  <li key={c} className="flex items-center gap-1">
                    <span>›</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    ));

  const renderTable = (list) => (
    <Table className="text-left">
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSort("name")}
            className="cursor-pointer select-none">
            STATE {indicator("name")}
          </TableHead>
          <TableHead onClick={() => handleSort("days")}
            className="cursor-pointer select-none">
            DAYS {indicator("days")}
          </TableHead>
          <TableHead onClick={() => handleSort("miles")}
            className="cursor-pointer select-none">
            MILES {indicator("miles")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{renderRows(list)}</TableBody>
    </Table>
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {renderTable(left)}
      {renderTable(right)}
    </div>
  );
}
