import { states } from "@/data/states";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/Table";
import React from "react";

export default function StatesTable() {
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
      <TableRow key={s.abbr} className="group">
        <TableCell className="cursor-pointer">› {s.name}</TableCell>
        <TableCell className="tabular-nums">{s.days}</TableCell>
        <TableCell className="tabular-nums">{s.miles.toFixed(1)}</TableCell>
      </TableRow>
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
