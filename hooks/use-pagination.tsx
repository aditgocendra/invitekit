"use client";

import { useState, useCallback, useMemo } from "react";

export function usePagination(totalPages: number, initialPage = 1) {
  const [activePage, setActivePage] = useState(initialPage);

  const pagination = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (activePage === 1) return [1, 2, 3];
    if (activePage === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];

    return [activePage - 1, activePage, activePage + 1];
  }, [activePage, totalPages]);

  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      setActivePage(page);
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    goToPage(activePage + 1);
  }, [activePage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(activePage - 1);
  }, [activePage, goToPage]);

  return {
    activePage,
    pagination,
    goToPage,
    nextPage,
    prevPage,
  };
}
