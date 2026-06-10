"use client";

import { useEffect, useMemo, useState } from "react";
import type { Employee, Department } from "@/lib/types";
import {
  filterEmployees,
  paginate,
  type StatusFilter,
} from "@/lib/employee-utils";

export function useEmployeeListFilters(
  employees: Employee[],
  pageSize: number
) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<Department | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => filterEmployees(employees, search, department, status),
    [employees, search, department, status]
  );

  const paged = useMemo(
    () => paginate(filtered, page, pageSize),
    [filtered, page, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [search, department, status]);

  useEffect(() => {
    if (page > paged.totalPages) setPage(paged.totalPages);
  }, [page, paged.totalPages]);

  return {
    search,
    setSearch,
    department,
    setDepartment,
    status,
    setStatus,
    page,
    setPage,
    filtered,
    paged,
  };
}
