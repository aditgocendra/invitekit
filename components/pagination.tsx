// Reusable Pagination Component
"use client";

import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  pageParam?: string; // default: "page"
}

export default function Pagination({
  totalPages,
  pageParam = "page",
}: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get(pageParam)) || 1;

  const { activePage, pagination, nextPage, prevPage, goToPage } =
    usePagination(totalPages, currentPage);

  const updateUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(pageParam, String(page));
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <nav className='flex items-center gap-2'>
      {/* Previous */}
      <Button
        variant='ghost'
        disabled={activePage <= 1}
        onClick={() => {
          prevPage();
          updateUrl(activePage - 1);
        }}>
        «
      </Button>

      {/* Page Numbers */}
      {pagination.map((page) => (
        <Button
          key={page}
          variant={activePage === page ? "secondary" : "ghost"}
          className='rounded-full text-xs'
          onClick={() => {
            goToPage(page);
            updateUrl(page);
          }}>
          {page}
        </Button>
      ))}

      {/* Next */}
      <Button
        variant='ghost'
        disabled={activePage >= totalPages}
        onClick={() => {
          nextPage();
          updateUrl(activePage + 1);
        }}>
        »
      </Button>
    </nav>
  );
}
